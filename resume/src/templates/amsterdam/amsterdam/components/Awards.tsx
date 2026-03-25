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
  gap: 6px; /* 🔽 reduced */
  break-inside: avoid;
  page-break-inside: avoid;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 20px;
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
  color: #111827;
`;

const Awarder = styled.div`
  font-size: 11.5px;
  color: #374151;
`;

const Summary = styled.div`
  font-size: 11.5px;
  line-height: 1.4;
  color: #374151;

  p {
    margin: 0;
  }

  li {
    margin-bottom: 2px;
  }
`;

export default function Awards({ items }: { items: AwardItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <Wrapper>
      {items.map((a, i) => (
        <Row key={i}>
          {/* LEFT: DATE */}
          <Date>{a.date ? dateParser(a.date) : ''}</Date>

          {/* RIGHT: CONTENT */}
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
