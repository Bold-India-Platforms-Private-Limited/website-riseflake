import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const CoursesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 5px;
`;

const CourseGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CourseWrapper = styled.div`
  .course-html-content,
  .course-content {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.3;

    strong,
    b {
      display: block;
      font-size: 12px;
      color: #ffffff;
      font-weight: 700;
      margin-bottom: 2px;
      letter-spacing: 0.3px;
    }

    p {
      margin: 0;
      margin-bottom: 4px;
    }

    ul {
      list-style-type: none !important;
      padding: 0 !important;
      margin: 4px 0 0 0;
    }

    li {
      margin-bottom: 3px;
      position: relative;
      padding-left: 12px;
      list-style-type: none !important;

      &:before {
        content: '•';
        position: absolute;
        left: 0;
        color: rgba(255, 255, 255, 0.4);
      }
    }

    .description {
      margin-top: 3px;
      font-style: italic;
      font-size: 10.5px;
      color: rgba(255, 255, 255, 0.7);
    }
  }
`;

export default function Courses({ data }: { data: any }) {
  if (!data) return null;

  if (Array.isArray(data)) {
    if (data.length === 0) return null;
    return (
      <CourseGrid>
        {data.map((item, index) => (
          <CourseWrapper key={index}>
            <div className="course-content">
              <strong>{item.title || item.name}</strong>
              <p>{item.awarder || item.issuer || item.authority || item.institution}</p>
              {item.summary && (
                <div className="description">
                  <HTMLRenderer htmlString={item.summary} />
                </div>
              )}
            </div>
          </CourseWrapper>
        ))}
      </CourseGrid>
    );
  }

  if (typeof data === 'string' && data.trim() !== '') {
    return (
      <CoursesContainer>
        <CourseWrapper>
          <div className="course-html-content">
            <HTMLRenderer htmlString={data} />
          </div>
        </CourseWrapper>
      </CoursesContainer>
    );
  }

  return null;
}
