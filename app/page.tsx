"use client";
import React, { useState } from 'react';
import Facturacion from './facturacion/page'; 
import Dashboard from './dashboard/page';

const App: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState<string>('Dashboard');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);


  const renderContent = () => {
    switch (selectedMenu) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Facturación':
        return <Facturacion />;
      default:
        return <div>Opción no válida</div>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Menú lateral */}
      <aside
        className={`${isCollapsed ? 'w-16' : 'w-64'
          } bg-gray-800 text-white flex flex-col transition-width duration-300`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-4 text-center bg-gray-700 hover:bg-gray-600"
        >
          {isCollapsed ? '=' : '<'}
        </button>
        <h2 className={` text-lg font-bold p-4 ${isCollapsed ? 'hidden' : ''}`}>Menú</h2>
        <ul className="flex-grow">
          <li
            className={`p-4 cursor-pointer hover:bg-gray-700 ${isCollapsed ? 'hidden' : ''} ${selectedMenu === 'Dashboard' ? 'bg-gray-600' : ''
              }`}
            onClick={() => setSelectedMenu('Dashboard')}
          >
            Dashboard
          </li>
          <li
            className={`p-4 cursor-pointer hover:bg-gray-700 ${isCollapsed ? 'hidden' : ''}  ${selectedMenu === 'Facturación' ? 'bg-gray-600' : ''
              }`}
            onClick={() => setSelectedMenu('Facturación')}
          >
            Facturación
          </li>
          <li
            className={`p-4 cursor-pointer hover:bg-gray-700 ${isCollapsed ? 'hidden' : ''}  
              }`}
          >
            Servicios
          </li>
          <li
            className={`p-4 cursor-pointer hover:bg-gray-700 ${isCollapsed ? 'hidden' : ''}  
              }`}
          >
            Stock
          </li>
          <li
            className={`p-4 cursor-pointer hover:bg-gray-700 ${isCollapsed ? 'hidden' : ''}  
              }`}
          >
            Mantenimiento
          </li>
        </ul>
        <button
          onClick={() => {
            localStorage.removeItem("token"); 
            window.location.href = "/login"; 
          }}
          className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-md"
        >
          Logout
        </button>
      </aside>

      {/* Contenido dinámico */}
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">{renderContent()}</main>
    </div>
  );
};

export default App;
