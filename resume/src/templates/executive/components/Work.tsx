import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import { dateParser } from '@/helpers/utils';
import { IExperienceItem } from '@/stores/experience.interface';
import styled from '@emotion/styled';

const WorkContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Position = styled.h3`
  font-size: 14.5px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.2;
`;

const CompanyName = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: #27345c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 1px;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: #666;
  font-weight: 600;
  margin-top: 3px;
  margin-bottom: 4px;
`;

const SummaryWrapper = styled.div`
  font-size: 12.5px;
  line-height: 1.4;
  color: #444;

  ul {
    list-style-type: disc !important;
    padding-left: 16px !important;
    margin: 0 !important;
  }

  li {
    margin-bottom: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  p {
    margin: 0;
  }
`;

export default function Work({ work = [] }: { work: IExperienceItem[] }) {
  if (!Array.isArray(work) || work.length === 0) return null;

  return (
    <WorkContainer>
      {work.map((company, index) => (
        <div key={`${company.name}-${index}`}>
          {/* Header Section */}
          <Position>{company.position}</Position>
          <CompanyName>{company.name}</CompanyName>

          <MetaRow>
            <span>
              {dateParser(company.startDate)} —{' '}
              {company.isWorkingHere ? 'Present' : dateParser(company.endDate)}
            </span>
            {company.location && <span>• {company.location}</span>}
          </MetaRow>
          <SummaryWrapper>
            <HTMLRenderer htmlString={company.summary} />
          </SummaryWrapper>
        </div>
      ))}
    </WorkContainer>
  );
}
