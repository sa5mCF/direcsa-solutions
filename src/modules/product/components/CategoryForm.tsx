'use client';

import { useState, useEffect } from 'react';

interface Category {
    id?: string;
    name: string;
    parentId?: string | null;
}

interface CategoryFormProps {
    category?: Category;
    categories: Category[];
    onSuccess: () => void;
    onCancel: () => void;
}

export function CategoryForm({ category, categories, onSuccess, onCancel }: CategoryFormProps) {
    const [name, setName] = useState(category?.name || '');
    const [parentId, setParentId] = useState(category?.parentId || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = category?.id ? `/api/admin/categories/${category.id}` : '/api/admin/categories';
            const method = category?.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, parentId: parentId || null }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al guardar la categoría');

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
                <label className="block text-sm font-bold text-gray-800 mb-2">Nombre de la Categoría</label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    placeholder="Ej. Audio, Video, etc."
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Categoría Padre (Opcional)</label>
                <select
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                >
                    <option value="">Ninguna (Categoría Principal)</option>
                    {categories
                        .filter(c => c.id !== category?.id) // Prevent self-parenting
                        .map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))
                    }
                </select>
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
                    {loading ? 'Guardando...' : category?.id ? 'Actualizar' : 'Crear Categoría'}
                </button>
            </div>
        </form>
    );
}
