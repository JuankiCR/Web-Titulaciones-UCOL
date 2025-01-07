"use client";
import React, { useState, useEffect } from "react";
import { Sinodal as tSinodal } from '@apptypes/ucolTypes';
import Papa from 'papaparse'; // Librería para procesar CSV

import styles from "./styles.module.scss";

export default function Sinodales() {
  const [sinodales, setSinodales] = useState<tSinodal[]>([]);
  const [newSinodal, setNewSinodal] = useState<tSinodal>({
    _id: "",
    numeroTrabajador: "",
    nombre: "",
    carrera: "",
    facultad: "",
    rol: "Vocal",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editSinodal, setEditSinodal] = useState<tSinodal | null>(null);

  useEffect(() => {
    fetch("/api/titulaciones/sinodales")
      .then((response) => response.json())
      .then((data: tSinodal[]) => setSinodales(data));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSinodal((prev) => ({ ...prev, [name]: value }));
  };

  const addSinodal = async () => {
    if (!newSinodal.numeroTrabajador || !newSinodal.nombre || !newSinodal.carrera || !newSinodal.facultad) return;

    const response = await fetch("/api/titulaciones/sinodales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSinodal),
    });

    if (response.ok) {
      const newEntry: tSinodal = await response.json();
      setSinodales([...sinodales, newEntry]);
      setNewSinodal({
        _id: "",
        numeroTrabajador: "",
        nombre: "",
        carrera: "",
        facultad: "",
        rol: "Vocal",
      });
    }
  };

  const deleteSinodal = async (_id: string) => {
    const response = await fetch(`/api/titulaciones/sinodales?id=${_id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setSinodales(sinodales.filter((sinodal) => sinodal._id !== _id));
    }
  };

  const startEditSinodal = (index: number) => {
    setEditIndex(index);
    setEditSinodal(sinodales[index]);
  };

  const saveEditSinodal = async () => {
    if (editIndex === null || !editSinodal) return;

    const response = await fetch(`/api/titulaciones/sinodales?id=${editSinodal._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editSinodal),
    });

    if (response.ok) {
      const updatedSinodal: tSinodal = await response.json();
      const updatedSinodales = sinodales.map((sinodal, i) =>
        i === editIndex ? updatedSinodal : sinodal
      );
      setSinodales(updatedSinodales);
      setEditIndex(null);
      setEditSinodal(null);
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editSinodal) {
      setEditSinodal((prev) => (prev ? { ...prev, [name]: value } : prev));
    }
  };

  // Cargar archivo CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const parsedData: tSinodal[] = results.data as tSinodal[];

          // Iteramos sobre cada sinodal y hacemos una solicitud POST para guardarlo
          for (const sinodal of parsedData) {
            const response = await fetch("/api/titulaciones/sinodales", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(sinodal),
            });

            if (!response.ok) {
              console.error(`Error guardando sinodal: ${sinodal.nombre}`);
            }
          }

          // Después de guardar todos los datos, actualizamos el estado con los nuevos datos
          setSinodales([...sinodales, ...parsedData]);
        },
      });
    }
  };

  // Descargar plantilla CSV
  const downloadTemplate = () => {
    const headers = ["_id", "numeroTrabajador", "nombre", "carrera", "facultad", "rol"];
    const csvContent =
      "data:text/csv;charset=utf-8," + headers.join(",") + "\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sinodales_template.csv");
    document.body.appendChild(link); // Requiere para Firefox
    link.click();
    document.body.removeChild(link);
  };

  // Descargar datos actuales como CSV
  const downloadSinodalesData = () => {
    const csv = Papa.unparse(sinodales); // Convierte los datos a formato CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sinodales_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestión de Sinodales</h1>

      {/* Formulario para agregar un sinodal */}
      <div className={styles.formContainer}>
        <input
          type="text"
          name="numeroTrabajador"
          value={newSinodal.numeroTrabajador}
          onChange={handleInputChange}
          placeholder="Número de Trabajador"
          className={styles.input}
        />
        <input
          type="text"
          name="nombre"
          value={newSinodal.nombre}
          onChange={handleInputChange}
          placeholder="Nombre"
          className={styles.input}
        />
        <input
          type="text"
          name="carrera"
          value={newSinodal.carrera}
          onChange={handleInputChange}
          placeholder="Carrera"
          className={styles.input}
        />
        <input
          type="text"
          name="facultad"
          value={newSinodal.facultad}
          onChange={handleInputChange}
          placeholder="Facultad"
          className={styles.input}
        />
        <select
          name="rol"
          value={newSinodal.rol}
          onChange={handleInputChange}
          className={styles.select}
        >
          <option value="Presidente/a">Presidente/a</option>
          <option value="Secretario/a">Secretario/a</option>
          <option value="Vocal">Vocal</option>
        </select>
        <button onClick={addSinodal} className='primary'>
          Agregar
        </button>
      </div>

      <div className={styles.dataControlsContainer}>	
        {/* Botones para cargar CSV y descargar plantilla */}
        <div className={styles.buttonContainer}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className={styles.inputFile}
          />
          <button onClick={downloadTemplate} className='secondary'>
            Descargar Plantilla CSV
          </button>
        </div>

        {/* Botón para descargar los datos actuales de sinodales */}
        <div className={styles.buttonContainer}>
          <button onClick={downloadSinodalesData} className='secondary'>
            Descargar Datos de Sinodales
          </button>
        </div>
      </div>
      
      {/* Tabla de sinodales */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Número de Trabajador</th>
              <th>Nombre</th>
              <th>Carrera</th>
              <th>Facultad</th>
              <th>Rol</th>
              <th colSpan={2}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sinodales.map((sinodal, index) => (
              <tr key={sinodal._id}>
                {editIndex === index ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="numeroTrabajador"
                        value={editSinodal?.numeroTrabajador || ""}
                        onChange={handleEditInputChange}
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="nombre"
                        value={editSinodal?.nombre || ""}
                        onChange={handleEditInputChange}
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="carrera"
                        value={editSinodal?.carrera || ""}
                        onChange={handleEditInputChange}
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="facultad"
                        value={editSinodal?.facultad || ""}
                        onChange={handleEditInputChange}
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <select
                        name="rol"
                        value={editSinodal?.rol || "Vocal"}
                        onChange={handleEditInputChange}
                        className={styles.select}
                      >
                        <option value="Presidente/a">Presidente/a</option>
                        <option value="Secretario/a">Secretario/a</option>
                        <option value="Vocal">Vocal</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={saveEditSinodal} className='primary'>
                        Guardar
                      </button>
                    </td>
                    <td>
                      <button onClick={() => setEditIndex(null)} className='cancel'>
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{sinodal.numeroTrabajador}</td>
                    <td>{sinodal.nombre}</td>
                    <td>{sinodal.carrera}</td>
                    <td>{sinodal.facultad}</td>
                    <td>{sinodal.rol}</td>
                    <td>
                      <button onClick={() => startEditSinodal(index)} className='primary'>
                        Editar
                      </button>
                    </td>
                    <td>
                      <button onClick={() => deleteSinodal(sinodal._id)} className='cancel'>
                        Borrar
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
