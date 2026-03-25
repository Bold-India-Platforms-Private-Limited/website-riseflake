import { IEducation } from '@/stores/index.interface';
import { dateParser } from '@/helpers/utils';
import styled from '@emotion/styled';

/* ================= CONTAINER ================= */

const EducationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px; /* tight spacing */
`;

/* ================= ROWS ================= */

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

/* ================= TEXT ================= */

const Institution = styled.h3`
  font-size: 13px;
  font-weight: 700;
  margin: 0;
  color: #1a1a1a;
`;

const Degree = styled.div`
  font-size: 11.5px;
  font-weight: 600;
  color: #4b5563;
`;

const Meta = styled.span`
  font-size: 10.5px;
  color: #6b7280;
  white-space: nowrap;
`;

/* ================= COMPONENT ================= */

export const Education = ({ education }: { education: IEducation[] }) => {
  if (!education || education.length === 0) return null;

  return (
    <EducationContainer>
      {education.map((item, index) => (
        <Row key={index}>
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
