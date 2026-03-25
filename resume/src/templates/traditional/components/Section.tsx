import React from 'react';
import styled from '@emotion/styled';

const SectionWrapper = styled.section`
  margin: 10px 0 4px;
  width: 100%;
`;

const HeaderContainer = styled.div<{ titleColor?: string }>`
  width: 100%;
  // text-align: center;
  border-top: 1.5px solid ${(p) => (p.titleColor ? `${p.titleColor}55` : '#d1d5db')};
  border-bottom: 1.5px solid ${(p) => (p.titleColor ? `${p.titleColor}55` : '#d1d5db')};
  padding: 6px 0;
  margin-bottom: 8px;
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
      <HeaderContainer titleColor={titleColor}>
        <Title titleColor={titleColor}>{title}</Title>
      </HeaderContainer>
      <Content>{children}</Content>
    </SectionWrapper>
  );
}
