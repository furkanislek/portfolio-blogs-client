'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearAuthToken } from '@/app/admin/services/auth';
import {
    LayoutDashboard,
    BookOpen,
    FolderOpen,
    GraduationCap,
    Briefcase,
    Code,
    Share2,
    User,
    Settings,
    Home
} from 'lucide-react';

type AdminPage =
    | 'dashboard'
    | 'blogs'
    | 'projects'
    | 'education'
    | 'experience'
    | 'techstack'
    | 'social'
    | 'userinfo';

interface AdminLayoutProps {
    children: React.ReactNode;
    activePage: AdminPage;
    setActivePage: (page: AdminPage) => void;
}

const menuItems = [
    { id: 'dashboard' as AdminPage, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'blogs' as AdminPage, label: 'Blogs', icon: BookOpen },
    { id: 'projects' as AdminPage, label: 'Projects', icon: FolderOpen },
    { id: 'education' as AdminPage, label: 'Education', icon: GraduationCap },
    { id: 'experience' as AdminPage, label: 'Experience', icon: Briefcase },
    { id: 'techstack' as AdminPage, label: 'Tech Stack', icon: Code },
    { id: 'social' as AdminPage, label: 'Social Links', icon: Share2 },
    { id: 'userinfo' as AdminPage, label: 'User Info', icon: User },
];

export default function AdminLayout({ children, activePage, setActivePage }: AdminLayoutProps) {
    const router = useRouter();

    const handleLogout = () => {
        clearAuthToken();
        router.replace('/admin/login');
    };
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <Settings className="h-8 w-8 text-blue-600" />
                            <h1 className="ml-2 text-2xl font-bold text-gray-900">Admin Panel</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/"
                                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <Home className="h-5 w-5 mr-2" />
                                <span className="text-sm">Ana Sayfa</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-red-600 hover:text-red-700"
                            >
                                Çıkış Yap
                            </button>
                            <div className="text-sm text-gray-500">
                                Portfolio Management System
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-sm min-h-screen">
                    <nav className="mt-8">
                        <div className="px-4 space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActivePage(item.id)}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activePage === item.id
                                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon className="h-5 w-5 mr-3" />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
