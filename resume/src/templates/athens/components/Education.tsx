import { IEducation } from '@/stores/index.interface';
import { dateParser } from '@/helpers/utils';
import styled from '@emotion/styled';

const EducationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Institution = styled.h3`
  font-size: 13px;
  font-weight: 700;
  margin: 0;
`;

const Degree = styled.div`
  font-size: 11.5px;
  color: #4b5563;
  font-weight: 600;
`;

const Meta = styled.span`
  font-size: 10.5px;
  color: #6b7280;
  white-space: nowrap;
`;

export const Education = ({ education }: { education: IEducation[] }) => {
  if (!education?.length) return null;

  return (
    <EducationContainer>
      {education.map((item, i) => (
        <Row key={i}>
          <Left>
            <Institution>{item.institution}</Institution>
            <Degree>
              {item.studyType}
              {item.area ? ` in ${item.area}` : ''}
            </Degree>
          </Left>
          <Meta>
            {dateParser(item.startDate)} —{' '}
            {item.isStudyingHere ? 'Present' : dateParser(item.endDate)}
          </Meta>
        </Row>
      ))}
    </EducationContainer>
  );
};
