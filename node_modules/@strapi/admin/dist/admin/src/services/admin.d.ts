import { type UpdateProjectSettings, type Plugins, type GetLicenseLimitInformation, GetGuidedTourMeta } from '../../../shared/contracts/admin';
interface ConfigurationLogo {
    custom?: {
        name?: string;
        url?: string;
    };
    default: string;
}
declare const useInitQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("..").QueryArguments, unknown, import("..").BaseQueryError>, "LicenseLimits" | "ProjectSettings" | "LicenseTrialTimeLeft" | "GuidedTourMeta", {
    uuid: string | false;
    hasAdmin: boolean;
    menuLogo: string | null;
    authLogo: string | null;
}, "adminApi">>, useTelemetryPropertiesQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("..").QueryArguments, unknown, import("..").BaseQueryError>, "LicenseLimits" | "ProjectSettings" | "LicenseTrialTimeLeft" | "GuidedTourMeta", {
    useTypescriptOnServer: boolean;
    useTypescriptOnAdmin: boolean;
    isHostedOnStrapiCloud: boolean;
    numberOfAllContentTypes: number;
    numberOfComponents: number;
    numberOfDynamicZones: number;
}, "adminApi">>, useInformationQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("..").QueryArguments, unknown, import("..").BaseQueryError>, "LicenseLimits" | "ProjectSettings" | "LicenseTrialTimeLeft" | "GuidedTourMeta", {
    currentEnvironment: string;
    autoReload: boolean;
    strapiVersion: string | null;
    dependencies: Record<string, string>;
    projectId: string | null;
    nodeVersion: string;
    communityEdition: boolean;
    useYarn: boolean;
}, "adminApi">>, useProjectSettingsQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("..").QueryArguments, unknown, import("..").BaseQueryError>, "LicenseLimits" | "ProjectSettings" | "LicenseTrialTimeLeft" | "GuidedTourMeta", {
    authLogo?: ConfigurationLogo['custom'];
    menuLogo?: ConfigurationLogo['custom'];
}, "adminApi">>, useUpdateProjectSettingsMutation: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseMutation<import("@reduxjs/toolkit/query").MutationDefinition<FormData, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("..").QueryArguments, unknown, import("..").BaseQueryError>, "LicenseLimits" | "ProjectSettings" | "LicenseTrialTimeLeft" | "GuidedTourMeta", UpdateProjectSettings.Response, "adminApi">>, useGetPluginsQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("..").QueryArguments, unknown, import("..").BaseQueryError>, "LicenseLimits" | "ProjectSettings" | "LicenseTrialTimeLeft" | "GuidedTourMeta", Plugins.Response, "adminApi">>, useGetLicenseLimitsQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("..").QueryArguments, unknown, import("..").BaseQueryError>, "LicenseLimits" | "ProjectSettings" | "LicenseTrialTimeLeft" | "GuidedTourMeta", GetLicenseLimitInformation.Response, "adminApi">>, useGetLicenseTrialTimeLeftQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("..").QueryArguments, unknown, import("..").BaseQueryError>, "LicenseLimits" | "ProjectSettings" | "LicenseTrialTimeLeft" | "GuidedTourMeta", {
    trialEndsAt: string;
}, "adminApi">>, useGetGuidedTourMetaQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<void, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("..").QueryArguments, unknown, import("..").BaseQueryError>, "LicenseLimits" | "ProjectSettings" | "LicenseTrialTimeLeft" | "GuidedTourMeta", GetGuidedTourMeta.Response, "adminApi">>;
export { useInitQuery, useTelemetryPropertiesQuery, useInformationQuery, useProjectSettingsQuery, useUpdateProjectSettingsMutation, useGetPluginsQuery, useGetLicenseLimitsQuery, useGetLicenseTrialTimeLeftQuery, useGetGuidedTourMetaQuery, };
export type { ConfigurationLogo };
