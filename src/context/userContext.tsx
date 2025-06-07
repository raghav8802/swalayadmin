'use client';
import { createContext, Dispatch, SetStateAction } from 'react';

interface User {
  _id: string;
  username: string;
  usertype: string;
  email: string;
  role: string;
  // Add other user properties here
}

interface UserContextType {
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
}

const UserContext = createContext<UserContextType | null>(null);

export default UserContext;
