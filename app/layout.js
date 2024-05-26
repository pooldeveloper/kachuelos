import 'normalize.css/normalize.css';
import "./globals.css";
import StyledComponentsRegistry from "@/lib/registry";
import { PT_Sans, Roboto_Slab } from 'next/font/google'
import { FirebaseProvider } from '@/firebase/context';

const pt_sans = PT_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const roboto_slab = Roboto_Slab({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})


export const metadata = {
  title: "Kachuelos",
  description: "Trabaja haciendo kachuelos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${pt_sans.className} ${roboto_slab.className}`}>
      <FirebaseProvider>
        <body>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </body>
      </FirebaseProvider>
    </html>
  );
}
