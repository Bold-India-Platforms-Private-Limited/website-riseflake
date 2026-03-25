import React, { useState } from 'react';

import DataHeaders from './components/EditHeaders';
import EditSection from './components/EditSection';
import ErrorBoundary from '@/helpers/common/components/ErrorBoundary';
import { OutlinedButton } from '@/helpers/common/atoms/Buttons';
import { headers } from '@/helpers/constants/editor-data';
import { resetResumeStore } from '@/stores/useResumeStore';
import PhotoUpload from '../resume/components/PhotoUpload';
import { useBasicDetails } from '@/stores/basic';

const EditorLayout = () => {
  const [link, setLink] = useState('');
  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false);

  const section = headers[link];
  const setImage = useBasicDetails((s) => s.setImage);

  const linkClickHandler = (link: string) => {
    setLink(link);
  };

  const displayElement = link ? (
    <EditSection section={section} onLinkClick={linkClickHandler} />
  ) : (
    <DataHeaders onLinkClick={linkClickHandler} />
  );

  return (
    <ErrorBoundary>
      <div className="bg-slate-50 h-full text-slate-800 p-8 overflow-auto relative no-scrollbar rounded-2xl shadow-lg border border-slate-200/50">
        {displayElement}

        <div className="mt-8 flex items-center gap-3">
          <OutlinedButton onClick={() => setIsPhotoUploadOpen(true)}>
            Change Profile Photo
          </OutlinedButton>

          <OutlinedButton onClick={resetResumeStore}>Reset all edits</OutlinedButton>
        </div>
        {isPhotoUploadOpen && (
          <PhotoUpload onClose={() => setIsPhotoUploadOpen(false)} setPhoto={setImage} />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default EditorLayout;
