'use client';

import { useContext } from 'react';
import Link from 'next/link'
import styled from 'styled-components';
import Buscar from '../ui/Buscar'
import Navegacion from './Navegacion'
import Boton from '../ui/Boton';
import FirebaseContext from '@/firebase/context';
import { useRouter } from 'next/navigation'

const ContenedorHeader = styled.div`
    max-width: 1200px;
    width: 95%;
    margin: 0 auto;
    @media (min-width:768px) {
        display: flex;
        justify-content: space-between;
    }
`;

const Logo = styled.p`
    color: var(--naranja);
    font-size: 4rem;
    line-height: 0;
    font-weight: 700;
    font-family: var(--font-roboto_slab), serif;
    margin-right: 2rem;
`;

export default function Header() {

  const { usuario, firebase } = useContext(FirebaseContext)

  const router = useRouter()

  async function cerrarSesion(){
    await firebase.logout()
    router.push('/')
  }
  
  return (
    <header
      css={css`
        border-bottom: 2px solid var(--gris3);
        padding: 1rem 0;
      `}
    >
      <ContenedorHeader>
        <div
          css={css`
            display:flex;
            align-items: center;
          `}
        >
          <Link href="/"><Logo>Kachuelos</Logo></Link>
          <Buscar />
          <Navegacion />
        </div>

        <div
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          {
            usuario ?
              <>
                <p
                  css={css`
                    margin-right: 2rem;
                  `}
                >
                  {`Hola: ${usuario.displayName}`}
                </p>
                <Boton $bgColor="true" onClick={cerrarSesion}>Cerrar Sesión</Boton>
              </>
              :
              <>
                <Link href="/login">
                  <Boton $bgColor="true">Login</Boton>
                </Link>

                <Link href="/crear-cuenta">
                  <Boton>Crear Cuenta</Boton>
                </Link>
              </>
          }
        </div>
      </ContenedorHeader>
    </header>
  )
}
