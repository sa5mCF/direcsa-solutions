'use client';

import { useState } from 'react';

interface Brand {
    id?: string;
    name: string;
    logoOriginal?: string;
    logoOptimized?: string;
    logoThumbnail?: string;
}

interface BrandFormProps {
    brand?: Brand;
    onSuccess: () => void;
    onCancel: () => void;
}

export function BrandForm({ brand, onSuccess, onCancel }: BrandFormProps) {
    const [name, setName] = useState(brand?.name || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = brand?.id ? `/api/admin/brands/${brand.id}` : '/api/admin/brands';
            const method = brand?.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al guardar la marca');

            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Nombre de la Marca</label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    placeholder="Ej. Sony, Bose, etc."
                />
            </div>

            {error && (
                <div className="text-red-600 text-sm font-medium">{error}</div>
            )}

            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Guardando...' : brand?.id ? 'Actualizar' : 'Crear Marca'}
                </button>
            </div>
        </form>
    );
}
