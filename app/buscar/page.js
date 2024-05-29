'use client'

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import useKachuelos from "@/hooks/useKachuelos";
import Layout from "@/components/layouts/Layout";
import DetallesProducto from '@/components/layouts/DetallesProducto';

function PageContent() {
    const [resultados, guardarResultados] = useState([]);
    const searchParams = useSearchParams();
    const q = searchParams.get('q');
    const kachuelos = useKachuelos('kachuelos', 'creado', 'desc');

    useEffect(() => {
        if (kachuelos && q) {
            const filtrarKachuelo = async () => {
                const busqueda = q.toLocaleLowerCase();
                const filtro = kachuelos.filter(kachuelo => {
                    return (
                        kachuelo.nombre.toLowerCase().includes(busqueda) ||
                        kachuelo.descripcion.toLowerCase().includes(busqueda)
                    );
                });
                guardarResultados(filtro);
            };

            filtrarKachuelo();
        }
    }, [q, kachuelos]);

    if (!kachuelos && !resultados) return 'Cargando...';

    return (
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
    );
}

export default function Page() {
    return (
        <Layout>
            <Suspense fallback={<div>Cargando...</div>}>
                <PageContent />
            </Suspense>
        </Layout>
    );
}
