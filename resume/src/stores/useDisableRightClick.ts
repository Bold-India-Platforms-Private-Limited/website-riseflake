import { P } from 'node_modules/framer-motion/dist/types.d-DagZKalS';
import { useEffect } from 'react';

export function useDisableRightClick() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'production') {
      const disableRightClick = (e: MouseEvent) => {
        e.preventDefault();
      };
      document.addEventListener('contextmenu', disableRightClick);
      return () => {
        document.removeEventListener('contextmenu', disableRightClick);
      };
    }
  }, []);
}
