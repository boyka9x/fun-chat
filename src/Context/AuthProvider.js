import { Spin } from 'antd';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const { displayName, email, uid, photoURL } = user;
                setUser({
                    displayName, email, uid, photoURL
                });
                setIsLoading(false);
                navigate('/');
                return;
            }

            setIsLoading(false);
            navigate('/login');
        })

        return () => {
            unsubscribe();
        };
    }, [navigate])

    return (
        <AuthContext.Provider value={{ user }}>
            {isLoading ? <Spin/> : children}
        </AuthContext.Provider>
    )
}
