import { IEducation } from '@/stores/index.interface';
import { dateParser } from '@/helpers/utils';
import styled from '@emotion/styled';

const Item = styled.div`
  margin-bottom: 8px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Degree = styled.div`
  font-size: 12px;
  font-weight: 700;
`;

const Institute = styled.div`
  font-size: 11.5px;
  color: #4b5563;
`;

const Dates = styled.div`
  font-size: 10.5px;
  color: #6b7280;
`;

export default function Education({ education }: { education: IEducation[] }) {
  if (!education?.length) return null;

  return (
    <>
      {education.map((e, i) => (
        <Item key={i}>
          <Row>
            <Degree>
              {e.studyType}
              {e.area && `, ${e.area}`}
            </Degree>

            <Dates>
              {dateParser(e.startDate)} – {e.isStudyingHere ? 'Present' : dateParser(e.endDate)}
            </Dates>
          </Row>

          <Institute>{e.institution}</Institute>
        </Item>
      ))}
    </>
  );
}
