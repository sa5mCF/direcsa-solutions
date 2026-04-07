import type { Metadata } from 'next';
import './globals.css';
import Image from 'next/image';
import { Facebook, Instagram } from 'lucide-react';
import WhatsAppButton from '@/app/components/WhatsAppButton';

export const metadata: Metadata = {
    title: 'Direcsa — Audio & Video Profesional',
    description: 'Diseño, venta e instalación de soluciones audiovisuales profesionales para empresas y recintos.',
    openGraph: {
        title: 'Direcsa — Audio & Video Profesional',
        description: 'Expertos en integración audiovisual y soluciones tecnológicas.',
        url: 'https://direcsa-audio.vercel.app/soluciones', // TODO: Cambiar por el dominio real
        siteName: 'Direcsa',
        images: [
            {
                url: '/images/audio_room.jpg',
                width: 1200,
                height: 630,
                alt: 'DIRECSA Soluciones Audiovisuales',
            },
        ],
        locale: 'es_MX',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Direcsa — Audio & Video Profesional',
        description: 'Distribución y soporte de las mejores marcas de audio y video.',
        images: ['/images/audio_room.jpg'],
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const fbUrl = process.env.NEXT_PUBLIC_META_FB;
    const igUrl = process.env.NEXT_PUBLIC_META_IG;

    return (
        <html lang="es">
            <body className="antialiased">
                <div className="min-h-screen bg-audio-bg flex flex-col">
                    <header className="bg-audio-navbar border-b border-audio-surface-border sticky top-0 z-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-center h-16">
                                <a href="/" className="flex items-center">
                                    <Image
                                        src="/images/logos/direcsa_logo.png"
                                        alt="Direcsa Logo"
                                        width={120}
                                        height={40}
                                        className="h-10 w-auto object-contain brightness-0 invert"
                                        priority
                                    />
                                </a>
                                <nav className="flex items-center gap-6">
                                    <a href="/soluciones" className="text-audio-text hover:text-audio-primary text-sm font-medium transition-colors">
                                        Soluciones
                                    </a>
                                    <a href="/offers" className="text-audio-text hover:text-audio-primary text-sm font-medium transition-colors">
                                        Ofertas
                                    </a>
                                    <a href="/catalogo" className="text-audio-text hover:text-audio-primary text-sm font-medium transition-colors">
                                        Catálogo
                                    </a>
                                    <a href="/proyectos" className="text-audio-text hover:text-audio-primary text-sm font-medium transition-colors">
                                        Proyectos
                                    </a>
                                    <a href="/contacto" className="text-audio-text hover:text-audio-primary text-sm font-medium transition-colors">
                                        Contacto
                                    </a>
                                </nav>
                            </div>
                        </div>
                    </header>
                    <main className="flex-grow">{children}</main>
                    <footer className="bg-audio-navbar text-audio-text py-12 px-4 border-t border-audio-surface-border mt-auto">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex flex-col items-center md:items-start gap-4">
                                <a href="/" className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-audio-primary rounded-lg flex items-center justify-center">
                                        <span className="text-audio-navbar font-bold text-sm">D</span>
                                    </div>
                                    <span className="font-bold text-xl">Direcsa</span>
                                </a>
                                <div className="text-sm font-medium text-audio-text/40">
                                    © {new Date().getFullYear()} Direcsa. Todos los derechos reservados.
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-6">
                                <div className="flex gap-6 text-sm">
                                    <a href="/soluciones" className="text-audio-text/70 hover:text-audio-primary transition-colors">Soluciones</a>
                                    <a href="/catalogo" className="text-audio-text/70 hover:text-audio-primary transition-colors">Catálogo</a>
                                    <a href="/proyectos" className="text-audio-text/70 hover:text-audio-primary transition-colors">Proyectos</a>
                                    <a href="/contacto" className="text-audio-text/70 hover:text-audio-primary transition-colors">Contacto</a>
                                </div>
                                <div className="flex gap-5">
                                    {fbUrl && (
                                        <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="text-audio-text/50 hover:text-audio-primary transition-colors duration-300" aria-label="Facebook">
                                            <Facebook size={20} />
                                        </a>
                                    )}
                                    {igUrl && (
                                        <a href={igUrl} target="_blank" rel="noopener noreferrer" className="text-audio-text/50 hover:text-audio-primary transition-colors duration-300" aria-label="Instagram">
                                            <Instagram size={20} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
                <WhatsAppButton />
            </body>
        </html>
    );
}

