import { IExperienceItem } from '@/stores/experience.interface';
import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import { dateParser } from '@/helpers/utils';
import styled from '@emotion/styled';

const Block = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 14px; /* 🔥 spacing between jobs */
`;

const Left = styled.div`
  flex: 1;
`;

const Company = styled.div`
  font-size: 13px;
  font-weight: 700;
`;

const Position = styled.div`
  font-size: 11.5px;
  font-weight: 600;
  color: #4b5563;
`;

const Summary = styled.div`
  margin-top: 4px;
  font-size: 11px;
  color: #4b5563;

  ul {
    margin: 4px 0 0;
    padding-left: 16px;
  }

  li {
    margin-bottom: 4px;
  }
`;

const Right = styled.div`
  font-size: 10.5px;
  color: #6b7280;
  white-space: nowrap;
`;

export default function Work({ work }: { work: IExperienceItem[] }) {
  if (!work?.length) return null;

  return (
    <>
      {work.slice(0, 2).map((w, i) => (
        <Block key={i}>
          <Left>
            <Company>{w.name}</Company>
            <Position>{w.position}</Position>

            {w.summary && (
              <Summary>
                <HTMLRenderer htmlString={w.summary} />
              </Summary>
            )}
          </Left>

          <Right>
            {dateParser(w.startDate)} — {w.isWorkingHere ? 'Present' : dateParser(w.endDate)}
          </Right>
        </Block>
      ))}
    </>
  );
}
