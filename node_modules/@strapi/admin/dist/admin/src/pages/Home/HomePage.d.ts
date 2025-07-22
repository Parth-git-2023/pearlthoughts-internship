import * as React from 'react';
import type { WidgetType } from '@strapi/admin/strapi-admin';
interface WidgetRootProps extends Pick<WidgetType, 'title' | 'icon' | 'permissions' | 'link'> {
    children: React.ReactNode;
}
export declare const WidgetRoot: ({ title, icon, permissions, children, link, }: WidgetRootProps) => import("react/jsx-runtime").JSX.Element;
declare const HomePageCE: () => import("react/jsx-runtime").JSX.Element;
declare const HomePage: () => import("react/jsx-runtime").JSX.Element | null;
export { HomePage, HomePageCE };
