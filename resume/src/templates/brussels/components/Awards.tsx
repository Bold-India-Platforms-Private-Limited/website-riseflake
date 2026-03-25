import styled from '@emotion/styled';
import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import { dateParser } from '@/helpers/utils';

interface AwardItem {
  title: string;
  awarder?: string;
  date?: string;
  summary?: string;
}

/* ================= WRAPPER ================= */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  break-inside: avoid;
  page-break-inside: avoid;
`;

/* ================= ROW ================= */

const Row = styled.div`
  display: grid;
  grid-template-columns: 90px 1fr; /* ⬅️ tighter for your layout */
  gap: 14px;
`;

/* ================= LEFT ================= */

const Date = styled.div`
  font-size: 10.5px;
  color: #6b7280;
  line-height: 1.3;
`;

/* ================= RIGHT ================= */

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Title = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #111827;
  line-height: 1.25;
`;

const Awarder = styled.div`
  font-size: 11px;
  color: #374151;
  line-height: 1.3;
`;

const Summary = styled.div`
  font-size: 11px;
  line-height: 1.4;
  color: #374151;

  p {
    margin: 0;
  }

  ul {
    margin: 2px 0 0;
    padding-left: 14px;
  }

  li {
    margin-bottom: 2px;
  }
`;

/* ================= COMPONENT ================= */

export default function Awards({ items }: { items: AwardItem[] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <Wrapper>
      {items.map((a, i) => (
        <Row key={i}>
          {/* DATE */}
          <Date>{a.date ? dateParser(a.date) : ''}</Date>

          {/* CONTENT */}
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
