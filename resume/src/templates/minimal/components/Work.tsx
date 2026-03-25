import React from 'react';
import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import { dateParser } from '@/helpers/utils';
import { IExperienceItem } from '@/stores/experience.interface';
import styled from '@emotion/styled';

const WorkContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px; /* 🔽 tighter */
`;

const WorkEntry = styled.div`
  display: flex;
  flex-direction: column;
`;

const Position = styled.h3`
  font-size: 11.2px;
  font-weight: 700;
  margin: 0;
  line-height: 1.15;
`;

const CompanyName = styled.div`
  font-size: 10.3px;
  font-weight: 600;
  margin-top: 1px;
  opacity: 0.9;
`;

const MetaRow = styled.div`
  display: flex;
  gap: 8px;
  font-size: 9.6px;
  opacity: 0.7;
  margin-top: 2px;
  margin-bottom: 3px;
  font-style: italic;
`;

const SummaryWrapper = styled.div`
  font-size: 10.2px;
  line-height: 1.28; /* 🔥 KEY */

  ul {
    padding-left: 14px !important;
    margin: 3px 0 0 0 !important;
  }

  li {
    margin-bottom: 2px;
  }

  p {
    margin: 0;
  }
`;

export default function Work({ work = [] }: { work: IExperienceItem[] }) {
  if (!Array.isArray(work) || work.length === 0) return null;

  return (
    <WorkContainer>
      {work.map((company, index) => (
        <WorkEntry key={`${company.name}-${index}`}>
          <Position>{company.position}</Position>
          <CompanyName>{company.name}</CompanyName>

          <MetaRow>
            <span>
              {dateParser(company.startDate)} —{' '}
              {company.isWorkingHere ? 'Present' : dateParser(company.endDate)}
            </span>
            {company.location && <span>• {company.location}</span>}
          </MetaRow>

          <SummaryWrapper>
            <HTMLRenderer htmlString={company.summary} />
          </SummaryWrapper>
        </WorkEntry>
      ))}
    </WorkContainer>
  );
}
