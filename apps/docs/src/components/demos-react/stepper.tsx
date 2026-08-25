'use client';

import { CheckIcon } from '@acronis-platform/icons-react/stroke-mono';
import {
  Avatar,
  AvatarFallback,
  Stepper,
  StepperItem,
} from '@acronis-platform/ui-react';

const checkAvatar = (
  <Avatar color="green" className="[box-shadow:none]">
    <CheckIcon size={16} />
  </Avatar>
);

const numberAvatar = (n: number, color: 'blue' | 'gray' = 'blue') => (
  <Avatar color={color} className="[box-shadow:none]">
    <AvatarFallback>{n}</AvatarFallback>
  </Avatar>
);

export function StepperDemo() {
  return (
    <div className="flex flex-col gap-8">
      {/* Narrow this preview below 1024px to watch the row give way to the
          two-line summary — it is a real viewport media query. */}
      <Stepper
        currentStep={2}
        totalSteps={6}
        current="Choose a plan"
        next="Add your team"
      >
        <StepperItem
          variant="completed"
          label="Create an account"
          avatar={checkAvatar}
        />
        <StepperItem
          variant="current"
          label="Choose a plan"
          avatar={numberAvatar(2)}
        />
        <StepperItem
          variant="future"
          label="Add your team"
          avatar={numberAvatar(3, 'gray')}
        />
        <StepperItem
          variant="future"
          label="Connect a workload"
          avatar={numberAvatar(4, 'gray')}
        />
        <StepperItem
          variant="future"
          label="Set a protection plan"
          avatar={numberAvatar(5, 'gray')}
        />
        <StepperItem
          variant="future"
          label="Confirm and pay"
          avatar={numberAvatar(6, 'gray')}
        />
      </Stepper>

      {/* The last step: no `next`, so the "Next: …" line is not rendered. */}
      <Stepper currentStep={6} totalSteps={6} current="Confirm and pay">
        <StepperItem
          variant="completed"
          label="Set a protection plan"
          avatar={checkAvatar}
        />
        <StepperItem
          variant="current"
          label="Confirm and pay"
          avatar={numberAvatar(6)}
        />
      </Stepper>
    </div>
  );
}
