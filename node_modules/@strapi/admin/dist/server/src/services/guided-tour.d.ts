import { Core } from '@strapi/types';
export type GuidedTourRequiredActions = {
    didCreateContentTypeSchema: boolean;
    didCreateContent: boolean;
    didCreateApiToken: boolean;
};
export type GuidedTourCompletedActions = keyof GuidedTourRequiredActions;
export declare const createGuidedTourService: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    getCompletedActions: () => Promise<(keyof GuidedTourRequiredActions)[]>;
};
