'use client';

import React, { useState, useEffect } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    Search,
    Briefcase,
    Calendar,
    MapPin,
    Plus as PlusIcon,
    X
} from 'lucide-react';
import { adminApi, handleApiError } from '../services/adminApi';

interface Experience {
    _id: string;
    title: string;
    trTitle: string;
    time?: string;
    trTime?: string;
    company: string;
    trCompany: string;
    details: string[];
    trDetails: string[];
    createdAt: string;
    updatedAt: string;
}

export default function ExperienceManagement() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        trTitle: '',
        time: '',
        trTime: '',
        company: '',
        trCompany: '',
        details: [] as string[],
        trDetails: [] as string[],
    });
    const [newDetail, setNewDetail] = useState('');
    const [newTrDetail, setNewTrDetail] = useState('');

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const response = await adminApi.experience.getAll();
            setExperiences(response.data);
        } catch (error) {
            console.error('Error fetching experiences:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingExperience) {
                await adminApi.experience.update(editingExperience._id, formData);
            } else {
                await adminApi.experience.create(formData);
            }

            fetchExperiences();
            setShowModal(false);
            setEditingExperience(null);
            resetForm();
        } catch (error) {
            console.error('Error saving experience:', error);
        }
    };

    const handleEdit = (experience: Experience) => {
        setEditingExperience(experience);
        setFormData({
            title: experience.title || '',
            trTitle: experience.trTitle || '',
            time: experience.time || '',
            trTime: experience.trTime || '',
            company: experience.company || '',
            trCompany: experience.trCompany || '',
            details: experience.details || [],
            trDetails: experience.trDetails || [],
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bu deneyimi silmek istediğinizden emin misiniz?')) {
            try {
                await adminApi.experience.delete(id);
                fetchExperiences();
            } catch (error) {
                console.error('Error deleting experience:', error);
            }
        }
    };

    const addDetail = (type: 'details' | 'trDetails') => {
        const detailValue = type === 'details' ? newDetail : newTrDetail;
        if (detailValue.trim()) {
            setFormData({
                ...formData,
                [type]: [...formData[type], detailValue.trim()]
            });
            if (type === 'details') {
                setNewDetail('');
            } else {
                setNewTrDetail('');
            }
        }
    };

    const removeDetail = (type: 'details' | 'trDetails', index: number) => {
        setFormData({
            ...formData,
            [type]: formData[type].filter((_, i) => i !== index)
        });
    };

    const resetForm = () => {
        setFormData({
            title: '',
            trTitle: '',
            time: '',
            trTime: '',
            company: '',
            trCompany: '',
            details: [],
            trDetails: [],
        });
        setNewDetail('');
        setNewTrDetail('');
    };

    const filteredExperiences = experiences.filter(experience =>
        (experience.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (experience.trTitle?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (experience.company?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (experience.trCompany?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
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
                    <h1 className="text-2xl font-bold text-gray-900">Deneyim Yönetimi</h1>
                    <p className="text-gray-600">İş deneyimlerinizi yönetin</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Deneyim
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Deneyim ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Experience Cards */}
            <div className="space-y-6">
                {filteredExperiences.map((experience) => (
                    <div key={experience._id} className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                                <Briefcase className="h-8 w-8 text-blue-600 mr-3" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{experience.title || 'Başlık yok'}</h3>
                                    <p className="text-sm text-gray-600">{experience.trTitle || 'TR Başlık yok'}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(experience)}
                                    className="text-blue-600 hover:text-blue-900"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(experience._id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <span className="font-medium">Şirket:</span>
                                <span className="ml-2">{experience.company || 'Şirket yok'}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <span className="font-medium">TR Şirket:</span>
                                <span className="ml-2">{experience.trCompany || 'TR Şirket yok'}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{experience.time || 'Tarih yok'}</span>
                            </div>
                            {experience.trTime && (
                                <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>TR: {experience.trTime}</span>
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="border-t pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* EN Details */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-3">Detaylar (EN)</h4>
                                    <div className="space-y-2">
                                        {experience.details?.map((detail, index) => (
                                            <div key={index} className="bg-gray-50 p-2 rounded">
                                                <span className="text-sm text-gray-700">{detail}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* TR Details */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-3">Detaylar (TR)</h4>
                                    <div className="space-y-2">
                                        {experience.trDetails?.map((detail, index) => (
                                            <div key={index} className="bg-gray-50 p-2 rounded">
                                                <span className="text-sm text-gray-700">{detail}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingExperience ? 'Deneyim Düzenle' : 'Yeni Deneyim'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingExperience(null);
                                    resetForm();
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Başlık (EN) *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Örn: Full Stack Developer"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Başlık (TR) *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.trTitle}
                                        onChange={(e) => setFormData({ ...formData, trTitle: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Örn: Full Stack Geliştirici"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Şirket (EN) *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Örn: Tech Company"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Şirket (TR) *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.trCompany}
                                        onChange={(e) => setFormData({ ...formData, trCompany: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Örn: Teknoloji Şirketi"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Zaman (EN)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Örn: 2020-2024"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Zaman (TR)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.trTime}
                                        onChange={(e) => setFormData({ ...formData, trTime: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Örn: 2020-2024"
                                    />
                                </div>
                            </div>
                            {/* Details Section */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-gray-900">Detaylar</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* EN Details */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Detaylar (EN) *
                                        </label>
                                        <div className="space-y-2">
                                            {formData.details.map((detail, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <span className="flex-1 bg-gray-50 p-2 rounded text-sm">{detail}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeDetail('details', index)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            <div className="flex space-x-2">
                                                <input
                                                    type="text"
                                                    value={newDetail}
                                                    onChange={(e) => setNewDetail(e.target.value)}
                                                    placeholder="Yeni detay ekle..."
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => addDetail('details')}
                                                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                                                >
                                                    <PlusIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TR Details */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Detaylar (TR) *
                                        </label>
                                        <div className="space-y-2">
                                            {formData.trDetails.map((detail, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <span className="flex-1 bg-gray-50 p-2 rounded text-sm">{detail}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeDetail('trDetails', index)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            <div className="flex space-x-2">
                                                <input
                                                    type="text"
                                                    value={newTrDetail}
                                                    onChange={(e) => setNewTrDetail(e.target.value)}
                                                    placeholder="Yeni TR detay ekle..."
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => addDetail('trDetails')}
                                                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                                                >
                                                    <PlusIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingExperience(null);
                                        resetForm();
                                    }}
                                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                >
                                    {editingExperience ? (
                                        <>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Güncelle
                                        </>
                                    ) : (
                                        <>
                                            <PlusIcon className="h-4 w-4 mr-2" />
                                            Kaydet
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
