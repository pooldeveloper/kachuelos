import { useEffect, useState } from 'react'
import { onAuthStateChanged } from "firebase/auth";
import firebase from "../firebase/firebase"

export default function useAutenticacion() {

    const [usuarioAutenticado, guardarUsuarioAutenticado] = useState(null)

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(firebase.auth, (user) => {
            if (user) {
                guardarUsuarioAutenticado(user)
            } else {
                guardarUsuarioAutenticado(null)
            }
        });
        return () => unSubscribe()
    }, [])


    return usuarioAutenticado
}
