import { IEducation } from '@/stores/index.interface';
import { dateParser } from '@/helpers/utils';
import styled from '@emotion/styled';

const EduContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: white;
`;

const EduItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-bottom: 8px;
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const Degree = styled.p`
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
  color: white;
  margin: 0;
`;

const Institution = styled.p`
  font-size: 11.5px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
`;

const DateRange = styled.p`
  font-size: 10px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.3px;
  margin: 0;
  text-transform: uppercase;
`;

export const Education = ({ education }: { education: IEducation[] }) => {
  if (!education || education.length === 0) return null;

  return (
    <EduContainer>
      {education.map((item: IEducation, index: number) => {
        return (
          <EduItem key={index}>
            <Degree>
              {item.studyType} {item.area}
            </Degree>
            <Institution>{item.institution}</Institution>
            <DateRange>
              {dateParser(item.startDate)} —{' '}
              {item.isStudyingHere ? 'Present' : dateParser(item.endDate)}
            </DateRange>
          </EduItem>
        );
      })}
    </EduContainer>
  );
};
