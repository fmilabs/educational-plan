import { environment } from "../environments/environment";

export const msalConfig = {
  auth: {
    clientId: environment.azureClientId || '',
    authority: `https://login.microsoftonline.com/${environment.azureTenantId}`,
    redirectUri: `${environment.websiteURL}`,
  },
  cache: {
    cacheLocation: 'sessionStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

export const loginRequest = {
  scopes: ['User.Read'],
};
