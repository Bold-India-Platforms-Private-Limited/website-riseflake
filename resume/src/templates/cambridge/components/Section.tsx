import React from 'react';
import styled from '@emotion/styled';

/* ================= STYLES ================= */

const SectionWrapper = styled.section`
  margin: 10px 0 6px;
  width: 100%;
`;

const Divider = styled.hr<{ color?: string }>`
  border: none;
  border-top: 1px solid ${(p) => p.color || '#d1d5db'};
  margin: 6px 0 10px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 24px;
  align-items: flex-start;
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

/* ================= COMPONENT ================= */

interface SectionProps {
  title: string;
  children: React.ReactNode;
  titleColor?: string;
}

export function Section({ title, children, titleColor }: SectionProps) {
  if (!children || (Array.isArray(children) && children.length === 0)) return null;

  return (
    <SectionWrapper>
      <Divider color={titleColor} />
      <Row>
        <Title titleColor={titleColor}>{title}</Title>
        <Content>{children}</Content>
      </Row>
    </SectionWrapper>
  );
}
