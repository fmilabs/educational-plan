import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PublicClientApplication } from '@azure/msal-browser';

import App from './app/app';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './config/azure-config';
import { AuthProvider } from './app/contexts/auth.context';

const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
if(isAzureHash()) {
  // do nothing
} else {
  root.render(
    <StrictMode>
      <MsalProvider instance={msalInstance}>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </MsalProvider>
    </StrictMode>
  )
}

function isAzureHash() {
  const hash = window.location.hash;
  if(!hash.startsWith('#')) return false;
  const params = new URLSearchParams(hash.slice(1));
  return params.has('code') || params.has('client_info') || params.has('session_state');
}
