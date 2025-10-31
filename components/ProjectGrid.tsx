'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase, Project } from '@/lib/supabase';
import { SkeletonCard } from './LoadingSpinner';

export default function ProjectGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="portfolio" className="py-24 px-6 lg:px-12 bg-light-darker">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="h-6 bg-gray-200 rounded w-20 mx-auto mb-4 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-24 px-6 lg:px-12 bg-light-darker">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-xs font-medium text-primary mb-4">
            Projek
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Projek Saya</h2>
          <p className="text-base text-accent-gray max-w-2xl mx-auto">
            Koleksi projek yang telah dikerjakan selama magang
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/project/${project.id}`}>
                <div className="group relative rounded-2xl overflow-hidden cursor-pointer h-full flex flex-col bg-light-card border-2 border-gray-200 hover:border-primary transition-all duration-300 hover:shadow-xl">
                  <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {project.image_url && project.image_url.trim() !== '' ? (
                      <>
                        <Image
                          src={project.image_url}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2 shadow-lg">
                            <span className="text-primary font-semibold text-sm">Lihat Detail</span>
                            <ExternalLink className="w-4 h-4 text-primary" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-accent-gray text-sm font-medium">Tanpa Gambar</span>
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center space-x-1.5 shadow-sm">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-medium text-primary">
                          {new Date(project.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold mb-2 text-primary">
                      {project.title}
                    </h3>
                    <p className="text-accent-gray text-sm mb-4 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.technologies?.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 text-xs font-semibold rounded-full bg-primary/5 text-primary border border-primary/10"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies && project.technologies.length > 3 && (
                        <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gray-100 text-accent-gray">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {projects.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              Belum ada projek. Silakan tambahkan melalui admin panel.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
