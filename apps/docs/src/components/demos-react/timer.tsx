'use client';

import { useEffect, useState } from 'react';
import { ButtonGroupItem, Timer } from '@acronis-platform/ui-react';
import {
  CirclePauseIcon,
  CirclePlayIcon,
  CircleStopIcon,
  PencilIcon,
  PlusIcon,
} from '@acronis-platform/icons-react/stroke-mono';

const pad = (n: number) => String(n).padStart(2, '0');

const format = (seconds: number) =>
  `${pad(Math.floor(seconds / 3600))}:${pad(
    Math.floor((seconds % 3600) / 60)
  )}:${pad(seconds % 60)}`;

export function TimerDemo() {
  const [seconds, setSeconds] = useState(43_305);
  const [running, setRunning] = useState(false);

  // The interval lives here, not in the component: `Timer` renders whatever
  // string it is handed and holds no clock of its own.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="flex flex-wrap items-center gap-6">
      <Timer value={format(seconds)} actionsLabel="Time tracking">
        <ButtonGroupItem
          aria-label={running ? 'Pause' : 'Resume'}
          onClick={() => setRunning((r) => !r)}
        >
          {running ? (
            <CirclePauseIcon size={16} />
          ) : (
            <CirclePlayIcon size={16} />
          )}
        </ButtonGroupItem>
        <ButtonGroupItem
          aria-label="Stop"
          onClick={() => {
            setRunning(false);
            setSeconds(0);
          }}
        >
          <CircleStopIcon size={16} />
        </ButtonGroupItem>
        <ButtonGroupItem aria-label="Rename">
          <PencilIcon size={16} />
        </ButtonGroupItem>
        <ButtonGroupItem aria-label="Add entry">
          <PlusIcon size={16} />
        </ButtonGroupItem>
      </Timer>

      {/* No actions: the toolbar and the divider are both dropped. */}
      <Timer value="00:12:30" />
    </div>
  );
}
