import React, { createContext, useContext, useState, useEffect } from 'react';

export interface TOCHeading {
  value: string;
  id: string;
  level: number;
}

interface DocSubmenuContextType {
  toc: TOCHeading[];
  activeHeadingId: string;
  setDocTOC: (toc: TOCHeading[]) => void;
  setActiveHeadingId: (id: string) => void;
}

const DocSubmenuContext = createContext<DocSubmenuContextType>({
  toc: [],
  activeHeadingId: '',
  setDocTOC: () => {},
  setActiveHeadingId: () => {},
});

export const DocSubmenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toc, setDocTOC] = useState<TOCHeading[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined' || !toc || toc.length === 0) return;

    const handleScroll = () => {
      const headingElements = toc
        .map(h => document.getElementById(h.id))
        .filter((el): el is HTMLElement => el !== null);

      if (headingElements.length === 0) return;

      const scrollPosition = window.scrollY + 140;
      let currentActive = headingElements[0].id;

      for (const el of headingElements) {
        if (el.offsetTop <= scrollPosition) {
          currentActive = el.id;
        } else {
          break;
        }
      }

      setActiveHeadingId(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  return (
    <DocSubmenuContext.Provider value={{ toc, activeHeadingId, setDocTOC, setActiveHeadingId }}>
      {children}
    </DocSubmenuContext.Provider>
  );
};

export const useDocSubmenu = () => useContext(DocSubmenuContext);
