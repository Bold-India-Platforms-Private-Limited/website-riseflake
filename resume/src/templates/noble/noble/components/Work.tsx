import { IExperienceItem } from '@/stores/experience.interface';
import { dateParser } from '@/helpers/utils';
import styled from '@emotion/styled';
import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';

const Item = styled.div`
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0; /* ✅ end gap removed */
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
  margin-bottom: 4px;
`;

const Desc = styled.div`
  font-size: 12px;
  line-height: 1.35;
  color: #1f2937;

  p,
  li,
  ul,
  span,
  strong,
  b {
    color: #1f2937 !important;
  }
`;

export default function Work({ work }: { work: IExperienceItem[] }) {
  if (!work?.length) return null;

  return (
    <>
      {work.map((w, i) => (
        <Item key={i}>
          <Title>
            {w.position} — {w.name}
          </Title>
          <Meta>
            {dateParser(w.startDate)} – {w.isWorkingHere ? 'Present' : dateParser(w.endDate)}
          </Meta>
          <Desc>
            <HTMLRenderer htmlString={w.summary} />
          </Desc>
        </Item>
      ))}
    </>
  );
}
