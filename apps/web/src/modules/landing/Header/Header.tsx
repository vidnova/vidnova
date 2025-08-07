import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { LanguageDropdown } from './components';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Landing.Header');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="bg-transparent flex items-center justify-between px-4 sm:px-8 py-6 relative">
      <div className="flex items-center gap-8">
        <div className="text-2xl font-bold gradient-logo">VIDNOVA</div>
        <nav className="hidden md:block">
          <ul className="flex gap-6">
            <li className="text-gray-400 hover:text-white transition-colors">
              <a href="#mission">{t('nav.mission')}</a>
            </li>
            <li className="text-gray-400 hover:text-white transition-colors">
              <a href="#how-it-works">{t('nav.howItWorks')}</a>
            </li>
            <li className="text-gray-400 hover:text-white transition-colors">
              <a href="#features">{t('nav.features')}</a>
            </li>
            <li className="text-gray-400 hover:text-white transition-colors">
              <a href="#call-to-action">{t('nav.joinUs')}</a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex md:hidden gap-7">
        <LanguageDropdown />
        <button onClick={toggleMenu} aria-label="Toggle menu">
          <div
            className={`w-6 h-0.5 bg-white mb-1.5 transition-transform ${
              isMenuOpen && 'invisible'
            }`}
          ></div>
          <div className={`w-6 h-0.5 bg-white mb-1.5 ${isMenuOpen && 'invisible'}`}></div>
          <div
            className={`w-6 h-0.5 bg-white transition-transform ${isMenuOpen && 'invisible'}`}
          ></div>
        </button>
      </div>
      <nav
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-64 bg-[#131313b3] backdrop-blur-md transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden z-10 py-10 px-6 overflow-y-auto`}
      >
        <ul className="flex flex-col gap-6">
          <li className="text-gray-400 hover:text-white transition-colors">
            <a href="#mission" onClick={toggleMenu}>
              {t('nav.mission')}
            </a>
          </li>
          <li className="text-gray-400 hover:text-white transition-colors">
            <a href="#how-it-works" onClick={toggleMenu}>
              {t('nav.howItWorks')}
            </a>
          </li>
          <li className="text-gray-400 hover:text-white transition-colors">
            <a href="#features" onClick={toggleMenu}>
              {t('nav.features')}
            </a>
          </li>
          <li className="text-gray-400 hover:text-white transition-colors">
            <a href="#call-to-action" onClick={toggleMenu}>
              {t('nav.joinUs')}
            </a>
          </li>
        </ul>
      </nav>
      <div className="hidden md:flex items-center gap-7">
        <LanguageDropdown />
        <Link
          href={'/overview'}
          className="px-4 py-2 bg-blue-400 hover:bg-blue-500 transition-colors text-white cursor-pointer rounded-lg"
        >
          {t('button.start')}
        </Link>
      </div>
    </header>
  );
};
