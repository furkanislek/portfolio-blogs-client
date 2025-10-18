'use client';

import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    FolderOpen,
    GraduationCap,
    Briefcase,
    Code,
    Share2,
    User,
    TrendingUp,
    Activity
} from 'lucide-react';
import { adminApi } from '../services/adminApi';

interface DashboardStats {
    blogs: number;
    projects: number;
    education: number;
    experience: number;
    techStack: number;
    social: number;
    userInfo: number;
}

function Dashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        blogs: 0,
        projects: 0,
        education: 0,
        experience: 0,
        techStack: 0,
        social: 0,
        userInfo: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [
                    blogsRes,
                    projectsRes,
                    educationRes,
                    experienceRes,
                    techStackRes,
                    socialRes,
                    userInfoRes
                ] = await Promise.all([
                    adminApi.blogs.getAll(),
                    adminApi.projects.getAll(),
                    adminApi.education.getAll(),
                    adminApi.experience.getAll(),
                    adminApi.techStack.getAll(),
                    adminApi.social.getAll(),
                    adminApi.userInfo.getAll()
                ]);

                setStats({
                    blogs: blogsRes.data.length,
                    projects: projectsRes.data.length,
                    education: educationRes.data.length,
                    experience: experienceRes.data.length,
                    techStack: techStackRes.data.length,
                    social: socialRes.data.length,
                    userInfo: userInfoRes.data.length,
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { title: 'Blogs', value: stats.blogs, icon: BookOpen, color: 'bg-blue-500' },
        { title: 'Projects', value: stats.projects, icon: FolderOpen, color: 'bg-green-500' },
        { title: 'Education', value: stats.education, icon: GraduationCap, color: 'bg-purple-500' },
        { title: 'Experience', value: stats.experience, icon: Briefcase, color: 'bg-orange-500' },
        { title: 'Tech Stack', value: stats.techStack, icon: Code, color: 'bg-red-500' },
        { title: 'Social Links', value: stats.social, icon: Share2, color: 'bg-pink-500' },
        { title: 'User Info', value: stats.userInfo, icon: User, color: 'bg-indigo-500' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600">Portfolio yönetim sistemi genel bakış</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className={`p-3 rounded-lg ${card.color}`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                    <Activity className="h-6 w-6 text-green-600 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">Hızlı İşlemler</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <h3 className="font-medium text-gray-900">Yeni Blog Yazısı</h3>
                        <p className="text-sm text-gray-600">Blog yazısı ekle</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <h3 className="font-medium text-gray-900">Yeni Proje</h3>
                        <p className="text-sm text-gray-600">Proje ekle</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <h3 className="font-medium text-gray-900">Eğitim Bilgisi</h3>
                        <p className="text-sm text-gray-600">Eğitim bilgisi ekle</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h2>
                <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                        Sistem başlatıldı
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        Dashboard yüklendi
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                        İstatistikler güncellendi
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
