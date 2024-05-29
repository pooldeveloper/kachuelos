'use client';

import useKachuelos from '@/hooks/useKachuelos';
import Layout from '@/components/layouts/Layout';
import DetallesProducto from '@/components/layouts/DetallesProducto';

export default function Page() {

    const kachuelos = useKachuelos('kachuelos', 'votos', 'desc')

    if (!kachuelos) return 'Cargando...';

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
