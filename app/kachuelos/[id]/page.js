'use client';

import { useEffect, useState, useContext } from 'react';
import { useParams } from "next/navigation";
import { useRouter } from 'next/navigation'
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
    const router = useRouter()

    const { firebase, usuario } = useContext(FirebaseContext)

    const [kachuelo, guardarKachuelo] = useState({})
    const [error, guardarError] = useState(false);
    const [comentario, guardarComentario] = useState({});
    const [consultarDB, guardarConsultarDB] = useState(true);

    useEffect(() => {
        if (id && consultarDB) {
            async function obtenerKachuelo() {
                try {
                    const kachuelo = await firebase.obtenerDocumento('kachuelos', id)
                    if (kachuelo) {
                        guardarKachuelo(kachuelo)
                        guardarConsultarDB(false)
                    } else {
                        guardarError(true)
                        guardarConsultarDB(false)
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            obtenerKachuelo()
        }
    }, [id])

    if (Object.keys(kachuelo).length === 0 && !error) return 'Cargando...';

    const { comentarios, creado, descripcion, empresa, nombre, urlImagen, url, votos, creador, haVotado } = kachuelo;

    async function votarKachuelo() {
        if (!usuario) {
            return router.push('/login')
        }

        const nuevoTotal = votos + 1

        if (haVotado.includes(usuario.uid)) return;

        const nuevoHaVotado = [...haVotado, usuario.uid]

        try {
            await firebase.actualizarDocumento('kachuelos', id, { votos: nuevoTotal, haVotado: nuevoHaVotado })
        } catch (error) {
            console.error("Hubo un error al agregar un voto", error.message);
        }

        guardarKachuelo({
            ...kachuelo,
            votos: nuevoTotal
        })

        guardarConsultarDB(true)
    }

    function comentarioChange(e) {
        guardarComentario({
            ...comentario,
            [e.target.name]: e.target.value
        })
    }

    function esCreador(id) {
        if (creador.id == id) {
            return true;
        }
    }

    async function agregarComentario(e) {
        e.preventDefault();

        if (!usuario) {
            return router.push('/login')
        }

        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        const nuevosComentarios = [...comentarios, comentario];

        try {
            await firebase.actualizarDocumento('kachuelos', id, { comentarios: nuevosComentarios })
        } catch (error) {
            console.error("Hubo un error al agregar un voto", error.message);
        }

        guardarKachuelo({
            ...kachuelo,
            comentarios: nuevosComentarios
        })

        guardarConsultarDB(true)
    }

    function puedeBorrar() {
        if (!usuario) return false;

        if (creador.id === usuario.uid) {
            return true
        }
    }

    async function eliminarProducto() {
        if (!usuario) {
            return router.push('/login')
        }

        if (creador.id !== usuario.uid) {
            return router.push('/')
        }

        try {
            await firebase.eliminarDocumento('kachuelos', id)
            router.push('/')
        } catch (error) {
            console.error("Hubo un error al eliminar el kachuelo", error.message);
        }
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
                                                onSubmit={agregarComentario}
                                            >
                                                <Campo>
                                                    <input
                                                        required
                                                        type="text"
                                                        name="mensaje"
                                                        onChange={comentarioChange}
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
                                                {esCreador(comentario.usuarioId) && <CreadorProducto>Es Creador</CreadorProducto>}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                            </div>

                            <aside>
                                <a
                                    href={url}
                                    target="_blank"
                                >
                                    <Boton
                                        css={css`
                                                width: 100%;
                                            `}
                                        $bgColor="true"
                                    >

                                        Visitar URL
                                    </Boton>
                                </a>
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

                        {puedeBorrar() && <Boton onClick={eliminarProducto} >Eliminar Producto</Boton>}
                    </div>
                )
            }
        </Layout>
    )
}

