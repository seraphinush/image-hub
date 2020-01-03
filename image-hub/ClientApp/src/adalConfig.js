import { AuthenticationContext, adalFetch, withAdalLogin } from 'react-adal';

export const adalConfig = {
    tenant: 'samplehotmail.onmicrosoft.com',
    clientId: 'abcdefgh-ijkl-mnop-qrst-uvwxyz123456', 
    endpoints: {
        api: 'abcdefgh-ijkl-mnop-qrst-uvwxyz123456'
    },
    postLogoutRedirectUri: window.location.origin,
    redirectUri: 'http://localhost:5000/',
    cacheLocation: 'sessionStorage'
};

export const authContext = new AuthenticationContext(adalConfig);

export const getToken = () => {
    return authContext.getCachedToken(authContext.config.clientId);
};


export const getCredentials = (token) => {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

export const isAdmin = () => {
    const adminGroup = "abcdefgh-ijkl-mnop-qrst-uvwxyz123456";
    let groupClaims = getUser().profile["groups"];
    if (groupClaims != null) {
        return getUser().profile["groups"].includes(adminGroup);
    }
    return false;
};

export const adalApiFetch = (fetch, url, options) =>
adalFetch(authContext, adalConfig.endpoints.api, fetch, url, options);

export const withAdalLoginApi = withAdalLogin(authContext, adalConfig.endpoints.api);

export const getUser = () => {
    return authContext.getCachedUser();
};

// returns true if current browser is IE, false otherwise
export const isIE = () => {
   return /*@cc_on!@*/false || !!document.documentMode;
};