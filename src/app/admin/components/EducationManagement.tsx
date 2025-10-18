'use client';

import React, { useState, useEffect } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    Search,
    GraduationCap,
    Calendar,
    MapPin
} from 'lucide-react';
import { adminApi, handleApiError } from '../services/adminApi';

interface Education {
    _id: string;
    title: string;
    trTitle: string;
    description?: string;
    trDescription: string;
    company: string;
    trCompany: string;
    time: string;
    createdAt: string;
}

export default function EducationManagement() {
    const [educations, setEducations] = useState<Education[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingEducation, setEditingEducation] = useState<Education | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        trTitle: '',
        description: '',
        trDescription: '',
        company: '',
        trCompany: '',
        time: '',
    });

    useEffect(() => {
        fetchEducations();
    }, []);

    const fetchEducations = async () => {
        try {
            const response = await adminApi.education.getAll();
            setEducations(response.data);
        } catch (error) {
            console.error('Error fetching educations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingEducation) {
                await adminApi.education.update(editingEducation._id, formData);
            } else {
                await adminApi.education.create(formData);
            }

            fetchEducations();
            setShowModal(false);
            setEditingEducation(null);
            resetForm();
        } catch (error) {
            console.error('Error saving education:', error);
        }
    };

    const handleEdit = (education: Education) => {
        setEditingEducation(education);
        setFormData({
            title: education.title || '',
            trTitle: education.trTitle || '',
            description: education.description || '',
            trDescription: education.trDescription || '',
            company: education.company || '',
            trCompany: education.trCompany || '',
            time: education.time || '',
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bu eğitim bilgisini silmek istediğinizden emin misiniz?')) {
            try {
                await adminApi.education.delete(id);
                fetchEducations();
            } catch (error) {
                console.error('Error deleting education:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            trTitle: '',
            description: '',
            trDescription: '',
            company: '',
            trCompany: '',
            time: '',
        });
    };

    const filteredEducations = educations.filter(education =>
        (education.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (education.trTitle?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (education.company?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (education.trCompany?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
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
                    <h1 className="text-2xl font-bold text-gray-900">Eğitim Yönetimi</h1>
                    <p className="text-gray-600">Eğitim bilgilerinizi yönetin</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Eğitim
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Eğitim ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Education Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEducations.map((education) => (
                    <div key={education._id} className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                                <GraduationCap className="h-8 w-8 text-blue-600 mr-3" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{education.title || 'Başlık yok'}</h3>
                                    <p className="text-sm text-gray-600">{education.trTitle || 'TR Başlık yok'}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(education)}
                                    className="text-blue-600 hover:text-blue-900"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(education._id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <span className="font-medium">Şirket:</span>
                                <span className="ml-2">{education.company || 'Şirket yok'}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <span className="font-medium">TR Şirket:</span>
                                <span className="ml-2">{education.trCompany || 'TR Şirket yok'}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{education.time || 'Tarih yok'}</span>
                            </div>
                        </div>

                        {education.description && (
                            <p className="text-sm text-gray-700 line-clamp-3">
                                {education.description}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {editingEducation ? 'Eğitim Düzenle' : 'Yeni Eğitim'}
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
                                        Şirket (EN)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Şirket (TR)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.trCompany}
                                        onChange={(e) => setFormData({ ...formData, trCompany: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Zaman
                                </label>
                                <input
                                    type="text"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Örn: 2020-2024, 2020-Devam ediyor"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Açıklama (EN)
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Açıklama (TR)
                                    </label>
                                    <textarea
                                        value={formData.trDescription}
                                        onChange={(e) => setFormData({ ...formData, trDescription: e.target.value })}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingEducation(null);
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
                                    {editingEducation ? 'Güncelle' : 'Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
