import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import { dateParser } from '@/helpers/utils';
import { IExperienceItem } from '@/stores/experience.interface';
import styled from '@emotion/styled';

/* ================= CONTAINERS ================= */

const WorkContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

/* ================= ROW ================= */

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
`;

/* ================= TEXT ================= */

const Company = styled.h3`
  font-size: 13px;
  font-weight: 700;
  margin: 0;
  color: #1a1a1a;
`;

const Position = styled.span`
  font-size: 11.5px;
  font-weight: 600;
  color: #4b5563;
`;

const Meta = styled.span`
  font-size: 10.5px;
  color: #6b7280;
  white-space: nowrap;
`;

const Summary = styled.div`
  font-size: 11px;
  line-height: 1.4;
  color: #4b5563;

  ul {
    padding-left: 16px;
    margin: 2px 0 0;
  }

  li {
    margin-bottom: 2px;
  }

  p {
    margin: 0;
  }
`;

/* ================= COMPONENT ================= */

interface Props {
  work: IExperienceItem[];
}

export default function Work({ work }: Props) {
  if (!work || work.length === 0) return null;

  /* 🔥 ONLY FIRST 2 COMPANIES */
  const visibleWork = work.slice(0, 2);

  return (
    <WorkContainer>
      {visibleWork.map((item: IExperienceItem, index: number) => (
        <Item key={`${item.name}-${index}`}>
          <Row>
            <Company>{item.name}</Company>
            {item.location && <Meta>{item.location}</Meta>}
          </Row>

          <Row>
            <Position>{item.position}</Position>
            <Meta>
              {dateParser(item.startDate)} —{' '}
              {item.isWorkingHere ? 'Present' : dateParser(item.endDate)}
            </Meta>
          </Row>

          {item.summary && (
            <Summary>
              <HTMLRenderer htmlString={item.summary} />
            </Summary>
          )}
        </Item>
      ))}
    </WorkContainer>
  );
}
