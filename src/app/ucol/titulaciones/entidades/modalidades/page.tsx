"use client";
import React, { useState, useEffect } from "react";
import { Modalidad as tModalidad } from '@apptypes/ucolTypes';
import Papa from 'papaparse'; // Librería para procesar CSV

import styles from "./styles.module.scss";

export default function Modalidades() {
  const [modalidades, setModalidades] = useState<tModalidad[]>([]);
  const [newModalidad, setNewModalidad] = useState<tModalidad>({
    _id: "",
    nombre: "",
    conDocumento: false,
    maximoEstudiantes: 0,
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editModalidad, setEditModalidad] = useState<tModalidad | null>(null);

  useEffect(() => {
    fetch("/api/titulaciones/modalidades")
      .then((response) => response.json())
      .then((data: tModalidad[]) => setModalidades(data));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewModalidad((prev) => ({
      ...prev,
      [name]: name === "conDocumento" ? value === "true" : value,
    }));
  };

  const addModalidad = async () => {
    if (!newModalidad.nombre || newModalidad.maximoEstudiantes <= 0) return;

    const response = await fetch("/api/titulaciones/modalidades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newModalidad),
    });

    if (response.ok) {
      const newEntry: tModalidad = await response.json();
      setModalidades([...modalidades, newEntry]);
      setNewModalidad({
        _id: "",
        nombre: "",
        conDocumento: false,
        maximoEstudiantes: 0,
      });
    }
  };

  const deleteModalidad = async (_id: string) => {
    const response = await fetch(`/api/titulaciones/modalidades?id=${_id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setModalidades(modalidades.filter((modalidad) => modalidad._id !== _id));
    }
  };

  const startEditModalidad = (index: number) => {
    setEditIndex(index);
    setEditModalidad(modalidades[index]);
  };

  const saveEditModalidad = async () => {
    if (editIndex === null || !editModalidad) return;

    const response = await fetch(`/api/titulaciones/modalidades?id=${editModalidad._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editModalidad),
    });

    if (response.ok) {
      const updatedModalidad: tModalidad = await response.json();
      const updatedModalidades = modalidades.map((modalidad, i) =>
        i === editIndex ? updatedModalidad : modalidad
      );
      setModalidades(updatedModalidades);
      setEditIndex(null);
      setEditModalidad(null);
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editModalidad) {
      setEditModalidad((prev) =>
        prev
          ? {
              ...prev,
              [name]: name === "conDocumento" ? value === "true" : value,
            }
          : prev
      );
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
          const parsedData: tModalidad[] = results.data as tModalidad[];

          // Iteramos sobre cada modalidad y hacemos una solicitud POST para guardarla
          for (const modalidad of parsedData) {
            const response = await fetch("/api/titulaciones/modalidades", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(modalidad),
            });

            if (!response.ok) {
              console.error(`Error guardando modalidad: ${modalidad.nombre}`);
            }
          }

          // Después de guardar todos los datos, actualizamos el estado con los nuevos datos
          setModalidades([...modalidades, ...parsedData]);
        },
      });
    }
  };

  // Descargar plantilla CSV
  const downloadTemplate = () => {
    const headers = ["_id", "nombre", "conDocumento", "maximoEstudiantes"];
    const csvContent =
      "data:text/csv;charset=utf-8," + headers.join(",") + "\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "modalidades_template.csv");
    document.body.appendChild(link); // Requiere para Firefox
    link.click();
    document.body.removeChild(link);
  };

  // Descargar datos actuales como CSV
  const downloadModalidadesData = () => {
    const csv = Papa.unparse(modalidades); // Convierte los datos a formato CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "modalidades_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestión de Modalidades de Titulación</h1>

      {/* Formulario para agregar una modalidad */}
      <div className={styles.formContainer}>
        <input
          type="text"
          name="nombre"
          value={newModalidad.nombre}
          onChange={handleInputChange}
          placeholder="Nombre"
          className={styles.input}
        />

        <select
          name="conDocumento"
          value={newModalidad.conDocumento ? "true" : "false"}
          onChange={handleInputChange}
          className={styles.select}
        >
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>

        <input
          type="number"
          name="maximoEstudiantes"
          value={newModalidad.maximoEstudiantes}
          onChange={handleInputChange}
          placeholder="Máximo de Estudiantes"
          className={styles.input}
        />
        
        <button onClick={addModalidad} className='primary'>
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

        {/* Botón para descargar los datos actuales de las modalidades */}
        <div className={styles.buttonContainer}>
          <button onClick={downloadModalidadesData} className='secondary'>
            Descargar Datos de Modalidades
          </button>
        </div>
      </div>
      
      {/* Tabla de modalidades */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Con Documento</th>
              <th>Máximo de Estudiantes</th>
              <th colSpan={2}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {modalidades.map((modalidad, index) => (
              <tr key={modalidad._id}>
                {editIndex === index ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="nombre"
                        value={editModalidad?.nombre || ""}
                        onChange={handleEditInputChange}
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <select
                        name="conDocumento"
                        value={editModalidad?.conDocumento ? "true" : "false"}
                        onChange={handleEditInputChange}
                        className={styles.select}
                      >
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        name="maximoEstudiantes"
                        value={editModalidad?.maximoEstudiantes || 0}
                        onChange={handleEditInputChange}
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <button onClick={saveEditModalidad} className='primary'>
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
                    <td>{modalidad.nombre}</td>
                    <td>{modalidad.conDocumento ? "Sí" : "No"}</td>
                    <td>{modalidad.maximoEstudiantes}</td>
                    <td>
                      <button onClick={() => startEditModalidad(index)} className='primary'>
                        Editar
                      </button>
                    </td>
                    <td>
                      <button onClick={() => deleteModalidad(modalidad._id)} className='cancel'>
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
