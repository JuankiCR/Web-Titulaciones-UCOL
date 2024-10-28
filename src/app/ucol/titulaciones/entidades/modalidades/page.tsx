// src/app/ucol/titulaciones/modalidades/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";

interface Modalidad {
  _id: string;
  nombre: string;
  conDocumento: boolean;
  maximoEstudiantes: number;
}

export default function Modalidades() {
  const [modalidades, setModalidades] = useState<Modalidad[]>([]);
  const [newModalidad, setNewModalidad] = useState<Modalidad>({
    _id: "",
    nombre: "",
    conDocumento: false,
    maximoEstudiantes: 0,
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editModalidad, setEditModalidad] = useState<Modalidad | null>(null);

  useEffect(() => {
    fetch("/api/titulaciones/modalidades")
      .then((response) => response.json())
      .then((data: Modalidad[]) => setModalidades(data));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewModalidad((prev) => ({ ...prev, [name]: name === "conDocumento" ? (e.target as HTMLInputElement).checked : value }));
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
      const newEntry: Modalidad = await response.json();
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
      const updatedModalidad: Modalidad = await response.json();
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
      setEditModalidad((prev) => (prev ? { ...prev, [name]: name === "conDocumento" ? (e.target as HTMLInputElement).checked : value } : prev));
    }
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
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="conDocumento"
            checked={newModalidad.conDocumento}
            onChange={handleInputChange}
            className={styles.checkbox}
          />
          Con Documento
        </label>
        <input
          type="number"
          name="maximoEstudiantes"
          value={newModalidad.maximoEstudiantes}
          onChange={handleInputChange}
          placeholder="Máximo de Estudiantes"
          className={styles.input}
        />
        <button onClick={addModalidad} className={styles.button}>
          Agregar
        </button>
      </div>

      {/* Tabla de modalidades */}
      <div className={styles.tableContainer}>
        <h2>Lista de Modalidades de Titulación</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Con Documento</th>
              <th>Máximo de Estudiantes</th>
              <th>Acciones</th>
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
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          name="conDocumento"
                          checked={editModalidad?.conDocumento || false}
                          onChange={handleEditInputChange}
                          className={styles.checkbox}
                        />
                      </label>
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
                      <button onClick={saveEditModalidad} className={styles.button}>
                        Guardar
                      </button>
                      <button onClick={() => setEditIndex(null)} className={styles.buttonCancel}>
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
                      <button onClick={() => startEditModalidad(index)} className={styles.button}>
                        Editar
                      </button>
                      <button onClick={() => deleteModalidad(modalidad._id)} className={styles.buttonCancel}>
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
