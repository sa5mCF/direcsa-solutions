'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface LoginFormProps {
    title?: string;
    subtitle?: string;
    defaultRedirect?: string;
}

export function LoginForm({
    title = 'Bienvenido de nuevo',
    subtitle = 'Gestiona tus proyectos con Direcsa',
    defaultRedirect = '/dashboard'
}: LoginFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'login', ...form }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');

            // 1. Priority: URL parameter
            const redirectParam = searchParams.get('redirect');
            if (redirectParam) {
                router.push(redirectParam);
                return;
            }

            // 2. Secondary: Role-based smart redirect
            if (data.user.role === 'ADMIN') {
                router.push('/control-center');
                return;
            }

            // 3. Fallback: Default for the context
            router.push(defaultRedirect);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-10">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-blue-100">
                    <span className="text-white font-bold text-2xl">D</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                <p className="text-gray-500 text-sm font-medium">{subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Correo electrónico</label>
                    <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-gray-400 font-medium"
                        placeholder="ejemplo@direcsa.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Contraseña</label>
                    <input
                        type="password"
                        required
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-gray-400 font-medium"
                        placeholder="••••••••"
                    />
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3.5 rounded-xl text-center font-bold">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    <span className="flex items-center justify-center gap-2">
                        {loading ? 'Verificando...' : 'Acceder ahora'}
                        {!loading && <span className="group-hover:translate-x-1 transition-transform">→</span>}
                    </span>
                </button>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500 mb-2">¿Problemas para entrar?</p>
                <a href="/register" className="text-blue-600 font-bold hover:underline">
                    Crear una cuenta nueva
                </a>
            </div>
        </div>
    );
}
