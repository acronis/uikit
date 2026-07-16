// Figma Code Connect — status: COMPLETE
// Mapped to the "InputSelect" field component set (2639-293), the
// "InputSelectDropdown" component set (2885-2373), and the
// "InputSelectDropdownTenants" component set (3064-21461) in the ui-react Figma file.
import figma from '@figma/code-connect';

import {
  InputSelect,
  InputSelectContent,
  InputSelectDescription,
  InputSelectError,
  InputSelectField,
  InputSelectItem,
  InputSelectLabel,
  InputSelectSearch,
  InputSelectSection,
  InputSelectSectionLabel,
  InputSelectStatus,
  InputSelectTrigger,
  InputSelectValue,
} from './input-select';

figma.connect(
  InputSelect,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=2639-293',
  {
    props: {
      label: figma.boolean('hasLabel', {
        true: figma.string('label'),
        false: undefined,
      }),
      required: figma.boolean('required'),
      placeholder: figma.string('placeholder'),
      description: figma.boolean('hasDescription', {
        true: figma.string('description'),
        false: undefined,
      }),
      // The `error` text drives the error treatment — only meaningful for
      // `variant="error"`.
      error: figma.enum('variant', { error: figma.string('error') }),
      // `state` (idle / hover / active / focused / disabled) is otherwise a pure
      // interaction pseudo-state, not a prop.
      disabled: figma.enum('state', { disabled: true }),
    },
    example: ({ label, required, placeholder, description, error, disabled }) => (
      <InputSelect disabled={disabled}>
        <InputSelectField>
          <InputSelectLabel required={required}>{label}</InputSelectLabel>
          <InputSelectTrigger>
            <InputSelectValue placeholder={placeholder} />
          </InputSelectTrigger>
          <InputSelectDescription>{description}</InputSelectDescription>
          <InputSelectError>{error}</InputSelectError>
        </InputSelectField>
        <InputSelectContent>
          <InputSelectItem value="1">Option 1</InputSelectItem>
          <InputSelectItem value="2">Option 2</InputSelectItem>
        </InputSelectContent>
      </InputSelect>
    ),
  }
);

// ── InputSelectDropdown (the popup panel) ──

figma.connect(
  InputSelectContent,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=2885-2373',
  {
    variant: { variant: 'data' },
    props: {
      hasSearch: figma.boolean('hasSearch'),
      sectionList: figma.children('sectionList'),
    },
    example: ({ hasSearch, sectionList }) => (
      <InputSelectContent>
        {hasSearch && <InputSelectSearch placeholder="Search…" />}
        <InputSelectSection>{sectionList}</InputSelectSection>
      </InputSelectContent>
    ),
  }
);

figma.connect(
  InputSelectContent,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=2885-2373',
  {
    variant: { variant: 'loading' },
    props: {
      hasSearch: figma.boolean('hasSearch'),
    },
    example: ({ hasSearch }) => (
      <InputSelectContent>
        {hasSearch && <InputSelectSearch placeholder="Search…" />}
        <InputSelectStatus variant="loading">Data is loading…</InputSelectStatus>
      </InputSelectContent>
    ),
  }
);

figma.connect(
  InputSelectContent,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=2885-2373',
  {
    variant: { variant: 'empty' },
    props: {
      hasSearch: figma.boolean('hasSearch'),
    },
    example: ({ hasSearch }) => (
      <InputSelectContent>
        {hasSearch && <InputSelectSearch placeholder="Search…" />}
        <InputSelectStatus variant="empty">No data found</InputSelectStatus>
      </InputSelectContent>
    ),
  }
);

figma.connect(
  InputSelectContent,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=2885-2373',
  {
    variant: { variant: 'error' },
    props: {
      hasSearch: figma.boolean('hasSearch'),
    },
    example: ({ hasSearch }) => (
      <InputSelectContent>
        {hasSearch && <InputSelectSearch placeholder="Search…" />}
        <InputSelectStatus variant="error" action={<a href="#">Try again</a>}>
          Something went wrong
        </InputSelectStatus>
      </InputSelectContent>
    ),
  }
);

// ── InputSelectDropdownTenants (tenant selector with icons + hierarchy) ──

figma.connect(
  InputSelectContent,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=3064-21461',
  {
    variant: { variant: 'data' },
    props: {
      hasRecent: figma.boolean('hasRecent'),
      listRecent: figma.children('listRecent'),
      listBrowse: figma.children('listBrowse'),
    },
    example: ({ hasRecent, listRecent, listBrowse }) => (
      <InputSelectContent>
        <InputSelectSearch placeholder="Search…" />
        {hasRecent && (
          <InputSelectSection>
            <InputSelectSectionLabel>Recent</InputSelectSectionLabel>
            {listRecent}
          </InputSelectSection>
        )}
        <InputSelectSection>
          <InputSelectSectionLabel>Browse</InputSelectSectionLabel>
          {listBrowse}
        </InputSelectSection>
      </InputSelectContent>
    ),
  }
);

figma.connect(
  InputSelectContent,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=3064-21461',
  {
    variant: { variant: 'loading' },
    example: () => (
      <InputSelectContent>
        <InputSelectSearch placeholder="Search…" />
        <InputSelectStatus variant="loading">Data is loading…</InputSelectStatus>
      </InputSelectContent>
    ),
  }
);

figma.connect(
  InputSelectContent,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=3064-21461',
  {
    variant: { variant: 'empty' },
    example: () => (
      <InputSelectContent>
        <InputSelectSearch placeholder="Search…" />
        <InputSelectStatus variant="empty">No data found</InputSelectStatus>
      </InputSelectContent>
    ),
  }
);

figma.connect(
  InputSelectContent,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=3064-21461',
  {
    variant: { variant: 'error' },
    example: () => (
      <InputSelectContent>
        <InputSelectSearch placeholder="Search…" />
        <InputSelectStatus variant="error" action={<a href="#">Try again</a>}>
          Something went wrong
        </InputSelectStatus>
      </InputSelectContent>
    ),
  }
);
