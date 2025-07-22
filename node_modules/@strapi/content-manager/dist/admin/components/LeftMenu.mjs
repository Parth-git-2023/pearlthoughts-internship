import { jsxs, jsx } from 'react/jsx-runtime';
import * as React from 'react';
import { useQueryParams, SubNav } from '@strapi/admin/strapi-admin';
import { useFilter, useCollator, Divider, Flex, TextInput } from '@strapi/design-system';
import { Search, Cross } from '@strapi/icons';
import { stringify, parse } from 'qs';
import { useIntl } from 'react-intl';
import { useContentTypeSchema } from '../hooks/useContentTypeSchema.mjs';
import { useTypedSelector } from '../modules/hooks.mjs';
import { getTranslation } from '../utils/translations.mjs';

const LeftMenu = ()=>{
    const [search, setSearch] = React.useState('');
    const [{ query }] = useQueryParams();
    const { formatMessage, locale } = useIntl();
    const collectionTypeLinks = useTypedSelector((state)=>state['content-manager'].app.collectionTypeLinks);
    const singleTypeLinks = useTypedSelector((state)=>state['content-manager'].app.singleTypeLinks);
    const { schemas } = useContentTypeSchema();
    const { startsWith } = useFilter(locale, {
        sensitivity: 'base'
    });
    const formatter = useCollator(locale, {
        sensitivity: 'base'
    });
    const menu = React.useMemo(()=>[
            {
                id: 'collectionTypes',
                title: formatMessage({
                    id: getTranslation('components.LeftMenu.collection-types'),
                    defaultMessage: 'Collection Types'
                }),
                searchable: true,
                links: collectionTypeLinks
            },
            {
                id: 'singleTypes',
                title: formatMessage({
                    id: getTranslation('components.LeftMenu.single-types'),
                    defaultMessage: 'Single Types'
                }),
                searchable: true,
                links: singleTypeLinks
            }
        ].map((section)=>({
                ...section,
                links: section.links/**
           * Filter by the search value
           */ .filter((link)=>startsWith(link.title, search))/**
           * Sort correctly using the language
           */ .sort((a, b)=>formatter.compare(a.title, b.title))/**
           * Apply the formated strings to the links from react-intl
           */ .map((link)=>{
                    return {
                        ...link,
                        title: formatMessage({
                            id: link.title,
                            defaultMessage: link.title
                        })
                    };
                })
            })), [
        collectionTypeLinks,
        search,
        singleTypeLinks,
        startsWith,
        formatMessage,
        formatter
    ]);
    const handleClear = ()=>{
        setSearch('');
    };
    const handleChangeSearch = ({ target: { value } })=>{
        setSearch(value);
    };
    const label = formatMessage({
        id: getTranslation('header.name'),
        defaultMessage: 'Content Manager'
    });
    const getPluginsParamsForLink = (link)=>{
        const schema = schemas.find((schema)=>schema.uid === link.uid);
        const isI18nEnabled = Boolean(schema?.pluginOptions?.i18n?.localized);
        // The search params have the i18n plugin
        if (query.plugins && 'i18n' in query.plugins) {
            // Prepare removal of i18n from the plugins search params
            const { i18n, ...restPlugins } = query.plugins;
            // i18n is not enabled, remove it from the plugins search params
            if (!isI18nEnabled) {
                return restPlugins;
            }
            // i18n is enabled, put the plugins search params back together
            return {
                i18n,
                ...restPlugins
            };
        }
        return query.plugins;
    };
    return /*#__PURE__*/ jsxs(SubNav.Main, {
        "aria-label": label,
        children: [
            /*#__PURE__*/ jsx(SubNav.Header, {
                label: label
            }),
            /*#__PURE__*/ jsx(Divider, {
                background: "neutral150"
            }),
            /*#__PURE__*/ jsx(Flex, {
                padding: 5,
                gap: 3,
                direction: 'column',
                alignItems: 'stretch',
                children: /*#__PURE__*/ jsx(TextInput, {
                    startAction: /*#__PURE__*/ jsx(Search, {
                        fill: "neutral500"
                    }),
                    value: search,
                    onChange: handleChangeSearch,
                    "aria-label": "Search",
                    placeholder: formatMessage({
                        id: 'content-manager.components.LeftMenu.Search.label',
                        defaultMessage: 'Search for a content type'
                    }),
                    endAction: /*#__PURE__*/ jsx(Cross, {
                        onClick: handleClear,
                        fill: "neutral500",
                        cursor: "pointer"
                    }),
                    size: "S"
                })
            }),
            /*#__PURE__*/ jsx(SubNav.Sections, {
                children: menu.map((section)=>{
                    return /*#__PURE__*/ jsx(SubNav.Section, {
                        label: section.title,
                        children: section.links.map((link)=>{
                            return /*#__PURE__*/ jsx(SubNav.Link, {
                                to: {
                                    pathname: link.to,
                                    search: stringify({
                                        ...parse(link.search ?? ''),
                                        plugins: getPluginsParamsForLink(link)
                                    })
                                },
                                label: link.title
                            }, link.uid);
                        })
                    }, section.id);
                })
            })
        ]
    });
};

export { LeftMenu };
//# sourceMappingURL=LeftMenu.mjs.map
