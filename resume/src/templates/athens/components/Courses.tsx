import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 16px;
`;

const Item = styled.div`
  font-size: 11.5px;
  color: #4b5563;

  strong {
    font-size: 12px;
    display: block;
    color: #1a1a1a;
  }

  p {
    margin: 0;
    font-size: 10.5px;
    color: #6b7280;
  }
`;

export default function Courses({ data }: { data: any }) {
  if (!data) return null;

  if (Array.isArray(data)) {
    return (
      <Grid>
        {data.map((c, i) => (
          <Item key={i}>
            <strong>{c.title || c.name}</strong>
            {(c.issuer || c.awarder) && <p>{c.issuer || c.awarder}</p>}
          </Item>
        ))}
      </Grid>
    );
  }

  return <HTMLRenderer htmlString={data} />;
}
