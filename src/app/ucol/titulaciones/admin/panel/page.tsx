'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';

import StudentIllustration from '@icons/ucol_estudiantes.svg';
import TeacherIllustration from '@icons/ucol_maestros.svg';

const Dashboard: React.FC = () => {
  const [unverifiedTeachers, setUnverifiedTeachers] = useState<number>(0);
  const [unverifiedStudents, setUnverifiedStudents] = useState<number>(0);
  const [inviteRole, setInviteRole] = useState<string>('STUDENT');
  const [autoVerification, setAutoVerification] = useState<boolean>(false);
  const [inviteLink, setInviteLink] = useState<string>('');
  const [qrCode, setQrCode] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUnverifiedUsers = async () => {
      try {
        const teachersResponse = await fetch('/api/admin/users?role=TEACHER&status=UNVERIFIED');
        const teachers = await teachersResponse.json();

        const studentsResponse = await fetch('/api/admin/users?role=STUDENT&status=UNVERIFIED');
        const students = await studentsResponse.json();

        setUnverifiedTeachers(teachers.length);
        setUnverifiedStudents(students.length);
      } catch (error) {
        console.error('Error fetching unverified users:', error);
      }
    };

    fetchUnverifiedUsers();
  }, []);

  const handleGenerateInvite = async () => {
    try {
      const response = await fetch('/api/invite/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          autoVerification,
          role: inviteRole,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al generar la invitación.');
      }

      const { link } = await response.json();
      setInviteLink(`${window.location.origin}${link}`);

      const qrCodeUrl = await QRCode.toDataURL(link);
      setQrCode(qrCodeUrl);

      setIsModalOpen(true);
    } catch (error) {
      console.error('Error generando el enlace de invitación:', error);
    }
  };

  const handleCopyLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      alert('Enlace copiado al portapapeles.');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setInviteLink('');
    setQrCode('');
  };

  const handleNavigate = (role: string) => {
    router.push(`/ucol/titulaciones/admin/usuarios/${role.toLowerCase()}/unverified`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px', justifyContent: 'space-around' }}> 
        <button
          style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: '#fff', borderRadius: '5px', cursor: 'pointer' }}
          onClick={() => handleNavigate('TEACHER')}
        >
          <TeacherIllustration width={30} height={30} />
          Tienes {unverifiedTeachers} maestros por aprobar
        </button>
        <button
          style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: '#fff', borderRadius: '5px', cursor: 'pointer' }}
          onClick={() => handleNavigate('STUDENT')}
        >
          <StudentIllustration width={30} height={30} />
          Tienes {unverifiedStudents} estudiantes por aprobar
        </button>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>Generar invitación</h3>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="roleSelect">Seleccionar Rol:</label>
          <select
            id="roleSelect"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            style={{ marginLeft: '10px' }}
          >
            <option value="STUDENT">Estudiante</option>
            <option value="TEACHER">Maestro</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>
            <input
              type="checkbox"
              checked={autoVerification}
              onChange={(e) => setAutoVerification(e.target.checked)}
              style={{ marginRight: '10px' }}
            />
            Auto Verificación
          </label>
        </div>
        <button
          onClick={handleGenerateInvite}
          style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: '#fff', borderRadius: '5px', cursor: 'pointer' }}
        >
          Generar Invitación
        </button>
      </div>

      {/* Modal para mostrar el resultado */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div
            className="border border-admin-accent rounded-lg p-6 w-[400px] text-center"
            style={{ backgroundColor: '#131924' }}
          >
            <h3 className="text-admin-foreground text-xl font-bold mb-4">Enlace Generado</h3>
            <p className="text-admin-foreground mb-4 break-words">{inviteLink}</p>
            <button
              onClick={handleCopyLink}
              className="button-primary mb-4"
            >
              Copiar Enlace
            </button>
            <div className="mt-4">
              <h4 className="text-admin-foreground text-lg font-semibold mb-2">Código QR</h4>
              <img src={qrCode} alt="Código QR" className="mx-auto" />
            </div>
            <button
              onClick={handleCloseModal}
              className="button-cancel mt-6"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
