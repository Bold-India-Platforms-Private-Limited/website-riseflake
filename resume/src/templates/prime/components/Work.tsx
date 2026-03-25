import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import { dateParser } from '@/helpers/utils';
import { IExperienceItem } from '@/stores/experience.interface';
import styled from '@emotion/styled';

const WorkContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: baseline;
  gap: 6px;
`;

const Dots = styled.div`
  border-bottom: 1px dotted #9ca3af;
  height: 1px;
  margin-bottom: 3px;
`;

const CompanyName = styled.h3`
  font-size: 13.5px;
  font-weight: 700;
  margin: 0;
`;

const Location = styled.span`
  font-size: 11px;
  color: #666;
`;

const RoleRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: baseline;
  gap: 6px;
`;

const Position = styled.span`
  font-size: 11.5px;
  font-weight: 600;
  color: #4b5563;
`;

const DateRange = styled.span`
  font-size: 10.5px;
  color: #888;
`;

const SummaryWrapper = styled.div`
  font-size: 11px;
  line-height: 1.32;
  color: #4b5563;

  ul {
    list-style-type: disc;
    padding-left: 16px;
    margin: 1px 0 0;
  }

  li {
    margin-bottom: 1px;
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
          <HeaderRow>
            <CompanyName>{company.name}</CompanyName>
            <Dots />
            {company.location && <Location>{company.location}</Location>}
          </HeaderRow>

          <RoleRow>
            <Position>{company.position}</Position>
            <Dots />
            <DateRange>
              {dateParser(company.startDate)} —{' '}
              {company.isWorkingHere ? 'Present' : dateParser(company.endDate)}
            </DateRange>
          </RoleRow>

          <SummaryWrapper>
            <HTMLRenderer htmlString={company.summary} />
          </SummaryWrapper>
        </div>
      ))}
    </WorkContainer>
  );
}
