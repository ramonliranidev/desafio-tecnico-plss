import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Teste Técnico - PLSS',
  description: 'Sistema de login e registro com JWT',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
        <Providers>{children}</Providers>
    </html>
  );
}
