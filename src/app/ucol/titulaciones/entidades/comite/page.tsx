"use client";
import React, { useState, useEffect } from "react";
import { Comite as tComite } from '@apptypes/ucolTypes';
import Papa from 'papaparse';

import styles from "./styles.module.scss";

export default function Comite() {
  const [comite, setComite] = useState<tComite[]>([]);
  const [newComite, setNewComite] = useState<tComite>({
    _id: "",
    numeroTrabajador: "",
    nombre: "",
    carrera: "",
    facultad: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editMember, setEditMember] = useState<tComite | null>(null);

  useEffect(() => {
    fetch("/api/titulaciones/comite")
      .then((response) => response.json())
      .then((data: tComite[]) => setComite(data));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewComite((prev) => ({ ...prev, [name]: value }));
  };

  const addMember = async () => {
    if (!newComite.nombre || !newComite.numeroTrabajador) return;

    const response = await fetch("/api/titulaciones/comite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newComite),
    });

    if (response.ok) {
      const newMember: tComite = await response.json();
      setComite([...comite, newMember]);
      setNewComite({
        _id: "",
        numeroTrabajador: "",
        nombre: "",
        carrera: "",
        facultad: "",
      });
    }
  };

  const deleteMember = async (_id: string) => {
    const response = await fetch(`/api/titulaciones/comite?id=${_id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setComite(comite.filter((member) => member._id !== _id));
    }
  };

  const startEditMember = (index: number) => {
    setEditIndex(index);
    setEditMember(comite[index]);
  };

  const saveEditMember = async () => {
    if (editIndex === null || !editMember) return;

    const response = await fetch(`/api/titulaciones/comite?id=${editMember._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editMember),
    });

    if (response.ok) {
      const updatedMember: tComite = await response.json();
      const updatedComite = comite.map((member, i) =>
        i === editIndex ? updatedMember : member
      );
      setComite(updatedComite);
      setEditIndex(null);
      setEditMember(null);
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editMember) {
      setEditMember((prev) => (prev ? { ...prev, [name]: value } : prev));
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
        const parsedData: tComite[] = results.data as tComite[];

        for (const member of parsedData) {
          const response = await fetch("/api/titulaciones/comite", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(member),
          });

          if (!response.ok) {
            console.error(`Error guardando miembro: ${member.nombre}`);
          }
        }
        setComite((prevComite) => [...prevComite, ...parsedData]);
      },
    });
  }
};

  // Descargar plantilla CSV
  const downloadTemplate = () => {
    const headers = ["_id", "numeroTrabajador", "nombre", "carrera", "facultad"];
    const csvContent =
      "data:text/csv;charset=utf-8," + headers.join(",") + "\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "comite_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Descargar datos actuales como CSV
  const downloadComiteData = () => {
    const csv = Papa.unparse(comite); 
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "comite_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestión del Comité Revisor</h1>

      {/* Formulario para agregar un miembro del comité */}
      <div className={styles.formContainer}>
        <input
          type="text"
          name="numeroTrabajador"
          value={newComite.numeroTrabajador}
          onChange={handleInputChange}
          placeholder="Número de Trabajador"
          className={styles.input}
        />
        <input
          type="text"
          name="nombre"
          value={newComite.nombre}
          onChange={handleInputChange}
          placeholder="Nombre"
          className={styles.input}
        />
        <input
          type="text"
          name="carrera"
          value={newComite.carrera}
          onChange={handleInputChange}
          placeholder="Carrera"
          className={styles.input}
        />
        <input
          type="text"
          name="facultad"
          value={newComite.facultad}
          onChange={handleInputChange}
          placeholder="Facultad"
          className={styles.input}
        />
        <button onClick={addMember} className='primary'>
          Agregar
        </button>
      </div>

      <div className={styles.dataControlsContainer}>	
        {/* Botones para cargar CSV y descargar plantilla */}
        <div>
          <h2>Importar datos desde csv.</h2>
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
        </div>

        {/* Botón para descargar los datos actuales del comité */}
        <div className={styles.buttonContainer}>
          <h2>Exportar datos a csv.</h2>
          <button onClick={downloadComiteData} className='secondary'>
            Descargar Datos del Comité
          </button>
        </div>
      </div>

      {/* Tabla de comité */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Número de Trabajador</th>
              <th>Nombre</th>
              <th>Carrera</th>
              <th>Facultad</th>
              <th colSpan={2}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {comite.map((member, index) => (
              <tr key={member._id}>
                {editIndex === index ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="numeroTrabajador"
                        value={editMember?.numeroTrabajador || ""}
                        onChange={handleEditInputChange}
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="nombre"
                        value={editMember?.nombre || ""}
                        onChange={handleEditInputChange}
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="carrera"
                        value={editMember?.carrera || ""}
                        onChange={handleEditInputChange}
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="facultad"
                        value={editMember?.facultad || ""}
                        onChange={handleEditInputChange}
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <button onClick={saveEditMember} className='primary'>
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
                    <td>{member.numeroTrabajador}</td>
                    <td>{member.nombre}</td>
                    <td>{member.carrera}</td>
                    <td>{member.facultad}</td>
                    <td>
                      <button onClick={() => startEditMember(index)} className='primary'>
                        Editar
                      </button>
                    </td>
                    <td>
                      <button onClick={() => deleteMember(member._id)} className='cancel'>
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
