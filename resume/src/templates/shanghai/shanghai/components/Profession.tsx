import styled from '@emotion/styled';

const Role = styled.div`
  margin-top: 14px;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
`;

export default function Profession({ label }: { label?: string }) {
  if (!label) return null;
  return <Role>{label}</Role>;
}
