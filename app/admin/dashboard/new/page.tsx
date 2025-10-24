'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Upload, X, Plus, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function NewPortfolio() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detail: '',
    technologies: '',
    image_url: '',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/admin/login');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) throw new Error('No file selected');

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `portfolio-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portofolios')
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      // Throw error dengan pesan yang lebih informatif
      if (uploadError.message.includes('not found')) {
        throw new Error('Storage bucket "portofolios" belum dibuat di Supabase. Silakan buat bucket terlebih dahulu di Supabase Dashboard → Storage → New Bucket dengan nama "portofolios" dan set sebagai Public.');
      }
      throw new Error(`Upload gagal: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from('portofolios')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image_url;

      // Upload image if file selected
      if (imageFile) {
        try {
          imageUrl = await uploadImage();
        } catch (uploadError: any) {
          // Jika upload gagal, hentikan proses dan tampilkan error
          throw new Error(`Gagal upload gambar: ${uploadError.message}`);
        }
      }

      // Parse technologies from comma-separated string to array
      const techArray = formData.technologies
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const { error } = await supabase
        .from('projects')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            detail: formData.detail,
            technologies: techArray,
            image_url: imageUrl,
          }
        ]);

      if (error) throw error;

      alert('Portfolio berhasil ditambahkan!');
      router.push('/admin/dashboard');
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-light py-8 px-6 lg:px-12">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-primary rounded-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-primary">
                Tambah Portfolio
              </h1>
            </div>
            <p className="text-accent-gray">Buat project portfolio baru untuk ditampilkan</p>
          </div>
          
          <Link 
            href="/admin/dashboard"
            className="px-4 py-2 rounded-full bg-light-card border-2 border-gray-200 hover:border-primary transition-colors flex items-center space-x-2 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </Link>
        </div>

        <div className="bg-light-card rounded-2xl border-2 border-gray-200 p-8">

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold mb-2 text-primary">
                Judul Portfolio *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Website E-Commerce"
                required
                className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold mb-2 text-primary">
                Deskripsi Singkat *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi singkat tentang project (max 200 karakter)"
                required
                rows={3}
                maxLength={200}
                className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors resize-none"
              />
              <p className="text-xs text-accent-gray mt-1">{formData.description.length}/200 karakter</p>
            </div>

            {/* Detail */}
            <div>
              <label htmlFor="detail" className="block text-sm font-semibold mb-2 text-primary">
                Detail Portfolio *
              </label>
              <textarea
                id="detail"
                value={formData.detail}
                onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                placeholder="Detail lengkap tentang project, tantangan, solusi, dan hasil yang dicapai..."
                required
                rows={8}
                className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Technologies */}
            <div>
              <label htmlFor="technologies" className="block text-sm font-semibold mb-2 text-primary">
                Teknologi yang Digunakan *
              </label>
              <input
                id="technologies"
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                placeholder="Pisahkan dengan koma: React, Node.js, MongoDB"
                required
                className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
              />
              <p className="text-xs text-accent-gray mt-1">Pisahkan setiap teknologi dengan koma (,)</p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-primary">
                Gambar Portfolio
              </label>
              
              {imagePreview ? (
                <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-4 border-2 border-gray-200">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                    }}
                    className="absolute top-3 right-3 p-2 bg-red-500 rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              ) : (
                <label className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-primary hover:bg-gray-50 transition-all">
                  <div className="p-4 bg-gray-100 rounded-full mb-3">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-primary font-medium text-sm">Klik untuk upload gambar</p>
                  <p className="text-accent-gray text-xs mt-1">PNG, JPG, atau GIF (Max. 5MB)</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}

              {/* Or URL */}
              <div className="mt-4">
                <p className="text-sm text-accent-gray mb-2">Atau masukkan URL gambar:</p>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Menyimpan...' : 'Simpan Portfolio'}
              </button>
              <Link
                href="/admin/dashboard"
                className="px-6 py-3 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors text-center font-semibold text-primary flex items-center justify-center"
              >
                Batal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
