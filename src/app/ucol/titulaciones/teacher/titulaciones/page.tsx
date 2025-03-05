"use client";
import React, { useState, useEffect } from "react";
import { Alumno, Modalidad, Sinodal, Comite } from "@apptypes/ucolTypes";
import styles from "./styles.module.scss";

export default function Titulacion() {
  const [modalidades, setModalidades] = useState<Modalidad[]>([]);
  const [modalidadSeleccionada, setModalidadSeleccionada] = useState<Modalidad | null>(null);
  const [estudiantesDisponibles, setEstudiantesDisponibles] = useState<Alumno[]>([]);
  const [sinodalesDisponibles, setSinodalesDisponibles] = useState<Sinodal[]>([]);
  const [asesoresDisponibles, setAsesoresDisponibles] = useState<Comite[]>([]);
  const [estudiantesSeleccionados, setEstudiantesSeleccionados] = useState<Alumno[]>([]);
  const [sinodalesSeleccionados, setSinodalesSeleccionados] = useState<Sinodal[]>([]);
  const [asesoresSeleccionados, setAsesoresSeleccionados] = useState<Comite[]>([]);
  const [documento, setDocumento] = useState<File | null>(null);
  const [finalizada, setFinalizada] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    fetch("/api/titulaciones/modalidades")
      .then((response) => response.json())
      .then((data: Modalidad[]) => setModalidades(data));

    fetch("/api/titulaciones/alumnos")
      .then((response) => response.json())
      .then((data: Alumno[]) => setEstudiantesDisponibles(data));

    fetch("/api/titulaciones/sinodales")
      .then((response) => response.json())
      .then((data: Sinodal[]) => setSinodalesDisponibles(data));

    fetch("/api/titulaciones/comite")
      .then((response) => response.json())
      .then((data: Comite[]) => setAsesoresDisponibles(data));
  }, []);

  const handleModalidadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modalidad = modalidades.find((m) => m._id === e.target.value);
    setModalidadSeleccionada(modalidad || null);
    setEstudiantesSeleccionados([]);
    setSinodalesSeleccionados([]);
    setAsesoresSeleccionados([]);
  };

  const handleSelectChange = <T extends { _id: string }>(
    id: string,
    disponibles: T[],
    setSeleccionados: React.Dispatch<React.SetStateAction<T[]>>,
    max: number
  ) => {
    const seleccionado = disponibles.find((item) => item._id === id);
    if (seleccionado) {
      setSeleccionados((prev) => {
        if (prev.length >= max) {
          alert(`No puedes agregar más de ${max} miembros en esta categoría.`);
          return prev;
        }
        return [...prev, seleccionado];
      });
    }
  };

  const removeSelectedItem = <T extends { _id: string }>(
    id: string,
    setSeleccionados: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    setSeleccionados((prev) => prev.filter((item) => item._id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setDocumento(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!modalidadSeleccionada) {
      alert("Selecciona una modalidad.");
      return;
    }

    // Convertir el archivo a base64
    let documentoBase64 = null;
    if (documento) {
      documentoBase64 = await new Promise<string | null>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string | null);
        reader.readAsDataURL(documento);
      });
    }

    const payload = {
      modalidadId: modalidadSeleccionada._id,
      estudiantes: estudiantesSeleccionados,
      sinodales: sinodalesSeleccionados,
      asesores: asesoresSeleccionados,
      documento: documentoBase64, // Documento en base64
      finalizada,
      fechaInicio,
      fechaFin: finalizada ? fechaFin : null,
    };

    const response = await fetch("/api/titulaciones/titulacion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert("Titulación creada exitosamente.");
    } else {
      const errorData = await response.json();
      alert(`Error al crear la titulación: ${errorData.error}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Crear Nueva Titulación</h1>

      <div className={styles.formContainer}>
        <label htmlFor="modalidad">Selecciona una Modalidad:</label>
        <select
          id="modalidad"
          onChange={handleModalidadChange}
          value={modalidadSeleccionada?._id || ""}
          className={styles.input}
        >
          <option value="">Seleccione una modalidad</option>
          {modalidades.map((modalidad) => (
            <option key={modalidad._id} value={modalidad._id}>
              {modalidad.nombre}
            </option>
          ))}
        </select>
      </div>

      {modalidadSeleccionada && (
        <>
          {/* Fecha de Inicio */}
          <div className={styles.formContainer}>
            <label>Fecha de Inicio:</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Estado Finalizada */}
          <div className={styles.formContainer}>
            <label>¿Está finalizada?</label>
            <select
              value={finalizada ? "si" : "no"}
              onChange={(e) => setFinalizada(e.target.value === "si")}
              className={styles.input}
            >
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>

          {/* Fecha de Fin */}
          {finalizada && (
            <div className={styles.formContainer}>
              <label>Fecha de Fin:</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className={styles.input}
              />
            </div>
          )}

          {/* Selección de Estudiantes */}
          <div className={styles.formContainer}>
            <label>Seleccionar Estudiantes (Máx. {modalidadSeleccionada.maximoEstudiantes}):</label>
            <input
              list="estudiantes"
              placeholder="Buscar estudiante..."
              className={styles.input}
              onChange={(e) =>
                handleSelectChange(
                  e.target.value,
                  estudiantesDisponibles,
                  setEstudiantesSeleccionados,
                  modalidadSeleccionada.maximoEstudiantes
                )
              }
            />
            <datalist id="estudiantes">
              {estudiantesDisponibles.map((estudiante) => (
                <option key={estudiante._id} value={estudiante._id}>
                  {estudiante.nombre} - {estudiante.numeroCuenta}
                </option>
              ))}
            </datalist>
            <div>
              {estudiantesSeleccionados.map((estudiante) => (
                <div key={estudiante._id}>
                  {estudiante.nombre} - {estudiante.numeroCuenta}
                  <button
                    onClick={() => removeSelectedItem(estudiante._id, setEstudiantesSeleccionados)}
                    className="secondary"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Selección de Sinodales */}
          <div className={styles.formContainer}>
            <label>Seleccionar Sinodales (Máx. 3):</label>
            <input
              list="sinodales"
              placeholder="Buscar sinodal..."
              className={styles.input}
              onChange={(e) =>
                handleSelectChange(e.target.value, sinodalesDisponibles, setSinodalesSeleccionados, 3)
              }
            />
            <datalist id="sinodales">
              {sinodalesDisponibles.map((sinodal) => (
                <option key={sinodal._id} value={sinodal._id}>
                  {sinodal.nombre} - {sinodal.numeroTrabajador}
                </option>
              ))}
            </datalist>
            <div>
              {sinodalesSeleccionados.map((sinodal) => (
                <div key={sinodal._id}>
                  {sinodal.nombre} - {sinodal.numeroTrabajador}
                  <button
                    onClick={() => removeSelectedItem(sinodal._id, setSinodalesSeleccionados)}
                    className="secondary"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Selección de Asesores */}
          <div className={styles.formContainer}>
            <label>Seleccionar Asesores (Máx. 3):</label>
            <input
              list="asesores"
              placeholder="Buscar asesor..."
              className={styles.input}
              onChange={(e) =>
                handleSelectChange(e.target.value, asesoresDisponibles, setAsesoresSeleccionados, 3)
              }
            />
            <datalist id="asesores">
              {asesoresDisponibles.map((asesor) => (
                <option key={asesor._id} value={asesor._id}>
                  {asesor.nombre} - {asesor.numeroTrabajador}
                </option>
              ))}
            </datalist>
            <div>
              {asesoresSeleccionados.map((asesor) => (
                <div key={asesor._id}>
                  {asesor.nombre} - {asesor.numeroTrabajador}
                  <button
                    onClick={() => removeSelectedItem(asesor._id, setAsesoresSeleccionados)}
                    className="secondary"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Carga de documento */}
          {modalidadSeleccionada.conDocumento && (
            <div className={styles.formContainer}>
              <label>Subir Documento:</label>
              <input type="file" onChange={handleFileChange} className={styles.inputFile} />
            </div>
          )}

          {/* Botón para enviar */}
          <button onClick={handleSubmit} className="primary">
            Crear Titulación
          </button>
        </>
      )}
    </div>
  );
}
