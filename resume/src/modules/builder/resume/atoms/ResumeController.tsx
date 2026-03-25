import Image from 'next/image';
import { ReactNode } from 'react';
import Tooltip from '@mui/material/Tooltip';

const ResumeController = ({
  zoomIn,
  zoomOut,
  resetZoom,
  showZoomControls = true,
  showReset = true,
}: {
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  showZoomControls?: boolean;
  showReset?: boolean;
}) => {
  return (
    <div className="flex">
      <div className="flex items-center gap-5">
        {showZoomControls && (
          <div className="flex flex-col items-center gap-2">
            <TooltipRenderer title="Zoom out">
              <Image
                src="/icons/zoom-out.svg"
                className="cursor-pointer"
                alt="Zoom out"
                width="24"
                height="24"
                onClick={zoomOut}
              />
            </TooltipRenderer>
            <TooltipRenderer title="Zoom in">
              <Image
                src="/icons/zoom-in.svg"
                className="cursor-pointer"
                alt="Zoom in"
                width="24"
                height="24"
                onClick={zoomIn}
              />
            </TooltipRenderer>
          </div>
        )}
        {showReset && (
          <TooltipRenderer title="Reset zoom">
            <Image
              src="/icons/reset-zoom.svg"
              className="cursor-pointer"
              alt="Reset zoom"
              width="24"
              height="24"
              onClick={resetZoom}
            />
          </TooltipRenderer>
        )}
      </div>
    </div>
  );
};

export default ResumeController;

function TooltipRenderer({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Tooltip title={title}>
      <div className="w-auto h-auto flex">{children}</div>
    </Tooltip>
  );
}
