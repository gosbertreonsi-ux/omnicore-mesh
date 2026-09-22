import React from 'react';
import { createRoot } from 'react-dom/client';
import { OverwatchDashboard } from './OverwatchDashboard.tsx';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <OverwatchDashboard />
    </React.StrictMode>
  );
}
