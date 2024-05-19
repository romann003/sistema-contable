import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import moment from 'moment-timezone';
moment.tz.setDefault('America/Guatemala');

// primereact
import { LayoutProvider } from "./layout/context/layoutcontext";
import { PrimeReactProvider } from 'primereact/api'

import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css'; // flex

import './styles/layout/layout.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <PrimeReactProvider>
      <LayoutProvider>
      <App />
      </LayoutProvider>
    </PrimeReactProvider>
  // </React.StrictMode>
)