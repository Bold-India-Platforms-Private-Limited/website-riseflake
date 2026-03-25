import { lazy, Suspense, useEffect, useState } from 'react';

const PhotoUpload = lazy(() => import('@/modules/builder/resume/components/PhotoUpload'));

type Props = {
  src: string;
  height?: string;
  width?: string;
  setPhoto: (url: string) => void;
};

export const ProfilePhoto = ({ src, height, width, setPhoto }: Props) => {
  const [open, setOpen] = useState(false);
  const [safeSrc, setSafeSrc] = useState<string>('/default-avatar.png');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);

    if (
      typeof src === 'string' &&
      (src.startsWith('blob:') ||
        src.startsWith('data:image') ||
        src.startsWith('http') ||
        src.startsWith('/'))
    ) {
      setSafeSrc(src);
    } else {
      setSafeSrc('/default-avatar.png');
    }
  }, [src]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
        style={{ height, width }}
        aria-label="Change profile photo"
      >
        <img
          src={hasError ? '/default-avatar.png' : safeSrc}
          alt="Profile"
          className="h-full w-full object-cover"
          draggable={false}
          onError={() => {
            setHasError(true);
          }}
        />
      </button>

      {open && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-xl p-4 text-sm shadow">Loading photo editor…</div>
            </div>
          }
        >
          <PhotoUpload
            onClose={() => setOpen(false)}
            setPhoto={(url: string) => {
              if (
                url.startsWith('blob:') ||
                url.startsWith('data:image') ||
                url.startsWith('http')
              ) {
                setPhoto(url);
              }
            }}
          />
        </Suspense>
      )}
    </>
  );
};
