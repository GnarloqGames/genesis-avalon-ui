import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from "react-oidc-context";
import 'normalize.css';
import './index.css'
import { Configuration } from './config.ts';

declare global {
  interface Window { config: Configuration }
}

const oidcConfig = {
  authority: window.config.oidcAuthorityUrl,
  client_id: window.config.oidcClientId,
  redirect_uri: window.config.oidcRedirectUrl || window.location.href,
  scope: window.config.oidcScope
};

console.log(oidcConfig)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider {...oidcConfig}>
    <App />
  </AuthProvider>
)