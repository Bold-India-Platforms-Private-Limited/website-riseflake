import styled from '@emotion/styled';

const Wrapper = styled.section`
  margin-bottom: 22px;
  padding-left: 0; /* 🔥 IMPORTANT */
`;

const Title = styled.h2<{ color?: string }>`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 0 0 8px 0;
  color: ${(p) => p.color || '#000'};
`;

export function Section({
  title,
  titleColor,
  children,
}: {
  title: string;
  titleColor?: string;
  children: React.ReactNode;
}) {
  if (!children) return null;

  return (
    <Wrapper>
      <Title color={titleColor}>{title}</Title>
      {children}
    </Wrapper>
  );
}
