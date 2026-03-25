import styled from '@emotion/styled';
import { IExperienceItem } from '@/stores/experience.interface';
import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import { dateParser } from '@/helpers/utils';

const Item = styled.div`
  position: relative;
  padding-left: 20px;
  margin-bottom: 14px;

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

  &::after {
    content: '';
    position: absolute;
    left: 3px;
    top: 14px;
    width: 2px;
    height: calc(100% - 14px);
    background: #e5e7eb;
  }
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 13px;
`;

const Meta = styled.div`
  font-size: 11px;
  color: #6b7280;
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
          <HTMLRenderer htmlString={w.summary} />
        </Item>
      ))}
    </>
  );
}
