import { type UseDocument } from '../../hooks/useDocument';
import { type EditLayout } from '../../hooks/useDocumentLayout';
interface PreviewContextValue {
    url: string;
    title: string;
    document: NonNullable<ReturnType<UseDocument>['document']>;
    meta: NonNullable<ReturnType<UseDocument>['meta']>;
    schema: NonNullable<ReturnType<UseDocument>['schema']>;
    layout: EditLayout;
    onPreview: () => void;
}
declare const usePreviewContext: <Selected, ShouldThrow extends boolean = true>(consumerName: string, selector: (value: PreviewContextValue) => Selected, shouldThrowOnMissingContext?: ShouldThrow | undefined) => ShouldThrow extends true ? Selected : Selected | undefined;
declare const ProtectedPreviewPage: () => import("react/jsx-runtime").JSX.Element;
export { ProtectedPreviewPage, usePreviewContext };
