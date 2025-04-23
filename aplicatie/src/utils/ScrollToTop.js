import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Asigură-te că funcționează pe toate paginile
    window.scrollTo({ top: 0, behavior: 'instant' }); // sau 'smooth' dacă vrei animat
  }, [pathname]);

  return null;
};

export default ScrollToTop;
