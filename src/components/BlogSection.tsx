import React, { useState } from 'react';
import { BLOG_POSTS } from '../data/blog';
import { BlogPost } from '../types';
import { BookOpen, Clock, Calendar, User, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BlogSectionProps {
  onOpenLeadModal: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onOpenLeadModal }) => {
  const { language, t } = useLanguage();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <section id="blog" className="py-20 bg-[#FAF8F5] border-b border-stone-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-300 text-xs font-mono text-stone-900 font-semibold">
            <BookOpen className="w-4 h-4 text-[#007BFF]" />
            {language === 'EN' ? 'TECHNICAL KNOWLEDGE & MAINTENANCE CENTER' : 'CENTRO DE CONOCIMIENTO TÉCNICO Y MANTENIMIENTO'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-heading font-bold text-stone-900">
            {language === 'EN' ? (
              <>Surface Engineering & <span className="text-[#007BFF]">Comparisons</span></>
            ) : (
              <>Ingeniería de Superficies & <span className="text-[#007BFF]">Comparativas</span></>
            )}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            {language === 'EN'
              ? 'Articles written by our polymer engineers on durability, load testing, and epoxy maintenance guides.'
              : 'Artículos redactados por nuestros ingenieros químicos sobre durabilidad, ensayos de resistencia y guías de mantenimiento epóxico.'}
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => {
            const title = language === 'EN' ? post.titleEn || post.title : post.title;
            const excerpt = language === 'EN' ? post.excerptEn || post.excerpt : post.excerpt;
            const category = language === 'EN' ? post.categoryEn || post.category : post.category;
            const readTime = language === 'EN' ? post.readTimeEn || post.readTime : post.readTime;
            const author = language === 'EN' ? post.authorEn || post.author : post.author;

            return (
              <article
                key={post.id}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <div>
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={post.image}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-stone-900 text-amber-300 px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono">
                      {category}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-[11px] text-stone-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#007BFF]" />
                        {readTime}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#007BFF]" />
                        {post.date}
                      </span>
                    </div>

                    <h3 className="font-serif-heading font-bold text-lg text-stone-900 group-hover:text-[#007BFF] transition-colors leading-snug">
                      {title}
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-stone-200 mt-4">
                  <span className="text-[11px] text-stone-500 font-medium">{author}</span>
                  <span className="text-xs font-bold text-[#007BFF] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {language === 'EN' ? 'Read Article' : 'Leer Guía'} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Lead Magnet Download Banner inside Blog */}
        <div className="mt-16 p-8 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-mono text-amber-800 font-bold uppercase tracking-wider">
              📘 {language === 'EN' ? 'FREE LEAD MAGNET RESOURCE' : 'IMÁN DE CLIENTES POTENCIALES - RECURSO GRATUITO'}
            </span>
            <h3 className="font-serif-heading font-bold text-2xl text-stone-900">
              {language === 'EN'
                ? 'Free Guide: How to Prepare Your Floor for Epoxy Resin'
                : 'Guía Gratuita: Cómo preparar tu piso para resina epóxica'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {language === 'EN'
                ? '15-page technical handbook for architects, contractors, and building owners. Avoid the 5 critical prep mistakes.'
                : 'Manual técnico de 15 páginas para arquitectos, ingenieros y propietarios. Evita los 5 errores destructivos antes de aplicar la resina.'}
            </p>
          </div>

          <button
            onClick={onOpenLeadModal}
            id="blog-download-lead-btn"
            className="px-6 py-3.5 rounded-xl font-heading font-bold text-xs text-white bg-stone-900 hover:bg-[#007BFF] shadow-md transition-all shrink-0 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>{language === 'EN' ? 'DOWNLOAD FREE PDF GUIDE' : 'DESCARGAR GUÍA GRATIS PDF'}</span>
          </button>
        </div>

      </div>

      {/* Blog Article Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-mono text-[#007BFF] font-bold">
                  {(language === 'EN' ? selectedPost.categoryEn || selectedPost.category : selectedPost.category)} • {(language === 'EN' ? selectedPost.readTimeEn || selectedPost.readTime : selectedPost.readTime)}
                </span>
                <h3 className="font-serif-heading font-bold text-2xl text-stone-900">
                  {language === 'EN' ? selectedPost.titleEn || selectedPost.title : selectedPost.title}
                </h3>
                <p className="text-xs text-stone-500">
                  {language === 'EN' ? 'By' : 'Por'} {language === 'EN' ? selectedPost.authorEn || selectedPost.author : selectedPost.author} • {selectedPost.date}
                </p>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 rounded-xl bg-stone-100 text-stone-600 hover:text-stone-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
              {((language === 'EN' && selectedPost.contentEn) ? selectedPost.contentEn : selectedPost.content).map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-between items-center">
              <button
                onClick={onOpenLeadModal}
                className="text-xs font-bold text-[#007BFF] hover:underline"
              >
                {language === 'EN' ? '📘 Get Technical Guide in PDF →' : '📘 Obtener Guía Técnica en PDF →'}
              </button>
              <button
                onClick={() => setSelectedPost(null)}
                className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800"
              >
                {language === 'EN' ? 'Close Article' : 'Cerrar Artículo'}
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
