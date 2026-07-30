import type * as React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, afterEach } from 'vitest';

import {
  AiChatResizeEdge,
  handleAiChatResizeKeyDown,
  handleAiChatResizePointerDown,
  type AiChatResizeContext,
} from '../ai-chat';

// ---------------------------------------------------------------------------
// DOM helpers — mirrors `app-shell-chat-resize.test.tsx`'s pattern: these
// exports read real geometry (`getBoundingClientRect`, `closest`,
// `getComputedStyle`), so the tests build a real (if styleless) DOM row
// instead of mocking the functions' internals.
// ---------------------------------------------------------------------------

function mockRect(
  el: Element,
  { width = 0, left = 0 }: { width?: number; left?: number }
) {
  el.getBoundingClientRect = () =>
    ({
      width,
      height: 0,
      top: 0,
      left,
      right: left + width,
      bottom: 0,
      x: left,
      y: 0,
      toJSON() {},
    }) as DOMRect;
}

/** A styleless `ai-chat` panel with a resize handle, at the row's end (right=1000 in LTR). */
function buildChatPanel({ rtl = false }: { rtl?: boolean } = {}) {
  const chat = document.createElement('aside');
  chat.dataset.slot = 'ai-chat';
  if (rtl) chat.style.direction = 'rtl';
  mockRect(chat, { width: 512, left: 488 });

  const handle = document.createElement('div');
  handle.setPointerCapture = vi.fn();
  handle.releasePointerCapture = vi.fn();
  chat.appendChild(handle);

  document.body.appendChild(chat);
  return { chat, handle };
}

function fakePointerEvent(
  currentTarget: Element,
  pointerId = 1
): React.PointerEvent<HTMLDivElement> {
  return {
    preventDefault: vi.fn(),
    pointerId,
    currentTarget,
  } as unknown as React.PointerEvent<HTMLDivElement>;
}

function fakeKeyDownEvent(
  currentTarget: Element,
  key: string
): React.KeyboardEvent<HTMLDivElement> {
  return {
    key,
    preventDefault: vi.fn(),
    currentTarget,
  } as unknown as React.KeyboardEvent<HTMLDivElement>;
}

/** Ends any drag started with pointerId 1 — avoids leaking `window` listeners into later tests. */
function endDrag() {
  window.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));
}

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});

function baseResizeCtx(
  overrides: Partial<AiChatResizeContext> = {}
): AiChatResizeContext {
  return {
    variant: 'expanded',
    setVariant: vi.fn(),
    width: 512,
    setWidth: vi.fn(),
    resetWidth: vi.fn(),
    ...overrides,
  };
}

describe('handleAiChatResizePointerDown', () => {
  it('resizes within the expanded range as the pointer moves toward the row start (LTR)', () => {
    const { handle, chat } = buildChatPanel();
    const setWidth = vi.fn();
    const ctxRef = { current: baseResizeCtx({ setWidth }) };

    handleAiChatResizePointerDown(fakePointerEvent(handle), ctxRef);
    expect(handle.setPointerCapture).toHaveBeenCalledWith(1);
    expect(chat.style.transitionProperty).toBe('none');

    // chatRect.right(1000) - clientX(600) = 400, within [384, 512].
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 600, pointerId: 1 }));
    expect(setWidth).toHaveBeenCalledWith(400);
    endDrag();
  });

  it('clamps to the 512px ceiling when dragged wider than expanded allows', () => {
    const { handle } = buildChatPanel();
    const setWidth = vi.fn();
    const ctxRef = { current: baseResizeCtx({ setWidth }) };

    handleAiChatResizePointerDown(fakePointerEvent(handle), ctxRef);
    // chatRect.right(1000) - clientX(0) = 1000, above the 512px max.
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 0, pointerId: 1 }));
    expect(setWidth).toHaveBeenCalledWith(512);
    endDrag();
  });

  it('snaps to collapsed instead of clamping once dragged past the collapse threshold', () => {
    const { handle } = buildChatPanel();
    const setVariant = vi.fn();
    const setWidth = vi.fn();
    const ctxRef = { current: baseResizeCtx({ setVariant, setWidth }) };

    handleAiChatResizePointerDown(fakePointerEvent(handle), ctxRef);
    // chatRect.right(1000) - clientX(990) = 10, below the 192px threshold.
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 990, pointerId: 1 }));
    expect(setVariant).toHaveBeenCalledWith('collapsed');
    expect(setWidth).not.toHaveBeenCalled();
    endDrag();
  });

  it('re-expands when dragged back out past the threshold while collapsed', () => {
    const { handle } = buildChatPanel();
    const setVariant = vi.fn();
    const ctxRef = {
      current: baseResizeCtx({ variant: 'collapsed', setVariant }),
    };

    handleAiChatResizePointerDown(fakePointerEvent(handle), ctxRef);
    // chatRect.right(1000) - clientX(700) = 300, above the 192px threshold.
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 700, pointerId: 1 }));
    expect(setVariant).toHaveBeenCalledWith('expanded');
    endDrag();
  });

  it('does nothing while collapsed if still under the threshold', () => {
    const { handle } = buildChatPanel();
    const setVariant = vi.fn();
    const ctxRef = {
      current: baseResizeCtx({ variant: 'collapsed', setVariant }),
    };

    handleAiChatResizePointerDown(fakePointerEvent(handle), ctxRef);
    // chatRect.right(1000) - clientX(950) = 50, below the 192px threshold.
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 950, pointerId: 1 }));
    expect(setVariant).not.toHaveBeenCalled();
    endDrag();
  });

  it('never touches full-width — pointermove is a no-op', () => {
    const { handle } = buildChatPanel();
    const setVariant = vi.fn();
    const setWidth = vi.fn();
    const ctxRef = {
      current: baseResizeCtx({ variant: 'full-width', setVariant, setWidth }),
    };

    handleAiChatResizePointerDown(fakePointerEvent(handle), ctxRef);
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 200, pointerId: 1 }));
    expect(setVariant).not.toHaveBeenCalled();
    expect(setWidth).not.toHaveBeenCalled();
    endDrag();
  });

  it('resizes in the opposite pointer direction under RTL', () => {
    const { handle } = buildChatPanel({ rtl: true });
    const setWidth = vi.fn();
    const ctxRef = { current: baseResizeCtx({ setWidth }) };

    handleAiChatResizePointerDown(fakePointerEvent(handle), ctxRef);
    // RTL: clientX(888) - chatRect.left(488) = 400.
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 888, pointerId: 1 }));
    expect(setWidth).toHaveBeenCalledWith(400);
    endDrag();
  });

  it('invokes onDragStart/onDragEnd around the drag and restores the transition', () => {
    const { handle, chat } = buildChatPanel();
    const onDragStart = vi.fn();
    const onDragEnd = vi.fn();
    const ctxRef = { current: baseResizeCtx() };

    handleAiChatResizePointerDown(fakePointerEvent(handle), ctxRef, {
      onDragStart,
      onDragEnd,
    });
    expect(onDragStart).toHaveBeenCalledOnce();
    expect(onDragEnd).not.toHaveBeenCalled();

    window.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));
    expect(onDragEnd).toHaveBeenCalledOnce();
    expect(chat.style.transitionProperty).toBe('');
  });

  it('ends the drag on pointercancel too, not just pointerup', () => {
    const { handle, chat } = buildChatPanel();
    const onDragEnd = vi.fn();
    const setWidth = vi.fn();
    const ctxRef = { current: baseResizeCtx({ setWidth }) };

    handleAiChatResizePointerDown(fakePointerEvent(handle), ctxRef, { onDragEnd });
    window.dispatchEvent(new PointerEvent('pointercancel', { pointerId: 1 }));
    expect(onDragEnd).toHaveBeenCalledOnce();
    expect(chat.style.transitionProperty).toBe('');

    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 0, pointerId: 1 }));
    expect(setWidth).not.toHaveBeenCalled();
  });

  it('ignores pointermove/pointerup from a different pointer than started the drag', () => {
    const { handle } = buildChatPanel();
    const onDragEnd = vi.fn();
    const setWidth = vi.fn();
    const ctxRef = { current: baseResizeCtx({ setWidth }) };

    handleAiChatResizePointerDown(fakePointerEvent(handle, 1), ctxRef, { onDragEnd });

    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 600, pointerId: 2 }));
    expect(setWidth).not.toHaveBeenCalled();
    window.dispatchEvent(new PointerEvent('pointerup', { pointerId: 2 }));
    expect(onDragEnd).not.toHaveBeenCalled();

    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 600, pointerId: 1 }));
    expect(setWidth).toHaveBeenCalledWith(400);
    window.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));
    expect(onDragEnd).toHaveBeenCalledOnce();
  });

  it('always calls the LATEST setters, even if the ref is updated mid-drag', () => {
    const { handle } = buildChatPanel();
    const firstSetWidth = vi.fn();
    const secondSetWidth = vi.fn();
    const ctxRef = { current: baseResizeCtx({ setWidth: firstSetWidth }) };

    handleAiChatResizePointerDown(fakePointerEvent(handle), ctxRef);
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 550, pointerId: 1 }));
    expect(firstSetWidth).toHaveBeenCalledWith(450);

    ctxRef.current = { ...ctxRef.current, setWidth: secondSetWidth };

    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 600, pointerId: 1 }));
    expect(secondSetWidth).toHaveBeenCalledWith(400);
    expect(firstSetWidth).toHaveBeenCalledOnce();
    endDrag();
  });

  it('bails out (and releases the pointer) when there is no [data-slot="ai-chat"] ancestor', () => {
    const handle = document.createElement('div');
    handle.setPointerCapture = vi.fn();
    handle.releasePointerCapture = vi.fn();
    document.body.appendChild(handle);
    const setWidth = vi.fn();
    const onDragEnd = vi.fn();
    const ctxRef = { current: baseResizeCtx({ setWidth }) };

    handleAiChatResizePointerDown(fakePointerEvent(handle), ctxRef, { onDragEnd });
    expect(handle.releasePointerCapture).toHaveBeenCalledWith(1);
    expect(onDragEnd).toHaveBeenCalledOnce();

    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 0, pointerId: 1 }));
    expect(setWidth).not.toHaveBeenCalled();
  });
});

describe('handleAiChatResizeKeyDown', () => {
  it('ArrowLeft grows by 16px in LTR while expanded', () => {
    const { chat } = buildChatPanel();
    const setWidth = vi.fn();
    handleAiChatResizeKeyDown(
      fakeKeyDownEvent(chat, 'ArrowLeft'),
      baseResizeCtx({ setWidth, width: 450 }),
      'ltr'
    );
    expect(setWidth).toHaveBeenCalledWith(466);
  });

  it('ArrowLeft clamps to the 512px ceiling', () => {
    const { chat } = buildChatPanel();
    const setWidth = vi.fn();
    handleAiChatResizeKeyDown(
      fakeKeyDownEvent(chat, 'ArrowLeft'),
      baseResizeCtx({ setWidth, width: 505 }),
      'ltr'
    );
    expect(setWidth).toHaveBeenCalledWith(512);
  });

  it('ArrowRight shrinks by 16px in LTR while expanded', () => {
    const { chat } = buildChatPanel();
    const setWidth = vi.fn();
    handleAiChatResizeKeyDown(
      fakeKeyDownEvent(chat, 'ArrowRight'),
      baseResizeCtx({ setWidth, width: 450 }),
      'ltr'
    );
    expect(setWidth).toHaveBeenCalledWith(434);
  });

  it('ArrowRight snaps to collapsed instead of clamping once shrunk past the floor', () => {
    const { chat } = buildChatPanel();
    const setVariant = vi.fn();
    const setWidth = vi.fn();
    handleAiChatResizeKeyDown(
      fakeKeyDownEvent(chat, 'ArrowRight'),
      baseResizeCtx({ setVariant, setWidth, width: 390 }),
      'ltr'
    );
    expect(setVariant).toHaveBeenCalledWith('collapsed');
    expect(setWidth).not.toHaveBeenCalled();
  });

  it('ArrowLeft expands from collapsed instead of resizing', () => {
    const { chat } = buildChatPanel();
    const setVariant = vi.fn();
    const setWidth = vi.fn();
    handleAiChatResizeKeyDown(
      fakeKeyDownEvent(chat, 'ArrowLeft'),
      baseResizeCtx({ variant: 'collapsed', setVariant, setWidth }),
      'ltr'
    );
    expect(setVariant).toHaveBeenCalledWith('expanded');
    expect(setWidth).not.toHaveBeenCalled();
  });

  it('ArrowRight does nothing while collapsed', () => {
    const { chat } = buildChatPanel();
    const setVariant = vi.fn();
    handleAiChatResizeKeyDown(
      fakeKeyDownEvent(chat, 'ArrowRight'),
      baseResizeCtx({ variant: 'collapsed', setVariant }),
      'ltr'
    );
    expect(setVariant).not.toHaveBeenCalled();
  });

  it('inverts the grow/shrink keys in RTL', () => {
    const { chat } = buildChatPanel();
    const setWidth = vi.fn();
    handleAiChatResizeKeyDown(
      fakeKeyDownEvent(chat, 'ArrowRight'),
      baseResizeCtx({ setWidth, width: 450 }),
      'rtl'
    );
    expect(setWidth).toHaveBeenCalledWith(466);
  });

  it('Home delegates to ctx.resetWidth() instead of computing a value itself', () => {
    const { chat } = buildChatPanel();
    const setWidth = vi.fn();
    const resetWidth = vi.fn();
    handleAiChatResizeKeyDown(
      fakeKeyDownEvent(chat, 'Home'),
      baseResizeCtx({ setWidth, resetWidth, width: 400 }),
      'ltr'
    );
    expect(resetWidth).toHaveBeenCalledOnce();
    expect(setWidth).not.toHaveBeenCalled();
  });

  it('Home also expands when collapsed', () => {
    const { chat } = buildChatPanel();
    const setVariant = vi.fn();
    const resetWidth = vi.fn();
    handleAiChatResizeKeyDown(
      fakeKeyDownEvent(chat, 'Home'),
      baseResizeCtx({ variant: 'collapsed', setVariant, resetWidth }),
      'ltr'
    );
    expect(setVariant).toHaveBeenCalledWith('expanded');
    expect(resetWidth).toHaveBeenCalledOnce();
  });

  it('ignores unrelated keys', () => {
    const { chat } = buildChatPanel();
    const setWidth = vi.fn();
    const event = fakeKeyDownEvent(chat, 'a');
    handleAiChatResizeKeyDown(event, baseResizeCtx({ setWidth }), 'ltr');
    expect(setWidth).not.toHaveBeenCalled();
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});

describe('AiChatResizeEdge', () => {
  it('renders a labeled separator', () => {
    render(<AiChatResizeEdge ctx={baseResizeCtx()} resizeAriaLabel="Resize the panel" />);
    expect(
      screen.getByRole('separator', { name: 'Resize the panel' })
    ).toBeInTheDocument();
  });

  it('double-click delegates to ctx.resetWidth(), not a fixed setWidth call', async () => {
    const setWidth = vi.fn();
    const resetWidth = vi.fn();
    render(<AiChatResizeEdge ctx={baseResizeCtx({ setWidth, resetWidth })} />);

    await userEvent.dblClick(screen.getByRole('separator'));
    expect(resetWidth).toHaveBeenCalledOnce();
    expect(setWidth).not.toHaveBeenCalled();
  });

  it('double-click also expands when collapsed', async () => {
    const setVariant = vi.fn();
    render(
      <AiChatResizeEdge ctx={baseResizeCtx({ variant: 'collapsed', setVariant })} />
    );

    await userEvent.dblClick(screen.getByRole('separator'));
    expect(setVariant).toHaveBeenCalledWith('expanded');
  });

  it('ArrowLeft delegates to handleAiChatResizeKeyDown and resizes', async () => {
    const setWidth = vi.fn();
    render(<AiChatResizeEdge ctx={baseResizeCtx({ setWidth, width: 450 })} />);

    const edge = screen.getByRole('separator');
    edge.focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(setWidth).toHaveBeenCalledWith(466);
  });
});
