import { Fragment, ReactNode } from 'react';
// import { IExperienceItem } from '@/stores/experience.interface';
// import { IEducationItem } from '@/stores/education.interface';
// import { IAwardItem } from '@/stores/awards.interface';
// import { IVolunteeringItem } from '@/stores/volunteering.interface';
// import { ISkillItem } from '@/stores/skill.interface';

// export const SectionValidator = ({
//   value,
//   children,
// }: {
//   value:
//     | string
//     | IExperienceItem[]
//     | IEducationItem[]
//     | IAwardItem[]
//     | IVolunteeringItem[]
//     | ISkillItem[];
//   children: ReactNode;
// }) => {
//   const isValid = useMemo(() => {
//     return (value || '').length > 0;
//   }, [value]);

//   if (!isValid) {
//     return null;
//   }

//   return <Fragment>{children}</Fragment>;
// };

export const SectionValidator = ({ value, children }: { value: any; children: ReactNode }) => {
  // If value exists and is a string with length, or an array with items, show it.
  // We remove useMemo and complex logic to ensure it doesn't fail.
  const hasContent =
    (typeof value === 'string' && value.length > 0) ||
    (Array.isArray(value) && value.length > 0) ||
    (value && typeof value === 'object' && Object.keys(value).length > 0);

  if (!hasContent) {
    return null;
  }

  return <Fragment>{children}</Fragment>;
};
