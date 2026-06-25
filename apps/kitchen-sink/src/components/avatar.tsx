import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from '@acronis-platform/ui-react';

import { SampleRow, SpecimenPage, Subsection } from '@/lib/specimen';

const COLORS = ['teal', 'violet', 'red', 'yellow', 'orange'] as const;

const SAMPLE_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><rect width='32' height='32' fill='%234f46e5'/><circle cx='16' cy='13' r='6' fill='white'/><circle cx='16' cy='30' r='10' fill='white'/></svg>";

export function AvatarSpecimen() {
  return (
    <SpecimenPage
      title="Avatar"
      description="A user/entity avatar. Colors tint fallback initials; image and grouped overlap variants are shown below."
    >
      <Subsection title="Fallback colors">
        <SampleRow>
          {COLORS.map((color) => (
            <Avatar key={color} color={color}>
              <AvatarFallback>{color.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          ))}
        </SampleRow>
      </Subsection>

      <Subsection title="Image & groups">
        <SampleRow>
          <Avatar>
            <AvatarImage src={SAMPLE_IMAGE} alt="Sam Nguyen" />
            <AvatarFallback>SN</AvatarFallback>
          </Avatar>
          <AvatarGroup>
            <Avatar color="teal">
              <AvatarFallback>SN</AvatarFallback>
            </Avatar>
            <Avatar color="violet">
              <AvatarFallback>GA</AvatarFallback>
            </Avatar>
            <Avatar color="red">
              <AvatarFallback>SI</AvatarFallback>
            </Avatar>
          </AvatarGroup>
        </SampleRow>
      </Subsection>
    </SpecimenPage>
  );
}
