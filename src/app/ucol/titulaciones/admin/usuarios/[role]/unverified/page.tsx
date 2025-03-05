'use client';

import React, { useEffect, useState } from 'react';

interface User {
  _id: string;
  email: string;
  name: string;
  lastName: string;
  role: string;
  status: 'VERIFIED' | 'UNVERIFIED' | 'BLOCKED';
}

const UnverifiedUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const role = window.location.pathname.split('/').at(-2);

  useEffect(() => {
    if (!role) return;

    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/admin/users?role=${role.toUpperCase()}&status=UNVERIFIED`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching unverified users:', error);
      }
    };

    fetchUsers();
  }, [role]);

  const handleApprove = async (userId: string) => {
    try {
      await fetch('/api/admin/users/updateStatus', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: userId, status: 'VERIFIED' }),
      });

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Usuarios por Aprobar - {role?.toUpperCase()}</h1>

      {users.length === 0 ? (
        <p>No hay usuarios pendientes por aprobar.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id} style={{ margin: '10px 0', listStyle: 'none' }}>
              <span>
                {user.name} {user.lastName} - {user.email}
              </span>
              <button
                style={{
                  marginLeft: '10px',
                  padding: '5px 10px',
                  backgroundColor: 'green',
                  color: '#fff',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
                onClick={() => handleApprove(user._id)}
              >
                Aprobar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UnverifiedUsers;
