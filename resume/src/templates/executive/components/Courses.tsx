import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const CoursesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const CourseEntry = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px dotted #ccc;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const CourseTitle = styled.div`
  font-weight: 700;
  font-size: 12.5px;
  color: #27345c;
  line-height: 1.2;
`;

const Issuer = styled.div`
  font-size: 10.5px;
  color: #666;
  margin-top: 1px;
`;

const SummaryWrapper = styled.div`
  font-size: 11px;
  color: #555;
  margin-top: 4px;
  line-height: 1.4;
  font-style: italic;
  opacity: 0.9;

  p {
    margin: 0;
  }
`;

export default function Courses({ items = [] }: { items: any[] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <CoursesContainer>
      {items.map((item, i) => (
        <CourseEntry key={i}>
          {/* Course Name */}
          <CourseTitle>{item.title}</CourseTitle>

          {/* Issuer/Awarder */}
          {item.awarder && <Issuer>Provided by {item.awarder}</Issuer>}

          {/* Summary */}
          {item.summary && (
            <SummaryWrapper>
              <HTMLRenderer htmlString={item.summary} />
            </SummaryWrapper>
          )}
        </CourseEntry>
      ))}
    </CoursesContainer>
  );
}
