import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('access');
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        setUser(decoded);
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  return { user, isAuthenticated: !!user };
}