// src\types\ucolTypes.ts
interface Alumno {
  _id: string;
  numeroCuenta: string;
  nombre: string;
  generacion: string;
  carrera: string;
  facultad: string;
}

interface Modalidad {
  _id: string;
  nombre: string;
  conDocumento: boolean;
  maximoEstudiantes: number;
}

interface Comite {
  _id: string;
  numeroTrabajador: string;
  nombre: string;
  carrera: string;
  facultad: string;
}

interface Sinodal {
  _id: string;
  numeroTrabajador: string;
  nombre: string;
  carrera: string;
  facultad: string;
  rol: "Presidente/a" | "Secretario/a" | "Vocal";
}

interface Titulacion {
  _id: string;
  modalidadId: string;
  estudiantes: Alumno[];
  sinodales: Sinodal[];
  asesores: Comite[];
  documento?: string | null;
  finalizada: boolean;
  fechaInicio: string;
  fechaFin?: string | null;
}

export type { Alumno, Modalidad, Comite, Sinodal, Titulacion };