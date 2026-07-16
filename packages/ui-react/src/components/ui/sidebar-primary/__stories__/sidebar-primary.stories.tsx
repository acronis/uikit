import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  BoltIcon,
  BriefcaseIcon,
  BuildingIcon,
  ChartGrowthIcon,
  ChartPieIcon,
  ChevronsLeftIcon,
  CircleHelpIcon,
  CircleUserIcon,
  CogIcon,
  CoinsIcon,
  HeadsetIcon,
  InboxIcon,
  LayoutGridIcon,
  MonitorIcon,
  ShieldCheckIcon,
  StarIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { Tag } from '../../tag';
import { TooltipProvider } from '../../tooltip';
import {
  SidebarPrimary,
  SidebarPrimaryCollapseTrigger,
  SidebarPrimaryContent,
  SidebarPrimaryFooter,
  SidebarPrimaryHeader,
  SidebarPrimaryMenu,
  SidebarPrimaryMenuItem,
  SidebarPrimaryMenuItemExtras,
  SidebarPrimarySection,
} from '../sidebar-primary';

const meta = {
  title: 'UI/SidebarPrimary',
  component: SidebarPrimary,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    expanded: {
      control: 'boolean',
      description:
        'Controlled rail-width state. When set, the consumer owns it and the trigger only emits `onExpandedChange`. `data-state="expanded|collapsed"` drives every token switch.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    defaultExpanded: {
      control: 'boolean',
      description:
        'Uncontrolled initial expanded state. Ignored when `expanded` is provided.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: 'State',
      },
    },
    onExpandedChange: {
      control: false,
      description:
        'Fires with the next expanded value whenever the rail toggles (e.g. via the collapse trigger), in both controlled and uncontrolled modes.',
      table: {
        type: { summary: '(expanded: boolean) => void' },
        category: 'Events',
      },
    },
    render: {
      control: false,
      description:
        'Replace the rendered `<nav>` with another element or component (Base UI composition). Accepts a React element or a render function.',
      table: { type: { summary: 'useRender.RenderProp' }, category: 'Composition' },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name for the navigation landmark.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Primary'" },
        category: 'Behavior',
      },
    },
    children: {
      control: false,
      description:
        'Composed sidebar parts (Header, Content, Section, Menu, Footer, …).',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
  },
} satisfies Meta<typeof SidebarPrimary>;

export default meta;
type Story = StoryObj<typeof meta>;

// The exact Figma "expanded" logo asset (node 2426-4909): a single flattened
// vector containing both the "Acronis" wordmark and the "Cyber Platform"
// subtitle — Figma's expanded lockup has no separate A-mark glyph, so
// approximating it with an icon + text pairing would drift from the design.
// `fill="currentColor"` (rather than the source's literal white) inherits
// `--ui-sidebar-primary-global-logo-color`, so it adapts per brand/theme.
// Figma's export frame was 208×48, but the artwork's real bounding box is
// only 0..148.6 (getBBox()) — the rest is dead trailing space baked into the
// asset. Cropping the `viewBox` to the tight bounds matters for RTL: the
// header's flex container correctly flips to hug the sidebar's right edge in
// `dir="rtl"`, but with the untrimmed 208-wide box the artwork itself (which
// starts flush at x=0) stayed pinned to the *left* edge of that oversized box,
// so the visible gap ended up on the wrong side instead of a flush edge.
// Passed as `SidebarPrimaryHeader`'s `logo` prop.
function LogoMark() {
  return (
    <svg
      viewBox="0 0 148.6 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Acronis Cyber Platform"
    >
      <path
        d="M19.3975 35.6821C19.9913 37.1557 20.321 37.9044 20.6289 38.7622H20.6729C20.9588 37.9483 21.1793 37.3318 21.6191 36.1001L24.3916 28.5542H25.5576L20.6953 41.6001C19.9474 43.6676 19.0453 44.306 17.2637 44.3062H16.4268V43.2944H17.1094C18.4731 43.2944 19.0678 42.8763 19.6396 41.3589L20.0791 40.1704L15.2832 28.5542H16.4932L19.3975 35.6821ZM7.15039 24.9907C10.6263 24.9908 13.1567 27.0145 13.9707 30.3364H12.7383C12.0123 27.5865 9.92236 26.024 7.10645 26.0239C3.67445 26.0239 1.25391 28.7965 1.25391 32.6245C1.25415 36.5622 3.65243 39.3559 7.28223 39.356C9.98802 39.356 12.078 37.8382 12.8262 34.9126H14.0146C13.2225 38.3003 10.6701 40.3901 7.23828 40.3901C2.88245 40.3901 0.000230185 37.1342 0 32.6685C0 28.2025 2.97039 24.9907 7.15039 24.9907ZM28.8545 30.8423C29.8225 29.2803 31.517 28.3345 33.585 28.3345C36.8408 28.3346 39.2607 30.7769 39.2607 34.3628C39.2603 37.8382 36.8845 40.39 33.541 40.3901C31.4952 40.3901 29.8225 39.51 28.8545 37.9702L28.7666 40.1704H27.7324V24.0005H28.8545V30.8423ZM46.8164 28.3345C50.0724 28.3345 52.1186 30.9084 52.1406 34.2964H42.3291V34.4067C42.2635 37.3323 44.0891 39.3784 46.8389 39.3784C48.6866 39.3784 50.1167 38.5422 50.8867 36.7827H51.9424C51.1502 39.0702 49.1486 40.3901 46.7949 40.3901C43.3412 40.3901 41.1849 37.8383 41.1846 34.3628C41.1846 30.8649 43.5826 28.3347 46.8164 28.3345ZM90.9121 28.3345C93.6839 28.3345 95.29 29.5664 95.29 32.4702V40.1704H94.2559L94.2119 37.9263C93.3759 39.6199 91.6599 40.39 89.6582 40.3901C87.1946 40.3901 85.7641 39.1143 85.7637 37.1128C85.7637 35.617 86.4898 34.7364 87.3037 34.2964C88.0957 33.8564 88.976 33.7247 90.208 33.6147C91.264 33.5267 93.5959 33.3502 94.168 33.2622V32.3823C94.1679 30.2484 92.9357 29.2583 90.8457 29.2583C88.9538 29.2583 87.6782 30.0947 87.3262 31.7446H86.1377C86.5557 29.5226 88.4041 28.3345 90.9121 28.3345ZM116.346 28.3345C119.778 28.3346 122.241 30.9309 122.241 34.3628C122.241 37.7943 119.777 40.39 116.346 40.3901C112.914 40.3901 110.494 37.7944 110.493 34.3628C110.493 30.9308 112.914 28.3345 116.346 28.3345ZM55.9678 31.2163H56.0117C56.6057 29.5443 57.882 28.5542 59.708 28.5542H60.3457V29.6548H59.5322C57.6842 29.6548 55.9902 30.9748 55.9902 34.3188V40.1704H54.8457V28.5542H55.9463L55.9678 31.2163ZM74.7578 25.2104C77.7496 25.2104 79.0916 27.2342 79.0918 29.478C79.0916 31.8098 77.64 33.8559 74.4062 33.856H68.9502V40.1704H67.8066V25.2104H74.7578ZM83.0391 40.1704H81.8945V24.0005H83.0391V40.1704ZM100.213 28.5542H102.896V29.478H100.213V37.3101C100.213 38.4757 100.587 39.2026 101.862 39.2026H102.963V40.1704H101.555C99.7289 40.1704 99.0909 39.202 99.0908 37.5083V29.478H97.3525V28.5542H99.0908V26.0688H100.213V28.5542ZM110.116 25.0347H109.214C107.586 25.0347 106.948 25.9366 106.948 27.4985V28.5542H109.5V29.478H106.97V40.1704H105.826V29.478H103.868V28.5542H105.826V27.3882C105.826 25.1004 107.124 24.0005 109.258 24.0005H110.116V25.0347ZM126.071 31.2163H126.115C126.709 29.5443 127.986 28.5542 129.812 28.5542H130.449V29.6548H129.636C127.788 29.6548 126.094 30.9748 126.094 34.3188V40.1704H124.949V28.5542H126.05L126.071 31.2163ZM144.815 28.3345C146.465 28.3346 148.577 29.1486 148.577 32.5581V40.1704H147.455V32.8228C147.455 30.3368 146.245 29.3248 144.529 29.3247C142.593 29.3247 141.031 30.7763 141.031 33.438V40.1704H139.887V32.8667C139.887 30.2269 138.479 29.3248 136.983 29.3247C135.069 29.3247 133.441 30.7324 133.441 33.5044V40.1704H132.297V28.5542H133.354L133.397 30.7319H133.463C134.211 29.1042 135.641 28.3345 137.291 28.3345C138.523 28.3345 140.24 28.7966 140.812 30.9526C141.582 29.1266 143.143 28.3345 144.815 28.3345ZM94.1895 34.0542C93.6388 34.1642 91.3522 34.3402 90.4502 34.4282C89.2182 34.5382 88.6017 34.6705 88.0957 34.9565C87.392 35.3085 86.9083 35.9904 86.9082 36.98C86.9084 38.5197 87.9645 39.4224 89.9883 39.4224C92.1 39.4222 94.1892 38.2335 94.1895 35.396V34.0542ZM33.4531 29.3247C30.6372 29.3247 28.7452 31.4583 28.7451 34.3843C28.7453 37.31 30.6373 39.4009 33.4531 39.4009C36.1367 39.4006 38.0721 37.3098 38.0723 34.3843C38.0722 31.4585 36.1368 29.325 33.4531 29.3247ZM116.346 29.3462C113.574 29.3462 111.659 31.4588 111.659 34.3628C111.66 37.2663 113.574 39.3783 116.367 39.3784C119.117 39.3784 121.075 37.2663 121.075 34.3628C121.075 31.4589 119.118 29.3464 116.346 29.3462ZM46.8164 29.3022C44.4187 29.3024 42.6372 31.0184 42.373 33.394H50.9746C50.7105 30.9962 49.2143 29.3022 46.8164 29.3022ZM68.9502 32.8003H74.4062C76.76 32.8003 77.8816 31.3917 77.8818 29.522C77.8817 27.6302 76.7379 26.2661 74.5381 26.2661H68.9502V32.8003ZM23.8193 7.14014C26.8618 7.14024 29.2576 8.97176 29.7607 11.8237H27.3408C26.8616 10.0847 25.4959 9.0874 23.7471 9.0874C21.4233 9.08747 19.7939 10.8734 19.7939 13.4937C19.794 16.1139 21.4237 17.8989 23.7715 17.8989C25.4963 17.8988 26.8382 16.9249 27.3652 15.3481H29.7842C29.1134 18.0612 26.67 19.8472 23.6992 19.8472C19.938 19.8471 17.3741 17.2037 17.374 13.4937C17.374 9.78351 20.1299 7.14014 23.8193 7.14014ZM46.1172 7.14014C49.9025 7.14014 52.6572 9.78351 52.6572 13.4937C52.6572 17.2037 49.9024 19.8472 46.1172 19.8472C42.3559 19.8472 39.6006 17.2037 39.6006 13.4937C39.6006 9.78352 42.3559 7.14015 46.1172 7.14014ZM79.6094 7.14014C82.2207 7.14014 84.4966 8.137 84.7842 11.0122H82.4844C82.2687 9.5284 81.2627 8.8795 79.5381 8.87939C77.7413 8.87939 76.9502 9.78339 76.9502 10.6646C76.9502 11.3834 77.4053 11.8243 78.124 12.0562C78.8427 12.288 79.8729 12.45 80.7832 12.5659C81.6936 12.705 82.748 12.8905 83.5146 13.3774C84.3771 13.8644 85 14.7921 85 16.021C85 18.4557 83.0596 19.847 79.8975 19.8472C76.2801 19.8472 74.6509 18.2937 74.4111 15.9751H76.6865C76.9262 17.2734 77.9089 18.0845 80.0889 18.0845C81.7897 18.0844 82.7959 17.4353 82.7959 16.2759C82.7958 15.5804 82.4125 15.0934 81.7178 14.8384C81.1668 14.6297 80.544 14.5602 79.5381 14.3979C78.4121 14.2124 77.7169 14.1193 76.9023 13.8179C76.0399 13.4932 74.8184 12.7049 74.8184 10.9194C74.8185 8.67031 76.6867 7.1402 79.6094 7.14014ZM16.1953 19.6157H13.7041L12.5303 16.7397H3.68945L2.49121 19.6157H0L6.80371 3.84717H9.3916L16.1953 19.6157ZM34.5479 9.27295H34.6201C35.4107 7.97452 36.6089 7.37158 38.1182 7.37158H38.8604V9.62061H37.7344C36.2491 9.62071 34.6445 10.3404 34.6445 13.2388V19.6157H32.3203V7.37158H34.4766L34.5479 9.27295ZM61.5957 7.14014C63.632 7.14014 66.2918 8.18331 66.292 11.8931V19.6157H63.9443V12.2642C63.9442 10.1079 62.8177 9.13428 61.0449 9.13428C59.1284 9.13432 57.6192 10.224 57.6191 12.5659V19.6157H55.2949V7.37158H57.3555L57.499 8.78662H57.5713C58.5535 7.67366 59.9667 7.14022 61.5957 7.14014ZM71.9375 19.6157H69.5898V7.37158H71.9375V19.6157ZM46.1172 9.15771C43.7454 9.15773 42.0205 10.8502 42.0205 13.4937C42.0206 16.1371 43.7459 17.8296 46.1416 17.8296C48.4892 17.8294 50.2382 16.1369 50.2383 13.4937C50.2383 10.8502 48.489 9.15771 46.1172 9.15771ZM4.50391 14.769H11.7148L10.9482 12.9604H5.24707L4.50391 14.769ZM8.09766 5.98096C7.73829 7.02434 7.13897 8.41523 6.44434 10.0845L6.01367 11.105H10.2061L9.77441 10.0845C9.07981 8.41531 8.48095 7.0243 8.09766 5.98096Z"
        fill="currentColor"
      />
    </svg>
  );
}

// The exact Figma "collapsed" logo asset (node 2463-50479, 32×32): the bare
// "A" mark. `fill="currentColor"` for the same theme-adaptive reason as
// `LogoMark`. Passed as `SidebarPrimaryHeader`'s `collapsedLogo` prop so the
// rail swaps to a distinct graphic instead of resizing/hiding parts of the
// expanded lockup.
function LogoMarkCollapsed() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Acronis"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.7 24H8.3L6.00406 29H2L14.3125 1.99976H17.7159L30 29H26.0243L23.7 24ZM19.7958 15L16.0142 6.5L12.2326 15H19.7958ZM21.1 18L22.4 21H9.6L10.9 18H21.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Shell({
  children,
  height = 620,
}: {
  children: React.ReactNode;
  /** Fixed viewport height — sidebars fill their container (`h-full`). */
  height?: number;
}) {
  return <div style={{ height, display: 'flex' }}>{children}</div>;
}

// A single, fully interactive recreation of the real Figma "Acronis Cyber
// Platform" screen (node 2092:4359's realistic content, not the abstract
// component-set demo) that exercises every documented sidebar feature in one
// canvas instead of spreading them across narrow single-purpose stories:
//
//   - Expand/collapse: uncontrolled `defaultExpanded` + the real
//     `SidebarPrimaryCollapseTrigger`, not a frozen `expanded` prop — click it.
//   - Header: `logo`/`collapsedLogo` swap to the exact Figma assets.
//   - Tooltips when expanded + overflowing: "Service desk and support
//     tickets" truncates and opens a tooltip on hover.
//   - Tooltips when collapsed: every icon-only row opens a tooltip with its
//     full label (the `sr-only` label itself can never receive that hover).
//   - Tooltips do NOT open on icon/extras hover, only the label — implicit in
//     every row here; the negative case is unit-tested in
//     sidebar-primary.test.tsx (Base UI's floating-ui pointer tracking isn't
//     reliably reproducible from a `play` function in the headless VR runner).
//   - `MenuItemExtras` — all four Figma-documented variants (`shortcut`,
//     `externalLink`, `tag`, `tag-externalLink`), each in a plausible spot
//     rather than an invented Figma combination.
//   - Extras + truncation together: "Service desk and support tickets" pairs
//     a `shortcut` with a long label.
//   - Multiple sections: the main list, "My inbox"/"Favorites"/"Profile", and
//     the footer each get their own `SidebarPrimarySection`/divider.
//   - Sticky header/footer: the `Shell` height is short enough that
//     `SidebarPrimaryContent` scrolls internally while the header and footer
//     (`shrink-0` flex siblings) stay pinned.
export const FullDemo: Story = {
  name: 'Full Demo - All Features',
  render: function FullDemoStory() {
    return (
      <Shell height={560}>
        <TooltipProvider delay={0}>
          <SidebarPrimary defaultExpanded>
            <SidebarPrimaryHeader
              logo={<LogoMark />}
              collapsedLogo={<LogoMarkCollapsed />}
            />
            <SidebarPrimaryContent>
              <SidebarPrimarySection>
                <SidebarPrimaryMenu>
                  <SidebarPrimaryMenuItem href="#" icon={<ChartPieIcon />} selected>
                    Intelligence
                  </SidebarPrimaryMenuItem>
                  <SidebarPrimaryMenuItem href="#" icon={<MonitorIcon />}>
                    Assets
                  </SidebarPrimaryMenuItem>
                  <SidebarPrimaryMenuItem href="#" icon={<ShieldCheckIcon />}>
                    Protection
                  </SidebarPrimaryMenuItem>
                  <SidebarPrimaryMenuItem href="#" icon={<BriefcaseIcon />}>
                    Clients
                  </SidebarPrimaryMenuItem>
                  <SidebarPrimaryMenuItem
                    href="#"
                    icon={<HeadsetIcon />}
                    extras={
                      <SidebarPrimaryMenuItemExtras variant="shortcut" shortcut="⌘D" />
                    }
                  >
                    Service desk and support tickets
                  </SidebarPrimaryMenuItem>
                  <SidebarPrimaryMenuItem
                    href="#"
                    icon={<CoinsIcon />}
                    extras={
                      <SidebarPrimaryMenuItemExtras
                        variant="tag-externalLink"
                        tag={
                          <Tag variant="info" size="sm">
                            Beta
                          </Tag>
                        }
                      />
                    }
                  >
                    Sales and billing
                  </SidebarPrimaryMenuItem>
                  <SidebarPrimaryMenuItem href="#" icon={<BoltIcon />}>
                    Automation
                  </SidebarPrimaryMenuItem>
                  <SidebarPrimaryMenuItem
                    href="#"
                    icon={<LayoutGridIcon />}
                    extras={
                      <SidebarPrimaryMenuItemExtras
                        variant="tag"
                        tag={
                          <Tag variant="info" size="sm">
                            New
                          </Tag>
                        }
                      />
                    }
                  >
                    Marketplace
                  </SidebarPrimaryMenuItem>
                  <SidebarPrimaryMenuItem
                    href="#"
                    icon={<ChartGrowthIcon />}
                    extras={<SidebarPrimaryMenuItemExtras variant="externalLink" />}
                  >
                    Partner portal
                  </SidebarPrimaryMenuItem>
                  <SidebarPrimaryMenuItem href="#" icon={<BuildingIcon />}>
                    My company
                  </SidebarPrimaryMenuItem>
                  <SidebarPrimaryMenuItem href="#" icon={<CogIcon />}>
                    Settings
                  </SidebarPrimaryMenuItem>
                </SidebarPrimaryMenu>
              </SidebarPrimarySection>
              <SidebarPrimarySection>
                <SidebarPrimaryMenu>
                  <SidebarPrimaryMenuItem href="#" icon={<InboxIcon />}>
                    My inbox
                  </SidebarPrimaryMenuItem>
                  <SidebarPrimaryMenuItem href="#" icon={<StarIcon />}>
                    Favorites
                  </SidebarPrimaryMenuItem>
                  <SidebarPrimaryMenuItem href="#" icon={<CircleUserIcon />}>
                    Profile
                  </SidebarPrimaryMenuItem>
                </SidebarPrimaryMenu>
              </SidebarPrimarySection>
            </SidebarPrimaryContent>
            <SidebarPrimaryFooter>
              <SidebarPrimaryMenu>
                <SidebarPrimaryMenuItem href="#" icon={<CircleHelpIcon />}>
                  Help
                </SidebarPrimaryMenuItem>
                <SidebarPrimaryCollapseTrigger
                  icon={<ChevronsLeftIcon />}
                  extras={
                    <SidebarPrimaryMenuItemExtras variant="shortcut" shortcut="⌘H" />
                  }
                >
                  Collapse menu
                </SidebarPrimaryCollapseTrigger>
              </SidebarPrimaryMenu>
            </SidebarPrimaryFooter>
          </SidebarPrimary>
        </TooltipProvider>
      </Shell>
    );
  },
};
