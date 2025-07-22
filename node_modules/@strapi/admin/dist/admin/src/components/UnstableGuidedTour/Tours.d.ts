import * as React from 'react';
import { type State, type Action } from './Context';
import { Step } from './Step';
declare const tours: {
    readonly contentTypeBuilder: {
        Introduction: React.ComponentType<{
            children: React.ReactNode;
        }>;
        CollectionTypes: React.ComponentType<{
            children: React.ReactNode;
        }>;
        SingleTypes: React.ComponentType<{
            children: React.ReactNode;
        }>;
        Components: React.ComponentType<{
            children: React.ReactNode;
        }>;
        Finish: React.ComponentType<{
            children: React.ReactNode;
        }>;
    };
    readonly contentManager: {
        Introduction: React.ComponentType<{
            children: React.ReactNode;
        }>;
        Finish: React.ComponentType<{
            children: React.ReactNode;
        }>;
        Fields: React.ComponentType<{
            children: React.ReactNode;
        }>;
        Publish: React.ComponentType<{
            children: React.ReactNode;
        }>;
    };
    readonly apiTokens: {
        Introduction: React.ComponentType<{
            children: React.ReactNode;
        }>;
        Finish: React.ComponentType<{
            children: React.ReactNode;
        }>;
        CreateAnAPIToken: React.ComponentType<{
            children: React.ReactNode;
        }>;
        CopyAPIToken: React.ComponentType<{
            children: React.ReactNode;
        }>;
    };
    readonly strapiCloud: {};
};
type Tours = typeof tours;
type Content = (Step: Step, { state, dispatch, }: {
    state: State;
    dispatch: React.Dispatch<Action>;
}) => React.ReactNode;
export type { Content, Tours };
export { tours };
