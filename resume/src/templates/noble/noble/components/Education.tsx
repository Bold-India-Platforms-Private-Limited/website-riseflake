import { IEducation } from '@/stores/index.interface';
import { dateParser } from '@/helpers/utils';
import styled from '@emotion/styled';

const Item = styled.div`
  margin-bottom: 6px;

  &:last-child {
    margin-bottom: 0; /* ✅ end gap removed */
  }
`;

const Title = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1px;
`;

const Meta = styled.div`
  font-size: 11px;
  color: #6b7280;
  line-height: 1.3;
`;

export function Education({ education }: { education: IEducation[] }) {
  if (!education?.length) return null;

  return (
    <>
      {education.map((e, i) => (
        <Item key={i}>
          <Title>
            {e.studyType} in {e.area}
          </Title>
          <Meta>
            {e.institution} • {dateParser(e.startDate)} –{' '}
            {e.isStudyingHere ? 'Present' : dateParser(e.endDate)}
          </Meta>
        </Item>
      ))}
    </>
  );
}
