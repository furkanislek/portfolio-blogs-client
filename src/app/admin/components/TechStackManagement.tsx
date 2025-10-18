'use client';

import React, { useState, useEffect } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    Search,
    Code,
    Tag
} from 'lucide-react';
import { adminApi, handleApiError } from '../services/adminApi';

interface TechStack {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export default function TechStackManagement() {
    const [techStacks, setTechStacks] = useState<TechStack[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingTechStack, setEditingTechStack] = useState<TechStack | null>(null);
    const [formData, setFormData] = useState({
        name: '',
    });

    useEffect(() => {
        fetchTechStacks();
    }, []);

    const fetchTechStacks = async () => {
        try {
            const response = await adminApi.techStack.getAll();
            setTechStacks(response.data);
        } catch (error) {
            console.error('Error fetching tech stacks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingTechStack) {
                await adminApi.techStack.update(editingTechStack._id, formData);
            } else {
                await adminApi.techStack.create(formData);
            }

            fetchTechStacks();
            setShowModal(false);
            setEditingTechStack(null);
            resetForm();
        } catch (error) {
            console.error('Error saving tech stack:', error);
        }
    };

    const handleEdit = (techStack: TechStack) => {
        setEditingTechStack(techStack);
        setFormData({
            name: techStack.name,
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bu teknolojiyi silmek istediğinizden emin misiniz?')) {
            try {
                await adminApi.techStack.delete(id);
                fetchTechStacks();
            } catch (error) {
                console.error('Error deleting tech stack:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
        });
    };

    const filteredTechStacks = techStacks.filter(techStack =>
        (techStack.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
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
                    <h1 className="text-2xl font-bold text-gray-900">Teknoloji Yönetimi</h1>
                    <p className="text-gray-600">Kullandığınız teknolojileri yönetin</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Teknoloji
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Teknoloji ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Tech Stack Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTechStacks.map((techStack) => (
                    <div key={techStack._id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Code className="h-5 w-5 text-blue-600 mr-2" />
                                <span className="text-sm font-medium text-gray-900">{techStack.name}</span>
                            </div>
                            <div className="flex space-x-1">
                                <button
                                    onClick={() => handleEdit(techStack)}
                                    className="text-blue-600 hover:text-blue-900 p-1"
                                >
                                    <Edit className="h-3 w-3" />
                                </button>
                                <button
                                    onClick={() => handleDelete(techStack._id)}
                                    className="text-red-600 hover:text-red-900 p-1"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredTechStacks.length === 0 && (
                <div className="text-center py-12">
                    <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Teknoloji bulunamadı</h3>
                    <p className="text-gray-600 mb-4">
                        {searchTerm ? 'Arama kriterlerinize uygun teknoloji bulunamadı.' : 'Henüz hiç teknoloji eklenmemiş.'}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center mx-auto"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            İlk Teknolojiyi Ekle
                        </button>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {editingTechStack ? 'Teknoloji Düzenle' : 'Yeni Teknoloji'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Teknoloji Adı
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Örn: React, Node.js, Python..."
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingTechStack(null);
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
                                    {editingTechStack ? 'Güncelle' : 'Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
