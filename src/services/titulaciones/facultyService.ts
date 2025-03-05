import fs from 'fs';
import path from 'path';

export interface Career {
  _id: string;
  name: string;
  alias: string;
}

export interface Faculty {
  _id: string;
  name: string;
  alias: string;
  careers: Career[];
}

const facultyFilePath = path.join(process.cwd(), 'src/data', 'faculties.json');

export const getFaculties = (): Faculty[] => {
  try {
    const data = fs.readFileSync(facultyFilePath, 'utf-8');
    return JSON.parse(data) as Faculty[];
  } catch {
    return [];
  }
};

export const saveFaculties = (faculties: Faculty[]) => {
  fs.writeFileSync(facultyFilePath, JSON.stringify(faculties, null, 2), 'utf-8');
};

export const getFacultyById = (id: string): Faculty | undefined => {
  const faculties = getFaculties();
  return faculties.find((faculty) => faculty._id === id);
};

export const addFaculty = (newFaculty: Faculty): void => {
  const faculties = getFaculties();
  faculties.push(newFaculty);
  saveFaculties(faculties);
};

export const updateFaculty = (id: string, updatedFaculty: Partial<Faculty>): void => {
  const faculties = getFaculties();
  const index = faculties.findIndex((faculty) => faculty._id === id);

  if (index === -1) throw new Error('Facultad no encontrada.');

  faculties[index] = { ...faculties[index], ...updatedFaculty };
  saveFaculties(faculties);
};

export const deleteFaculty = (id: string): void => {
  const faculties = getFaculties();
  const filteredFaculties = faculties.filter((faculty) => faculty._id !== id);
  saveFaculties(filteredFaculties);
};

export const addCareerToFaculty = (facultyId: string, newCareer: Career): void => {
  const faculties = getFaculties();
  const faculty = faculties.find((f) => f._id === facultyId);

  if (!faculty) throw new Error('Facultad no encontrada.');

  faculty.careers.push(newCareer);
  saveFaculties(faculties);
};

export const deleteCareerFromFaculty = (facultyId: string, careerId: string): void => {
  const faculties = getFaculties();
  const faculty = faculties.find((f) => f._id === facultyId);

  if (!faculty) throw new Error('Facultad no encontrada.');

  faculty.careers = faculty.careers.filter((career) => career._id !== careerId);
  saveFaculties(faculties);
};
