import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ThemeProvider } from '@bisnishub/shared/context/ThemeContext';
import { AuthProvider } from '@bisnishub/shared/context/AuthContext';

export function App() {
  return <ThemeProvider><AuthProvider><RouterProvider router={router} /></AuthProvider></ThemeProvider>;
}
export default App;
