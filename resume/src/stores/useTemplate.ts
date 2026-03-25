import { create } from 'zustand';
import { AVAILABLE_TEMPLATES } from '@/helpers/constants';
import { ITemplate, ITemplateContent } from '@/helpers/constants/index.interface';

export type BuilderMode = 'free' | 'trial' | 'paid';

const TRIAL_TEMPLATE_IDS = ['santiago', 'berlin', 'elegant', 'executive'];

const getTemplatesForMode = (mode: BuilderMode): ITemplate => {
  if (mode === 'trial') {
    return TRIAL_TEMPLATE_IDS.reduce<ITemplate>((acc, id) => {
      if (AVAILABLE_TEMPLATES[id]) {
        acc[id] = AVAILABLE_TEMPLATES[id];
      }

      return acc;
    }, {});
  }

  if (mode === 'paid') {
    return AVAILABLE_TEMPLATES;
  }

  return AVAILABLE_TEMPLATES;
};

const getFirstTemplate = (templates: ITemplate): ITemplateContent => {
  const firstKey = Object.keys(templates)[0];
  return templates[firstKey];
};

interface ITemplateStore {
  builderMode: BuilderMode;
  availableTemplate: ITemplate;
  activeTemplate: ITemplateContent;
  setTemplate: (template: ITemplateContent) => void;
  configureBuilderMode: (mode: BuilderMode) => void;
}

export const useTemplates = create<ITemplateStore>((set) => ({
  builderMode: 'free',
  availableTemplate: AVAILABLE_TEMPLATES,
  activeTemplate: AVAILABLE_TEMPLATES['modern'],

  setTemplate: (template: ITemplateContent) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedTemplateId', template.id);
    }

    set({ activeTemplate: template });
  },

  configureBuilderMode: (mode: BuilderMode) => {
    const templates = getTemplatesForMode(mode);
    const selectedTemplateId =
      typeof window !== 'undefined' ? localStorage.getItem('selectedTemplateId') : null;
    const nextTemplate =
      (selectedTemplateId && templates[selectedTemplateId]) || getFirstTemplate(templates);

    if (typeof window !== 'undefined' && nextTemplate) {
      localStorage.setItem('selectedTemplateId', nextTemplate.id);
    }

    set({
      builderMode: mode,
      availableTemplate: templates,
      activeTemplate: nextTemplate,
    });
  },
}));
