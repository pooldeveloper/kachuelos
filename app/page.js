'use client';

import { useEffect, useState, useContext } from 'react';
import FirebaseContext from '@/firebase/context';
import Layout from '@/components/layouts/Layout';
import DetallesProducto from '../components/layouts/DetallesProducto'

export default function Home() {

  const { firebase } = useContext(FirebaseContext)

  const [kachuelos, guardarKachuelos] = useState([])

  useEffect(() => {
    async function obtenerKachuelos() {
      try {
        const kachuelos = await firebase.obtenerColeccion('kachuelos')
        guardarKachuelos(kachuelos)
      } catch (error) {
        console.log(error);
      }
    }

    obtenerKachuelos()
  }, [])

  return (
    <Layout>
      <div className="listado-productos">
        <div className="contenedor">
          <ul className="bg-white">
            {kachuelos.map(kachuelo => (
              <DetallesProducto
                key={kachuelo.id}
                kachuelo={kachuelo}
              />
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
