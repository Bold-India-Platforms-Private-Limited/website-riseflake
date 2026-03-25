import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const Container = styled.div`
  font-size: 11.5px;
  color: #374151;
  line-height: 1.5;

  ul {
    padding-left: 18px;
    margin: 6px 0 0;
  }

  li {
    margin-bottom: 6px;
  }

  p {
    margin: 0;
  }
`;

export default function Involvement({ items = [] }: { items: any[] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <Container>
      {items.map((item, i) => {
        // 🔥 HARD GUARD
        if (typeof item?.summary !== 'string') return null;

        return (
          <div key={i}>
            <HTMLRenderer htmlString={item.summary} />
          </div>
        );
      })}
    </Container>
  );
}
