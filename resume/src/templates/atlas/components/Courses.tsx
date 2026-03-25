import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 2px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const CourseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  .course-content {
    font-size: 11px;
    line-height: 1.3;
    color: #4b5563;

    strong,
    b {
      display: block;
      font-size: 12px;
      color: #1a1a1a;
      font-weight: 700;
      margin-bottom: 1px;
    }

    span,
    p {
      display: block;
      margin: 0;
      font-weight: 600;
      color: #666;
      font-size: 10.5px;
    }

    .description {
      margin-top: 2px;
      color: #777;
      font-size: 10px;
      line-height: 1.2;
    }

    ul {
      padding-left: 12px;
      margin: 2px 0;
    }
  }
`;

export default function Courses({ data }: { data: any }) {
  if (!data || data === '<p><br></p>') return null;

  if (Array.isArray(data)) {
    if (data.length === 0) return null;
    return (
      <CourseGrid>
        {data.map((item, index) => (
          <CourseWrapper key={index}>
            <div className="course-content">
              <strong>{item.title || item.name}</strong>
              {(item.awarder || item.issuer || item.authority || item.institution) && (
                <p>{item.awarder || item.issuer || item.authority || item.institution}</p>
              )}
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
      <CourseGrid>
        <CourseWrapper>
          <div className="course-content">
            <HTMLRenderer htmlString={data} />
          </div>
        </CourseWrapper>
      </CourseGrid>
    );
  }

  return null;
}
