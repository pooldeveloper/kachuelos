'use client';

import { useEffect, useState, useContext } from 'react';
import { useParams } from "next/navigation";
import FirebaseContext from '@/firebase/context';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import styled from 'styled-components';
import Layout from '@/components/layouts/Layout';
import Error404 from '@/components/layouts/404';
import { Campo, InputSubmit } from '@/components/ui/Formulario';
import Boton from '@/components/ui/Boton';

const ContenedorProducto = styled.div`
   @media (min-width:768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
   }
`;

const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`

export default function Page() {

    const { id } = useParams()

    const { firebase, usuario } = useContext(FirebaseContext)

    const [kachuelo, guardarKachuelo] = useState({})
    const [error, guardarError] = useState(false);

    useEffect(() => {
        if (id) {
            async function obtenerKachuelo() {
                try {
                    const kachuelo = await firebase.obtenerDocumento('kachuelos', id)
                    if (kachuelo) {
                        guardarKachuelo(kachuelo)
                    } else {
                        guardarError(true)
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            obtenerKachuelo()
        }
    }, [])

    if (Object.keys(kachuelo).length === 0 && !error) return 'Cargando...';

    const { comentarios, creado, descripcion, empresa, nombre, urlImagen, url, votos, creador, haVotado } = kachuelo;

    function votarKachuelo(){
        
    }

    return (
        <Layout>
            {
                error ? <Error404 /> : (
                    <div className="contenedor">
                        <h1 css={css`
                                text-align: center;
                                margin-top: 5rem;
                            `}>{nombre} </h1>

                        <ContenedorProducto>
                            <div>
                                <p>Publicado hace: {formatDistanceToNow(new Date(creado), { locale: es })} </p>
                                <p>Por: {creador.nombre} de {empresa} </p>
                                <img src={urlImagen} />
                                <p>{descripcion}</p>

                                {
                                    usuario &&
                                        <>
                                            <h2>Agrega tu comentario</h2>
                                            <form

                                            >
                                                <Campo>
                                                    <input
                                                        type="text"
                                                        name="mensaje"
                                                    />
                                                </Campo>
                                                <InputSubmit
                                                    type="submit"
                                                    value="Agregar Comentario"
                                                />
                                            </form>

                                        </>
                                }

                                <h2 css={css`
                                        margin: 2rem 0;
                                    `}>Comentarios</h2>

                                {comentarios.length === 0 ? "Aún no hay comentarios" : (
                                    <ul>
                                        {comentarios.map((comentario, i) => (
                                            <li
                                                key={`${comentario.usuarioId}-${i}`}
                                                css={css`
                                                        border: 1px solid #e1e1e1;
                                                        padding: 2rem;
                                                    `}
                                            >
                                                <p>{comentario.mensaje}</p>
                                                <p>Escrito por:
                                                    <span
                                                        css={css`
                                                                font-weight:bold;
                                                            `}
                                                    >
                                                        {''} {comentario.usuarioNombre}
                                                    </span>
                                                </p>
                                                <CreadorProducto>Es Creador</CreadorProducto>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                            </div>

                            <aside>
                                <Boton
                                    css={css`
                                        width: 100%;
                                    `}
                                    $bgColor="true"
                                >
                                    <a 
                                        href={url} 
                                        target="_blank"
                                    >
                                        Visitar URL
                                    </a>
                                </Boton>

                                <div
                                    css={css`
                                            margin-top: 5rem;
                                        `}
                                >
                                    <p css={css`
                                            text-align: center;
                                        `}>{votos} Votos</p>


                                 {
                                    usuario && 
                                        <Boton
                                            css={css`
                                                width: 100%;
                                            `}
                                            onClick={votarKachuelo}
                                        >
                                            Votar
                                        </Boton>
                                 }
                                </div>
                            </aside>
                        </ContenedorProducto>

                        {
                            usuario && 
                                <Boton>Eliminar Producto</Boton>
                        }
                    </div>
                )
            }
        </Layout>
    )
}

