import type { Metadata } from 'next';
import './globals.css';
import Image from 'next/image';

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
    return (
        <html lang="es">
            <body className="antialiased">
                <div className="min-h-screen bg-gray-50">
                    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-center h-16">
                                <a href="/" className="flex items-center">
                                    <Image
                                        src="/images/logos/direcsa_logo.png"
                                        alt="Direcsa Logo"
                                        width={120}
                                        height={40}
                                        className="h-10 w-auto object-contain"
                                        priority
                                    />
                                </a>
                                <nav className="flex items-center gap-6">
                                    <a href="/soluciones" className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors">
                                        Soluciones
                                    </a>
                                    <a href="/proyectos" className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors">
                                        Proyectos
                                    </a>
                                    <a href="/contacto" className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors">
                                        Contacto
                                    </a>
                                </nav>
                            </div>
                        </div>
                    </header>
                    <main>{children}</main>
                    <footer className="bg-[#FF4500] text-white py-12 px-4 shadow-[0_-4px_20px_rgba(255,69,0,0.2)] mt-16">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                            <a href="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                    <span className="text-[#FF4500] font-bold text-sm">D</span>
                                </div>
                                <span className="font-bold text-xl">Direcsa</span>
                            </a>
                            <div className="text-center text-sm font-medium">
                                © {new Date().getFullYear()} Direcsa.
                            </div>
                            <div className="flex gap-6 text-sm">
                                <a href="/soluciones" className="hover:underline">Soluciones</a>
                                <a href="/proyectos" className="hover:underline">Proyectos</a>
                                <a href="/contacto" className="hover:underline">Contacto</a>
                            </div>
                        </div>
                    </footer>
                </div>
            </body>
        </html>
    );
}
