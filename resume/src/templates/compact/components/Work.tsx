import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import { dateParser } from '@/helpers/utils';
import { IExperienceItem } from '@/stores/experience.interface';
import styled from '@emotion/styled';

const WorkContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const JobTitle = styled.h3`
  font-size: 13.5px;
  font-weight: 700;
  color: #27345c;
  margin: 0;
  line-height: 1.2;
`;

const CompanyName = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #444;
  margin-top: 1px;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 10.5px;
  color: #666;
  font-weight: 500;
  margin-top: 2px;
`;

const SummaryWrapper = styled.div`
  font-size: 11.5px;
  color: #4b5563;
  margin-top: 5px;
  line-height: 1.4;

  ul,
  ol {
    list-style: none !important;
    padding: 0 !important;
    margin: 0;
  }

  li {
    position: relative;
    padding-left: 15px;
    margin-bottom: 3px;
    display: block;

    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: #9ca3af;
      font-size: 14px;
      line-height: 1;
      top: 1px;
    }
  }

  p {
    margin: 0;
    display: inline;
  }
`;

export default function Work({ work = [] }: { work: IExperienceItem[] }) {
  if (!Array.isArray(work) || work.length === 0) return null;

  return (
    <WorkContainer>
      {work.map((company, index) => (
        <div key={`${company.name}-${index}`} className="flex flex-col">
          <JobTitle>{company.position}</JobTitle>
          <CompanyName>{company.name}</CompanyName>
          <MetaRow>
            <span>
              {dateParser(company.startDate)} —{' '}
              {company.isWorkingHere ? 'Present' : dateParser(company.endDate)}
            </span>
            {company.location && <span>{company.location}</span>}
          </MetaRow>

          <SummaryWrapper>
            <HTMLRenderer htmlString={company.summary} />
          </SummaryWrapper>
        </div>
      ))}
    </WorkContainer>
  );
}
