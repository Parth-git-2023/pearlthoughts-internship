/// <reference types="react" />
declare const StyledLink: import("styled-components").IStyledComponent<"web", import("styled-components/dist/types").FastOmit<Omit<import("react-router-dom").NavLinkProps & import("react").RefAttributes<HTMLAnchorElement>, "ref"> & {
    ref?: ((instance: HTMLAnchorElement | null) => void) | import("react").RefObject<HTMLAnchorElement> | null | undefined;
}, never>> & Omit<import("react").ForwardRefExoticComponent<import("react-router-dom").NavLinkProps & import("react").RefAttributes<HTMLAnchorElement>>, keyof import("react").Component<any, {}, any>>;
export declare const SubNav: {
    Main: import("styled-components").IStyledComponent<"web", import("styled-components/dist/types").FastOmit<Omit<Omit<import("@strapi/design-system").SubNavProps, "ref"> & import("react").RefAttributes<HTMLDivElement>, "ref"> & {
        ref?: ((instance: HTMLDivElement | null) => void) | import("react").RefObject<HTMLDivElement> | null | undefined;
    }, never>> & Omit<import("react").ForwardRefExoticComponent<Omit<import("@strapi/design-system").SubNavProps, "ref"> & import("react").RefAttributes<HTMLDivElement>>, keyof import("react").Component<any, {}, any>>;
    Header: ({ label }: {
        label: string;
    }) => import("react/jsx-runtime").JSX.Element;
    Link: (props: Omit<React.ComponentProps<typeof StyledLink>, 'label'> & {
        label: React.ReactNode;
        endAction?: React.ReactNode;
    }) => import("react/jsx-runtime").JSX.Element;
    Sections: ({ children, ...props }: {
        children: React.ReactNode[];
        [key: string]: any;
    }) => import("react/jsx-runtime").JSX.Element;
    Section: ({ label, children, link, }: {
        label: string;
        children: React.ReactNode[];
        link?: {
            label: string;
            onClik: () => void;
        };
    }) => import("react/jsx-runtime").JSX.Element;
    SubSection: ({ label, children }: {
        label: string;
        children: React.ReactNode[];
    }) => import("react/jsx-runtime").JSX.Element;
};
export {};
