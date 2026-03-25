import { IEducation } from '@/stores/index.interface';
import { dateParser } from '@/helpers/utils';
import styled from '@emotion/styled';

const Item = styled.div`
  margin-bottom: 12px;
`;

const Degree = styled.div`
  font-size: 13.5px; /* 🔥 clear hierarchy */
  font-weight: 700;
  color: #111827;
`;

const Meta = styled.div`
  font-size: 11px; /* 🔽 smaller than degree */
  color: #6b7280;
  margin-top: 2px;
`;

export function Education({ education }: { education: IEducation[] }) {
  if (!education || education.length === 0) return null;

  return (
    <>
      {education.map((e, i) => (
        <Item key={i}>
          <Degree>
            {e.studyType}
            {e.area ? ` in ${e.area}` : ''}
          </Degree>

          <Meta>
            {e.institution} — {dateParser(e.startDate)} –{' '}
            {e.isStudyingHere ? 'Present' : dateParser(e.endDate)}
          </Meta>
        </Item>
      ))}
    </>
  );
}
