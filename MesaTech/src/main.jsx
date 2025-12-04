import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';

// Importe o Layout
import MainLayout from './components/MainLayout.jsx';

// Importe suas páginas
import Projetos from './pages/Projetos.jsx'; 
import Home from './pages/Home.jsx';
import Colaboradores from './pages/Colaboradores.jsx';
import ColaboradoresPerfil from "./pages/colaboradoresPerfil.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "projetos",
        element: <Projetos />,
      },
      {
        path: "colaboradores",
        element: <Colaboradores />,
      },
      {
        path: "colaboradores/:id",
        element: <ColaboradoresPerfil />,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
