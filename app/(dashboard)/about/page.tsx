'use client';

import { useState } from 'react';
import { constitution } from '@/lib/constitution';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
};

export default function ConstitutionPage() {
const [showContentMobile, setShowContentMobile] = useState(false);


  const [activeSectionId, setActiveSectionId] = useState(
    constitution[0].id
  );
  const [activeArticleId, setActiveArticleId] = useState(
    constitution[0].articles[0].id
  );

  const activeSection = constitution.find(
    (s) => s.id === activeSectionId
  );

  const activeArticle = activeSection?.articles.find(
    (a) => a.id === activeArticleId
  );

  return (
    <div className="max-w-7xl mx-auto min-h-screen p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      
      {/* LEFT SIDEBAR */}
      <aside  className={`md:col-span-1 border rounded-xl bg-white overflow-y-auto
  ${showContentMobile ? 'hidden md:block' : 'block'}`}>
        <h2 className="px-4 py-3 font-bold text-lg border-b">
          Constitution
        </h2>

        {constitution.map((section) => (
          <div key={section.id} className="border-b">
            
            {/* SECTION */}
            <button
              onClick={() => {
                setActiveSectionId(section.id);
                setActiveArticleId(section.articles[0].id);
              }}
              className={`w-full text-left px-4 py-3 font-semibold transition ${
                activeSectionId === section.id
                  ? 'bg-green-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {section.title}
            </button>

            {/* ARTICLES */}
            {activeSectionId === section.id && (
              <ul className="bg-gray-50">
                {section.articles.map((article) => (
                  <li key={article.id}>
                    <button
                      onClick={
                        () => {
                            setActiveArticleId(article.id);
                            setShowContentMobile(true);
                        }
                    }
                      className={`w-full text-left px-8 py-2 text-sm transition ${
                        activeArticleId === article.id
                          ? 'text-green-700 font-semibold'
                          : 'hover:text-green-600'
                      }`}
                    >
                      {article.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </aside>

      {/* RIGHT CONTENT */}
      <section className={`md:col-span-3 border rounded-xl bg-white p-6
  ${showContentMobile ? 'block' : 'hidden md:block'}`}>
    {showContentMobile && (
  <button
    onClick={() => setShowContentMobile(false)}
    className="mb-4 text-sm text-green-600 font-medium md:hidden"
  >
    ← Back to sections
  </button>
)}
        {activeArticle ? (
          <>
            <h1 className="text-2xl font-bold mb-4">
              {activeArticle.title}
            </h1>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {activeArticle.content}
            </p>
          </>
        ) : (
          <p className="text-gray-500">
            Select an article to view details.
          </p>
        )}
      </section>
    </div>
  );
}
