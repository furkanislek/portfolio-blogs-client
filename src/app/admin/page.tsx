'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from './components/AdminLayout';
import Dashboard from './components/Dashboard';
import BlogsManagement from './components/BlogsManagement';
import ProjectsManagement from './components/ProjectsManagement';
import EducationManagement from './components/EducationManagement';
import ExperienceManagement from './components/ExperienceManagement';
import TechStackManagement from './components/TechStackManagement';
import SocialManagement from './components/SocialManagement';
import UserInfoManagement from './components/UserInfoManagement';
import { isAuthenticated } from '@/app/admin/services/auth';
import { useRouter } from 'next/navigation';

type AdminPage =
    | 'dashboard'
    | 'blogs'
    | 'projects'
    | 'education'
    | 'experience'
    | 'techstack'
    | 'social'
    | 'userinfo';

export default function AdminPage() {
    const [activePage, setActivePage] = useState<AdminPage>('dashboard');
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.replace('/admin/login');
        }
    }, [router]);

    const renderPage = () => {
        switch (activePage) {
            case 'dashboard':
                return <Dashboard />;
            case 'blogs':
                return <BlogsManagement />;
            case 'projects':
                return <ProjectsManagement />;
            case 'education':
                return <EducationManagement />;
            case 'experience':
                return <ExperienceManagement />;
            case 'techstack':
                return <TechStackManagement />;
            case 'social':
                return <SocialManagement />;
            case 'userinfo':
                return <UserInfoManagement />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <AdminLayout activePage={activePage} setActivePage={setActivePage}>
            {renderPage()}
        </AdminLayout>
    );
}
