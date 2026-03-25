import React from 'react';
import { IEducation } from '@/stores/index.interface';
import { dateParser } from '@/helpers/utils';
import styled from '@emotion/styled';

const EduContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Entry = styled.div`
  display: flex;
  flex-direction: column;
`;

const Degree = styled.h3`
  font-size: 11.5px;
  font-weight: 700;
  color: inherit;
  margin: 0;
  line-height: 1.2;
`;

const Institution = styled.div`
  font-size: 10.5px;
  font-weight: 600;
  color: inherit;
  margin-top: 1px;
  opacity: 0.9;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 10px;
  color: inherit;
  opacity: 0.7;
  margin-top: 2px;
  font-style: italic;
`;

export const Education = ({ education = [] }: { education: IEducation[] }) => {
  if (!Array.isArray(education) || education.length === 0) return null;

  return (
    <EduContainer>
      {education.map((item: IEducation, index: number) => {
        return (
          <Entry key={index}>
            {/* Degree and Area */}
            <Degree>
              {item.studyType}
              {item.area ? ` in ${item.area}` : ''}
            </Degree>

            {/* Institution */}
            <Institution>{item.institution}</Institution>

            {/* Date and Metadata */}
            <MetaRow>
              <span>
                {dateParser(item.startDate)} —{' '}
                {item.isStudyingHere ? 'Present' : dateParser(item.endDate)}
              </span>
              {item.url && <span>• {item.url}</span>}
            </MetaRow>
          </Entry>
        );
      })}
    </EduContainer>
  );
};
