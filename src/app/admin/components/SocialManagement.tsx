'use client';

import React, { useState, useEffect } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    Search,
    Share2,
    ExternalLink,
    Image as ImageIcon
} from 'lucide-react';
import { adminApi, handleApiError } from '../services/adminApi';

interface Social {
    _id: string;
    img: string;
    href: string;
    title: string;
    address: string;
    createdAt: string;
    updatedAt: string;
}

export default function SocialManagement() {
    const [socials, setSocials] = useState<Social[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingSocial, setEditingSocial] = useState<Social | null>(null);
    const [formData, setFormData] = useState({
        img: '',
        href: '',
        title: '',
        address: '',
    });

    useEffect(() => {
        fetchSocials();
    }, []);

    const fetchSocials = async () => {
        try {
            const response = await adminApi.social.getAll();
            setSocials(response.data);
        } catch (error) {
            console.error('Error fetching socials:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingSocial) {
                await adminApi.social.update(editingSocial._id, formData);
            } else {
                await adminApi.social.create(formData);
            }

            fetchSocials();
            setShowModal(false);
            setEditingSocial(null);
            resetForm();
        } catch (error) {
            console.error('Error saving social:', error);
        }
    };

    const handleEdit = (social: Social) => {
        setEditingSocial(social);
        setFormData({
            img: social.img,
            href: social.href,
            title: social.title,
            address: social.address,
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bu sosyal medya linkini silmek istediğinizden emin misiniz?')) {
            try {
                await adminApi.social.delete(id);
                fetchSocials();
            } catch (error) {
                console.error('Error deleting social:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            img: '',
            href: '',
            title: '',
            address: '',
        });
    };

    const filteredSocials = socials.filter(social =>
        (social.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (social.address?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
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
                    <h1 className="text-2xl font-bold text-gray-900">Sosyal Medya Yönetimi</h1>
                    <p className="text-gray-600">Sosyal medya linklerinizi yönetin</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Link
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Sosyal medya ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Social Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSocials.map((social) => (
                    <div key={social._id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                    {social.img ? (
                                        <img
                                            src={social.img}
                                            alt={social.title}
                                            className="w-8 h-8 object-contain"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                                if (nextElement) {
                                                    nextElement.style.display = 'block';
                                                }
                                            }}
                                        />
                                    ) : null}
                                    <ImageIcon className="h-5 w-5 text-gray-400" style={{ display: social.img ? 'none' : 'block' }} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{social.title}</h3>
                                    <p className="text-sm text-gray-600">{social.address}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(social)}
                                    className="text-blue-600 hover:text-blue-900"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(social._id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                                <Share2 className="h-4 w-4 mr-2" />
                                <span className="truncate">{social.href}</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <a
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                            >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Linki Aç
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredSocials.length === 0 && (
                <div className="text-center py-12">
                    <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Sosyal medya linki bulunamadı</h3>
                    <p className="text-gray-600 mb-4">
                        {searchTerm ? 'Arama kriterlerinize uygun link bulunamadı.' : 'Henüz hiç sosyal medya linki eklenmemiş.'}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center mx-auto"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            İlk Linki Ekle
                        </button>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {editingSocial ? 'Sosyal Medya Düzenle' : 'Yeni Sosyal Medya'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Platform Adı
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Örn: GitHub, LinkedIn, Twitter..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Link
                                </label>
                                <input
                                    type="url"
                                    value={formData.href}
                                    onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Adres/Kullanıcı Adı
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Örn: @username, github.com/username..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    İkon URL (İsteğe bağlı)
                                </label>
                                <input
                                    type="url"
                                    value={formData.img}
                                    onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://example.com/icon.png"
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingSocial(null);
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
                                    {editingSocial ? 'Güncelle' : 'Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}