import { createRoot } from 'react-dom/client';

import React from 'react';
import App from './client/App';
import { IgSessionContextProvider } from './client/IgSessionContext';

const container = document.getElementById('root');
if (container !== null) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <IgSessionContextProvider>
        <App />
      </IgSessionContextProvider>
    </React.StrictMode>,
  );
}
