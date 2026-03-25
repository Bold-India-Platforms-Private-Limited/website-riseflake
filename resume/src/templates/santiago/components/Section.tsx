import React from 'react';
import styled from '@emotion/styled';

const SectionWrapper = styled.section`
  margin-bottom: 8px;
  width: 100%;

  &:last-child {
    margin-bottom: 0;
  }
`;

const HeaderContainer = styled.div<{ titleColor?: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  /* Use the theme color for the border, or default to a light green */
  border-bottom: 1.5px solid ${(props) => (props.titleColor ? `${props.titleColor}33` : '#e8f5e9')};
  padding-bottom: 4px;
`;

const IconBox = styled.div<{ titleColor?: string }>`
  width: 22px;
  height: 22px;
  background-color: ${(props) => (props.titleColor ? `${props.titleColor}20` : '#e8f5e9')};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
  color: ${(props) => props.titleColor || '#2e7d32'};
`;

const Title = styled.h2<{ titleColor?: string }>`
  font-size: 12.5px;
  font-weight: 800;
  color: ${(props) => props.titleColor || '#1b5e20'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
  transition: color 0.3s ease;
`;

const Content = styled.div`
  width: 100%;
  padding-top: 2px;
`;

export function Section({
  title,
  children,
  icon,
  titleColor,
}: {
  title: string;
  children: React.ReactNode;
  icon?: string | React.ReactNode;
  titleColor?: string;
}) {
  if (!children || (Array.isArray(children) && children.length === 0)) return null;

  return (
    <SectionWrapper>
      <HeaderContainer titleColor={titleColor}>
        <IconBox titleColor={titleColor}>{icon || '●'}</IconBox>
        <Title titleColor={titleColor}>{title}</Title>
      </HeaderContainer>
      <Content>{children}</Content>
    </SectionWrapper>
  );
}
