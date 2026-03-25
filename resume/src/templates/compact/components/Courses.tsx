import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const CoursesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CourseWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .course-content {
    font-size: 11px;
    line-height: 1.4;
    color: #444;

    strong,
    b {
      display: block;
      font-size: 12px;
      color: #27345c;
      font-weight: 700;
      margin-bottom: 1px;
    }

    p {
      display: block;
      margin: 0;
      font-weight: 600;
      color: #666;
      font-size: 10.5px;
    }
    ul {
      list-style-type: disc;
      padding-left: 15px;
      margin-top: 2px;
    }

    li {
      margin-bottom: 2px;
    }
  }
`;

export default function Courses({ data }: { data: any }) {
  if (!data) return null;
  const items = Array.isArray(data) ? data : data?.items;

  if (Array.isArray(items)) {
    if (items.length === 0) return null;
    return (
      <CoursesContainer>
        {items.map((item, index) => (
          <CourseWrapper key={index}>
            <div className="course-content">
              <strong>{item.title || item.name}</strong>
              {(item.issuer || item.authority || item.institution) && (
                <p>{item.issuer || item.authority || item.institution}</p>
              )}
              {item.summary && <HTMLRenderer htmlString={item.summary} />}
            </div>
          </CourseWrapper>
        ))}
      </CoursesContainer>
    );
  }

  if (typeof data === 'string') {
    if (data.trim() === '' || data === '<p><br></p>') return null;
    return (
      <CoursesContainer>
        <CourseWrapper>
          <div className="course-content">
            <HTMLRenderer htmlString={data} />
          </div>
        </CourseWrapper>
      </CoursesContainer>
    );
  }

  return null;
}
