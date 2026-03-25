import { IExperienceItem } from '@/stores/experience.interface';
import { dateParser } from '@/helpers/utils';
import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const Item = styled.div`
  margin-bottom: 14px;
`;

const Title = styled.div`
  font-size: 13px;
  font-weight: 700;
`;

const Meta = styled.div`
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
`;

const Desc = styled.div`
  font-size: 12px;
  line-height: 1.45;

  p {
    margin: 0;
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
