import { SectionHeading } from '../atoms/SectionHeading';
import { SectionText } from '../atoms/SectionText';
import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';

export const Objective = ({ objective, titleColor }: { objective: string; titleColor: string }) => {
  return (
    <>
      <SectionHeading title="Objective" color={titleColor} />
      <SectionText>
        <HTMLRenderer htmlString={objective} />
      </SectionText>
    </>
  );
};
