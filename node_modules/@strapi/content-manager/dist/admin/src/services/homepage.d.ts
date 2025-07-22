import * as Homepage from '../../../shared/contracts/homepage';
declare const useGetRecentDocumentsQuery: import("@reduxjs/toolkit/dist/query/react/buildHooks").UseQuery<import("@reduxjs/toolkit/query").QueryDefinition<{
    action: "update" | "publish";
}, import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@strapi/admin/strapi-admin").QueryArguments, unknown, import("@strapi/admin/strapi-admin").BaseQueryError, {}, {}>, "ComponentConfiguration" | "ContentTypesConfiguration" | "ContentTypeSettings" | "Document" | "InitialData" | "HistoryVersion" | "Relations" | "UidAvailability" | "RecentDocumentList" | "GuidedTourMeta", Homepage.RecentDocument[], "adminApi">>;
export { useGetRecentDocumentsQuery };
