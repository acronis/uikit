// Re-export all missing icons from the demos package.
// When Next.js transpiles demo files, @/ resolves to this docs package's src/,
// so we forward everything to the actual icon definitions.
export * from '@acronis-platform/shadcn-uikit-demos/icons/missing-icons';
