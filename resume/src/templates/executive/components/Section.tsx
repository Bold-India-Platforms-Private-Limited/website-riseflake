import React from 'react';
import styled from '@emotion/styled';

const SectionWrapper = styled.section<{ isSidebar?: boolean }>`
  margin-bottom: ${(props) => (props.isSidebar ? '14px' : '18px')};
  width: 100%;
  &:last-child {
    margin-bottom: 0;
  }
`;

// 1. Updated Styled Component to accept titleColor
const SectionTitle = styled.h2<{ isSidebar?: boolean; titleColor?: string }>`
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  /* Apply the theme color to the text */
  color: ${(props) => props.titleColor || '#1a1a1a'};

  /* Apply the theme color to the bottom border */
  border-bottom: ${(props) =>
    props.isSidebar ? '1px solid #e0e0e0' : `2px solid ${props.titleColor || '#1a1a1a'}`};

  padding-bottom: 3px;
  margin-bottom: 10px;
  letter-spacing: 0.08em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition:
    color 0.3s ease,
    border-color 0.3s ease;
`;

const Content = styled.div`
  width: 100%;
  & > * {
    margin-top: 0 !important;
  }
`;

// 2. Updated Interface to include titleColor
export function Section({
  title,
  children,
  isSidebar = false,
  titleColor, // Prop passed from ExecutiveTemplate
}: {
  title: string;
  children: React.ReactNode;
  isSidebar?: boolean;
  titleColor?: string;
}) {
  if (!children || (Array.isArray(children) && children.length === 0)) return null;

  return (
    <SectionWrapper isSidebar={isSidebar}>
      {/* 3. Pass the theme color down to the styled heading */}
      <SectionTitle isSidebar={isSidebar} titleColor={titleColor}>
        {title}
      </SectionTitle>
      <Content>{children}</Content>
    </SectionWrapper>
  );
}
