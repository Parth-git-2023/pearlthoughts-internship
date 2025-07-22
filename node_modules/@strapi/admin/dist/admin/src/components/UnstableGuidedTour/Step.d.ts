import * as React from 'react';
import { Popover } from '@strapi/design-system';
import { type MessageDescriptor } from 'react-intl';
import { ValidTourName } from './Context';
type WithChildren = {
    children: React.ReactNode;
    id?: never;
    defaultMessage?: never;
};
type WithIntl = {
    children?: undefined;
    id: MessageDescriptor['id'];
    defaultMessage: MessageDescriptor['defaultMessage'];
};
type WithActionsChildren = {
    children: React.ReactNode;
    showStepCount?: boolean;
    showSkip?: boolean;
};
type WithActionsProps = {
    children?: undefined;
    showStepCount?: boolean;
    showSkip?: boolean;
};
type StepProps = WithChildren | WithIntl;
type ActionsProps = WithActionsChildren | WithActionsProps;
type Step = {
    Root: React.ForwardRefExoticComponent<React.ComponentProps<typeof Popover.Content>>;
    Title: (props: StepProps) => React.ReactNode;
    Content: (props: StepProps) => React.ReactNode;
    Actions: (props: ActionsProps & {
        to?: string;
    }) => React.ReactNode;
};
declare const createStepComponents: (tourName: ValidTourName) => Step;
export type { Step };
export { createStepComponents };
