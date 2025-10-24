'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Upload, X, Edit2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function EditPortfolio({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/admin/login');
      return;
    }
    await fetchPortfolio();
  };

  const fetchPortfolio = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', resolvedParams.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title,
          description: data.description,
          detail: data.detail,
          technologies: data.technologies?.join(', ') || '',
          image_url: data.image_url || '',
        });
        if (data.image_url) {
          setImagePreview(data.image_url);
        }
      }
    } catch (error: any) {
      alert('Error loading portfolio: ' + error.message);
      router.push('/admin/dashboard');
    } finally {
      setFetching(false);
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

      // Upload new image if file selected
      if (imageFile) {
        try {
          imageUrl = await uploadImage();
        } catch (uploadError: any) {
          throw new Error(`Gagal upload gambar: ${uploadError.message}`);
        }
      }

      // Parse technologies
      const techArray = formData.technologies
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const { error } = await supabase
        .from('projects')
        .update({
          title: formData.title,
          description: formData.description,
          detail: formData.detail,
          technologies: techArray,
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', resolvedParams.id);

      if (error) throw error;

      alert('Portfolio berhasil diupdate!');
      router.push('/admin/dashboard');
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="text-2xl font-bold text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-light py-8 px-6 lg:px-12">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-primary rounded-lg">
                <Edit2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-primary">
                Edit Portfolio
              </h1>
            </div>
            <p className="text-accent-gray">Update informasi portfolio Anda</p>
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
            <div>
              <label htmlFor="title" className="block text-sm font-semibold mb-2 text-primary">
                Judul Portfolio *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold mb-2 text-primary">
                Deskripsi Singkat *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                maxLength={200}
                className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:outline-none focus:border-primary transition-colors resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.description.length}/200 karakter</p>
            </div>

            <div>
              <label htmlFor="detail" className="block text-sm font-semibold mb-2 text-primary">
                Detail Portfolio *
              </label>
              <textarea
                id="detail"
                value={formData.detail}
                onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                required
                rows={8}
                className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            <div>
              <label htmlFor="technologies" className="block text-sm font-semibold mb-2 text-primary">
                Teknologi yang Digunakan *
              </label>
              <input
                id="technologies"
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-primary">
                Gambar Portfolio
              </label>
              
              {imagePreview ? (
                <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
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
                      setFormData({ ...formData, image_url: '' });
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-gray-400 text-sm">Klik untuk upload gambar baru</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}

              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Atau masukkan URL gambar:</p>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Menyimpan...' : 'Update Portfolio'}
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
