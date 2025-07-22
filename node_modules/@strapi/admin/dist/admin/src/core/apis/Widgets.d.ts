/// <reference types="react" />
import { To } from 'react-router-dom';
import { Permission } from '../../../../shared/contracts/shared';
import type { Internal, Utils } from '@strapi/types';
import type { MessageDescriptor } from 'react-intl';
type WidgetUID = Utils.String.Suffix<Internal.Namespace.WithSeparator<Internal.Namespace.Plugin> | Internal.Namespace.WithSeparator<Internal.Namespace.Global>, string>;
type WidgetArgs = {
    icon?: typeof import('@strapi/icons').PuzzlePiece;
    title: MessageDescriptor;
    link?: {
        label: MessageDescriptor;
        href: To;
    };
    component: () => Promise<React.ComponentType>;
    pluginId?: string;
    id: string;
    permissions?: Array<Pick<Permission, 'action'> & Partial<Omit<Permission, 'action'>>>;
};
type Widget = Omit<WidgetArgs, 'id' | 'pluginId'> & {
    uid: WidgetUID;
};
declare class Widgets {
    widgets: Record<string, Widget>;
    constructor();
    register: (widget: WidgetArgs | WidgetArgs[]) => void;
    getAll: () => Widget[];
}
export { Widgets };
export type { WidgetArgs, Widget };
