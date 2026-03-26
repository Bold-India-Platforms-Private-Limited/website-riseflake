import { useTemplates } from '@/stores/useTemplate';
import { useZoom } from '@/stores/useZoom';
import ResumeController from '../atoms/ResumeController';
import { ResumeTitle } from '../atoms/ResumeTitle';

const ResumeHeader = () => {
  const { zoomIn, zoomOut, resetZoom } = useZoom.getState();
  const templateName = useTemplates((state) => state.activeTemplate.name);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <ResumeTitle title={templateName} />
        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
          {useTemplates.getState().builderMode} mode
        </span>
      </div>
      <ResumeController
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        resetZoom={resetZoom}
        showZoomControls={false}
      />
    </div>
  );
};

export default ResumeHeader;
