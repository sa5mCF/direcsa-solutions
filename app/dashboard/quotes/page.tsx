'use client';

import { useState, useEffect, useCallback } from 'react';

interface QuoteItem {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

interface Quote {
    id: string;
    userId: string;
    status: string;
    notes: string | null;
    total: number;
    items: QuoteItem[];
    createdAt: string;
}

interface Product {
    id: string;
    name: string;
    sku: string;
    priceMxn: number;
    unit: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
    REVIEWED: { label: 'Revisada', color: 'bg-blue-100 text-blue-700' },
    APPROVED: { label: 'Aprobada', color: 'bg-green-100 text-green-700' },
    REJECTED: { label: 'Rechazada', color: 'bg-red-100 text-red-700' },
};

export default function DashboardQuotesPage() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [notes, setNotes] = useState('');
    const [items, setItems] = useState([{ productId: '', quantity: 1, unitPrice: 0 }]);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [quotesRes, productsRes] = await Promise.all([
                fetch('/api/quotes'),
                fetch('/api/products'),
            ]);
            const quotesData = quotesRes.ok ? await quotesRes.json() : { quotes: [] };
            const productsData = productsRes.ok ? await productsRes.json() : { products: [] };
            setQuotes(quotesData.quotes ?? []);
            setProducts(productsData.products ?? []);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    function addItem() {
        setItems([...items, { productId: '', quantity: 1, unitPrice: 0 }]);
    }

    function removeItem(index: number) {
        setItems(items.filter((_, i) => i !== index));
    }

    function updateItem(index: number, field: string, value: string | number) {
        const updated = [...items];
        if (field === 'productId') {
            const product = products.find((p) => p.id === value);
            updated[index] = { ...updated[index], productId: String(value), unitPrice: product?.priceMxn ?? 0 };
        } else {
            updated[index] = { ...updated[index], [field]: value };
        }
        setItems(updated);
    }

    const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            const res = await fetch('/api/quotes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes, items }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al crear cotización');
            setShowForm(false);
            setNotes('');
            setItems([{ productId: '', quantity: 1, unitPrice: 0 }]);
            fetchData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Cotizaciones</h1>
                    <p className="text-gray-500 text-sm mt-1">Gestiona las solicitudes de cotización</p>
                </div>
                <button
                    onClick={() => { setShowForm(true); setError(''); }}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <span>+</span> Nueva cotización
                </button>
            </div>

            {/* Create Quote Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Nueva cotización</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notas (opcional)</label>
                                <textarea
                                    rows={2}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="Observaciones o requerimientos especiales..."
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-sm font-medium text-gray-700">Productos *</label>
                                    <button type="button" onClick={addItem} className="text-blue-600 text-xs font-medium hover:underline">
                                        + Agregar producto
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {items.map((item, i) => (
                                        <div key={i} className="grid grid-cols-12 gap-2 items-center">
                                            <div className="col-span-5">
                                                <select
                                                    required
                                                    value={item.productId}
                                                    onChange={(e) => updateItem(i, 'productId', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    {products.map((p) => (
                                                        <option key={p.id} value={p.id}>{p.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    required
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(i, 'quantity', parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Cant."
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    required
                                                    value={item.unitPrice}
                                                    onChange={(e) => updateItem(i, 'unitPrice', parseFloat(e.target.value))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Precio"
                                                />
                                            </div>
                                            <div className="col-span-2 text-right">
                                                {items.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(i)}
                                                        className="text-red-400 hover:text-red-600 text-xs px-2 py-1"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl px-4 py-3 flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">Total estimado</span>
                                <span className="text-lg font-bold text-blue-700">
                                    ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </span>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {saving ? 'Creando...' : 'Crear cotización'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Quotes list */}
            {loading ? (
                <div className="text-center py-20 text-gray-400">Cargando cotizaciones...</div>
            ) : quotes.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                    <div className="text-5xl mb-4">📋</div>
                    <p className="text-gray-500 font-medium">No hay cotizaciones aún</p>
                    <button onClick={() => setShowForm(true)} className="mt-4 text-blue-600 text-sm hover:underline">
                        Crear la primera →
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {quotes.map((q) => {
                        const status = STATUS_LABELS[q.status] ?? { label: q.status, color: 'bg-gray-100 text-gray-600' };
                        const isExpanded = expandedId === q.id;
                        return (
                            <div key={q.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                <button
                                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                            {status.label}
                                        </span>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Cotización #{q.id.slice(-8).toUpperCase()}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {new Date(q.createdAt).toLocaleDateString('es-MX', { dateStyle: 'medium' })}
                                                {' · '}{q.items.length} producto{q.items.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-gray-900">
                                            ${q.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                        </span>
                                        <svg
                                            className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>
                                {isExpanded && (
                                    <div className="border-t border-gray-100 px-6 py-4">
                                        {q.notes && (
                                            <p className="text-sm text-gray-600 mb-4 bg-gray-50 rounded-lg px-4 py-3">
                                                <span className="font-medium">Notas:</span> {q.notes}
                                            </p>
                                        )}
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-gray-500 text-xs">
                                                    <th className="text-left pb-2">Producto</th>
                                                    <th className="text-right pb-2">Cant.</th>
                                                    <th className="text-right pb-2">Precio unit.</th>
                                                    <th className="text-right pb-2">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {q.items.map((item) => {
                                                    const product = products.find((p) => p.id === item.productId);
                                                    return (
                                                        <tr key={item.id}>
                                                            <td className="py-2 text-gray-900">{product?.name ?? item.productId}</td>
                                                            <td className="py-2 text-right text-gray-600">{item.quantity}</td>
                                                            <td className="py-2 text-right text-gray-600">
                                                                ${item.unitPrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                                            </td>
                                                            <td className="py-2 text-right font-medium text-gray-900">
                                                                ${item.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                            <tfoot>
                                                <tr className="border-t border-gray-200">
                                                    <td colSpan={3} className="pt-3 text-right font-semibold text-gray-700">Total</td>
                                                    <td className="pt-3 text-right font-bold text-blue-700">
                                                        ${q.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
