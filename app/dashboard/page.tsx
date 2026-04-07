import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard — Direcsa',
};

async function getStats() {
    const base = process.env.BASE_URL || 'http://localhost:3000';
    try {
        const [productsRes] = await Promise.all([
            fetch(`${base}/api/products`, { cache: 'no-store' }),
        ]);
        const productsData = productsRes.ok ? await productsRes.json() : { products: [] };
        return {
            totalProducts: productsData.products?.length ?? 0,
        };
    } catch {
        return { totalProducts: 0 };
    }
}

export default async function DashboardPage() {
    const stats = await getStats();

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Resumen</h1>
                <p className="text-gray-500 text-sm mt-1">Bienvenido al panel de administración de Direcsa</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-500">Productos</span>
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <span className="text-xl">📦</span>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                    <a href="/dashboard/products" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                        Ver productos →
                    </a>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-500">Cotizaciones</span>
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                            <span className="text-xl">📋</span>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">—</p>
                    <a href="/dashboard/quotes" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                        Ver cotizaciones →
                    </a>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
                    <p className="text-sm font-medium text-blue-100 mb-4">Acciones rápidas</p>
                    <div className="space-y-2">
                        <a
                            href="/dashboard/products"
                            className="block bg-white/20 hover:bg-white/30 transition-colors rounded-lg px-4 py-2 text-sm font-medium"
                        >
                            + Agregar producto
                        </a>
                        <a
                            href="/dashboard/quotes"
                            className="block bg-white/20 hover:bg-white/30 transition-colors rounded-lg px-4 py-2 text-sm font-medium"
                        >
                            + Nueva cotización
                        </a>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Inicio rápido</h2>
                <ol className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                        <span>Ve a <a href="/dashboard/products" className="text-blue-600 hover:underline font-medium">Productos</a> y agrega tu catálogo</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                        <span>Comparte el <a href="/products" className="text-blue-600 hover:underline font-medium">catálogo público</a> con tus clientes</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                        <span>Gestiona las <a href="/dashboard/quotes" className="text-blue-600 hover:underline font-medium">cotizaciones</a> recibidas</span>
                    </li>
                </ol>
            </div>
        </div>
    );
}
