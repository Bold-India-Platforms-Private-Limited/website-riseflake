import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import { dateParser } from '@/helpers/utils';
import { IExperienceItem } from '@/stores/experience.interface';
import styled from '@emotion/styled';

const WorkContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CompanyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0px;
`;

const CompanyName = styled.h3`
  font-size: 13.5px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const Location = styled.span`
  font-size: 11px;
  color: #666;
  font-weight: 400;
`;

const RoleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1px;
`;

const Position = styled.span`
  font-size: 11.5px;
  font-weight: 600;
  color: #4b5563;
`;

const DateRange = styled.span`
  font-size: 10.5px;
  color: #888;
  letter-spacing: 0.1px;
`;

const SummaryWrapper = styled.div`
  font-size: 11px;
  line-height: 1.4;
  color: #4b5563;

  ul {
    list-style-type: disc;
    padding-left: 16px;
    margin-top: 2px;
    margin-bottom: 0;
  }

  li {
    margin-bottom: 2px;

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
          <CompanyHeader>
            <CompanyName>{company.name}</CompanyName>
            {company.location && <Location>{company.location}</Location>}
          </CompanyHeader>

          <RoleRow>
            <Position>{company.position}</Position>
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
