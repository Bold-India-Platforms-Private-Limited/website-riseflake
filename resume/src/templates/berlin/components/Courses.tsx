import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Item = styled.div`
  font-size: 11.5px;
  color: #4b5563;

  strong,
  b {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: #111;
    margin-bottom: 2px;
  }

  p {
    margin: 0;
    font-size: 10.5px;
    color: #6b7280;
  }

  ul {
    margin-top: 4px;
    padding-left: 16px;
  }

  li {
    margin-bottom: 3px;
  }
`;

export default function Courses({ data }: { data: any }) {
  if (!data) return null;
  const items = Array.isArray(data) ? data : data?.items;

  if (Array.isArray(items)) {
    if (!items.length) return null;
    return (
      <Container>
        {items.map((item, i) => (
          <Item key={i}>
            <strong>{item.title || item.name}</strong>
            {(item.issuer || item.institution) && <p>{item.issuer || item.institution}</p>}
            {item.summary && <HTMLRenderer htmlString={item.summary} />}
          </Item>
        ))}
      </Container>
    );
  }

  if (typeof data === 'string') {
    if (data.trim() === '' || data === '<p><br></p>') return null;
    return (
      <Container>
        <Item>
          <HTMLRenderer htmlString={data} />
        </Item>
      </Container>
    );
  }

  return null;
}
