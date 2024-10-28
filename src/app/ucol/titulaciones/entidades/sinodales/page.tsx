// src/app/ucol/titulaciones/sinodales/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";

interface Sinodal {
  _id: string;
  numeroTrabajador: string;
  nombre: string;
  carrera: string;
  facultad: string;
  rol: "Presidente/a" | "Secretario/a" | "Vocal";
}

export default function Sinodales() {
  const [sinodales, setSinodales] = useState<Sinodal[]>([]);
  const [newSinodal, setNewSinodal] = useState<Sinodal>({
    _id: "",
    numeroTrabajador: "",
    nombre: "",
    carrera: "",
    facultad: "",
    rol: "Vocal",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editSinodal, setEditSinodal] = useState<Sinodal | null>(null);

  useEffect(() => {
    fetch("/api/titulaciones/sinodales")
      .then((response) => response.json())
      .then((data: Sinodal[]) => setSinodales(data));
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
      const newEntry: Sinodal = await response.json();
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
      const updatedSinodal: Sinodal = await response.json();
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
        <button onClick={addSinodal} className={styles.button}>
          Agregar
        </button>
      </div>

      {/* Tabla de sinodales */}
      <div className={styles.tableContainer}>
        <h2>Lista de Sinodales</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Número de Trabajador</th>
              <th>Nombre</th>
              <th>Carrera</th>
              <th>Facultad</th>
              <th>Rol</th>
              <th>Acciones</th>
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
                      <button onClick={saveEditSinodal} className={styles.button}>
                        Guardar
                      </button>
                      <button onClick={() => setEditIndex(null)} className={styles.buttonCancel}>
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
                      <button onClick={() => startEditSinodal(index)} className={styles.button}>
                        Editar
                      </button>
                      <button onClick={() => deleteSinodal(sinodal._id)} className={styles.buttonCancel}>
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