import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const app = document.querySelector('.App');
    const root = document.getElementById('root');

    if (app) {
      app.scrollTop = 0;
    }

    if (root) {
      root.scrollTop = 0;
    }

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'instant' });

    console.log('Scroll to top triggered on:', pathname);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
