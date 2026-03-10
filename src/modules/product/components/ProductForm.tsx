'use client';

import { useState, useEffect } from 'react';

interface Brand {
    id: string;
    name: string;
}

interface Category {
    id: string;
    name: string;
}

interface Product {
    id?: string;
    name: string;
    sku: string;
    unit: string;
    description?: string | null;
    brandId: string;
    categoryId: string;
    dealerPriceUsd: number;
    promoPriceUsd: number;
    priceMxnExVat: number;
    priceMxnIncVat: number;
    priceMxn: number;
    priceUsd: number;
    discount: number;
    imageOriginal?: string;
    imageOptimized?: string;
    imageThumbnail?: string;
}

interface ProductFormProps {
    product?: Product;
    brands: Brand[];
    categories: Category[];
    onSuccess: () => void;
    onCancel: () => void;
}

const emptyProduct: Product = {
    name: '',
    sku: '',
    unit: 'pza',
    description: '',
    brandId: '',
    categoryId: '',
    dealerPriceUsd: 0,
    promoPriceUsd: 0,
    priceMxnExVat: 0,
    priceMxnIncVat: 0,
    priceMxn: 0,
    priceUsd: 0,
    discount: 0,
    imageOriginal: '',
    imageOptimized: '',
    imageThumbnail: '',
};

export function ProductForm({ product, brands, categories, onSuccess, onCancel }: ProductFormProps) {
    const [form, setForm] = useState<Product>(product || emptyProduct);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = product?.id ? `/api/admin/products/${product.id}` : '/api/admin/products';
            const method = product?.id ? 'PUT' : 'POST';

            // Ensure numeric fields are numbers
            const payload = {
                ...form,
                dealerPriceUsd: Number(form.dealerPriceUsd),
                promoPriceUsd: Number(form.promoPriceUsd),
                priceMxnExVat: Number(form.priceMxnExVat),
                priceMxnIncVat: Number(form.priceMxnIncVat),
                priceMxn: Number(form.priceMxn),
                priceUsd: Number(form.priceUsd),
                discount: Number(form.discount),
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al guardar el producto');

            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto px-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-800 mb-2">Nombre del Producto</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                        placeholder="Ej. Consola de Audio Digital"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">SKU / Modelo</label>
                    <input
                        type="text"
                        name="sku"
                        required
                        value={form.sku}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                        placeholder="DI-001"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Unidad</label>
                    <input
                        type="text"
                        name="unit"
                        required
                        value={form.unit}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                        placeholder="pza, kit, etc."
                    />
                </div>

                {/* Brand and Category */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Marca</label>
                    <select
                        name="brandId"
                        required
                        value={form.brandId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    >
                        <option value="">Seleccionar marca</option>
                        {brands.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Categoría</label>
                    <select
                        name="categoryId"
                        required
                        value={form.categoryId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    >
                        <option value="">Seleccionar categoría</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* Pricing */}
                <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 bg-blue-50/30 p-4 rounded-2xl border border-blue-100">
                    <div className="md:col-span-4">
                        <h4 className="text-sm font-bold text-blue-900 mb-2">Información de Precios</h4>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Precio Distribuidor (USD)</label>
                        <input
                            type="number"
                            name="dealerPriceUsd"
                            step="0.01"
                            value={form.dealerPriceUsd}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Precio Promo (USD)</label>
                        <input
                            type="number"
                            name="promoPriceUsd"
                            step="0.01"
                            value={form.promoPriceUsd}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Precio MXN Ex. IVA</label>
                        <input
                            type="number"
                            name="priceMxnExVat"
                            step="0.01"
                            value={form.priceMxnExVat}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Precio MXN Inc. IVA</label>
                        <input
                            type="number"
                            name="priceMxnIncVat"
                            step="0.01"
                            value={form.priceMxnIncVat}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Precio Final MXN</label>
                        <input
                            type="number"
                            name="priceMxn"
                            step="0.01"
                            value={form.priceMxn}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm text-gray-900 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Precio Final USD</label>
                        <input
                            type="number"
                            name="priceUsd"
                            step="0.01"
                            value={form.priceUsd}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm text-gray-900 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Descuento (%)</label>
                        <input
                            type="number"
                            name="discount"
                            step="0.01"
                            value={form.discount}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-800 mb-2">Descripción</label>
                    <textarea
                        name="description"
                        rows={4}
                        value={form.description || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none transition-all"
                        placeholder="Detalles sobre el producto..."
                    />
                </div>
            </div>

            {error && (
                <div className="text-red-600 text-sm font-medium p-3 bg-red-50 rounded-lg border border-red-100">{error}</div>
            )}

            <div className="flex gap-4 pt-4 sticky bottom-0 bg-white pb-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-4 border border-gray-300 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 disabled:opacity-50 shadow-lg shadow-gray-200 transition-all"
                >
                    {loading ? 'Guardando...' : product?.id ? 'Actualizar Producto' : 'Crear Producto'}
                </button>
            </div>
        </form>
    );
}
