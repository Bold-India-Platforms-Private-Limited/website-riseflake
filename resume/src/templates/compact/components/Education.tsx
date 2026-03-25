import { IEducation } from '@/stores/index.interface';
import { dateParser } from '@/helpers/utils';
import styled from '@emotion/styled';

const EduItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Degree = styled.h3`
  font-size: 13px;
  font-weight: 700;
  color: #27345c;
  line-height: 1.3;
  margin: 0;
`;

const Institution = styled.div`
  font-size: 11.5px;
  font-weight: 600;
  color: #444;
  margin-top: 1px;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 10.5px;
  color: #666;
  margin-top: 2px;
  font-weight: 500;
`;

export const Education = ({ education = [] }: { education: IEducation[] }) => {
  if (!Array.isArray(education) || education.length === 0) return null;

  return (
    <div className="flex flex-col">
      {education.map((item: IEducation, index: number) => {
        return (
          <EduItem key={index}>
            <Degree>
              {item.studyType}
              {item.area ? ` in ${item.area}` : ''}
            </Degree>

            <Institution>{item.institution}</Institution>

            <MetaRow>
              <span>
                {dateParser(item.startDate)} —{' '}
                {item.isStudyingHere ? 'Present' : dateParser(item.endDate)}
              </span>
              {item.score && <span>GPA: {item.score}</span>}
            </MetaRow>
          </EduItem>
        );
      })}
    </div>
  );
};
