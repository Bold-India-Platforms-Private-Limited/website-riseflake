import styled from '@emotion/styled';
import { IEducation } from '@/stores/index.interface';
import { dateParser } from '@/helpers/utils';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 16px;
  align-items: baseline;
`;

const Date = styled.div`
  font-size: 11px;
  color: #6b7280;
`;

const Degree = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #1a1a1a;
`;

const Location = styled.div`
  font-size: 11px;
  color: #6b7280;
  opacity: 0.8;
  white-space: nowrap;
`;

export function Education({ education }: { education: IEducation[] }) {
  if (!education?.length) return null;

  return (
    <Wrapper>
      {education.map((e, i) => (
        <HeaderRow key={i}>
          <Date>
            {dateParser(e.startDate)} – {e.isStudyingHere ? 'Present' : dateParser(e.endDate)}
          </Date>

          <Degree>
            {e.studyType}, {e.institution}
          </Degree>

          {e.area && <Location>{e.area}</Location>}
        </HeaderRow>
      ))}
    </Wrapper>
  );
}
