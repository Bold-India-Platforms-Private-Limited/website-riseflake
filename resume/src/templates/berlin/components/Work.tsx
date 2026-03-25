import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import { dateParser } from '@/helpers/utils';
import { IExperienceItem } from '@/stores/experience.interface';
import styled from '@emotion/styled';

const WorkContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const JobTitle = styled.h3`
  font-size: 13px;
  font-weight: 700;
  margin: 0;
`;

const Company = styled.div`
  font-size: 11.5px;
  font-weight: 600;
  color: #555;
  margin-top: 2px;
`;

const Meta = styled.div`
  font-size: 10.5px;
  color: #777;
  margin-top: 2px;
`;

const Summary = styled.div`
  margin-top: 6px;
  font-size: 11.5px;
  color: #4b5563;
  line-height: 1.5;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding-left: 14px;
    position: relative;
    margin-bottom: 4px;

    &::before {
      content: '–';
      position: absolute;
      left: 0;
      color: #9ca3af;
    }
  }
`;

export default function Work({ work = [] }: { work: IExperienceItem[] }) {
  if (!Array.isArray(work) || work.length === 0) return null;

  return (
    <WorkContainer>
      {work.map((item, i) => (
        <div key={i}>
          <JobTitle>{item.position}</JobTitle>
          <Company>{item.name}</Company>
          <Meta>
            {dateParser(item.startDate)} –{' '}
            {item.isWorkingHere ? 'Present' : dateParser(item.endDate)}
            {item.location && ` · ${item.location}`}
          </Meta>

          <Summary>
            <HTMLRenderer htmlString={item.summary} />
          </Summary>
        </div>
      ))}
    </WorkContainer>
  );
}
