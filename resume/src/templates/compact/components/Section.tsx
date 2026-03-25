import React from 'react';
import styled from '@emotion/styled';

const SectionWrapper = styled.section`
  margin-bottom: 5px;
  &:last-child {
    margin-bottom: 0;
  }
`;
const SectionTitle = styled.h2<{ isSidebar?: boolean; titleColor?: string; accentColor?: string }>`
  font-size: 12px;
  font-weight: 800;
  color: ${(props) => props.titleColor || '#1a1a1a'};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
  border-bottom: 1.5px solid ${(props) => props.titleColor || '#e2e8f0'};
  padding-bottom: 2px;
  transition:
    color 0.3s ease,
    border-color 0.3s ease;
`;

const Content = styled.div`
  width: 100%;
`;

interface SectionProps {
  title: string;
  children: React.ReactNode;
  isSidebar?: boolean;
  titleColor?: string;
  accentColor?: string;
}

const Section = ({ title, children, isSidebar, titleColor, accentColor }: SectionProps) => {
  if (!children || (Array.isArray(children) && children.length === 0)) return null;

  return (
    <SectionWrapper>
      {title && (
        <SectionTitle isSidebar={isSidebar} titleColor={titleColor} accentColor={accentColor}>
          {title}
        </SectionTitle>
      )}
      <Content>{children}</Content>
    </SectionWrapper>
  );
};

export default Section;
