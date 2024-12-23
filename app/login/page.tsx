"use client";

import React, { useState } from "react";
import api from "../utils/axiosConfig";
import Cookies from 'js-cookie';


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [token, setToken] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await api.post('/auth/login', { email, password });
        setToken(response.data.token);
        setError('');
        console.log('Token:', response.data.token);
        Cookies.set('token', response.data.token, { expires: 1 }); 
        window.location.href = '/'; 
       
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al iniciar sesión');
      }
    };

    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
            <img src="/logo.png" alt="Logo" className="mb-6" />
  
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Usuario
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:ring-blue-300 text-gray-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-500">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:ring-blue-300 text-black"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Acceder
            </button>
          </form>
  
          {error && (
            <p className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>
    );
};

export default Login;