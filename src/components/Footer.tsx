import React from 'react';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-bg-elev text-text mt-20 border-t border-bg-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-gradient-to-br from-primary to-brand-cyan rounded-lg p-2">
                <Zap className="w-6 h-6 text-[#0D0D0D]" />
              </div>
              <span className="text-2xl font-bold">BluBlu</span>
            </div>
            <p className="text-text-3 leading-relaxed">
              Fast, reliable campus delivery for food, groceries and essentials. Lightning
              fast service with transparent pricing.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-text-secondary mb-4">Company</h4>
            <ul className="space-y-2 text-text-3">
              <li><a className="hover:text-brand-cyan" href="#services">Services</a></li>
              <li><a className="hover:text-brand-cyan" href="#">About</a></li>
              <li><a className="hover:text-brand-cyan" href="#">Careers</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-text-secondary mb-4">Support</h4>
            <ul className="space-y-2 text-text-3">
              <li><a className="hover:text-brand-cyan" href="#">Help Center</a></li>
              <li><a className="hover:text-brand-cyan" href="#">Safety & FAQs</a></li>
              <li><a className="hover:text-brand-cyan" href="#">Terms & Privacy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-text-secondary mb-4">Contact</h4>
            <ul className="space-y-2 text-text-3">
              <li>Email: support@blublu.app</li>
              <li>Phone: +91-99999-99999</li>
              <li>Hours: 24/7</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-bg-border/70 text-center text-text-3 text-sm">
          © {new Date().getFullYear()} BluBlu. All rights reserved.
        </div>
      </div>
    </footer>
  );
}


