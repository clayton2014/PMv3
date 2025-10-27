'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'pt-BR', name: t('common.portuguese'), flag: '🇧🇷' },
    { code: 'en-US', name: t('common.english'), flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 transition-all"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:block">{currentLanguage.flag} {currentLanguage.name}</span>
        <span className="sm:hidden">{currentLanguage.flag}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-purple-500/30 rounded-lg shadow-2xl z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-purple-500/20 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                i18n.language === language.code ? 'bg-purple-500/30 text-white' : 'text-purple-200'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}