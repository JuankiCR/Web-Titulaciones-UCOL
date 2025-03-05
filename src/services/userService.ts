// src/services/userService.ts
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

export interface User {
  _id: string;
  cuentaUCOL: string;
  email: string;
  password: string;
  name: string;
  lastName: string;
  status: 'VERIFIED' | 'UNVERIFIED' | 'BLOCKED';
  role: string;
  facultyId: string;
  careerId: string;
}

const usersFilePath = path.join(process.cwd(), 'src/data', 'users.json');
const secretKey = process.env.JWT_SECRET || 'esto-no-es-seguro';

export const getUsers = (): User[] => {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(data) as User[];
  } catch {
    return [];
  }
};

export const saveUsers = (users: User[]) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
};

export const registerUser = async (
  email: string,
  password: string,
  name: string,
  lastName: string,
  cuentaUCOL: string,
  facultyId: string,
  careerId: string
): Promise<void> => {
  const users = getUsers();

  if (users.find((user) => user.email === email)) {
    throw new Error('El usuario ya existe.');
  }

  if (users.find((user) => user.cuentaUCOL === cuentaUCOL)) {
    throw new Error('El número de cuenta UCOL ya está registrado.');
  }

  console.log('facultyId', facultyId);
  console.log('careerId', careerId);

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: User = {
    _id: uuidv4(),
    cuentaUCOL,
    email,
    password: hashedPassword,
    name,
    lastName,
    role: 'STUDENT',
    status: 'UNVERIFIED',
    facultyId,
    careerId,
  };

  users.push(newUser);
  saveUsers(users);
};

export const registerUserWithInvite = async (
  email: string,
  password: string,
  name: string,
  lastName: string,
  cuentaUCOL: string,
  facultyId: string,
  careerId: string,
  role: string,
  autoVerification: boolean
): Promise<void> => {
  const users = getUsers();

  if (users.find((user) => user.email === email)) {
    throw new Error('El usuario ya existe.');
  }

  if (users.find((user) => user.cuentaUCOL === cuentaUCOL)) {
    throw new Error('El número de cuenta UCOL ya está registrado.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: User = {
    _id: uuidv4(),
    cuentaUCOL,
    email,
    password: hashedPassword,
    name,
    lastName,
    role,
    status: autoVerification ? 'VERIFIED' : 'UNVERIFIED',
    facultyId,
    careerId,
  };

  users.push(newUser);
  saveUsers(users);
};

export const authenticateUser = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  const users = getUsers();

  const user = users.find((user) => user.email === email);
  if (!user) {
    throw new Error('Usuario o contraseña incorrectos.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Usuario o contraseña incorrectos.');
  }

  const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: '1h' });

  return { user, token };
};

export const updateUserStatus = (_id: string, newStatus: "VERIFIED" | "UNVERIFIED" | "BLOCKED"): void => {
  const users = getUsers();

  const userIndex = users.findIndex((user) => user._id === _id);
  if (userIndex === -1) {
    throw new Error('Usuario no encontrado.');
  }

  users[userIndex].status = newStatus;
  saveUsers(users);
};

export const getUsersByRoleAndStatus = (role: string, status?: "VERIFIED" | "UNVERIFIED" | "BLOCKED"): User[] => {
  const users = getUsers();

  return users.filter((user) => {
    const roleMatches = user.role === role;
    const statusMatches = status ? user.status === status : true;
    return roleMatches && statusMatches;
  });
};
