import { IEducation } from '@/stores/index.interface';
import { dateParser } from '@/helpers/utils';

export function Education({ education }: { education: IEducation[] }) {
  if (!education?.length) return null;

  return (
    <>
      {education.map((e, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <strong>
            {e.studyType} in {e.area}
          </strong>
          <div style={{ fontSize: 11, color: '#666' }}>
            {e.institution} — {dateParser(e.startDate)} –{' '}
            {e.isStudyingHere ? 'Present' : dateParser(e.endDate)}
          </div>
        </div>
      ))}
    </>
  );
}
