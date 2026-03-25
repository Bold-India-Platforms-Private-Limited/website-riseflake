import { IExperienceItem } from '@/stores/experience.interface';
import { dateParser } from '@/helpers/utils';
import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const Item = styled.div`
  margin-bottom: 14px;
`;

const Role = styled.div`
  font-size: 13.5px; /* 🔥 sub-heading thodi chhoti */
  font-weight: 700;
  color: #111827;
`;

const Date = styled.div`
  font-size: 11px; /* 🔽 clearly smaller */
  color: #6b7280;
  margin: 2px 0 6px;
`;

const Summary = styled.div`
  font-size: 11.5px;
  line-height: 1.45;
  color: #374151;

  ul {
    padding-left: 16px;
    margin: 0;
  }

  li {
    margin-bottom: 3px;
  }

  p {
    margin: 0;
  }
`;

export default function Work({ work }: { work: IExperienceItem[] }) {
  if (!work || work.length === 0) return null;

  return (
    <>
      {work.map((w, i) => (
        <Item key={i}>
          <Role>
            {w.position} — {w.name}
          </Role>

          <Date>
            {dateParser(w.startDate)} – {w.isWorkingHere ? 'Present' : dateParser(w.endDate)}
          </Date>

          {w.summary && (
            <Summary>
              <HTMLRenderer htmlString={w.summary} />
            </Summary>
          )}
        </Item>
      ))}
    </>
  );
}
