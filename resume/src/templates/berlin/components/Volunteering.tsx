import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import { dateParser } from '@/helpers/utils';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Org = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #27345c;
`;

const Role = styled.div`
  font-size: 11.5px;
  font-weight: 600;
  color: #444;
  margin-top: 2px;
`;

const Meta = styled.div`
  font-size: 10.5px;
  color: #666;
  margin-top: 2px;
`;

const Summary = styled.div`
  font-size: 11.5px;
  color: #4b5563;
  margin-top: 4px;
  line-height: 1.4;

  ul {
    padding-left: 16px;
    margin: 0;
  }

  p {
    margin: 0;
  }
`;

export default function Volunteering({ items = [] }: { items: any[] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <Container>
      {items.map((item, i) => (
        <div key={i}>
          <Org>{item.organization || item.name}</Org>
          {item.position && <Role>{item.position}</Role>}
          <Meta>
            {dateParser(item.startDate)} —{' '}
            {item.isVolunteeringHere ? 'Present' : dateParser(item.endDate)}
          </Meta>

          {item.summary && (
            <Summary>
              <HTMLRenderer htmlString={item.summary} />
            </Summary>
          )}
        </div>
      ))}
    </Container>
  );
}
