import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gradient">Ledy Jentri Meiza</h3>
            <p className="text-gray-400 text-sm">
              Siswa XII RPL A - Projek Praktek Kerja Lapangan menampilkan hasil pembelajaran selama 4 bulan magang di industri.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  About
                </a>
              </li>
              <li>
                <a href="#portfolio" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Projek
                </a>
              </li>
              <li>
                <a href="#skills" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Skills
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Contact
                </a>
              </li>
              <li>
                <a href="/admin/login" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Admin Login
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 glass-effect rounded-lg hover:bg-primary/20 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 glass-effect rounded-lg hover:bg-primary/20 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:admin@example.com"
                className="p-2 glass-effect rounded-lg hover:bg-primary/20 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Ledy Jentri Meiza - XII RPL A. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
