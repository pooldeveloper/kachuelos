'use client';

import { useState, useContext } from "react";
import FirebaseContext from "@/firebase/context";
import { useRouter } from 'next/navigation'
import { useForm } from "react-hook-form";
import Layout from "@/components/layouts/Layout";
import { Formulario, Campo, InputSubmit, Error } from "@/components/ui/Formulario"

export default function Page() {

    const { register, handleSubmit, formState: { errors } } = useForm()

    const [error, guardarError] = useState(false)

    const { firebase } = useContext(FirebaseContext)

    const router = useRouter()

    async function crearCuenta(data) {
        const { nombre, email, password } = data

        try {
            await firebase.registrar(nombre, email, password)
            router.push('/')
        } catch (error) {
            guardarError(error.message)
            console.error("Hubo un error al crear el usuario", error.message)
        }
    }

    return (
        <Layout>
            <h1
                css={css`
                    text-align: center;
                    margin-top: 5rem;
                `}
            >Crear Cuenta</h1>
            <Formulario onSubmit={handleSubmit(crearCuenta)} noValidate>
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
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Tu Email"
                        name="email"
                        {
                        ...register('email', {
                            required: 'El Email es Obligatorio',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Email no válido'
                            }
                        })}
                    />
                </Campo>

                {errors.email && <Error>{errors.email.message}</Error>}

                <Campo>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Tu Password"
                        name="password"
                        {
                        ...register('password', {
                            required: 'El password es obligatorio',
                            minLength: {
                                value: 6,
                                message: 'El password debe ser de al menos 6 caracteres'
                            }
                        })}
                    />
                </Campo>

                {errors.password && <Error>{errors.password.message}</Error>}
                {errors.minLength && <Error>{errors.minLength.message}</Error>}

                {error && <Error>{error}</Error>}

                <InputSubmit
                    type="submit"
                    value="Crear Cuenta"
                />
            </Formulario>
        </Layout>
    )
}
