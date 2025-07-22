import { jsx } from 'react/jsx-runtime';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createContext } from '../components/Context.mjs';
import { useTypedDispatch, useTypedSelector } from '../core/store/hooks.mjs';
import { useStrapiApp } from './StrapiApp.mjs';
import { useQueryParams } from '../hooks/useQueryParams.mjs';
import { logout, login, setLocale } from '../reducer.mjs';
import { adminApi } from '../services/api.mjs';
import { useGetMeQuery, useGetMyPermissionsQuery, useLoginMutation, useRenewTokenMutation, useLogoutMutation, useLazyCheckPermissionsQuery } from '../services/auth.mjs';

const [Provider, useAuth] = createContext('Auth');
const STORAGE_KEYS = {
    TOKEN: 'jwtToken',
    STATUS: 'isLoggedIn'
};
const AuthProvider = ({ children, _defaultPermissions = [], _disableRenewToken = false })=>{
    const dispatch = useTypedDispatch();
    const runRbacMiddleware = useStrapiApp('AuthProvider', (state)=>state.rbac.run);
    const location = useLocation();
    const [{ rawQuery }] = useQueryParams();
    const locationRef = React.useRef(location);
    // Update ref without causing re-render
    React.useEffect(()=>{
        locationRef.current = location;
    }, [
        location
    ]);
    const token = useTypedSelector((state)=>state.admin_app.token ?? null);
    const { data: user, isLoading: isLoadingUser } = useGetMeQuery(undefined, {
        /**
     * If there's no token, we don't try to fetch
     * the user data because it will fail.
     */ skip: !token
    });
    const { data: userPermissions = _defaultPermissions, refetch, isUninitialized, isLoading: isLoadingPermissions } = useGetMyPermissionsQuery(undefined, {
        skip: !token
    });
    const navigate = useNavigate();
    const [loginMutation] = useLoginMutation();
    const [renewTokenMutation] = useRenewTokenMutation();
    const [logoutMutation] = useLogoutMutation();
    const clearStateAndLogout = React.useCallback(()=>{
        dispatch(adminApi.util.resetApiState());
        dispatch(logout());
        navigate('/auth/login');
    }, [
        dispatch,
        navigate
    ]);
    /**
   * Fetch data from storages on mount and store it in our state.
   * It's not normally stored in session storage unless the user
   * does click "remember me" when they login. We also need to renew the token.
   */ React.useEffect(()=>{
        if (token && !_disableRenewToken) {
            renewTokenMutation({
                token
            }).then((res)=>{
                if ('data' in res) {
                    dispatch(login({
                        token: res.data.token
                    }));
                } else {
                    clearStateAndLogout();
                }
            });
        }
    }, [
        token,
        dispatch,
        renewTokenMutation,
        clearStateAndLogout,
        _disableRenewToken
    ]);
    React.useEffect(()=>{
        if (user) {
            if (user.preferedLanguage) {
                dispatch(setLocale(user.preferedLanguage));
            }
        }
    }, [
        dispatch,
        user
    ]);
    React.useEffect(()=>{
        /**
     * This will log a user out of all tabs if they log out in one tab.
     */ const handleUserStorageChange = (event)=>{
            if (event.key === STORAGE_KEYS.STATUS && event.newValue === null) {
                clearStateAndLogout();
            }
        };
        window.addEventListener('storage', handleUserStorageChange);
        return ()=>{
            window.removeEventListener('storage', handleUserStorageChange);
        };
    });
    const login$1 = React.useCallback(async ({ rememberMe, ...body })=>{
        const res = await loginMutation(body);
        /**
       * There will always be a `data` key in the response
       * because if something fails, it will throw an error.
       */ if ('data' in res) {
            const { token } = res.data;
            dispatch(login({
                token,
                persist: rememberMe
            }));
        }
        return res;
    }, [
        dispatch,
        loginMutation
    ]);
    const logout$1 = React.useCallback(async ()=>{
        await logoutMutation();
        clearStateAndLogout();
    }, [
        clearStateAndLogout,
        logoutMutation
    ]);
    const refetchPermissions = React.useCallback(async ()=>{
        if (!isUninitialized) {
            await refetch();
        }
    }, [
        isUninitialized,
        refetch
    ]);
    const [checkPermissions] = useLazyCheckPermissionsQuery();
    const checkUserHasPermissions = React.useCallback(async (permissions, passedPermissions, // TODO:
    // Here we have parameterised checkUserHasPermissions in order to pass
    // query context from elsewhere in the application.
    // See packages/core/content-manager/admin/src/features/DocumentRBAC.tsx
    // This is in order to calculate permissions on accurate query params.
    // We should be able to rely on the query params in this provider
    // If we need to pass additional context to the RBAC middleware
    // we should define a better context type.
    rawQueryContext)=>{
        /**
       * If there's no permissions to check, then we allow it to
       * pass to preserve existing behaviours.
       *
       * TODO: should we review this? it feels more dangerous than useful.
       */ if (!permissions || permissions.length === 0) {
            return [
                {
                    action: '',
                    subject: ''
                }
            ];
        }
        /**
       * Given the provided permissions, return the permissions from either passedPermissions
       * or userPermissions as this is expected to be the full permission entity.
       */ const actualUserPermissions = passedPermissions ?? userPermissions;
        const matchingPermissions = actualUserPermissions.filter((permission)=>permissions.findIndex((perm)=>perm.action === permission.action && // Only check the subject if it's provided
                (perm.subject == undefined || perm.subject === permission.subject)) >= 0);
        const middlewaredPermissions = await runRbacMiddleware({
            user,
            permissions: userPermissions,
            pathname: locationRef.current.pathname,
            search: (rawQueryContext || rawQuery).split('?')[1] ?? ''
        }, matchingPermissions);
        const shouldCheckConditions = middlewaredPermissions.some((perm)=>Array.isArray(perm.conditions) && perm.conditions.length > 0);
        if (!shouldCheckConditions) {
            return middlewaredPermissions;
        }
        const { data, error } = await checkPermissions({
            permissions: middlewaredPermissions.map((perm)=>({
                    action: perm.action,
                    subject: perm.subject
                }))
        });
        if (error) {
            throw error;
        } else {
            return middlewaredPermissions.filter((_, index)=>data?.data[index] === true);
        }
    }, [
        checkPermissions,
        rawQuery,
        runRbacMiddleware,
        user,
        userPermissions
    ]);
    const isLoading = isLoadingUser || isLoadingPermissions;
    return /*#__PURE__*/ jsx(Provider, {
        token: token,
        user: user,
        login: login$1,
        logout: logout$1,
        permissions: userPermissions,
        checkUserHasPermissions: checkUserHasPermissions,
        refetchPermissions: refetchPermissions,
        isLoading: isLoading,
        children: children
    });
};

export { AuthProvider, STORAGE_KEYS, useAuth };
//# sourceMappingURL=Auth.mjs.map
