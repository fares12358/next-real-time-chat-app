// contexts/AuthContext.js
import { createContext, useState, useContext } from 'react';

// Create the context
const AuthContext = createContext();

// Custom hook for consuming the AuthContext
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [data, setData] = useState('');
  const [deleId, setDeleId] = useState('');


  return (
    <AuthContext.Provider value={{ data, setData,deleId, setDeleId }}>
      {children}
    </AuthContext.Provider>
  );
};
