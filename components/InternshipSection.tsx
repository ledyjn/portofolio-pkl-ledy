'use client';

import { motion } from 'framer-motion';
import { Building2, Users, Briefcase, MapPin, Calendar, Phone, Mail, Globe } from 'lucide-react';

export default function InternshipSection() {
  return (
    <section id="internship" className="py-24 px-6 lg:px-12 bg-light-darker">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-xs font-medium text-primary mb-4">
            Tempat PKL
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pengenalan <span className="text-primary">Perusahaan</span>
          </h2>
          <p className="text-base text-accent-gray max-w-2xl mx-auto">
            Profil lengkap perusahaan tempat pelaksanaan program magang
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-light-card rounded-2xl border-2 border-gray-200 p-8 shadow-sm lg:h-[586px] overflow-y-auto">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-white font-bold text-xl">3PM</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary">3PM Solution</h3>
                  <p className="text-sm text-accent-gray">Software House</p>
                </div>
              </div>

              <p className="text-accent-gray leading-relaxed text-sm mb-6">
                Perusahaan teknologi yang didirikan pada tahun 2009 oleh Ricky Subiantoputra, S.Kom. 
                Dengan pengalaman lebih dari satu dekade, 3PM Solution telah berkembang menjadi 
                mitra terpercaya dalam pengembangan solusi digital. Awalnya berfokus pada pembuatan 
                aplikasi berbasis desktop untuk berbagai keperluan bisnis, perusahaan ini terus 
                berinovasi dan berkembang mengikuti perkembangan teknologi.
              </p>
              <p className="text-accent-gray leading-relaxed text-sm mb-6">
                Melalui berbagai tantangan dan keberhasilan, 3PM Solution kini menjadi pilihan 
                banyak perusahaan dalam mewujudkan transformasi digital mereka. Dengan tim profesional 
                yang berpengalaman, perusahaan ini menyediakan layanan pengembangan aplikasi web dan 
                mobile yang inovatif serta disesuaikan dengan kebutuhan klien.
              </p>

              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3 text-sm">
                  <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-accent-gray">Didirikan tahun <span className="font-semibold text-primary">2009</span></span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-accent-gray">Lokasi kantor di <span className="font-semibold text-primary">Indonesia</span></span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Briefcase className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-accent-gray">Lebih dari <span className="font-semibold text-primary">5+ layanan</span> digital</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Users className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-accent-gray">Dipercaya oleh <span className="font-semibold text-primary">11+ mitra</span> perusahaan</span>
                </div>
              </div>
            </div>

          </motion.div>

          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-light-card rounded-2xl border-2 border-gray-200 overflow-hidden shadow-sm lg:h-[280px] flex flex-col">
              <div className="flex-1 relative bg-gradient-to-br from-gray-100 to-gray-200 min-h-[200px]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-500">Foto Kantor 3PM Solution</p>
                    <p className="text-xs text-gray-400 mt-1">Tambahkan foto kantor di sini</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white">
                <h4 className="font-semibold text-primary text-sm mb-1">Kantor 3PM Solution</h4>
                <p className="text-xs text-accent-gray">Tempat pelaksanaan program PKL</p>
              </div>
            </div>

            <div className="bg-light-card rounded-xl border-2 border-gray-200 p-6 lg:h-[280px] flex flex-col">
              <h4 className="font-semibold text-primary mb-3 text-sm">Informasi Kontak</h4>
              <div className="space-y-2.5 flex-1">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-accent-gray mb-1">WhatsApp</p>
                    <p className="text-sm font-medium text-primary">0818388810</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-50 rounded-lg flex-shrink-0">
                    <Mail className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-accent-gray mb-1">Email</p>
                    <p className="text-sm font-medium text-primary">hr@3pmsolution@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-emerald-50 rounded-lg flex-shrink-0">
                    <Globe className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-accent-gray mb-1">Website</p>
                    <a 
                      href="https://www.3pm-solution.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      www.3pm-solution.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-pink-50 rounded-lg flex-shrink-0">
                    <Users className="w-4 h-4 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-xs text-accent-gray mb-1">Instagram</p>
                    <a 
                      href="https://instagram.com/3pmsolution" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      @3pmsolution
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
