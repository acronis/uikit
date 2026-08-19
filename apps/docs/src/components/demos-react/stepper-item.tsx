'use client';

import { CheckIcon } from '@acronis-platform/icons-react/stroke-mono';
import {
  Avatar,
  AvatarFallback,
  Stepper,
  StepperItem,
} from '@acronis-platform/ui-react';

const completedAvatar = (
  <Avatar color="green">
    <CheckIcon size={16} />
  </Avatar>
);

export function StepperItemDemo() {
  return (
    <div className="flex flex-col gap-8">
      {/* A real sequence, laid out by `Stepper`: the completed step is a control. */}
      <Stepper
        currentStep={2}
        totalSteps={3}
        current="Choose a plan"
        next="Confirm and pay"
      >
        <StepperItem
          render={<button type="button" />}
          variant="completed"
          label="Create an account"
          avatar={completedAvatar}
        />
        <StepperItem
          variant="current"
          label="Choose a plan"
          avatar={
            <Avatar color="blue">
              <AvatarFallback>2</AvatarFallback>
            </Avatar>
          }
        />
        <StepperItem
          variant="future"
          label="Confirm and pay"
          avatar={
            <Avatar color="gray">
              <AvatarFallback>3</AvatarFallback>
            </Avatar>
          }
        />
      </Stepper>

      {/* The five combinations the Figma component set actually draws. */}
      <div className="flex flex-wrap items-center gap-4">
        <StepperItem
          variant="current"
          state="active"
          label="Current"
          avatar={
            <Avatar color="blue">
              <AvatarFallback>1</AvatarFallback>
            </Avatar>
          }
        />
        <StepperItem
          variant="completed"
          state="idle"
          label="Completed / idle"
          avatar={completedAvatar}
        />
        <StepperItem
          variant="completed"
          state="hover"
          label="Completed / hover"
          avatar={completedAvatar}
        />
        <StepperItem
          variant="completed"
          state="active"
          label="Completed / active"
          avatar={completedAvatar}
        />
        <StepperItem
          variant="future"
          label="Future"
          avatar={
            <Avatar color="gray">
              <AvatarFallback>5</AvatarFallback>
            </Avatar>
          }
        />
      </div>
    </div>
  );
}
