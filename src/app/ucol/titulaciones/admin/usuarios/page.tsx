'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/services/userService';
import styles from './styles.module.scss';

interface Career {
  _id: string;
  name: string;
  alias: string;
}

interface Faculty {
  _id: string;
  name: string;
  alias: string;
  careers: Career[];
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editUser, setEditUser] = useState<Partial<User>>({});
  const [filterRole, setFilterRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT');

  useEffect(() => {
    fetchUsers(filterRole);
    fetchFaculties();
  }, [filterRole]);

  const fetchUsers = async (role: string) => {
    const response = await fetch(`/api/admin/users?role=${role}`);
    const data = await response.json();
    setUsers(data);
  };

  const fetchFaculties = async () => {
    try {
      const response = await fetch('/api/faculties'); // Llamamos al endpoint de facultades
      const data = await response.json();
      setFaculties(data);
    } catch (error) {
      console.error('Error al cargar las facultades:', error);
    }
  };

  const getFacultyAlias = (facultyId: string) => {
    const faculty = faculties.find((f) => f._id === facultyId);
    return faculty ? faculty.alias : 'Desconocido';
  };

  const getCareerAlias = (facultyId: string, careerId: string) => {
    const faculty = faculties.find((f) => f._id === facultyId);
    const career = faculty?.careers.find((c) => c._id === careerId);
    return career ? career.alias : 'Desconocido';
  };

  const startEditUser = (index: number) => {
    setEditIndex(index);
    setEditUser({ ...users[index] });
  };

  const saveUser = async (index: number) => {
    const user = users[index];
    const updatedUser = { ...user, ...editUser };
  
    try {
      // Actualizar Facultad si cambió
      if (user.facultyId !== editUser.facultyId) {
        const response = await fetch('/api/admin/users/updateFaculty', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: user._id, facultyId: editUser.facultyId }),
        });
  
        if (!response.ok) {
          throw new Error('Error al actualizar la facultad');
        }
      }
  
      // Actualizar Carrera si cambió
      if (user.careerId !== editUser.careerId) {
        const response = await fetch('/api/admin/users/updateCareer', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: user._id, careerId: editUser.careerId }),
        });
  
        if (!response.ok) {
          throw new Error('Error al actualizar la carrera');
        }
      }
  
      // Actualizar Estado si cambió
      if (user.status !== editUser.status) {
        const response = await fetch('/api/admin/users/updateStatus', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: user._id, status: editUser.status }),
        });
  
        if (!response.ok) {
          throw new Error('Error al actualizar el estado');
        }
      }
  
      // Actualizar Rol si cambió
      if (user.role !== editUser.role) {
        const response = await fetch('/api/admin/users/updateRole', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: user._id, role: editUser.role }),
        });
  
        if (!response.ok) {
          throw new Error('Error al actualizar el rol');
        }
      }
  
      // Actualizar el estado local del usuario
      const updatedUsers = [...users];
      updatedUsers[index] = updatedUser;
      setUsers(updatedUsers);
      setEditIndex(null);
    } catch (error) {
      console.error(error);
      alert('Error al guardar los cambios del usuario');
    }
  };

  const deleteUser = async (userId: string) => {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setUsers(users.filter((user) => user._id !== userId));
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestión de Usuarios</h1>

      <div className={styles.filter}>
        <label htmlFor="roleFilter">Filtrar por:</label>
        <select
          id="roleFilter"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as 'STUDENT' | 'TEACHER')}
        >
          <option value="STUDENT">Estudiante</option>
          <option value="TEACHER">Maestro</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Facultad</th>
            <th>Carrera</th>
            <th>Estado</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{user.name} {user.lastName}</td>
              <td>{user.email}</td>
              <td>
                {editIndex === index ? (
                  <select
                    value={editUser.facultyId || ''}
                    onChange={(e) => setEditUser({ ...editUser, facultyId: e.target.value })}
                  >
                    <option value="" disabled>Selecciona una facultad</option>
                    {faculties.map((faculty) => (
                      <option key={faculty._id} value={faculty._id}>
                        {faculty.alias}
                      </option>
                    ))}
                  </select>
                ) : (
                  getFacultyAlias(user.facultyId)
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <select
                    value={editUser.careerId || ''}
                    onChange={(e) => setEditUser({ ...editUser, careerId: e.target.value })}
                  >
                    <option value="" disabled>Selecciona una carrera</option>
                    {faculties
                      .find((f) => f._id === editUser.facultyId)?.careers.map((career) => (
                        <option key={career._id} value={career._id}>
                          {career.alias}
                        </option>
                      ))}
                  </select>
                ) : (
                  getCareerAlias(user.facultyId, user.careerId)
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <select
                    value={editUser.status || ''}
                    onChange={(e) => setEditUser({ ...editUser, status: e.target.value as 'VERIFIED' | 'UNVERIFIED' | 'BLOCKED' })}
                  >
                    <option value="VERIFIED">VERIFICADO</option>
                    <option value="UNVERIFIED">NO VERIFICADO</option>
                    <option value="BLOCKED">BLOQUEADO</option>
                  </select>
                ) : (
                  user.status
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <select
                    value={editUser.role || ''}
                    onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="STUDENT">ESTUDIANTE</option>
                    <option value="TEACHER">MAESTRO</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <button className='button-primary' onClick={() => saveUser(index)}>Guardar</button>
                ) : (
                  <>
                    <button className='button-primary' onClick={() => startEditUser(index)}>Editar</button>
                    <button className='button-cancel' onClick={() => deleteUser(user._id)}>Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
