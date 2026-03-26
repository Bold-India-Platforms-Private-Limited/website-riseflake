import { SectionHeading } from '../atoms/SectionHeading';
import { SectionText } from '../atoms/SectionText';
import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';

export const SummarySection = ({ summary, titleColor }: { summary: string; titleColor: string }) => {
  return (
    <div className="mb-3">
      <SectionHeading title="Summary" color={titleColor} />
      <SectionText>
        <HTMLRenderer htmlString={summary} />
      </SectionText>
    </div>
  );
};
