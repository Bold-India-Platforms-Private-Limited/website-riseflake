import React from 'react';
import styled from '@emotion/styled';

const SectionWrapper = styled.section<{ isSidebar?: boolean }>`
  margin-bottom: ${(props) => (props.isSidebar ? '12px' : '18px')};
  width: 100%;

  &:last-child {
    margin-bottom: 0;
  }
`;

const HeaderContainer = styled.div<{
  isSidebar?: boolean;
  noBorder?: boolean;
  titleColor?: string;
}>`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  /* Main column border uses theme color with low opacity, Sidebar uses white opacity */
  border-bottom: ${(props) =>
    props.noBorder
      ? 'none'
      : props.isSidebar
        ? '1px solid rgba(255, 255, 255, 0.2)'
        : props.titleColor
          ? `1px solid ${props.titleColor}33`
          : '1px solid #e0e0e0'};
  padding-bottom: 3px;
`;

const Title = styled.h2<{ isSidebar?: boolean; titleColor?: string }>`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin: 0;

  font-family: ${(props) =>
    props.isSidebar ? "'Inter', sans-serif" : "'Playfair Display', serif"};

  /* Logic: If sidebar, stay white. If main, use theme color. */
  color: ${(props) => {
    if (props.isSidebar) return '#ffffff';
    return props.titleColor || '#004d40';
  }};

  transition: color 0.3s ease;
`;

export function Section({
  title,
  children,
  isSidebar = false,
  noBorder = false,
  titleColor, // Accept the theme color prop
}: {
  title: string;
  children: React.ReactNode;
  isSidebar?: boolean;
  noBorder?: boolean;
  titleColor?: string;
}) {
  if (!children || (Array.isArray(children) && children.length === 0)) return null;

  return (
    <SectionWrapper isSidebar={isSidebar}>
      <HeaderContainer isSidebar={isSidebar} noBorder={noBorder} titleColor={titleColor}>
        <Title isSidebar={isSidebar} titleColor={titleColor}>
          {title}
        </Title>
      </HeaderContainer>
      <div style={{ lineHeight: '1.4' }}>{children}</div>
    </SectionWrapper>
  );
}
