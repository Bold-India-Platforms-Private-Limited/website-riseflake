import { ChangeEvent, useCallback, useRef, useState } from 'react';
import { NavBarActions, NavBarMenu, StyledButton } from './atoms';
import {
  useDatabases,
  useFrameworks,
  useLanguages,
  useLibraries,
  usePractices,
  useTechnologies,
  useTools,
} from '@/stores/skills';

import DEFAULT_RESUME_JSON from '@/helpers/constants/resume-data.json';
import Image from 'next/image';
import { withBasePath } from '@/utils/withBasePath';
import Link from 'next/link';
import { NavMenuItem } from './components/MenuItem';
import { PrintResume } from './components/PrintResume';
import { TemplateSelect } from './components/TemplateSelect';
import { ThemeSelect } from './components/ThemeSelect';
import { Toast } from '@/helpers/common/atoms/Toast';
import exportFromJSON from 'export-from-json';
import { useActivity } from '@/stores/activity';
import { useAwards } from '@/stores/awards';
import { useBasicDetails } from '@/stores/basic';
import { useEducations } from '@/stores/education';
import { useExperiences } from '@/stores/experience';
import { useVoluteeringStore } from '@/stores/volunteering';
import { useTemplates } from '@/stores/useTemplate';

const NavBarLayout = () => {
  const [openToast, setOpenToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const availableTemplate = useTemplates((state) => state.availableTemplate);
  const builderMode = useTemplates((state) => state.builderMode);
  const totalTemplatesAvailable = Object.keys(availableTemplate).length;

  const exportResumeData = useCallback(() => {
    const updatedResumeJson = {
      ...DEFAULT_RESUME_JSON,
      basics: {
        ...DEFAULT_RESUME_JSON.basics,
        ...useBasicDetails.getState().values,
      },
      work: useExperiences.getState().experiences,
      education: useEducations.getState().academics,
      awards: useAwards.getState().awards,
      volunteer: useVoluteeringStore.getState().volunteeredExps,
      skills: {
        languages: useLanguages.getState().get(),
        frameworks: useFrameworks.getState().get(),
        technologies: useTechnologies.getState().get(),
        libraries: useLibraries.getState().get(),
        databases: useDatabases.getState().get(),
        practices: usePractices.getState().get(),
        tools: useTools.getState().get(),
      },
      activities: useActivity.getState().activities,
    };

    const fileName = updatedResumeJson.basics.name + '_' + new Date().toLocaleString();
    const exportType = exportFromJSON.types.json;

    exportFromJSON({
      data: updatedResumeJson,
      fileName,
      exportType,
    });
  }, []);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) return;

    const reader = new FileReader();
    reader.readAsText(fileObj);
    event.target.value = '';

    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        const uploadedResumeJSON = JSON.parse(e.target.result);
        const {
          basics = {},
          skills = {},
          work = [],
          education = [],
          activities = { involvements: '', achievements: '' },
          volunteer = [],
          awards = [],
        } = uploadedResumeJSON;

        const {
          languages = [],
          frameworks = [],
          libraries = [],
          databases = [],
          technologies = [],
          practices = [],
          tools = [],
        } = skills;

        useBasicDetails.getState().reset(basics);
        useLanguages.getState().reset(languages);
        useFrameworks.getState().reset(frameworks);
        useLibraries.getState().reset(libraries);
        useDatabases.getState().reset(databases);
        useTechnologies.getState().reset(technologies);
        usePractices.getState().reset(practices);
        useTools.getState().reset(tools);
        useExperiences.getState().reset(work);
        useEducations.getState().reset(education);
        useVoluteeringStore.getState().reset(volunteer);
        useAwards.getState().reset(awards);
        useActivity.getState().reset(activities);

        setOpenToast(true);
      }
    };
  }, []);

  return (
    <nav className="h-16 w-full min-w-[calc(210mm+20rem)] md:min-w-0 bg-white sticky top-0 flex px-4 md:px-8 items-center border-b border-slate-100 z-20 print:hidden transition-all duration-300 shadow-sm">
      <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
        <Image
          src={withBasePath('/hero.jpg')}
          alt="logo"
          height={38}
          width={38}
          className="rounded-lg shadow-sm group-hover:shadow-md transition-all"
        />
        <span className="hidden md:block font-bold text-slate-800 text-lg tracking-tight">Riseflake</span>
      </Link>

      <div className="flex-auto min-w-0 flex justify-between items-center ml-4 md:ml-8">
        <div className="flex min-w-0 items-center">
          <NavBarMenu>
            <NavMenuItem
              caption="Settings"
              popoverChildren={
                <div className="w-[220px] bg-white rounded-lg p-2 shadow-lg">
                  <Link href="/profile" className="block">
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100"
                    >
                      Profile
                    </button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100"
                  >
                    Import
                  </button>
                  <button
                    type="button"
                    onClick={exportResumeData}
                    className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100"
                  >
                    Export
                  </button>
                  <div className="my-1 border-t border-slate-100" />
                  <Link href="/" className="block">
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Exit Builder
                    </button>
                  </Link>
                </div>
              }
            />
            <input
              type="file"
              hidden
              ref={fileInputRef}
              accept="application/json"
              onChange={handleFileChange}
            />
          </NavBarMenu>
        </div>

        <div className="flex items-center ml-2">
          <NavBarActions>
            <PrintResume />

            <NavBarMenu>
              <NavMenuItem
                caption={`Templates (${totalTemplatesAvailable})`}
                popoverChildren={<TemplateSelect />}
              />
            </NavBarMenu>

            <NavBarMenu>
              <NavMenuItem caption="Colours" popoverChildren={<ThemeSelect />} />
            </NavBarMenu>
          </NavBarActions>
        </div>
      </div>

      <Toast
        open={openToast}
        onClose={() => setOpenToast(false)}
        content="Resume data was successfully imported."
      />
    </nav>
  );
};

export default NavBarLayout;
