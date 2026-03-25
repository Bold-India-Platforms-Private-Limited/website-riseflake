import styled from '@emotion/styled';

const Wrapper = styled.section`
  margin: 14px 0 10px;
`;

const Title = styled.h2<{ color?: string }>`
  font-size: 12.5px;
  font-weight: 800;
  margin: 0 0 4px;
  text-transform: uppercase;
  color: ${(p) => p.color || '#111'};
`;

const Divider = styled.div`
  border-bottom: 2px solid #111;
  margin-bottom: 6px;
`;

export function Section({
  title,
  children,
  titleColor,
}: {
  title: string;
  children: React.ReactNode;
  titleColor?: string;
}) {
  return (
    <Wrapper>
      <Title color={titleColor}>{title}</Title>
      <Divider />
      {children}
    </Wrapper>
  );
}
