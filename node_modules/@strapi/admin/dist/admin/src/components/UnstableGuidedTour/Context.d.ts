import * as React from 'react';
import { GetGuidedTourMeta } from '../../../../shared/contracts/admin';
import { type Tours } from './Tours';
type ValidTourName = keyof Tours;
export type ExtendedCompletedActions = (GetGuidedTourMeta.Response['data']['completedActions'][number] | 'didCopyApiToken')[];
type Action = {
    type: 'next_step';
    payload: ValidTourName;
} | {
    type: 'skip_tour';
    payload: ValidTourName;
} | {
    type: 'set_completed_actions';
    payload: ExtendedCompletedActions;
} | {
    type: 'skip_all_tours';
};
type Tour = Record<ValidTourName, {
    currentStep: number;
    length: number;
    isCompleted: boolean;
}>;
type State = {
    tours: Tour;
    enabled: boolean;
    completedActions: ExtendedCompletedActions;
};
declare const unstableUseGuidedTour: <Selected, ShouldThrow extends boolean = true>(consumerName: string, selector: (value: {
    state: State;
    dispatch: React.Dispatch<Action>;
}) => Selected, shouldThrowOnMissingContext?: ShouldThrow | undefined) => ShouldThrow extends true ? Selected : Selected | undefined;
declare function reducer(state: State, action: Action): State;
declare const UnstableGuidedTourContext: ({ children, enabled, }: {
    children: React.ReactNode;
    enabled?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export type { Action, State, ValidTourName };
export { UnstableGuidedTourContext, unstableUseGuidedTour, reducer };
