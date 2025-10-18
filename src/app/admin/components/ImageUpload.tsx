'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ImageUploadProps {
    onImageUpload: (url: string) => void;
    currentImage?: string;
    className?: string;
}

export default function ImageUpload({ onImageUpload, currentImage, className = '' }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // File validation
        if (!file.type.startsWith('image/')) {
            alert('Lütfen sadece resim dosyası seçin.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert('Dosya boyutu 5MB\'dan küçük olmalıdır.');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to Supabase
        await uploadToSupabase(file);
    };

    const uploadToSupabase = async (file: File) => {
        try {
            setUploading(true);

            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `blog-images/${fileName}`;

            // Upload file
            const { data, error } = await supabase.storage
                .from('portfolio-images') // Bucket name - bu bucket'ı Supabase'de oluşturmanız gerekiyor
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                console.error('Upload error:', error);
                alert('Resim yüklenirken hata oluştu: ' + error.message);
                setPreview(null);
                return;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('portfolio-images')
                .getPublicUrl(filePath);

            onImageUpload(publicUrl);

        } catch (error) {
            console.error('Upload error:', error);
            alert('Resim yüklenirken hata oluştu.');
            setPreview(null);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        setPreview(null);
        onImageUpload('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <label className="block text-sm font-medium text-gray-700">
                Blog Resmi *
            </label>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                {preview ? (
                    <div className="space-y-4">
                        <div className="relative inline-block">
                            <img
                                src={preview}
                                alt="Preview"
                                className="max-w-full max-h-64 rounded-lg shadow-sm"
                            />
                            {uploading && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-center space-x-2">
                            <button
                                type="button"
                                onClick={triggerFileSelect}
                                disabled={uploading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                {uploading ? 'Yükleniyor...' : 'Değiştir'}
                            </button>
                            <button
                                type="button"
                                onClick={removeImage}
                                disabled={uploading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Kaldır
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={triggerFileSelect}
                                disabled={uploading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center mx-auto"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Yükleniyor...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-4 w-4 mr-2" />
                                        Resim Yükle
                                    </>
                                )}
                            </button>
                        </div>
                        <p className="text-sm text-gray-500">
                            PNG, JPG, GIF dosyaları desteklenir (Max: 5MB)
                        </p>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    );
}
