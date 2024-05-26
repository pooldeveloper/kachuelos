'use client';

import { createContext } from 'react'
import firebase from './firebase';
import useAutenticacion from '@/hooks/useAutenticacion';

const FirebaseContext = createContext(null)


export const FirebaseProvider = ({ children }) => {
    
    const usuario = useAutenticacion()

    return (
        <FirebaseContext.Provider
            value={{
                firebase,
                usuario
            }}
        >
            {children}
        </FirebaseContext.Provider>
    )
}

export default FirebaseContext