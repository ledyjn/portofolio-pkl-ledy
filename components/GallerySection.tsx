'use client';

import CircularGallery from '@/components/CircularGallery';

const galleryItems = [
  { image: '/gallery/lt1.jpeg', text: 'Lantai 1' },
  { image: '/gallery/lt1-pkl.jpeg', text: 'Area PKL' },
  { image: '/gallery/teras.jpeg', text: 'Teras Kantor' },
  { image: '/gallery/parkir.jpeg', text: 'Area Parkir' },
];

export default function GallerySection() {
  return (
    <section id="gallery" className="py-20 bg-light overflow-hidden">
      <div className="container mx-auto px-6 mb-12 text-center">
        <span className="inline-block px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-xs font-medium text-primary mb-4">
          Gallery
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Galeri <span className="text-primary">Dokumentasi</span>
        </h2>
        <p className="text-center text-accent-gray max-w-2xl mx-auto">
          Dokumentasi kegiatan dan momen selama program PKL
        </p>
      </div>
      <div style={{ height: '600px', position: 'relative' }}>
        <CircularGallery
          items={galleryItems}
          bend={3}
          textColor="#1a1a1a"
          borderRadius={0.05}
          scrollEase={0.02}
        />
      </div>
    </section>
  );
}
