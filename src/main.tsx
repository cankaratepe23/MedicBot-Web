import React from 'react'
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App'
import AudioPlayer from './AudioPlayer';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Navigate to="/" replace />
  },
  {
    path: "/Audio/:audioId",
    element: <AudioPlayer />
  }
])
const rootContainer = document.getElementById('root');
const root = createRoot(rootContainer!);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
