"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Machine {
  _id: string;
  name: string;
  status: string;
  services: number;
  image: string;
  editable: boolean;
  saving: boolean;
}

const Dashboard: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/machines", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMachines(
          response.data.map((machine: Machine) => ({
            ...machine,
            editable: false,
            saving: false,
          }))
        );
        setLoading(false);
      } catch (err) {
        setError("Error fetching machines");
        setLoading(false);
      }
    };

    fetchMachines();
  }, []);

  const toggleEditable = (id: string) => {
    setMachines((prevMachines) =>
      prevMachines.map((machine) =>
        machine._id === id
          ? { ...machine, editable: !machine.editable }
          : machine
      )
    );
  };

  const handleInputChange = (
    id: string,
    field: keyof Machine,
    value: string | number
  ) => {
    setMachines((prevMachines) =>
      prevMachines.map((machine) =>
        machine._id === id ? { ...machine, [field]: value } : machine
      )
    );
  };

  const saveChanges = async (id: string) => {
    setMachines((prevMachines) =>
      prevMachines.map((machine) =>
        machine._id === id ? { ...machine, saving: true } : machine
      )
    );

    const updatedMachine = machines.find((machine) => machine._id === id);
    try {
      if (updatedMachine) {
        const response = await axios.put(
          `http://localhost:5000/api/machines/${id}`,
          updatedMachine,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMachines((prevMachines) =>
          prevMachines.map((machine) =>
            machine._id === id
              ? { ...response.data, editable: false, saving: false }
              : machine
          )
        );
      }
    } catch (err) {
      setError("Error updating machine");
      setMachines((prevMachines) =>
        prevMachines.map((machine) =>
          machine._id === id ? { ...machine, saving: false } : machine
        )
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex h-screen bg-gray-200 overflow-hidden">
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4 text-black">Máquinas</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((machine) => (
            <div
              key={machine._id}
              className="bg-white shadow-md rounded-lg flex flex-col md:flex-row"
            >
              {/* Imagen ocupando el lado izquierdo */}
              <div className="md:w-1/3 flex-shrink-0">
                <img
                  src="/mixo_maquina.png"
                  alt={machine.name}
                  className="w-full h-full object-cover rounded-l-lg"
                />
              </div>

              {/* Contenido de la tarjeta */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <label className="block font-semibold text-black">
                    Nombre:
                  </label>
                  <input
                    type="text"
                    value={machine.name}
                    disabled={!machine.editable}
                    onChange={(e) =>
                      handleInputChange(machine._id, "name", e.target.value)
                    }
                    className={`w-full border ${
                      machine.editable ? "border-blue-500" : "border-gray-300"
                    } rounded-md p-2 mb-4 text-black`}
                  />
                  <label className="block font-semibold text-black">
                    Estado:
                  </label>
                  <input
                    type="text"
                    value={machine.status}
                    disabled={!machine.editable}
                    onChange={(e) =>
                      handleInputChange(machine._id, "status", e.target.value)
                    }
                    className={`w-full border ${
                      machine.editable ? "border-blue-500" : "border-gray-300"
                    } rounded-md p-2 mb-4 text-black`}
                  />
                  <label className="block font-semibold text-black">
                    Número de servicios:
                  </label>
                  <p className="text-black">{machine.services}</p>
                </div>

                {/* Botón de acción */}
                <button
                  onClick={() =>
                    machine.editable
                      ? saveChanges(machine._id)
                      : toggleEditable(machine._id)
                  }
                  className={`mt-4 ${
                    machine.saving
                      ? "bg-gray-500"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white px-4 py-2 rounded-md self-end`}
                  disabled={machine.saving}
                >
                  {machine.saving
                    ? "Guardando..."
                    : machine.editable
                    ? "Guardar"
                    : "Modificar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
