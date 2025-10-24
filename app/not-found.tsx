import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gradient mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-400 mb-8">
          Maaf, halaman yang Anda cari tidak ditemukan.
        </p>
        <Link 
          href="/" 
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Home className="w-5 h-5" />
          <span>Kembali ke Home</span>
        </Link>
      </div>
    </main>
  );
}
