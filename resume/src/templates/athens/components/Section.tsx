import React from 'react';
import styled from '@emotion/styled';

const SectionWrapper = styled.section`
  margin: 10px 0 6px;
  width: 100%;
`;

const HeaderContainer = styled.div`
  margin-bottom: 6px;
`;

const Title = styled.h2<{ titleColor?: string }>`
  font-size: 12.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin: 0;
  color: ${(p) => p.titleColor || '#1a1a1a'};
`;

const Content = styled.div`
  width: 100%;
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
  if (!children || (Array.isArray(children) && children.length === 0)) return null;

  return (
    <SectionWrapper>
      <HeaderContainer>
        <Title titleColor={titleColor}>{title}</Title>
      </HeaderContainer>
      <Content>{children}</Content>
    </SectionWrapper>
  );
}
