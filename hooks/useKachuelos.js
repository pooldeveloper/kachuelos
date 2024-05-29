'use client';

import { useEffect, useState, useContext } from 'react';
import FirebaseContext from '@/firebase/context';

export default function useKachuelos(id, campo, orden) {

  const { firebase } = useContext(FirebaseContext)

  const [kachuelos, guardarKachuelos] = useState(null)

  useEffect(() => {
    async function obtenerKachuelos() {
      try {
        const kachuelos = await firebase.obtenerColeccion(id, campo, orden)
        guardarKachuelos(kachuelos)
      } catch (error) {
        console.log(error);
      }
    }

    obtenerKachuelos()
  }, [])

  return kachuelos
}
