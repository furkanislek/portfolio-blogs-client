'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    Eye,
    X,
    Calendar,
    User,
    Tag,
    CheckCircle
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import HTMLEditor from '../components/HTMLEditor';
import ImageUpload from '../components/ImageUpload';

interface Blog {
    _id: string;
    img: string;
    title: string;
    trTitle: string;
    description: string;
    trDescription: string;
    summary: string;
    trSummary: string;
    type: string;
    createdAt: string;
    updatedAt?: string;
    // Yeni alanlar
    author?: string;
    tags?: string[];
    published?: boolean;
}

export default function BlogEditPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const blogId = searchParams.get('id');
    const isEdit = !!blogId;

    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const [formData, setFormData] = useState({
        img: '',
        title: '',
        trTitle: '',
        description: '',
        trDescription: '',
        summary: '',
        trSummary: '',
        type: '',
        author: '',
        tags: '',
        published: false,
    });

    const [activeLanguage, setActiveLanguage] = useState<'en' | 'tr'>('en');

    useEffect(() => {
        if (isEdit && blogId) {
            fetchBlog();
        } else {
            setLoading(false);
        }
    }, [isEdit, blogId]);

    const fetchBlog = async () => {
        try {
            const response = await adminApi.blogs.getById(blogId!);
            const blogData = response.data;
            setBlog(blogData);

            // Base64 decode function
            const decodeBase64 = (base64String: string) => {
                if (!base64String) return '';

                try {
                    // Try to decode as base64 first
                    const decoded = Buffer.from(base64String, 'base64').toString('utf-8');
                    return decoded;
                } catch (error) {
                    // If not base64, return as is
                    return base64String;
                }
            };

            setFormData({
                img: blogData.img || '',
                title: blogData.title || '',
                trTitle: blogData.trTitle || '',
                description: decodeBase64(blogData.description || ''),
                trDescription: decodeBase64(blogData.trDescription || ''),
                summary: blogData.summary || '',
                trSummary: blogData.trSummary || '',
                type: blogData.type || '',
                author: blogData.author || '',
                tags: blogData.tags?.join(', ') || '',
                published: blogData.published || false,
            });
        } catch (error) {
            console.error('Error fetching blog:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const submitData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            };

            if (isEdit) {
                await adminApi.blogs.update(blogId!, submitData);
            } else {
                await adminApi.blogs.create(submitData);
            }

            router.push('/admin?page=blogs');
        } catch (error) {
            console.error('Error saving blog:', error);
            alert('Blog kaydedilirken hata oluştu!');
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        if (window.confirm('Bu blog yazısını yayınlamak istediğinizden emin misiniz?')) {
            setSaving(true);
            try {
                const submitData = {
                    ...formData,
                    published: true,
                    tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                };

                if (isEdit) {
                    await adminApi.blogs.update(blogId!, submitData);
                } else {
                    await adminApi.blogs.create(submitData);
                }

                router.push('/admin?page=blogs');
            } catch (error) {
                console.error('Error publishing blog:', error);
                alert('Blog yayınlanırken hata oluştu!');
            } finally {
                setSaving(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center">
                            <button
                                onClick={() => router.push('/admin?page=blogs')}
                                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                <span className="text-sm">Geri Dön</span>
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {isEdit ? 'Blog Düzenle' : 'Yeni Blog'}
                                </h1>
                                <p className="text-sm text-gray-600">
                                    {isEdit ? 'Blog yazınızı düzenleyin' : 'Yeni blog yazısı oluşturun'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setActiveLanguage('en')}
                                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${activeLanguage === 'en'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    EN
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveLanguage('tr')}
                                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${activeLanguage === 'tr'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    TR
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowPreview(!showPreview)}
                                className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                {showPreview ? 'Düzenle' : 'Önizleme'}
                            </button>

                            <button
                                type="button"
                                onClick={handlePublish}
                                disabled={saving}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Yayınla
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <ImageUpload
                                    onImageUpload={(url) => setFormData({ ...formData, img: url })}
                                    currentImage={formData.img}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tür *
                                </label>
                                <input
                                    type="text"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Blog türü (örn: Teknoloji)"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Başlık (EN) *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="English title..."
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
                                    placeholder="Türkçe başlık..."
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Özet (EN) *
                                </label>
                                <textarea
                                    value={formData.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="English summary..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Özet (TR) *
                                </label>
                                <textarea
                                    value={formData.trSummary}
                                    onChange={(e) => setFormData({ ...formData, trSummary: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Türkçe özet..."
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Açıklama (HTML Editör)</h3>
                            <div className="flex items-center space-x-2 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setActiveLanguage('en')}
                                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${activeLanguage === 'en'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    EN
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveLanguage('tr')}
                                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${activeLanguage === 'tr'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    TR
                                </button>
                            </div>

                            <HTMLEditor
                                value={activeLanguage === 'en' ? formData.description : formData.trDescription}
                                onChange={(value) => {
                                    if (activeLanguage === 'en') {
                                        setFormData({ ...formData, description: value });
                                    } else {
                                        setFormData({ ...formData, trDescription: value });
                                    }
                                }}
                                placeholder={`${activeLanguage === 'en' ? 'English' : 'Türkçe'} açıklama yazın...`}
                                height={400}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Yazar
                                </label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Yazar adını girin..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Etiketler
                                </label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Etiketleri virgülle ayırarak girin..."
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex items-center">
                            <input
                                type="checkbox"
                                id="published"
                                checked={formData.published}
                                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                                Yayınla
                            </label>
                        </div>
                    </div>


                    {/* Preview */}
                    {showPreview && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Önizleme</h2>
                            <div className="border border-gray-300 rounded-lg p-6 bg-white">
                                <article className="prose max-w-none">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                        {activeLanguage === 'en' ? formData.title : formData.trTitle}
                                    </h1>
                                    <div className="flex items-center text-sm text-gray-600 mb-6">
                                        <User className="h-4 w-4 mr-1" />
                                        <span className="mr-4">{formData.author}</span>
                                        <Calendar className="h-4 w-4 mr-1" />
                                        <span className="mr-4">{new Date().toLocaleDateString('tr-TR')}</span>
                                        {formData.tags && (
                                            <>
                                                <Tag className="h-4 w-4 mr-1" />
                                                <span>{formData.tags}</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Özet</h3>
                                            <p>{activeLanguage === 'en' ? formData.summary : formData.trSummary}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Açıklama</h3>
                                            <div dangerouslySetInnerHTML={{
                                                __html: activeLanguage === 'en' ? formData.description : formData.trDescription
                                            }} />
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => router.push('/admin?page=blogs')}
                                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Kaydediliyor...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        {isEdit ? 'Güncelle' : 'Kaydet'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
