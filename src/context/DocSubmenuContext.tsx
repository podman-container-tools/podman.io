import React, { createContext, useContext, useState, useEffect } from 'react';

export interface TOCHeading {
  value: string;
  id: string;
  level: number;
}

interface DocSubmenuContextType {
  toc: TOCHeading[];
  activeHeadingId: string;
  openCategoryId: string | null;
  openGuideId: string | null;
  setDocTOC: (toc: TOCHeading[]) => void;
  setActiveHeadingId: (id: string) => void;
  setOpenCategoryId: React.Dispatch<React.SetStateAction<string | null>>;
  setOpenGuideId: React.Dispatch<React.SetStateAction<string | null>>;
}

const DocSubmenuContext = createContext<DocSubmenuContextType>({
  toc: [],
  activeHeadingId: '',
  openCategoryId: null,
  openGuideId: 'getting-started',
  setDocTOC: () => undefined,
  setActiveHeadingId: () => undefined,
  setOpenCategoryId: () => undefined,
  setOpenGuideId: () => undefined,
});

export const DocSubmenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toc, setDocTOC] = useState<TOCHeading[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [openGuideId, setOpenGuideId] = useState<string | null>('getting-started');

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
    <DocSubmenuContext.Provider
      value={{
        toc,
        activeHeadingId,
        openCategoryId,
        openGuideId,
        setDocTOC,
        setActiveHeadingId,
        setOpenCategoryId,
        setOpenGuideId,
      }}>
      {children}
    </DocSubmenuContext.Provider>
  );
};

export const useDocSubmenu = () => useContext(DocSubmenuContext);
