"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Service {
  _id: string;
  id: string;
  type: string;
  service: string;
  datetime: string;
  price: number;
}

const Facturacion: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [machines, setMachines] = useState<{ _id: string; name: string }[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/machines', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setMachines(response.data);
      } catch (err) {
        setError('Error fetching machines');
      }
    };

    fetchMachines();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/services', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: selectedMachine ? { machineId: selectedMachine } : {},
        });
        setServices(response.data);
      } catch (err) {
        setError('Error fetching services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [selectedMachine]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-200 overflow-y-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">Facturación</h1>

      <div className="mb-4">
        <label htmlFor="machineFilter" className="block font-bold text-black mb-2">
          Filtrar por máquina:
        </label>
        <select
          id="machineFilter"
          className="w-full p-2 border border-gray-300 rounded-md text-black"
          value={selectedMachine || ''}
          onChange={(e) => setSelectedMachine(e.target.value || null)}
        >
          <option value="">Todas las máquinas</option>
          {machines.map((machine) => (
            <option key={machine._id} value={machine._id}>
              {machine.name}
            </option>
          ))}
        </select>
      </div>

      <table className="table-auto w-full bg-white rounded-lg shadow-md">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-4 py-2">Identificador</th>
            <th className="px-4 py-2">Tipo</th>
            <th className="px-4 py-2">Servicio</th>
            <th className="px-4 py-2">Fecha y Hora</th>
            <th className="px-4 py-2">Precio</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id || service._id} className="text-black text-center border-b">
              <td className="px-4 py-2">{service._id}</td>
              <td className="px-4 py-2">{service.type}</td>
              <td className="px-4 py-2">{service.service}</td>
              <td className="px-4 py-2">{service.datetime}</td>
              <td className="px-4 py-2">${service.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Facturacion;
