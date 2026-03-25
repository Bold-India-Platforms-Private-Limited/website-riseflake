import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 2px;
`;

const CourseItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  .course-content {
    font-size: 11px;
    line-height: 1.3;
    color: #4b5563;
  }

  strong,
  b {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 1px;
  }

  span,
  p {
    margin: 0;
    font-size: 10.5px;
    font-weight: 600;
    color: #6b7280;
  }

  .description {
    margin-top: 2px;
    font-size: 10px;
    line-height: 1.2;
    color: #6b7280;
  }
`;

export default function Courses({ data }: { data: any }) {
  if (!data || data === '<p><br></p>') return null;

  if (Array.isArray(data)) {
    if (data.length === 0) return null;

    return (
      <CourseGrid>
        {data.map((item, index) => (
          <CourseItem key={index}>
            <div className="course-content">
              <strong>{item.title || item.name}</strong>
              {(item.awarder || item.issuer || item.authority || item.institution) && (
                <span>{item.awarder || item.issuer || item.authority || item.institution}</span>
              )}

              {item.summary && (
                <div className="description">
                  <HTMLRenderer htmlString={item.summary} />
                </div>
              )}
            </div>
          </CourseItem>
        ))}
      </CourseGrid>
    );
  }

  if (typeof data === 'string' && data.trim() !== '') {
    return (
      <CourseGrid>
        <CourseItem>
          <div className="course-content">
            <HTMLRenderer htmlString={data} />
          </div>
        </CourseItem>
      </CourseGrid>
    );
  }

  return null;
}
