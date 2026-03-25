import { IEducation } from '@/stores/index.interface';
import { dateParser } from '@/helpers/utils';
import styled from '@emotion/styled';

const Item = styled.div`
  margin-bottom: 14px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Degree = styled.div`
  font-size: 12px;
  font-weight: 700;
`;

const School = styled.div`
  font-size: 11.5px;
  color: #555;
  margin-top: 2px;
`;

const Meta = styled.div`
  font-size: 10.5px;
  color: #777;
  margin-top: 2px;
`;

export const Education = ({ education = [] }: { education: IEducation[] }) => {
  if (!Array.isArray(education) || education.length === 0) return null;

  return (
    <>
      {education.map((e, i) => (
        <Item key={i}>
          <Degree>
            {e.studyType} {e.area && `in ${e.area}`}
          </Degree>
          <School>{e.institution}</School>
          <Meta>
            {dateParser(e.startDate)} – {e.isStudyingHere ? 'Present' : dateParser(e.endDate)}
            {e.score && ` · GPA ${e.score}`}
          </Meta>
        </Item>
      ))}
    </>
  );
};
