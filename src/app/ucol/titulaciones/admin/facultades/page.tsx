'use client';

import React, { useState, useEffect } from 'react';

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

const FacultyAndCareers: React.FC = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [facultyName, setFacultyName] = useState('');
  const [facultyAlias, setFacultyAlias] = useState('');
  const [careerName, setCareerName] = useState('');
  const [careerAlias, setCareerAlias] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await fetch('/api/faculties');
        const data = await response.json();
        setFaculties(data);
      } catch (error) {
        setMessage(`Error al obtener las facultades. ${error}`);
      }
    };

    fetchFaculties();
  }, []);

  const handleAddFaculty = async () => {
    if (!facultyName || !facultyAlias) {
      setMessage('Por favor, completa todos los campos para agregar una facultad.');
      return;
    }
  
    try {
      const response = await fetch('/api/faculties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: crypto.randomUUID(),
          name: facultyName,
          alias: facultyAlias,
          careers: [],
        }),
      });
  
      if (response.ok) {
        setMessage('Facultad agregada correctamente.');
        setFacultyName('');
        setFacultyAlias('');
  
        const updatedResponse = await fetch('/api/faculties');
        if (updatedResponse.ok) {
          const updatedFaculties = await updatedResponse.json();
          setFaculties(updatedFaculties);
        } else {
          setMessage('Facultad agregada, pero no se pudo obtener la lista actualizada.');
        }
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      setMessage(`Error al agregar la facultad. ${error}`);
    }
  };
  

  const handleAddCareer = async () => {
    if (!selectedFaculty || !careerName || !careerAlias) {
      setMessage('Por favor, completa todos los campos para agregar una carrera.');
      return;
    }

    try {
      const response = await fetch(`/api/faculties/${selectedFaculty}/careers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: crypto.randomUUID(),
          name: careerName,
          alias: careerAlias,
        }),
      });

      if (response.ok) {
        setMessage('Carrera agregada correctamente.');
        setCareerName('');
        setCareerAlias('');

        const updatedFaculties = await fetch('/api/faculties');
        const data = await updatedFaculties.json();
        setFaculties(data);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      setMessage(`Error al agregar la carrera. ${error}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        Gestión de Facultades y Carreras
      </h1>

      <div 
        className="formWrapper"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        <div style={{ marginBottom: '20px', width: '40%' }}>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '10px',
            }}
          >
            Agregar Facultad
          </h2>
          <div 
            style={{ marginBottom: '16px' }}
          >
            <label>
              Nombre de la Facultad:
              <input
                type="text"
                value={facultyName}
                onChange={(e) => setFacultyName(e.target.value)}
                placeholder="Nombre"
              />
            </label>
          </div>
          <div 
            style={{ marginBottom: '16px' }}
          >
            <label>
              Alias de la Facultad:
              <input
                type="text"
                value={facultyAlias}
                onChange={(e) => setFacultyAlias(e.target.value)}
                placeholder="Alias"
              />
            </label>
          </div>
          <button className="button-primary" onClick={handleAddFaculty}>Agregar Facultad</button>
        </div>

        <div style={{ marginBottom: '20px', width: '40%' }}>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '10px',
            }}
          >
            Agregar Carrera
          </h2>
          <div 
            style={{ marginBottom: '16px' }}
          >
            <label>
              Seleccionar Facultad:
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
              >
                <option value="">Seleccione una facultad</option>
                {faculties.map((faculty) => (
                  <option key={faculty._id} value={faculty._id}>
                    {faculty.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div 
            style={{ marginBottom: '16px' }}
          >
            <label>
              Nombre de la Carrera:
              <input
                type="text"
                value={careerName}
                onChange={(e) => setCareerName(e.target.value)}
                placeholder="Nombre"
              />
            </label>
          </div>
          <div 
            style={{ marginBottom: '16px' }}
          >
            <label>
              Alias de la Carrera:
              <input
                type="text"
                value={careerAlias}
                onChange={(e) => setCareerAlias(e.target.value)}
                placeholder="Alias"
              />
            </label>
          </div>
          <button className="button-primary" onClick={handleAddCareer}>Agregar Carrera</button>
        </div>
      </div>


      {message &&
       <p style={{ textAlign: 'center', marginBottom: '20px' }}>
        {message}
      </p>
      }

      <div>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '10px',
          }}
        >
          Facultades y Carreras
        </h2>
        {faculties.length === 0 ? (
          <p>No hay facultades registradas.</p>
        ) : (
          <ul>
            {faculties.map((faculty) => (
              <li key={faculty._id}>
                <details>
                  <summary>
                    <strong>{faculty.name} ({faculty.alias})</strong>
                  </summary>
                  <ul>
                    {faculty.careers.length === 0 ? (
                      <li>No hay carreras registradas en esta facultad.</li>
                    ) : (
                      faculty.careers.map((career) => (
                        <li key={career._id}>
                          {career.name} ({career.alias})
                        </li>
                      ))
                    )}
                  </ul>
                </details>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FacultyAndCareers;
