import { Context, createContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { useResumeStore } from '@/stores/useResumeStore';
import { useTemplates } from '@/stores/useTemplate';
import { useThemes } from '@/stores/themes';
import { useZoom } from '@/stores/useZoom';
import ResumeController from './atoms/ResumeController';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const StateContext = createContext<any>(null);

export const ResumeLayout = () => {
  const resumeData = useResumeStore();
  const zoom = useZoom((state) => state.zoom);
  const { zoomIn, zoomOut, resetZoom } = useZoom.getState();

  const activeTemplate = useTemplates((state) => state.activeTemplate);
  const Template = activeTemplate?.component;
  const selectedTheme = useThemes((state) => state.selectedTheme);

  const image = resumeData.basics.image;

  const safeResumeData = {
    ...resumeData,
    basics: {
      ...resumeData.basics,
      image: typeof image === 'string' && !image.startsWith('blob:') ? image : '',
    },
  };



  return (
    <div className="mx-5 print:mx-0 mb-2 print:mb-0">
      <div className="relative w-[210mm] mx-auto">
        <div className="absolute -right-9 top-2 z-10 print:hidden">
          <ResumeController
            zoomIn={zoomIn}
            zoomOut={zoomOut}
            resetZoom={resetZoom}
            showReset={false}
          />
        </div>

        <div
          style={{ transform: `scale(${zoom})` }}
          className="origin-top transition-all duration-300 ease-linear
                   print:scale-100 print:transform-none"
        >
          <div className="w-[210mm] min-h-[594mm] bg-white my-0 mx-auto relative shadow-2xl">
            {/* Page Break Indicator */}
            <div className="absolute top-[297mm] left-[-20px] right-[-20px] border-t-2 border-dashed border-indigo-200 z-0 pointer-events-none print:hidden flex justify-center">
              <span className="bg-white px-3 py-1 text-[10px] text-indigo-400 font-extrabold -mt-3.5 rounded-full border border-indigo-100 shadow-sm animate-pulse">
                PAGE 1 ENDS HERE
              </span>
            </div>
            <StateContext.Provider value={safeResumeData}>
              <ThemeProvider theme={selectedTheme}>{Template && <Template />}</ThemeProvider>
            </StateContext.Provider>
          </div>
        </div>
      </div>
    </div>
  );
};
