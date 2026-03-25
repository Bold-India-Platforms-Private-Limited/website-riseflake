import styled from '@emotion/styled';
import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import { dateParser } from '@/helpers/utils';
import { IExperienceItem } from '@/stores/experience.interface';

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

const Title = styled.div`
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

const Desc = styled.div`
  margin-left: 120px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #4b5563;

  ul {
    padding-left: 16px;
    margin: 4px 0 0;
  }

  li {
    margin-bottom: 2px;
  }

  p {
    margin: 0;
  }
`;

export default function Work({ work }: { work: IExperienceItem[] }) {
  if (!work?.length) return null;

  const visibleWork = work.slice(0, 2); // agar limit chahiye

  return (
    <Wrapper>
      {visibleWork.map((w, i) => (
        <div key={i}>
          <HeaderRow>
            <Date>
              {dateParser(w.startDate)} – {w.isWorkingHere ? 'Present' : dateParser(w.endDate)}
            </Date>

            <Title>
              {w.position}, {w.name}
            </Title>

            {w.location && <Location>{w.location}</Location>}
          </HeaderRow>

          {w.summary && (
            <Desc>
              <HTMLRenderer htmlString={w.summary} />
            </Desc>
          )}
        </div>
      ))}
    </Wrapper>
  );
}
