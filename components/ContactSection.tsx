'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, Github, Linkedin, Instagram } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Profile {
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  instagram: string;
}

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('email, phone, github, linkedin, instagram')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile?.email) {
      alert('Email belum dikonfigurasi. Silakan hubungi admin.');
      return;
    }

    const subject = `Portfolio Contact: ${formData.name}`;
    const body = `Nama: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0A%0D%0APesan:%0D%0A${formData.message}`;
    const mailtoLink = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    
    window.location.href = mailtoLink;
    
    setSuccess(true);
    setFormData({ name: '', email: '', message: '' });
    
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <section id="contact" className="py-24 px-6 lg:px-12 bg-light-darker">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-xs font-medium text-primary mb-4">
            Hubungi Saya
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Hubungi Saya
          </h2>
          <p className="text-base text-accent-gray max-w-2xl mx-auto">
            Punya pertanyaan atau ingin bekerja sama? Jangan ragu untuk menghubungi!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-4 text-primary">Mari Terhubung</h3>
              <p className="text-sm text-accent-gray leading-relaxed mb-6">
                Saya terbuka untuk diskusi project baru, peluang magang, atau sekadar ngobrol tentang teknologi dan pengalaman PKL!
              </p>
            </div>

            <div className="space-y-4">
              {profile?.email && (
                <a 
                  href={`mailto:${profile.email}`}
                  className="flex items-center space-x-4 p-4 rounded-2xl bg-light-card hover:shadow-lg transition-all group"
                >
                  <div className="p-3 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary">Email</p>
                    <p className="text-sm text-accent-gray">{profile.email}</p>
                  </div>
                </a>
              )}

              {profile?.phone && (
                <a 
                  href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-4 rounded-2xl bg-light-card hover:shadow-lg transition-all group"
                >
                  <div className="p-3 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary">WhatsApp</p>
                    <p className="text-sm text-accent-gray">{profile.phone}</p>
                  </div>
                </a>
              )}
            </div>

            {(profile?.github || profile?.linkedin || profile?.instagram) && (
              <div>
                <h4 className="font-semibold mb-4 text-primary">Ikuti Saya</h4>
                <div className="flex space-x-4">
                  {profile?.github && (
                    <a 
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-light-card hover:bg-primary hover:text-white transition-all"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {profile?.linkedin && (
                    <a 
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-light-card hover:bg-primary hover:text-white transition-all"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {profile?.instagram && (
                    <a 
                      href={profile.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-light-card hover:bg-primary hover:text-white transition-all"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="card-hover rounded-2xl p-8 bg-light-card space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-2 text-primary">
                  Nama
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nama Anda"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2 text-primary">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@contoh.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold mb-2 text-primary">
                  Pesan
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tulis pesan Anda disini..."
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>

              {success && (
                <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200 text-blue-800 text-sm">
                  ✓ Klien email terbuka! Silakan klik Kirim di aplikasi email Anda.
                </div>
              )}

              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Kirim via Email</span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
