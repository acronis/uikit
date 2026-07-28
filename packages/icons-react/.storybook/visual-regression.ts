export type VisualColorMode = 'light' | 'dark';

const DEFAULT_COLOR_MODE: VisualColorMode = 'light';

export function resolveVisualColorMode(
  colorMode: string | undefined
): VisualColorMode {
  return colorMode === 'dark' ? 'dark' : DEFAULT_COLOR_MODE;
}

export function getSnapshotIdentifier(
  storyId: string,
  colorMode: VisualColorMode
): string {
  return colorMode === 'dark' ? `${storyId}--dark` : storyId;
}
