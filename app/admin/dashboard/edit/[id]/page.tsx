'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Upload, X, Edit2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { LoadingPage } from '@/components/LoadingSpinner';

export default function EditPortfolio({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
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
        // Load existing images from database and filter out empty strings
        if (data.images && data.images.length > 0) {
          const validImages = data.images.filter((url: string) => url && url.trim() !== '');
          setExistingImages(validImages);
        } else if (data.image_url && data.image_url.trim() !== '') {
          setExistingImages([data.image_url]);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan';
      alert('Error loading portfolio: ' + errorMessage);
      router.push('/admin/portfolio');
    } finally {
      setFetching(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeNewImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };


  const uploadMultipleImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return [];

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `portfolio-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portofolios')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          if (uploadError.message.includes('not found')) {
            throw new Error('Storage bucket "portofolios" belum dibuat di Supabase.');
          }
          throw new Error(`Upload gagal: ${uploadError.message}`);
        }

        const { data } = supabase.storage
          .from('portofolios')
          .getPublicUrl(filePath);

        uploadedUrls.push(data.publicUrl);
      }

      return uploadedUrls;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload new images if any
      let newImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        try {
          newImageUrls = await uploadMultipleImages();
        } catch (uploadError) {
          const errorMessage = uploadError instanceof Error ? uploadError.message : 'Upload gagal';
          throw new Error(`Gagal upload gambar: ${errorMessage}`);
        }
      }

      // Combine existing and new images, filter out empty strings
      const allImages = [...existingImages, ...newImageUrls].filter(url => url && url.trim() !== '');
      
      // Use first image as main thumbnail
      const mainImage = allImages.length > 0 ? allImages[0] : (formData.image_url && formData.image_url.trim() !== '' ? formData.image_url : '');

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
          image_url: mainImage,
          images: allImages,
          updated_at: new Date().toISOString(),
        })
        .eq('id', resolvedParams.id);

      if (error) throw error;

      alert('Portfolio berhasil diupdate!');
      router.push('/admin/portfolio');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan';
      alert('Error: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <LoadingPage text="Memuat data portfolio..." />;
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
            href="/admin/portfolio"
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
              <label className="block text-sm font-semibold mb-4 text-primary">
                Screenshots/Gambar Project *
              </label>
              <p className="text-sm text-accent-gray mb-4">
                Upload beberapa screenshot atau gambar dari project. Gambar pertama akan jadi thumbnail utama.
              </p>
              
              {/* Existing Images Grid */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-primary mb-2">Gambar Tersimpan ({existingImages.length})</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {existingImages.filter(url => url && url.trim() !== '').map((url, index) => (
                      <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                        <Image
                          src={url}
                          alt={`Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                          #{index + 1} {index === 0 && '(Thumbnail)'}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images Preview */}
              {imagePreviews.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-primary mb-2">Gambar Baru ({imagePreviews.length})</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border-2 border-blue-200">
                        <Image
                          src={preview}
                          alt={`New ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                          Baru
                        </div>
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <label className="w-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-gray-50 transition-all">
                <Upload className="w-10 h-10 text-accent-gray mb-2" />
                <p className="text-primary font-medium text-sm">Klik untuk upload gambar</p>
                <p className="text-xs text-accent-gray mt-1">Bisa pilih lebih dari 1 gambar</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {uploading && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Mengupload gambar...</p>
                </div>
              )}
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
                href="/admin/portfolio"
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
