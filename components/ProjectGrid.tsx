'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase, Project } from '@/lib/supabase';

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
      <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-effect rounded-lg h-96 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-24 px-6 lg:px-12 bg-light-darker">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-xs font-medium text-primary mb-4">
            Projek Saya
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Projek Saya
          </h2>
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
                <div className="group card-hover rounded-2xl overflow-hidden cursor-pointer h-full flex flex-col bg-light-card">
                  {/* Image */}
                  <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                    {project.image_url ? (
                      <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-accent-gray text-sm font-medium">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold mb-2 text-primary group-hover:opacity-70 transition-opacity">
                      {project.title}
                    </h3>
                    <p className="text-accent-gray text-sm mb-4 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.technologies?.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-primary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(project.created_at).toLocaleDateString('id-ID')}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 group-hover:text-primary transition-colors" />
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
