"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";

interface Student {
  _id: string;
  numeroCuenta: string;
  nombre: string;
  generacion: string;
  carrera: string;
  facultad: string;
}

export default function Estudiantes() {
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState<Student>({
    _id: "",
    numeroCuenta: "",
    nombre: "",
    generacion: "",
    carrera: "",
    facultad: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editStudent, setEditStudent] = useState<Student | null>(null);

  useEffect(() => {
    fetch("/api/titulaciones/alumnos")
      .then((response) => response.json())
      .then((data: Student[]) => setStudents(data));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const addStudent = async () => {
    if (!newStudent.nombre || !newStudent.numeroCuenta) return;

    const response = await fetch("/api/titulaciones/alumnos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStudent),
    });

    if (response.ok) {
      const newAlumno: Student = await response.json();
      setStudents([...students, newAlumno]);
      setNewStudent({
        _id: "",
        numeroCuenta: "",
        nombre: "",
        generacion: "",
        carrera: "",
        facultad: "",
      });
    }
  };

  const deleteStudent = async (_id: string) => {
    const response = await fetch(`/api/titulaciones/alumnos?id=${_id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setStudents(students.filter((student) => student._id !== _id));
    }
  };

  const startEditStudent = (index: number) => {
    setEditIndex(index);
    setEditStudent(students[index]);
  };

  const saveEditStudent = async () => {
    if (editIndex === null || !editStudent) return;

    const response = await fetch(`/api/titulaciones/alumnos?id=${editStudent._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editStudent),
    });

    if (response.ok) {
      const updatedAlumno: Student = await response.json();
      const updatedStudents = students.map((student, i) =>
        i === editIndex ? updatedAlumno : student
      );
      setStudents(updatedStudents);
      setEditIndex(null);
      setEditStudent(null);
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editStudent) {
      setEditStudent((prev) => (prev ? { ...prev, [name]: value } : prev));
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestión de Estudiantes</h1>

      {/* Formulario para agregar un estudiante */}
      <div className={styles.formContainer}>
        <input
          type="text"
          name="numeroCuenta"
          value={newStudent.numeroCuenta}
          onChange={handleInputChange}
          placeholder="Número de Cuenta"
          className={styles.input}
        />
        <input
          type="text"
          name="nombre"
          value={newStudent.nombre}
          onChange={handleInputChange}
          placeholder="Nombre"
          className={styles.input}
        />
        <input
          type="text"
          name="generacion"
          value={newStudent.generacion}
          onChange={handleInputChange}
          placeholder="Generación"
          className={styles.input}
        />
        <input
          type="text"
          name="carrera"
          value={newStudent.carrera}
          onChange={handleInputChange}
          placeholder="Carrera"
          className={styles.input}
        />
        <input
          type="text"
          name="facultad"
          value={newStudent.facultad}
          onChange={handleInputChange}
          placeholder="Facultad"
          className={styles.input}
        />
        <button onClick={addStudent} className={styles.button}>
          Agregar
        </button>
      </div>

      {/* Tabla de estudiantes */}
      <div className={styles.tableContainer}>
        <h2>Lista de Estudiantes</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Número de Cuenta</th>
              <th>Nombre</th>
              <th>Generación</th>
              <th>Carrera</th>
              <th>Facultad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student._id}>
                {editIndex === index ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="numeroCuenta"
                        value={editStudent?.numeroCuenta || ""}
                        onChange={handleEditInputChange}
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="nombre"
                        value={editStudent?.nombre || ""}
                        onChange={handleEditInputChange}
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="generacion"
                        value={editStudent?.generacion || ""}
                        onChange={handleEditInputChange}
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="carrera"
                        value={editStudent?.carrera || ""}
                        onChange={handleEditInputChange}
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="facultad"
                        value={editStudent?.facultad || ""}
                        onChange={handleEditInputChange}
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <button onClick={saveEditStudent} className={styles.button}>
                        Guardar
                      </button>
                      <button onClick={() => setEditIndex(null)} className={styles.buttonCancel}>
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{student.numeroCuenta}</td>
                    <td>{student.nombre}</td>
                    <td>{student.generacion}</td>
                    <td>{student.carrera}</td>
                    <td>{student.facultad}</td>
                    <td>
                      <button onClick={() => startEditStudent(index)} className={styles.button}>
                        Editar
                      </button>
                      <button onClick={() => deleteStudent(student._id)} className={styles.buttonCancel}>
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
