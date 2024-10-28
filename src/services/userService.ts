// src/services/userService.ts
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  lastName: string;
}

const usersFilePath = path.join(process.cwd(), 'src/data', 'users.json');
const secretKey = process.env.JWT_SECRET || 'esto-no-es-seguro';

const getUsers = (): User[] => {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(data) as User[];
  } catch {
    return [];
  }
};

const saveUsers = (users: User[]) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
};

export const registerUser = async (email: string, password: string, name: string, lastName: string): Promise<void> => {
  const users = getUsers();

  if (users.find((user) => user.email === email)) {
    throw new Error('El usuario ya existe.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = {
    _id: uuidv4(),
    email,
    password: hashedPassword,
    name,
    lastName,
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
