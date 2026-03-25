import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import { dateParser } from '@/helpers/utils';
import { IExperienceItem } from '@/stores/experience.interface';
import styled from '@emotion/styled';
import { useThemes } from '@/stores/themes';

const WorkContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const JobHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1px;
`;

const Position = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DateRange = styled.span`
  font-size: 11px;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
`;

const CompanyRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
`;
const CompanyName = styled.span<{ themeColor?: string }>`
  font-size: 13px;
  font-weight: 600;
  /* If a themeColor is passed, use it; otherwise fallback to the original teal */
  color: ${(props) => props.themeColor || '#00796b'};
  transition: color 0.3s ease;
`;

const Location = styled.span`
  font-size: 11px;
  color: #888;
  font-style: italic;
`;

const SummaryWrapper = styled.div`
  font-size: 12px;
  line-height: 1.35;
  color: #444;

  ul {
    list-style-type: disc;
    padding-left: 15px;
    margin-top: 3px;
    margin-bottom: 0;
  }

  li {
    margin-bottom: 3px;
    padding-left: 2px;
  }

  p {
    margin: 0;
  }
`;

export default function Work({ work = [] }: { work: IExperienceItem[] }) {
  const activeTheme = useThemes((state) => state.selectedTheme);

  if (!Array.isArray(work) || work.length === 0) return null;

  return (
    <WorkContainer>
      {work.map((company, index) => (
        <div key={`${company.name}-${index}`}>
          <JobHeader>
            <Position>{company.position}</Position>
            <DateRange>
              {dateParser(company.startDate)} —{' '}
              {company.isWorkingHere ? 'Present' : dateParser(company.endDate)}
            </DateRange>
          </JobHeader>

          <CompanyRow>
            <CompanyName themeColor={activeTheme.titleColor}>{company.name}</CompanyName>
            {company.location && <Location>{company.location}</Location>}
          </CompanyRow>

          <SummaryWrapper>
            <HTMLRenderer htmlString={company.summary} />
          </SummaryWrapper>
        </div>
      ))}
    </WorkContainer>
  );
}
