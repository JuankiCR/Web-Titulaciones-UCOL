// src/app/ucol/titulaciones/comite/page.tsx
"use client";
import React, { useState, useEffect } from "react";

import styles from "./styles.module.scss";

interface Comite {
  _id: string;
  numeroTrabajador: string;
  nombre: string;
  carrera: string;
  facultad: string;
}

export default function Comite() {
  const [comite, setComite] = useState<Comite[]>([]);
  const [newComite, setNewComite] = useState<Comite>({
    _id: "",
    numeroTrabajador: "",
    nombre: "",
    carrera: "",
    facultad: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editMember, setEditMember] = useState<Comite | null>(null);

  useEffect(() => {
    fetch("/api/titulaciones/comite")
      .then((response) => response.json())
      .then((data: Comite[]) => setComite(data));
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
      const newMember: Comite = await response.json();
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
      const updatedMember: Comite = await response.json();
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
        <button onClick={addMember} className={styles.button}>
          Agregar
        </button>
      </div>

      {/* Tabla de comité */}
      <div className={styles.tableContainer}>
        <h2>Lista del Comité Revisor</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Número de Trabajador</th>
              <th>Nombre</th>
              <th>Carrera</th>
              <th>Facultad</th>
              <th>Acciones</th>
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
                      <button onClick={saveEditMember} className={styles.button}>
                        Guardar
                      </button>
                      <button onClick={() => setEditIndex(null)} className={styles.buttonCancel}>
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
                      <button onClick={() => startEditMember(index)} className={styles.button}>
                        Editar
                      </button>
                      <button onClick={() => deleteMember(member._id)} className={styles.buttonCancel}>
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
