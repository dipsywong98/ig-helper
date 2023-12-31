import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import React from 'react';
import App from './client/App';
import { IgSessionContextProvider } from './client/IgSessionContext';

const queryClient = new QueryClient();

const container = document.getElementById('root');
if (container !== null) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <IgSessionContextProvider>
          <App />
        </IgSessionContextProvider>
      </QueryClientProvider>
    </React.StrictMode>,
  );
}
