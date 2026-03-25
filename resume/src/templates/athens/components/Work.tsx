import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import { dateParser } from '@/helpers/utils';
import { IExperienceItem } from '@/stores/experience.interface';
import styled from '@emotion/styled';

const WorkContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: baseline;
`;

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
  line-height: 1.45;
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

export default function Work({ work }: { work: IExperienceItem[] }) {
  if (!work?.length) return null;

  const visibleWork = work.slice(0, 3);
  return (
    <WorkContainer>
      {visibleWork.map((item, i) => (
        <Item key={i}>
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
