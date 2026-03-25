import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 16px;
  margin-top: 2px;

  @media print {
    grid-template-columns: 1fr 1fr;
  }
`;

const Item = styled.div`
  font-size: 11px;
  line-height: 1.35;
  color: #4b5563;

  strong {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 1px;
  }

  p {
    margin: 0;
    font-size: 10.5px;
    color: #6b7280;
    font-weight: 600;
  }

  ul {
    padding-left: 14px;
    margin: 2px 0 0;
  }

  li {
    margin-bottom: 2px;
  }
`;

export default function Courses({ data }: { data: any }) {
  if (!data || data === '<p><br></p>') return null;

  if (Array.isArray(data) && data.length > 0) {
    return (
      <Grid>
        {data.map((item, i) => (
          <Item key={i}>
            <strong>{item.title || item.name}</strong>
            {(item.awarder || item.issuer || item.authority || item.institution) && (
              <p>{item.awarder || item.issuer || item.authority || item.institution}</p>
            )}
            {item.summary && <HTMLRenderer htmlString={item.summary} />}
          </Item>
        ))}
      </Grid>
    );
  }

  if (typeof data === 'string' && data.trim() !== '') {
    return (
      <Grid>
        <Item>
          <HTMLRenderer htmlString={data} />
        </Item>
      </Grid>
    );
  }

  return null;
}
