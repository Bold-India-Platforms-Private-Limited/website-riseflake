import styled from '@emotion/styled';
import { IEducation } from '@/stores/index.interface';
import { dateParser } from '@/helpers/utils';

const Item = styled.div`
  position: relative;
  padding-left: 20px;
  margin-bottom: 12px;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 4px;
    width: 8px;
    height: 8px;
    background: #111827;
    border-radius: 50%;
  }
`;

export function Education({ education }: { education: IEducation[] }) {
  if (!education?.length) return null;

  return (
    <>
      {education.map((e, i) => (
        <Item key={i}>
          <strong>
            {e.studyType} in {e.area}
          </strong>
          <div style={{ fontSize: 11, color: '#6b7280' }}>
            {e.institution} · {dateParser(e.startDate)} –{' '}
            {e.isStudyingHere ? 'Present' : dateParser(e.endDate)}
          </div>
        </Item>
      ))}
    </>
  );
}
