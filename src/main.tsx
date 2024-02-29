import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from "react-oidc-context";
import 'normalize.css';
import './index.css'
import config from './config.ts';

const oidcConfig = {
  authority: config.oidcAuthorityUrl,
  client_id: config.oidcClientId,
  redirect_uri: config.oidcRedirectUrl,
  scope: config.oidcScope
};

console.log(oidcConfig)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider {...oidcConfig}>
    <App />
  </AuthProvider>
)