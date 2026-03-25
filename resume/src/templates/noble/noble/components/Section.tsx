import React from 'react';
import styled from '@emotion/styled';

const SectionWrapper = styled.section`
  margin-bottom: 10px; /* ⬅️ pehle zyada tha */
  width: 100%;
`;

const Header = styled.h2<{ color?: string }>`
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 0 0 6px 0; /* ⬅️ heading ke neeche gap kam */
  color: ${(p) => p.color || '#000'};
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
      <Header color={titleColor}>{title}</Header>
      <Content>{children}</Content>
    </SectionWrapper>
  );
}
