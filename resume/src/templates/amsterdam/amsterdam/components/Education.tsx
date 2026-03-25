import { IEducation } from '@/stores/index.interface';
import styled from '@emotion/styled';
import { dateParser } from '@/helpers/utils';

const Item = styled.div`
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Title = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #111827;
`;

const Meta = styled.div`
  font-size: 11px;
  color: #6b7280;
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
