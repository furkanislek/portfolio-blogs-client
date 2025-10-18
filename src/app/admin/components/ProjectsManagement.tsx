'use client';

import React, { useState, useEffect } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    ExternalLink,
    Search,
    Star,
    Code
} from 'lucide-react';
import { adminApi, handleApiError } from '../services/adminApi';

interface Project {
    _id: string;
    title: string;
    description: string;
    trTitle: string;
    trDescription: string;
    href: string;
    liveHref: string;
    imgSrc: string;
    type: string;
    point: number;
    createdAt: string;
    updatedAt: string;
}

export default function ProjectsManagement() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        trTitle: '',
        trDescription: '',
        href: '',
        liveHref: '',
        imgSrc: '',
        type: '',
        point: 0,
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await adminApi.projects.getAll();
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                point: Number(formData.point),
            };

            if (editingProject) {
                await adminApi.projects.update(editingProject._id, data);
            } else {
                await adminApi.projects.create(data);
            }

            fetchProjects();
            setShowModal(false);
            setEditingProject(null);
            resetForm();
        } catch (error) {
            console.error('Error saving project:', error);
        }
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            description: project.description,
            trTitle: project.trTitle,
            trDescription: project.trDescription,
            href: project.href,
            liveHref: project.liveHref || '',
            imgSrc: project.imgSrc,
            type: project.type,
            point: project.point,
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
            try {
                await adminApi.projects.delete(id);
                fetchProjects();
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            trTitle: '',
            trDescription: '',
            href: '',
            liveHref: '',
            imgSrc: '',
            type: '',
            point: 0,
        });
    };

    const filteredProjects = projects.filter(project =>
        (project.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (project.type?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    );

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
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Proje Yönetimi</h1>
                    <p className="text-gray-600">Projelerinizi yönetin</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Proje
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Proje ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                    <div key={project._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="aspect-w-16 aspect-h-9">
                            <img
                                src={project.imgSrc}
                                alt={project.title}
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = '/placeholder-image.png';
                                }}
                            />
                        </div>
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                                <div className="flex items-center text-yellow-500">
                                    <Star className="h-4 w-4" />
                                    <span className="ml-1 text-sm font-medium">{project.point}</span>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {project.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {project.type}
                                </span>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(project)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-3 flex space-x-2">
                                {project.href && (
                                    <a
                                        href={project.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                    >
                                        <Code className="h-3 w-3 mr-1" />
                                        Kod
                                    </a>
                                )}
                                {project.liveHref && (
                                    <a
                                        href={project.liveHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 hover:text-green-800 text-sm flex items-center"
                                    >
                                        <ExternalLink className="h-3 w-3 mr-1" />
                                        Canlı
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {editingProject ? 'Proje Düzenle' : 'Yeni Proje'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Başlık (EN)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Başlık (TR)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.trTitle}
                                        onChange={(e) => setFormData({ ...formData, trTitle: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Açıklama (EN)
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Açıklama (TR)
                                    </label>
                                    <textarea
                                        value={formData.trDescription}
                                        onChange={(e) => setFormData({ ...formData, trDescription: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        GitHub Linki
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.href}
                                        onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Canlı Demo Linki
                                    </label>
                                    <input
                                        type="url"
                                        required={false}
                                        value={formData.liveHref}
                                        onChange={(e) => setFormData({ ...formData, liveHref: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Resim URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.imgSrc}
                                        onChange={(e) => setFormData({ ...formData, imgSrc: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tip
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Tip seçin</option>
                                        <option value="web">Web</option>
                                        <option value="mobile">Mobile</option>
                                        <option value="desktop">Desktop</option>
                                        <option value="other">Diğer</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Puan (1-100)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={formData.point}
                                    onChange={(e) => setFormData({ ...formData, point: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingProject(null);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    {editingProject ? 'Güncelle' : 'Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
