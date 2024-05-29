'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import useKachuelos from "@/hooks/useKachuelos";
import Layout from "@/components/layouts/Layout";
import DetallesProducto from '@/components/layouts/DetallesProducto';

export default function Page() {

    const [resultados, guardarResultados] = useState([])

    const searchParams = useSearchParams();
    const q = searchParams.get('q');

    const kachuelos = useKachuelos('kachuelos', 'creado', 'desc')

    useEffect(() => {
        if (kachuelos && q) {
            async function filtrarKachuelo() {
                const busqueda = q.toLocaleLowerCase()
                const filtro = await kachuelos.filter(kachuelos => {
                    return (
                        kachuelos.nombre.toLowerCase().includes(busqueda) ||
                        kachuelos.descripcion.toLowerCase().includes(busqueda)
                    )
                })

                await guardarResultados(filtro)
            }

            filtrarKachuelo()
        }
    }, [q, kachuelos])

    if (!kachuelos && !resultados) return 'Cargando...';

    return (
        <Layout>
            <div className="listado-productos">
                <div className="contenedor">
                    <ul className="bg-white">
                        {resultados.map(kachuelo => (
                            <DetallesProducto
                                key={kachuelo.id}
                                kachuelo={kachuelo}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </Layout>
    )
}
