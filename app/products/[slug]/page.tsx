import type { Metadata } from 'next';
import { getProductBySlug } from '@/lib/products';
import Image from 'next/image';
import { CheckCircle2, ChevronLeft, Zap, Ruler, ShieldCheck } from 'lucide-react';

interface ApiProduct {
    id: string;
    name: string;
    description: string | null;
    sku: string;
    price: number;
    unit: string;
    isActive: boolean;
    image?: string;
    shortDescription?: string;
}

async function getApiProduct(id: string): Promise<ApiProduct | null> {
    try {
        const res = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/products/${id}`, {
            cache: 'no-store',
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.product ?? null;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const staticProduct = getProductBySlug(slug);
    const apiProduct = !staticProduct ? await getApiProduct(slug) : null;
    const product = staticProduct || apiProduct;

    const baseUrl = process.env.BASE_URL || 'https://direcsa.com';

    if (!product) {
        return {
            title: 'Producto no encontrado — Direcsa',
        };
    }

    const title = `${product.name} — Direcsa`;
    const description = ('shortDescription' in product ? product.shortDescription : product.description) || '';
    const imageUrl = `${baseUrl}${product.image || '/images/og-default.jpg'}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: imageUrl, width: 1200, height: 630 }],
            type: 'website',
            url: `${baseUrl}/products/${slug}`,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
    };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // 1. Check static data first
    const staticProduct = getProductBySlug(slug);

    if (staticProduct) {
        return (
            <div className="min-h-screen bg-audio-bg text-audio-text">
                {/* Navigation */}
                <div className="max-w-7xl mx-auto px-6 py-6 flex items-center">
                    <a href="/offers" className="flex items-center gap-2 text-audio-primary hover:text-audio-primary/80 transition-colors group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Volver a Ofertas</span>
                    </a>
                </div>

                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-6 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1">
                        <span className="inline-block px-3 py-1 bg-audio-primary/10 text-audio-primary text-xs font-bold rounded-full mb-6 tracking-wider uppercase">
                            {staticProduct.category}
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-bold mb-8 tracking-tight leading-tight">
                            {staticProduct.name}
                        </h1>
                        <p className="text-xl lg:text-2xl text-audio-text/70 leading-relaxed mb-12 max-w-xl">
                            {staticProduct.shortDescription}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="/contacto"
                                className="bg-audio-primary text-audio-navbar px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-audio-primary/20"
                            >
                                Solicitar Cotización
                            </a>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2 relative aspect-square w-full max-w-2xl mx-auto lg:mx-0">
                        <div className="absolute inset-0 bg-audio-primary/5 rounded-full blur-3xl" />
                        <Image
                            src={staticProduct.image}
                            alt={staticProduct.name}
                            fill
                            className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                            priority
                        />
                    </div>
                </section>

                {/* Highlights Grid */}
                <section className="bg-audio-surface border-y border-audio-surface-border">
                    <div className="max-w-7xl mx-auto px-6 py-20">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                            {staticProduct.highlights.map((highlight, index) => (
                                <div key={index} className="flex flex-col gap-4 p-8 rounded-3xl bg-audio-bg/50 border border-audio-surface-border/50 hover:border-audio-primary/30 transition-colors">
                                    <div className="w-12 h-12 rounded-2xl bg-audio-primary/10 flex items-center justify-center text-audio-primary">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <span className="text-lg font-semibold tracking-tight leading-tight">{highlight}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Storytelling Section */}
                <section className="max-w-5xl mx-auto px-6 py-32 text-center">
                    <h2 className="text-3xl lg:text-5xl font-bold mb-10 tracking-tight leading-tight">
                        Por qué elegir {staticProduct.name}
                    </h2>
                    <p className="text-xl lg:text-2xl text-audio-text/60 leading-relaxed max-w-3xl mx-auto">
                        {staticProduct.description}
                    </p>
                </section>

                {/* Specs Section */}
                <section className="bg-audio-navbar border-t border-audio-surface-border">
                    <div className="max-w-4xl mx-auto px-6 py-24">
                        <div className="flex items-center gap-4 mb-16">
                            <h2 className="text-3xl font-bold tracking-tight">Especificaciones Técnicas</h2>
                            <div className="h-px flex-grow bg-audio-surface-border" />
                        </div>
                        <div className="grid grid-cols-1 gap-px bg-audio-surface-border ring-1 ring-audio-surface-border rounded-2xl overflow-hidden">
                            {Object.entries(staticProduct.specs).map(([key, value]) => (
                                <div key={key} className="grid grid-cols-1 md:grid-cols-2 bg-audio-navbar p-8 gap-4 hover:bg-audio-bg/50 transition-colors">
                                    <span className="text-audio-text/40 font-medium uppercase tracking-widest text-xs">{key}</span>
                                    <span className="text-lg font-medium">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Footer */}
                <section className="max-w-7xl mx-auto px-6 py-32">
                    <div className="bg-gradient-to-br from-audio-surface to-audio-bg p-12 lg:p-24 rounded-[3rem] border border-audio-surface-border text-center">
                        <h2 className="text-4xl lg:text-6xl font-bold mb-8 tracking-tight">Potencia tu sonido hoy.</h2>
                        <p className="text-xl text-audio-text/60 mb-12 max-w-2xl mx-auto">
                            Únete a los profesionales que confían en Direcsa para sus soluciones de audio de alto rendimiento.
                        </p>
                        <a
                            href="/contacto"
                            className="inline-block bg-audio-text text-audio-navbar px-12 py-5 rounded-full font-bold text-xl hover:bg-audio-primary hover:text-audio-navbar transition-all"
                        >
                            Hablar con un experto
                        </a>
                    </div>
                </section>
            </div>
        );
    }

    // 2. Fallback to API if not in static list
    const apiProduct = await getApiProduct(slug);

    if (!apiProduct) {
        return (
            <div className="min-h-screen bg-audio-bg flex items-center justify-center text-center p-6">
                <div className="max-w-md">
                    <div className="text-8xl mb-8">🔭</div>
                    <h1 className="text-3xl font-bold text-audio-text mb-4">Producto no encontrado</h1>
                    <p className="text-audio-text/60 mb-8">El producto que buscas no está disponible o ha sido movido.</p>
                    <a href="/catalogo" className="text-audio-primary hover:underline font-medium">← Volver al catálogo</a>
                </div>
            </div>
        );
    }

    // 3. Render legacy API product with current UI but matched to new theme
    return (
        <div className="min-h-screen bg-audio-bg py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <a href="/catalogo" className="text-sm text-audio-primary hover:underline flex items-center gap-2 mb-12">
                    <ChevronLeft size={16} /> Volver al catálogo
                </a>
                <div className="bg-audio-surface rounded-[2rem] border border-audio-surface-border overflow-hidden p-8 lg:p-16">
                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                        <div className="flex-grow">
                            <p className="text-xs text-audio-text/40 font-mono mb-4 tracking-widest uppercase">{apiProduct.sku}</p>
                            <h1 className="text-4xl lg:text-5xl font-bold text-audio-text mb-8 tracking-tight">{apiProduct.name}</h1>
                            {apiProduct.description && (
                                <p className="text-lg text-audio-text/60 leading-relaxed mb-10 max-w-2xl">{apiProduct.description}</p>
                            )}
                            <div className="flex items-baseline gap-3 mb-12 p-6 bg-audio-bg/50 rounded-2xl w-fit border border-audio-surface-border/50">
                                <span className="text-4xl font-bold text-audio-primary">
                                    ${apiProduct.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </span>
                                <span className="text-audio-text/30 font-medium">/ {apiProduct.unit}</span>
                            </div>
                            <div className="flex flex-col gap-6">
                                <a
                                    href="/register"
                                    className="bg-audio-primary text-audio-navbar font-bold px-10 py-4 rounded-xl hover:scale-105 transition-transform inline-block text-center shadow-lg shadow-audio-primary/10"
                                >
                                    Solicitar cotización
                                </a>
                                <p className="text-xs text-audio-text/40">Regístrate para solicitar una cotización personalizada y tiempos de entrega.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
