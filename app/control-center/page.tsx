'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ProductForm } from '@/src/modules/product/components/ProductForm';
import { BrandForm } from '@/src/modules/product/components/BrandForm';
import { CategoryForm } from '@/src/modules/product/components/CategoryForm';
import { AdminForm } from '@/src/modules/admin/components/AdminForm';

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone?: string;
    description: string;
    isRead: boolean;
    createdAt: string;
}

interface Product {
    id: string;
    name: string;
    sku: string;
    priceMxn: number;
    unit: string;
    isActive: boolean;
    brand: { name: string };
    category: { name: string };
}

interface Brand {
    id: string;
    name: string;
}

interface Category {
    id: string;
    name: string;
    parentId?: string | null;
}

interface Admin {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: string;
}

type Tab = 'contacts' | 'products' | 'brands' | 'categories' | 'admins';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('contacts');
    const [contacts, setContacts] = useState<ContactMessage[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [permissions, setPermissions] = useState<string[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showModal, setShowModal] = useState<'product' | 'brand' | 'category' | 'admin' | null>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            let res;
            if (activeTab === 'contacts') {
                res = await fetch('/api/admin/contacts');
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                setContacts(data.contacts);
            } else if (activeTab === 'products') {
                res = await fetch('/api/products');
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                setProducts(data.products);
            } else if (activeTab === 'brands') {
                res = await fetch('/api/brands');
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                setBrands(data.brands);
            } else if (activeTab === 'categories') {
                res = await fetch('/api/categories');
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                setCategories(data.categories);
            } else if (activeTab === 'admins') {
                res = await fetch('/api/admin/admins');
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                setAdmins(data.admins);
            }

            // Always fetch brands and categories if they are empty (for forms)
            if (activeTab === 'contacts' || activeTab === 'products') {
                const [bRes, cRes] = await Promise.all([
                    fetch('/api/brands'),
                    fetch('/api/categories')
                ]);
                const bData = await bRes.json();
                const cData = await cRes.json();
                if (bRes.ok) setBrands(bData.brands);
                if (cRes.ok) setCategories(cData.categories);
            }
        } catch (err: any) {
            if (err.message === 'No autenticado') {
                router.push('/control-center/login');
                return;
            }
            setError(err.message || 'Error al cargar datos');
        } finally {
            setLoading(false);
        }
    }, [activeTab, router]);

    const fetchPermissions = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/me');
            const data = await res.json();
            if (res.ok) {
                setPermissions(data.permissions || []);
            }
        } catch (err) {
            console.error('Error fetching permissions:', err);
        }
    }, []);

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    async function handleLogout() {
        try {
            await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'logout' }),
            });
            router.push('/control-center/login');
        } catch (err) {
            console.error('Error al cerrar sesión:', err);
        }
    }

    const openCreate = (type: 'product' | 'brand' | 'category' | 'admin') => {
        setSelectedItem(null);
        setShowModal(type);
    };

    const openEdit = (type: 'product' | 'brand' | 'category' | 'admin', item: any) => {
        setSelectedItem(item);
        setShowModal(type);
    };

    const handleSuccess = () => {
        setShowModal(null);
        fetchData();
    };

    const handleDelete = async (type: string, id: string) => {
        if (!confirm('¿Estás seguro de eliminar este elemento?')) return;
        try {
            const res = await fetch(`/api/admin/${type}/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Error al eliminar');
            fetchData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleToggleRead = async (id: string, currentRead: boolean) => {
        try {
            const res = await fetch(`/api/admin/contacts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isRead: !currentRead }),
            });
            if (!res.ok) throw new Error('Error al actualizar estado');
            fetchData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleImageUpload = async (id: string, type: 'product' | 'brand', e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            // 1. Upload to S3
            const { uploadImage } = await import('@/src/lib/uploadImage');
            const uploadRes = await uploadImage(file, type);

            // 2. Update via PUT (Partial)
            const payload = type === 'product' ? {
                imageOriginal: uploadRes.originalUrl,
                imageOptimized: uploadRes.optimizedUrl,
                imageThumbnail: uploadRes.thumbnailUrl,
            } : {
                logoOriginal: uploadRes.originalUrl,
                logoOptimized: uploadRes.optimizedUrl,
                logoThumbnail: uploadRes.thumbnailUrl,
            };

            const res = await fetch(`/api/admin/${type === 'product' ? 'products' : 'brands'}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Error al actualizar registro');
            }

            alert('¡Imagen actualizada con éxito!');
            fetchData();
        } catch (err: any) {
            alert(err.message || 'Error durante la subida');
        } finally {
            setLoading(false);
            e.target.value = ''; // Reset input
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-100">
                        <span className="text-white font-bold text-xl">D</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Panel de Control</h1>
                        <p className="text-xs text-gray-500 font-medium">Gestión Administrativa Direcsa</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="text-sm font-bold text-gray-500 hover:text-red-600 transition-colors bg-gray-50 px-4 py-2 rounded-lg"
                >
                    Cerrar Sesión
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col p-4 gap-2">
                    <nav className="space-y-1">
                        {[
                            { id: 'contacts', label: 'Mensajes', icon: '📥' },
                            { id: 'products', label: 'Productos', icon: '📦' },
                            { id: 'brands', label: 'Marcas', icon: '🏷️' },
                            { id: 'categories', label: 'Categorías', icon: '🗂️' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <span className="text-lg">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}

                        {permissions.includes('CREATE_ADMIN') && (
                            <button
                                onClick={() => setActiveTab('admins')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'admins'
                                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <span className="text-lg">🛡️</span>
                                Administradores
                            </button>
                        )}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 capitalize">
                                    {activeTab === 'contacts' ? 'Mensajes de Contacto' : activeTab}
                                </h2>
                                <p className="text-gray-500 text-sm font-medium mt-1">
                                    {activeTab === 'contacts' && 'Visualiza y gestiona prospectos'}
                                    {activeTab === 'products' && 'Catálogo completo de productos'}
                                    {activeTab === 'brands' && 'Gestión de marcas registradas'}
                                    {activeTab === 'categories' && 'Estructura de categorías'}
                                    {activeTab === 'admins' && 'Gestión de cuentas administrativas'}
                                </p>
                            </div>
                            {activeTab !== 'contacts' && (
                                <button
                                    onClick={() => {
                                        const type = activeTab === 'categories'
                                            ? 'category'
                                            : activeTab === 'admins'
                                                ? 'admin'
                                                : activeTab.slice(0, -1) as any;
                                        openCreate(type);
                                    }}
                                    className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-gray-200 flex items-center gap-2"
                                >
                                    <span>+</span> Nuevo {activeTab === 'categories' ? 'categoría' : activeTab === 'admins' ? 'administrador' : activeTab.slice(0, -1)}
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div className="grid gap-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
                                <p className="font-bold">{error}</p>
                                <button onClick={fetchData} className="mt-4 text-sm underline font-bold">Reintentar</button>
                            </div>
                        ) : (
                            <div className="fade-in">
                                {activeTab === 'contacts' && (
                                    <div className="grid gap-6">
                                        {contacts?.length === 0 ? (
                                            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                                                <p className="text-gray-400 font-bold">Sin mensajes aún</p>
                                            </div>
                                        ) : contacts?.map((c) => (
                                            <div key={c.id} className={`bg-white rounded-2xl shadow-sm border ${c.isRead ? 'border-gray-100 opacity-75' : 'border-blue-200 ring-1 ring-blue-50'} p-6 hover:shadow-md transition-all relative overflow-hidden`}>
                                                {!c.isRead && (
                                                    <div className="absolute top-0 right-0">
                                                        <div className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-tighter">Nuevo</div>
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="text-lg font-bold text-gray-900">{c.name}</h3>
                                                            {c.isRead ? (
                                                                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase">Leído</span>
                                                            ) : (
                                                                <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">Pendiente</span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500">{c.email} • {c.phone}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                            {new Date(c.createdAt).toLocaleDateString()}
                                                        </span>
                                                        <button
                                                            onClick={() => handleToggleRead(c.id, c.isRead)}
                                                            className={`text-[10px] font-black uppercase tracking-tight py-1.5 px-3 rounded-lg transition-all ${c.isRead
                                                                ? 'text-gray-400 border border-gray-200 hover:bg-gray-50'
                                                                : 'text-blue-600 border border-blue-200 hover:bg-blue-50'
                                                                }`}
                                                        >
                                                            {c.isRead ? 'Marcar como pendiente' : 'Marcar como leído'}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className={`rounded-xl p-4 text-sm leading-relaxed italic ${c.isRead ? 'bg-gray-50 text-gray-600' : 'bg-blue-50/50 text-gray-800 border border-blue-50'}`}>
                                                    "{c.description}"
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'products' && (
                                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-gray-50 border-b border-gray-100">
                                                <tr>
                                                    <th className="px-6 py-4 font-bold text-gray-600">Producto</th>
                                                    <th className="px-6 py-4 font-bold text-gray-600">Marca/Cat</th>
                                                    <th className="px-6 py-4 font-bold text-gray-600">Precio</th>
                                                    <th className="px-6 py-4 font-bold text-gray-600 text-right">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {products?.map((p) => (
                                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="font-bold text-gray-900">{p.name}</div>
                                                            <div className="text-xs text-gray-500 font-mono mt-0.5">{p.sku}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-gray-700">{p.brand.name}</div>
                                                            <div className="text-xs text-gray-400">{p.category.name}</div>
                                                        </td>
                                                        <td className="px-6 py-4 font-bold text-blue-600">
                                                            ${p.priceMxn.toLocaleString()} <span className="text-[10px] text-gray-400">MXN</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                    <div className="relative">
                                                                        <input
                                                                            type="file"
                                                                            className="hidden"
                                                                            id={`upload-product-${p.id}`}
                                                                            accept="image/*"
                                                                            onChange={(e) => handleImageUpload(p.id, 'product', e)}
                                                                        />
                                                                        <button
                                                                            onClick={() => document.getElementById(`upload-product-${p.id}`)?.click()}
                                                                            className="text-emerald-600 font-bold hover:underline px-2 flex items-center gap-1"
                                                                        >
                                                                            <span>📷</span> Subir
                                                                        </button>
                                                                    </div>
                                                                    <button onClick={() => openEdit('product', p)} className="text-blue-600 font-bold hover:underline px-2">Editar</button>
                                                                    <button onClick={() => handleDelete('products', p.id)} className="text-red-500 font-bold hover:underline px-2">Borrar</button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {activeTab === 'brands' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {brands?.map((b) => (
                                            <div key={b.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center group">
                                                <span className="font-bold text-gray-900">{b.name}</span>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            id={`upload-brand-${b.id}`}
                                                            accept="image/*"
                                                            onChange={(e) => handleImageUpload(b.id, 'brand', e)}
                                                        />
                                                        <button
                                                            onClick={() => document.getElementById(`upload-brand-${b.id}`)?.click()}
                                                            className="text-xs font-bold text-emerald-600 hover:underline"
                                                        >
                                                            Subir Logo
                                                        </button>
                                                    </div>
                                                    <button onClick={() => openEdit('brand', b)} className="text-xs font-bold text-blue-600 hover:underline">Editar</button>
                                                    <button onClick={() => handleDelete('brands', b.id)} className="text-xs font-bold text-red-500 hover:underline">Borrar</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'categories' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {categories?.map((c) => (
                                            <div key={c.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                                                <div>
                                                    <span className="font-bold text-gray-900">{c.name}</span>
                                                    {c.parentId && <span className="ml-2 text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Sub</span>}
                                                </div>
                                                <div className="flex gap-3">
                                                    <button onClick={() => openEdit('category', c)} className="text-xs font-bold text-blue-600 hover:underline">Editar</button>
                                                    <button onClick={() => handleDelete('categories', c.id)} className="text-xs font-bold text-red-500 hover:underline">Borrar</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'admins' && (
                                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-gray-50 border-b border-gray-100">
                                                <tr>
                                                    <th className="px-6 py-4 font-bold text-gray-600">Nombre</th>
                                                    <th className="px-6 py-4 font-bold text-gray-600">Email</th>
                                                    <th className="px-6 py-4 font-bold text-gray-600">Fecha Registro</th>
                                                    <th className="px-6 py-4 font-bold text-gray-600 text-right">Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {admins?.map((admin) => (
                                                    <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-gray-900">{admin.name}</td>
                                                        <td className="px-6 py-4 text-gray-500">{admin.email}</td>
                                                        <td className="px-6 py-4 text-gray-400">
                                                            {new Date(admin.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${admin.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                                {admin.isActive ? 'Activo' : 'Inactivo'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Modals */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 transform transition-all">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-gray-900">
                                {selectedItem ? 'Editar' : 'Crear'} {showModal === 'product' ? 'Producto' : showModal === 'brand' ? 'Marca' : 'Categoría'}
                            </h3>
                            <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-gray-900 text-2xl">×</button>
                        </div>

                        {showModal === 'brand' && (
                            <BrandForm brand={selectedItem} onSuccess={handleSuccess} onCancel={() => setShowModal(null)} />
                        )}
                        {showModal === 'category' && (
                            <CategoryForm category={selectedItem} categories={categories} onSuccess={handleSuccess} onCancel={() => setShowModal(null)} />
                        )}
                        {showModal === 'product' && (
                            <ProductForm product={selectedItem} brands={brands} categories={categories} onSuccess={handleSuccess} onCancel={() => setShowModal(null)} />
                        )}
                        {showModal === 'admin' && (
                            <AdminForm onSuccess={handleSuccess} onCancel={() => setShowModal(null)} />
                        )}
                    </div>
                </div>
            )}

            <footer className="p-6 text-center text-gray-400 text-xs font-medium bg-white border-t border-gray-100">
                &copy; 2026 Direcsa Solutions - Panel Administrativo de Alto Rendimiento
            </footer>
        </div>
    );
}
