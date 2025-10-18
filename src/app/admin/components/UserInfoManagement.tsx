'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    Search,
    User,
    Upload,
    Image as ImageIcon,
    X
} from 'lucide-react';
import { adminApi, handleApiError } from '../services/adminApi';

interface UserInfo {
    _id: string;
    avatar?: string;
    mainTitle?: string;
    description?: string;
    trDescription?: string;
}

export default function UserInfoManagement() {
    const [userInfos, setUserInfos] = useState<UserInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUserInfo, setEditingUserInfo] = useState<UserInfo | null>(null);
    const [previewImage, setPreviewImage] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        avatar: '',
        mainTitle: '',
        description: '',
        trDescription: '',
    });

    useEffect(() => {
        fetchUserInfos();
    }, []);

    const fetchUserInfos = async () => {
        try {
            const response = await adminApi.userInfo.getAll();
            setUserInfos(response.data);
        } catch (error) {
            console.error('Error fetching user infos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                avatar: formData.avatar || undefined,
            };

            if (editingUserInfo) {
                await adminApi.userInfo.update(editingUserInfo._id, data);
            } else {
                await adminApi.userInfo.create(data);
            }

            fetchUserInfos();
            setShowModal(false);
            setEditingUserInfo(null);
            resetForm();
        } catch (error) {
            console.error('Error saving user info:', error);
        }
    };

    const handleEdit = (userInfo: UserInfo) => {
        setEditingUserInfo(userInfo);
        setFormData({
            avatar: userInfo.avatar || '',
            mainTitle: userInfo.mainTitle || '',
            description: userInfo.description || '',
            trDescription: userInfo.trDescription || '',
        });
        setPreviewImage(userInfo.avatar || '');
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bu kullanıcı bilgisini silmek istediğinizden emin misiniz?')) {
            try {
                await adminApi.userInfo.delete(id);
                fetchUserInfos();
            } catch (error) {
                console.error('Error deleting user info:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            avatar: '',
            mainTitle: '',
            description: '',
            trDescription: '',
        });
        setPreviewImage('');
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setPreviewImage(result);
                setFormData({ ...formData, avatar: result });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setPreviewImage('');
        setFormData({ ...formData, avatar: '' });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const filteredUserInfos = userInfos.filter(userInfo =>
        (userInfo.mainTitle?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (userInfo.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (userInfo.trDescription?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
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
                    <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Bilgisi Yönetimi</h1>
                    <p className="text-gray-600">Kişisel bilgilerinizi yönetin</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Bilgi
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Kullanıcı bilgisi ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* User Info Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Avatar
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ana Başlık
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Açıklama (EN)
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Açıklama (TR)
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUserInfos.map((userInfo) => (
                                <tr key={userInfo._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                                {userInfo.avatar ? (
                                                    <img
                                                        src={userInfo.avatar}
                                                        alt="Avatar"
                                                        className="w-12 h-12 object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                                            if (nextElement) {
                                                                nextElement.style.display = 'flex';
                                                            }
                                                        }}
                                                    />
                                                ) : null}
                                                <User className="h-6 w-6 text-gray-400" style={{ display: userInfo.avatar ? 'none' : 'flex' }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {userInfo.mainTitle || 'Başlık yok'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 max-w-xs truncate">
                                            {userInfo.description || 'Açıklama yok'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 max-w-xs truncate">
                                            {userInfo.trDescription || 'TR Açıklama yok'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => handleEdit(userInfo)}
                                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                title="Düzenle"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(userInfo._id)}
                                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                title="Sil"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty State */}
            {filteredUserInfos.length === 0 && (
                <div className="text-center py-12">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Kullanıcı bilgisi bulunamadı</h3>
                    <p className="text-gray-600 mb-4">
                        {searchTerm ? 'Arama kriterlerinize uygun bilgi bulunamadı.' : 'Henüz hiç kullanıcı bilgisi eklenmemiş.'}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center mx-auto"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            İlk Bilgiyi Ekle
                        </button>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingUserInfo ? 'Kullanıcı Bilgisi Düzenle' : 'Yeni Kullanıcı Bilgisi'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingUserInfo(null);
                                    resetForm();
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Avatar Upload Section */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Avatar
                                </label>
                                <div className="flex items-center space-x-4">
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                                        {previewImage ? (
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <ImageIcon className="h-8 w-8 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        <div className="space-y-2">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                                            >
                                                <Upload className="h-4 w-4 mr-2" />
                                                Fotoğraf Yükle
                                            </button>
                                            {previewImage && (
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
                                                >
                                                    <X className="h-4 w-4 mr-2" />
                                                    Fotoğrafı Kaldır
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            JPG, PNG veya GIF formatında, maksimum 5MB
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ana Başlık *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.mainTitle}
                                        onChange={(e) => setFormData({ ...formData, mainTitle: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Örn: Full Stack Developer"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Avatar URL (Alternatif)
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.avatar}
                                        onChange={(e) => {
                                            setFormData({ ...formData, avatar: e.target.value });
                                            setPreviewImage(e.target.value);
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://example.com/avatar.jpg"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Açıklama (EN)
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={6}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        placeholder="İngilizce açıklama..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Açıklama (TR) *
                                    </label>
                                    <textarea
                                        value={formData.trDescription}
                                        onChange={(e) => setFormData({ ...formData, trDescription: e.target.value })}
                                        rows={6}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        placeholder="Türkçe açıklama..."
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingUserInfo(null);
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
                                    {editingUserInfo ? (
                                        <>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Güncelle
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4 mr-2" />
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
