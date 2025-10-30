'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { LoadingPage } from '@/components/LoadingSpinner';
import { 
  LogOut, 
  User,
  LayoutDashboard,
  Save,
  Upload,
  X
} from 'lucide-react';

interface Profile {
  id?: string;
  name: string;
  bio: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  instagram: string;
  website: string;
  photo_url?: string;
}

export default function ProfileAdmin() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<Profile>({
    name: '',
    bio: '',
    email: '',
    phone: '',
    github: '',
    linkedin: '',
    instagram: '',
    website: '',
    photo_url: ''
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/admin/login');
      return;
    }

    await fetchProfile();
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setFormData(data);
        if (data.photo_url) {
          setPhotoPreview(data.photo_url);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile) return formData.photo_url || null;

    setUploading(true);
    try {
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `profile-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, photoFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setFormData({ ...formData, photo_url: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Upload photo first if there's a new file
      let photoUrl = formData.photo_url;
      if (photoFile) {
        const uploadedUrl = await uploadPhoto();
        if (uploadedUrl) {
          photoUrl = uploadedUrl;
        }
      }

      const dataToSave = { ...formData, photo_url: photoUrl };
      const { data: existingData } = await supabase
        .from('profile')
        .select('id')
        .single();

      if (existingData) {
        // Update existing profile
        const { error } = await supabase
          .from('profile')
          .update(dataToSave)
          .eq('id', existingData.id);

        if (error) throw error;
      } else {
        // Insert new profile
        const { error } = await supabase
          .from('profile')
          .insert([dataToSave]);

        if (error) throw error;
      }

      setFormData(dataToSave);
      setPhotoFile(null);

      alert('Profile berhasil disimpan!');
      
      // Auto redirect ke dashboard setelah 500ms
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan';
      alert('Error: ' + errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return <LoadingPage text="Memuat profil..." />;
  }

  return (
    <main className="min-h-screen bg-light py-8 px-6 lg:px-12">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-primary rounded-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-primary">
                Kelola Profile
              </h1>
            </div>
            <p className="text-accent-gray">Edit informasi profile dan kontak Anda</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/admin/dashboard" 
              className="px-4 py-2.5 rounded-full bg-light-card border-2 border-gray-200 hover:border-primary transition-colors flex items-center space-x-2 font-semibold"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center space-x-2 font-semibold border-2 border-red-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-light-card rounded-2xl border-2 border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload */}
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">Foto Profil</h2>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Photo Preview */}
                <div className="relative w-48 h-48 rounded-xl border-2 border-gray-200 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
                  {photoPreview ? (
                    <Image 
                      src={photoPreview} 
                      alt="Preview" 
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                
                {/* Upload Controls */}
                <div className="flex-1 space-y-3">
                  <p className="text-sm text-accent-gray">
                    Upload foto profil Anda. Foto akan ditampilkan di section &quot;Tentang Saya&quot;.
                  </p>
                  <div className="flex gap-3">
                    <label className="px-4 py-2.5 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors cursor-pointer flex items-center space-x-2 font-semibold">
                      <Upload className="w-4 h-4" />
                      <span>{photoFile ? 'Ganti Foto' : 'Upload Foto'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                    {photoPreview && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="px-4 py-2.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center space-x-2 font-semibold border-2 border-red-200"
                      >
                        <X className="w-4 h-4" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>
                  {uploading && (
                    <p className="text-sm text-primary font-medium">Mengupload foto...</p>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">Informasi Pribadi</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-primary">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nama Anda"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-primary">
                    Bio / About Me *
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Ceritakan tentang diri Anda, background, minat, dll..."
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">Informasi Kontak</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-primary">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-primary">
                    WhatsApp / Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+62 812-3456-7890"
                    className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">Social Media</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-primary">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-primary">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-primary">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="https://instagram.com/username"
                    className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-primary">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{saving ? 'Menyimpan...' : 'Simpan Profile'}</span>
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
