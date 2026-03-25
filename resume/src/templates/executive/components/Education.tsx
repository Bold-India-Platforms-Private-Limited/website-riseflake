import { IEducation } from '@/stores/index.interface';
import { dateParser } from '@/helpers/utils';
import styled from '@emotion/styled';

const EduContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Degree = styled.h3`
  font-size: 14.5px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.2;
`;

const Institution = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: #27345c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 1px;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: #666;
  font-weight: 600;
  margin-top: 3px;
`;

export const Education = ({ education = [] }: { education: IEducation[] }) => {
  if (!Array.isArray(education) || education.length === 0) return null;

  return (
    <EduContainer>
      {education.map((item: IEducation, index: number) => {
        return (
          <div key={index}>
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
              {item.url && <span style={{ opacity: 0.7 }}>• {item.url}</span>}
            </MetaRow>
          </div>
        );
      })}
    </EduContainer>
  );
};
