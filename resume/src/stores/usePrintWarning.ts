// import { useEffect } from 'react';

// export const usePrintWarning = (onWarn: () => void) => {
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.ctrlKey && e.key.toLowerCase() === 'p') {
//         e.preventDefault();
//         onWarn();
//       }
//     };

//     const handleBeforePrint = () => {
//       onWarn();
//     };

//     const handleVisibilityChange = () => {
//       if (document.visibilityState === 'hidden') {
//         onWarn();
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('beforeprint', handleBeforePrint);
//     document.addEventListener('visibilitychange', handleVisibilityChange);

//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('beforeprint', handleBeforePrint);
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, [onWarn]);
// };
