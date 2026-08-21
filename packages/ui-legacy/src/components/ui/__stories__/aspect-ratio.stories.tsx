import type { Meta, StoryObj } from '@storybook/react-vite';
import { AspectRatio } from '../aspect-ratio';

const meta = {
  title: 'UI/AspectRatio',
  component: AspectRatio,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

// A self-contained data-URI image keeps the visual-regression snapshot
// deterministic. These stories pulled a photo from a third-party image host, so
// the capture depended on that host being reachable — when it is not, the `<img>`
// renders as a broken/empty box over the `bg-muted` fill and the baseline no
// longer matches. Same fix, and same reason, as the avatar stories next door.
const SAMPLE_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='90'><rect width='160' height='90' fill='%230f172a'/><circle cx='40' cy='28' r='12' fill='%23fbbf24'/><path d='M0 90 L52 38 L96 90 Z' fill='%232563eb'/><path d='M74 90 L118 46 L160 90 Z' fill='%2338bdf8'/></svg>";

export const SixteenByNine: Story = {
  render: () => (
    <div className="w-[400px]">
      <AspectRatio
        ratio={16 / 9}
        className="bg-muted rounded-md overflow-hidden"
      >
        <img
          src={SAMPLE_IMAGE}
          alt="Photo"
          className="h-full w-full object-cover"
        />
      </AspectRatio>
    </div>
  ),
};

export const Square: Story = {
  render: () => (
    <div className="w-[200px]">
      <AspectRatio ratio={1} className="bg-muted rounded-md overflow-hidden">
        <img
          src={SAMPLE_IMAGE}
          alt="Photo"
          className="h-full w-full object-cover"
        />
      </AspectRatio>
    </div>
  ),
};

export const FourByThree: Story = {
  render: () => (
    <div className="w-[400px]">
      <AspectRatio
        ratio={4 / 3}
        className="bg-muted rounded-md flex items-center justify-center"
      >
        <span className="text-muted-foreground text-sm">4 / 3</span>
      </AspectRatio>
    </div>
  ),
};
