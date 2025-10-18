'use client';

import React, { useState } from 'react';
import { adminApi } from '@/app/admin/services/adminApi';
import { saveAuthToken, isAuthenticated } from '@/app/admin/services/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        if (isAuthenticated()) {
            router.replace('/admin');
        }
    }, [router]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const { data } = await adminApi.users.login({ username, password });
            if (data?.token) {
                saveAuthToken(data.token);
                router.replace('/admin');
            } else {
                setError('Geçersiz yanıt');
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Giriş başarısız');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
                <h1 className="text-xl font-semibold mb-4">Admin Giriş</h1>
                {error && (
                    <div className="mb-3 text-sm text-red-600">
                        {error}
                    </div>
                )}
                <label className="block text-sm mb-1">Kullanıcı Adı</label>
                <input
                    className="w-full border rounded px-3 py-2 mb-3"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                />
                <label className="block text-sm mb-1">Şifre</label>
                <input
                    type="password"
                    className="w-full border rounded px-3 py-2 mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
                >
                    {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                </button>
            </form>
        </div>
    );
}


