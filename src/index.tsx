import { createRoot } from 'react-dom/client';

import React from 'react';
import App from './client/v1/App';

const container = document.getElementById('root');
if (container !== null) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
