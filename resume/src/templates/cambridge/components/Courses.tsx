import styled from '@emotion/styled';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 16px;
  font-size: 12px;
`;

export default function Courses({ data }: { data: any[] }) {
  if (!data?.length) return null;

  return (
    <Grid>
      {data.map((c, i) => (
        <div key={i}>
          <strong>{c.title || c.name}</strong>
          {c.issuer && <div>{c.issuer}</div>}
        </div>
      ))}
    </Grid>
  );
}
