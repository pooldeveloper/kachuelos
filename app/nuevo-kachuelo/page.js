'use client';

import { useState, useContext } from "react";
import FirebaseContext from "@/firebase/context";
import { useRouter } from 'next/navigation'
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid'
import Layout from "@/components/layouts/Layout";
import Error404 from "@/components/layouts/404";
import { Formulario, Campo, InputSubmit, Error } from "@/components/ui/Formulario"

export default function Page() {

    const { register, handleSubmit, formState: { errors } } = useForm()

    const [error, guardarError] = useState(false)

    const { usuario, firebase } = useContext(FirebaseContext)

    const router = useRouter()

    async function subirImagen(imagen) {
        try {
            const url = await firebase.subirArchivo(`kachuelos/${uuidv4()}`, imagen[0])
            return url
        } catch (error) {
            console.error("Hubo un error al subir la imagen del kachuelo", error.message);
        }
    }

    async function crearKachuelo(data) {
        if (!usuario) {
            router.push('/login')
        }

        const { nombre, empresa, url, descripcion, imagen } = data

        const urlImagen = await subirImagen(imagen)

        const kachuelo = {
            nombre,
            empresa,
            urlImagen,
            url,
            descripcion,
            votos: 0,
            comentarios: [],
            creado: Date.now(),
            creador: {
                id: usuario.uid,
                nombre: usuario.displayName
            }
        }

        try {
            await firebase.crearColeccion('kachuelos', kachuelo)
        } catch (error) {
            guardarError(error.message)
            console.error("Hubo un error al crear un kachuelo", error.message);
        }

        return router.push('/')
    }

    return (
        <Layout>
            {
                !usuario ?
                    <Error404 /> :
                    <>
                        <h1
                            css={css`
                                text-align: center;
                                margin-top: 5rem;
                            `}
                        >Nuevo Kachuelo</h1>
                        <Formulario onSubmit={handleSubmit(crearKachuelo)} noValidate>
                            <fieldset>
                                <legend>Información General</legend>
                                <Campo>
                                    <label htmlFor="nombre">Nombre</label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        placeholder="Tu Nombre"
                                        name="nombre"
                                        {
                                        ...register('nombre', {
                                            required: 'El nombre es obligatorio'
                                        })
                                        }
                                    />
                                </Campo>

                                {errors.nombre && <Error>{errors.nombre.message}</Error>}

                                <Campo>
                                    <label htmlFor="empresa">Empresa</label>
                                    <input
                                        type="text"
                                        id="empresa"
                                        placeholder="Nombre Empresa o Compañia"
                                        name="empresa"
                                        {
                                        ...register('empresa', {
                                            required: 'El nombre de la empresa es obligatorio'
                                        })
                                        }
                                    />
                                </Campo>

                                {errors.empresa && <Error>{errors.empresa.message}</Error>}

                                <Campo>
                                    <label htmlFor="imagen">Imagen</label>
                                    <input
                                        type="file"
                                        id="imagen"
                                        name="imagen"
                                        {
                                        ...register('imagen', {
                                            validate: value => value.length > 0 || "La imagen es obligatoria"
                                        })
                                        }
                                    />
                                </Campo>

                                {errors.imagen && <Error>{errors.imagen.message}</Error>}

                                <Campo>
                                    <label htmlFor="url">URL</label>
                                    <input
                                        type="url"
                                        id="url"
                                        placeholder="URL de tu Kachuelo"
                                        name="url"
                                        {
                                        ...register('url', {
                                            required: 'La URL es obligatoria',
                                            pattern: {
                                                value: /^(ftp|http|https):\/\/[^ "]+$/,
                                                message: 'URL mal formateada o no válida'
                                            }
                                        })
                                        }
                                    />
                                </Campo>

                                {errors.url && <Error>{errors.url.message}</Error>}

                            </fieldset>

                            <fieldset>
                                <legend>Sobre el Kachuelo</legend>
                                <Campo>
                                    <label htmlFor="descripcion">Descripción</label>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        {
                                        ...register('descripcion', {
                                            required: 'La descripción es obligatoria'
                                        })
                                        }
                                    />
                                </Campo>

                                {errors.descripcion && <Error>{errors.descripcion.message}</Error>}
                            </fieldset>

                            {error && <Error>{error}</Error>}

                            <InputSubmit
                                type="submit"
                                value="Crear Kachuelo"
                            />
                        </Formulario>
                    </>
            }
        </Layout>
    )
}
