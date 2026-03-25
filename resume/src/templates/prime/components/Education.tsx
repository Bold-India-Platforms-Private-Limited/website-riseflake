import { IEducation } from '@/stores/index.interface';
import { dateParser } from '@/helpers/utils';
import styled from '@emotion/styled';

const EducationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
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

const Institution = styled.h3`
  font-size: 13px;
  font-weight: 700;
  margin: 0;
`;

const Location = styled.span`
  font-size: 11px;
  color: #666;
`;

const DegreeRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: baseline;
  gap: 6px;
`;

const StudyInfo = styled.span`
  font-size: 11.5px;
  font-weight: 600;
  color: #4b5563;
`;

const DateRange = styled.span`
  font-size: 10.5px;
  color: #888;
`;

export const Education = ({ education }: { education: IEducation[] }) => {
  if (!education || education.length === 0) return null;

  return (
    <EducationContainer>
      {education.map((item, index) => (
        <div key={index}>
          <HeaderRow>
            <Institution>{item.institution}</Institution>
            <Dots />
            <Location>{item.url?.replace('https://', '') || 'Denver, Colorado'}</Location>
          </HeaderRow>

          <DegreeRow>
            <StudyInfo>
              {item.studyType}
              {item.area ? ` in ${item.area}` : ''}
            </StudyInfo>
            <Dots />
            <DateRange>
              {dateParser(item.startDate)} —{' '}
              {item.isStudyingHere ? 'Present' : dateParser(item.endDate)}
            </DateRange>
          </DegreeRow>
        </div>
      ))}
    </EducationContainer>
  );
};
