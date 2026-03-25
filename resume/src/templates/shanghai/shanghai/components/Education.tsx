import { IEducation } from '@/stores/index.interface';
import { dateParser } from '@/helpers/utils';
import styled from '@emotion/styled';

const Block = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 14px; /* 🔥 education-to-education spacing */
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
`;

const Institution = styled.div`
  font-size: 13px;
  font-weight: 700;
  margin: 0;
`;

const Degree = styled.div`
  font-size: 11.5px;
  color: #4b5563;
  margin-top: 2px;
`;

const Right = styled.div`
  font-size: 10.5px;
  color: #6b7280;
  white-space: nowrap;
`;

export default function Education({ education }: { education: IEducation[] }) {
  if (!education?.length) return null;

  return (
    <>
      {education.map((e, i) => (
        <Block key={i}>
          <Left>
            <Institution>{e.institution}</Institution>
            <Degree>
              {e.studyType}
              {e.area && ` in ${e.area}`}
            </Degree>
          </Left>

          <Right>
            {dateParser(e.startDate)} — {e.isStudyingHere ? 'Present' : dateParser(e.endDate)}
          </Right>
        </Block>
      ))}
    </>
  );
}
