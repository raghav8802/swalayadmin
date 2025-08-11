'use client' 
import React, { useEffect, useState, ReactNode } from 'react';
import { apiGet } from '@/helpers/axiosRequest';
import toast from 'react-hot-toast';
import UserContext from './userContext';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  username: string;
  usertype: string;
  email: string;
  role: string;
  // Add other user properties here
}

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const router = useRouter();

  const fetchUserDetails = async () => {
    try {
      const response:any = await apiGet('/api/admin/userdetails');
      if (response.success) {
        const userInfo: User = response.data;
        setUser({ ...userInfo });
      } else {
        console.log('User details fetch failed:', response.message);
        setUser(undefined);
        if (response.status === 401) {
          router.push('/signin');
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setUser(undefined);
      router.push('/signin');
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
