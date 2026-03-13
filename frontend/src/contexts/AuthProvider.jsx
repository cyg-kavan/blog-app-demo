import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext';

export default function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

        const checkAuthentication = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/users/check-auth", { withCredentials: true });
                setUser(response.data.user);
            } catch (error) {
                // console.error("Authentication error", error.response?.data || error.message);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        useEffect(() => {
            checkAuthentication();
        },[])

    // const login = async (credentials) => {
    //     await axios.post("http://localhost:8000/api/users/login", credentials, { withCredentials: true });

    //     const response = await axios.get(
    //         "http://localhost:8000/api/users/check-auth",
    //         { withCredentials: true }
    //     )
    
    //     setUser(response.data.user)
    // }

    const logout = async () => {
        try {
            await axios.post("http://localhost:8000/api/users/logout", {}, { withCredentials: true });

            setUser(null);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, checkAuthentication, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
