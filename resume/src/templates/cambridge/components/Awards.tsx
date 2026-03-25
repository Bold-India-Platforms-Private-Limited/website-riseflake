import styled from '@emotion/styled';
import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import { dateParser } from '@/helpers/utils';

interface AwardItem {
  title: string;
  awarder?: string;
  date?: string;
  summary?: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 24px;
`;

const Date = styled.div`
  font-size: 11px;
  color: #6b7280;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Title = styled.div`
  font-size: 12.5px;
  font-weight: 700;
`;

const Awarder = styled.div`
  font-size: 11.5px;
  color: #374151;
`;

const Summary = styled.div`
  font-size: 11.5px;
  color: #374151;

  p {
    margin: 0;
  }
`;

export default function Awards({ items }: { items: AwardItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <Wrapper>
      {items.map((a, i) => (
        <Row key={i}>
          {/* DATE LEFT */}
          <Date>{a.date ? dateParser(a.date) : ''}</Date>

          {/* CONTENT RIGHT */}
          <Content>
            <Title>{a.title}</Title>
            {a.awarder && <Awarder>{a.awarder}</Awarder>}
            {a.summary && (
              <Summary>
                <HTMLRenderer htmlString={a.summary} />
              </Summary>
            )}
          </Content>
        </Row>
      ))}
    </Wrapper>
  );
}
