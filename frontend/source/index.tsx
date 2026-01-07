import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App/index.tsx';
// You exist to import tailwind
import './index.css';   

createRoot(document.getElementById('root')!).render(
  // StrictMode will do everything twice 
  <StrictMode> 
      <App />
  </StrictMode>
);