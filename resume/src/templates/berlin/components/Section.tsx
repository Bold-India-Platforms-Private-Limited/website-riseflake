import React from 'react';
import styled from '@emotion/styled';

const SectionWrapper = styled.section`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitleWrapper = styled.div`
  margin-bottom: 6px;
`;

const SectionTitle = styled.h2<{ titleColor?: string }>`
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0;
  color: ${(p) => p.titleColor || '#111'};
`;

const TitleLine = styled.div<{ titleColor?: string }>`
  width: 28px;
  height: 2px;
  background: ${(p) => p.titleColor || '#27345c'};
  margin-top: 4px;
`;

const Content = styled.div`
  margin-top: 6px;
`;

interface SectionProps {
  title: string;
  children: React.ReactNode;
  titleColor?: string;
  isSidebar?: boolean;
}

const Section = ({ title, children, titleColor }: SectionProps) => {
  if (!children) return null;

  return (
    <SectionWrapper>
      {title && (
        <SectionTitleWrapper>
          <SectionTitle titleColor={titleColor}>{title}</SectionTitle>
          <TitleLine titleColor={titleColor} />
        </SectionTitleWrapper>
      )}
      <Content>{children}</Content>
    </SectionWrapper>
  );
};

export default Section;
