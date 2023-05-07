import { createContext, useContext, useState, useEffect, useLayoutEffect } from 'react';
import { useRouter } from 'next/router';

// Define the context
const UserContext = createContext(null);

// Create a provider for the context
export function UserProvider({ children }) {
  let [myUser, setMyUser] = useState({});
  const router = useRouter();

  useLayoutEffect(() => {
    let user = JSON.parse(sessionStorage.getItem("user"));
    if(!user){
      setMyUser({});
      router.push('/');
    }else{
        user.req = {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          }
        };
        setMyUser(user);
    }
  }, []);

  return (
    <UserContext.Provider value={{ myUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Export a custom hook to access the context
export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}