'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Link,
    Code,
    Image as ImageIcon,
    Upload,
    X,
    Eye,
    Save,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Quote,
    Heading1,
    Heading2,
    Heading3,
    Table,
    Palette,
    Undo,
    Redo
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface HTMLEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    height?: number;
}

export default function HTMLEditor({
    value,
    onChange,
    placeholder = "HTML kodunuzu buraya yazın...",
    height = 400
}: HTMLEditorProps) {
    const [showPreview, setShowPreview] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [showImageGallery, setShowImageGallery] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [uploading, setUploading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // History management
    const saveToHistory = (newValue: string) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newValue);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const undo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            onChange(history[newIndex]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            onChange(history[newIndex]);
        }
    };

    // Text insertion functions
    const insertText = (before: string, after: string = '', placeholder?: string) => {
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = textarea.value.substring(start, end);
            const textToInsert = selectedText || placeholder || '';
            const newText = before + textToInsert + after;

            const newValue = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
            onChange(newValue);
            saveToHistory(newValue);

            // Restore cursor position
            setTimeout(() => {
                textarea.focus();
                const newStart = start + before.length;
                const newEnd = newStart + textToInsert.length;
                textarea.setSelectionRange(newStart, newEnd);
            }, 0);
        }
    };

    const insertImage = (imageUrl: string, alt?: string) => {
        const imgTag = `<img src="${imageUrl}" alt="${alt || 'Image'}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px;" />`;
        insertText(imgTag);
    };

    const insertLink = () => {
        const url = prompt('Link URL\'sini girin:');
        if (url) {
            const text = prompt('Link metnini girin:') || url;
            insertText(`<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`);
        }
    };

    const insertList = (ordered = false) => {
        const listItems = prompt('Liste öğelerini virgülle ayırarak girin:');
        if (listItems) {
            const items = listItems.split(',').map(item => `<li>${item.trim()}</li>`).join('\n');
            const listTag = ordered ? 'ol' : 'ul';
            const list = `<${listTag}>\n${items}\n</${listTag}>`;
            insertText(list);
        }
    };

    const insertTable = () => {
        const rows = prompt('Satır sayısını girin:', '3');
        const cols = prompt('Sütun sayısını girin:', '3');

        if (rows && cols) {
            let table = '<table style="border-collapse: collapse; width: 100%; margin: 10px 0;">\n';

            // Header row
            table += '<thead>\n<tr>\n';
            for (let i = 0; i < parseInt(cols); i++) {
                table += `<th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Header ${i + 1}</th>\n`;
            }
            table += '</tr>\n</thead>\n';

            // Body rows
            table += '<tbody>\n';
            for (let i = 0; i < parseInt(rows) - 1; i++) {
                table += '<tr>\n';
                for (let j = 0; j < parseInt(cols); j++) {
                    table += `<td style="border: 1px solid #ddd; padding: 8px;">Cell ${i + 1},${j + 1}</td>\n`;
                }
                table += '</tr>\n';
            }
            table += '</tbody>\n</table>';

            insertText(table);
        }
    };

    const insertHeading = (level: number) => {
        insertText(`<h${level}>`, `</h${level}>`, `Başlık ${level}`);
    };

    const insertQuote = () => {
        insertText('<blockquote style="border-left: 4px solid #ddd; margin: 10px 0; padding-left: 20px; font-style: italic;">', '</blockquote>', 'Alıntı metni');
    };

    const insertCodeBlock = () => {
        insertText('<pre><code>', '</code></pre>', 'Kod bloğu');
    };

    const insertColor = (color: string) => {
        insertText(`<span style="color: ${color};">`, '</span>', 'Renkli metin');
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setUploading(true);
            try {
                for (const file of Array.from(files)) {
                    // Generate unique filename
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                    const filePath = `blog-content-images/${fileName}`;

                    // Upload to Supabase
                    const { data, error } = await supabase.storage
                        .from('portfolio-images')
                        .upload(filePath, file, {
                            cacheControl: '3600',
                            upsert: false
                        });

                    if (error) {
                        console.error('Upload error:', error);
                        alert('Resim yüklenirken hata oluştu: ' + error.message);
                        continue;
                    }

                    // Get public URL
                    const { data: { publicUrl } } = supabase.storage
                        .from('portfolio-images')
                        .getPublicUrl(filePath);

                    // Add to uploaded images and insert into editor
                    setUploadedImages(prev => [...prev, publicUrl]);
                    insertImage(publicUrl, file.name);
                }
            } catch (error) {
                console.error('Upload error:', error);
                alert('Resim yüklenirken hata oluştu.');
            } finally {
                setUploading(false);
            }
        }
    };

    const removeImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };

    const applyAlignment = (align: 'left' | 'center' | 'right') => {
        insertText(`<div style="text-align: ${align};">`, '</div>');
    };

    // Initialize history
    useEffect(() => {
        if (history.length === 0) {
            setHistory([value]);
            setHistoryIndex(0);
        }
    }, []);

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 rounded-lg border">
                {/* History */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={undo}
                        disabled={historyIndex <= 0}
                        className="p-2 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Geri Al"
                    >
                        <Undo className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={redo}
                        disabled={historyIndex >= history.length - 1}
                        className="p-2 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        title="İleri Al"
                    >
                        <Redo className="h-4 w-4" />
                    </button>
                </div>

                <div className="w-px h-6 bg-gray-300"></div>

                {/* Text Formatting */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => insertText('<strong>', '</strong>')}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Kalın"
                    >
                        <Bold className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => insertText('<em>', '</em>')}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="İtalik"
                    >
                        <Italic className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => insertText('<u>', '</u>')}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Altı Çizili"
                    >
                        <Underline className="h-4 w-4" />
                    </button>
                </div>

                <div className="w-px h-6 bg-gray-300"></div>

                {/* Headings */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => insertHeading(1)}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Başlık 1"
                    >
                        <Heading1 className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => insertHeading(2)}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Başlık 2"
                    >
                        <Heading2 className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => insertHeading(3)}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Başlık 3"
                    >
                        <Heading3 className="h-4 w-4" />
                    </button>
                </div>

                <div className="w-px h-6 bg-gray-300"></div>

                {/* Lists */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => insertList(false)}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Sırasız Liste"
                    >
                        <List className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => insertList(true)}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Sıralı Liste"
                    >
                        <ListOrdered className="h-4 w-4" />
                    </button>
                </div>

                <div className="w-px h-6 bg-gray-300"></div>

                {/* Alignment */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => applyAlignment('left')}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Sola Hizala"
                    >
                        <AlignLeft className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => applyAlignment('center')}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Ortala"
                    >
                        <AlignCenter className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => applyAlignment('right')}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Sağa Hizala"
                    >
                        <AlignRight className="h-4 w-4" />
                    </button>
                </div>

                <div className="w-px h-6 bg-gray-300"></div>

                {/* Special Elements */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={insertLink}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Link Ekle"
                    >
                        <Link className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={insertQuote}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Alıntı"
                    >
                        <Quote className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={insertCodeBlock}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Kod Bloğu"
                    >
                        <Code className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={insertTable}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Tablo"
                    >
                        <Table className="h-4 w-4" />
                    </button>
                </div>

                <div className="w-px h-6 bg-gray-300"></div>

                {/* Media */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Resim Yükle"
                    >
                        {uploading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                                Yükleniyor...
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4 mr-1" />
                                Resim
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowImageGallery(!showImageGallery)}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Resim Galerisi"
                    >
                        <ImageIcon className="h-4 w-4" />
                    </button>
                </div>

                <div className="w-px h-6 bg-gray-300"></div>

                {/* Color Picker */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Renk Seç"
                    >
                        <Palette className="h-4 w-4" />
                    </button>
                </div>

                <div className="w-px h-6 bg-gray-300"></div>

                {/* Preview Toggle */}
                <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                    <Eye className="h-4 w-4 mr-1" />
                    {showPreview ? 'Düzenle' : 'Önizleme'}
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                />
            </div>

            {/* Color Picker */}
            {showColorPicker && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Renk Seç</h4>
                    <div className="grid grid-cols-8 gap-2">
                        {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
                            '#800000', '#008000', '#000080', '#808080', '#FFC0CB', '#A52A2A', '#808080', '#FFFFFF'].map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => insertColor(color)}
                                    className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-500"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                    </div>
                </div>
            )}

            {/* Image Gallery */}
            {showImageGallery && uploadedImages.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-700">Yüklenen Resimler</h4>
                        <button
                            type="button"
                            onClick={() => setShowImageGallery(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {uploadedImages.map((image, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={image}
                                    alt={`Uploaded ${index + 1}`}
                                    className="w-full h-20 object-cover rounded border"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center gap-1 rounded transition-all">
                                    <button
                                        type="button"
                                        onClick={() => insertImage(image, `Image ${index + 1}`)}
                                        className="opacity-0 group-hover:opacity-100 bg-blue-600 text-white p-1 rounded text-xs"
                                        title="Ekle"
                                    >
                                        <ImageIcon className="h-3 w-3" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-1 rounded text-xs"
                                        title="Sil"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Editor/Preview */}
            {!showPreview ? (
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        saveToHistory(e.target.value);
                    }}
                    style={{ height: `${height}px` }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
                    placeholder={placeholder}
                />
            ) : (
                <div
                    className="border border-gray-300 rounded-lg p-4 bg-white overflow-auto"
                    style={{ height: `${height}px` }}
                >
                    <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: value || '<p class="text-gray-500 italic">Önizleme için içerik girin...</p>' }}
                    />
                </div>
            )}
        </div>
    );
}
