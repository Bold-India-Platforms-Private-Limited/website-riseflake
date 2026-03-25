import { IEducation } from '@/stores/index.interface';
import { dateParser } from '@/helpers/utils';
import styled from '@emotion/styled';

const EducationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EduHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0px;
`;

const Institution = styled.h3`
  font-size: 13px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const Location = styled.span`
  font-size: 11px;
  color: #666;
  font-weight: 400;
`;

const DegreeRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 1px;
`;

const StudyInfo = styled.span`
  font-size: 11.5px;
  font-weight: 600;
  color: #4b5563;
`;

const DateRange = styled.span`
  font-size: 10.5px;
  color: #888;
  letter-spacing: 0.1px;
`;

export const Education = ({ education }: { education: IEducation[] }) => {
  if (!education || education.length === 0) return null;

  return (
    <EducationContainer>
      {education.map((item: IEducation, index: number) => {
        return (
          <div key={index}>
            <EduHeader>
              <Institution>{item.institution}</Institution>
              <Location>{item.url?.replace('https://', '') || 'Denver, Colorado'}</Location>
            </EduHeader>

            <DegreeRow>
              <StudyInfo>
                {item.studyType}
                {item.area ? ` in ${item.area}` : ''}
              </StudyInfo>
              <DateRange>
                {dateParser(item.startDate)} —{' '}
                {item.isStudyingHere ? 'Present' : dateParser(item.endDate)}
              </DateRange>
            </DegreeRow>
          </div>
        );
      })}
    </EducationContainer>
  );
};
