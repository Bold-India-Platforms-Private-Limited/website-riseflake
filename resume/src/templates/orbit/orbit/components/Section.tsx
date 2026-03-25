import styled from '@emotion/styled';

const Wrapper = styled.section`
  margin-bottom: 18px;
`;

const Header = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${(p) => p.color};
  margin-bottom: 8px;
`;

const Icon = styled.span`
  font-size: 14px;
  line-height: 1;
`;

const Content = styled.div`
  font-size: 12px;
  color: #111;
`;

export function Section({
  title,
  icon,
  titleColor,
  children,
}: {
  title: string;
  icon?: string;
  titleColor: string;
  children: React.ReactNode;
}) {
  if (!children) return null;

  return (
    <Wrapper>
      <Header color={titleColor}>
        {icon && <Icon>{icon}</Icon>}
        {title}
      </Header>
      <Content>{children}</Content>
    </Wrapper>
  );
}
