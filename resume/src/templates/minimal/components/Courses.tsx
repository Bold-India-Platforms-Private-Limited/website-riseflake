import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const CoursesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CourseEntry = styled.div`
  display: flex;
  flex-direction: column;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CourseTitle = styled.div`
  font-weight: 700;
  font-size: 11.5px;
  /* We keep this dark/neutral so it doesn't fight with the Section Title color */
  color: inherit;
  line-height: 1.2;
`;

const Issuer = styled.div`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  opacity: 0.8;
  margin-top: 2px;
  color: inherit;
`;

const SummaryWrapper = styled.div`
  font-size: 10.5px;
  color: inherit;
  margin-top: 4px;
  line-height: 1.4;

  p {
    margin: 0;
  }

  ul,
  ol {
    margin-left: 16px;
    margin-top: 4px;
    color: inherit;
  }

  li {
    margin-bottom: 2px;
    &::marker {
      color: inherit; /* Forces bullets to stay standard font color */
    }
  }
`;

export default function Courses({ items = [] }: { items: any[] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <CoursesContainer>
      {items.map((item, i) => (
        <CourseEntry key={i}>
          <CourseTitle>{item.title}</CourseTitle>

          {item.awarder && <Issuer>{item.awarder}</Issuer>}
          {item.summary && item.summary !== '<p></p>' && (
            <SummaryWrapper>
              <HTMLRenderer htmlString={item.summary} />
            </SummaryWrapper>
          )}
        </CourseEntry>
      ))}
    </CoursesContainer>
  );
}
