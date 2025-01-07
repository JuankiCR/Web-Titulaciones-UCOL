"use client";
import React, { useState, useEffect } from "react";
import { Alumno as tAlumno } from '@apptypes/ucolTypes';
import Papa from 'papaparse'; // Librería para procesar CSV

import styles from "./styles.module.scss";

export default function Estudiantes() {
  const [students, setStudents] = useState<tAlumno[]>([]);
  const [newStudent, setNewStudent] = useState<tAlumno>({
    _id: "",
    numeroCuenta: "",
    nombre: "",
    generacion: "",
    carrera: "",
    facultad: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editStudent, setEditStudent] = useState<tAlumno | null>(null);

  useEffect(() => {
    fetch("/api/titulaciones/alumnos")
      .then((response) => response.json())
      .then((data: tAlumno[]) => setStudents(data));
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
      const newAlumno: tAlumno = await response.json();
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
      const updatedAlumno: tAlumno = await response.json();
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

  // Cargar archivo CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const parsedData: tAlumno[] = results.data as tAlumno[];

          // Iteramos sobre cada estudiante y hacemos una solicitud POST para guardarlo
          for (const student of parsedData) {
            const response = await fetch("/api/titulaciones/alumnos", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(student),
            });

            if (!response.ok) {
              console.error(`Error guardando estudiante: ${student.nombre}`);
            }
          }

          // Después de guardar todos los datos, actualizamos el estado con los nuevos datos
          setStudents([...students, ...parsedData]);
        },
      });
    }
  };

  // Descargar plantilla CSV
  const downloadTemplate = () => {
    const headers = ["_id", "numeroCuenta", "nombre", "generacion", "carrera", "facultad"];
    const csvContent =
      "data:text/csv;charset=utf-8," + headers.join(",") + "\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "estudiantes_template.csv");
    document.body.appendChild(link); // Requiere para Firefox
    link.click();
    document.body.removeChild(link);
  };

  // Descargar datos actuales como CSV
  const downloadStudentsData = () => {
    const csv = Papa.unparse(students); // Convierte los datos a formato CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "estudiantes_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <button onClick={addStudent} className='primary'>
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

        {/* Botón para descargar los datos actuales de los estudiantes */}
        <div className={styles.buttonContainer}>
          <button onClick={downloadStudentsData} className='secondary'>
            Descargar Datos de Estudiantes
          </button>
        </div>
      </div>
      {/* Tabla de estudiantes */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Número de Cuenta</th>
              <th>Nombre</th>
              <th>Generación</th>
              <th>Carrera</th>
              <th>Facultad</th>
              <th colSpan={2}>Acciones</th>
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
                      <button onClick={saveEditStudent} className='primary'>
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
                    <td>{student.numeroCuenta}</td>
                    <td>{student.nombre}</td>
                    <td>{student.generacion}</td>
                    <td>{student.carrera}</td>
                    <td>{student.facultad}</td>
                    <td>
                      <button onClick={() => startEditStudent(index)} className='primary'>
                        Editar
                      </button>
                    </td>
                    <td>
                      <button onClick={() => deleteStudent(student._id)} className='cancel'>
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
