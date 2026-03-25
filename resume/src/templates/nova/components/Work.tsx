import styled from '@emotion/styled';
import { IExperienceItem } from '@/stores/experience.interface';
import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import { dateParser } from '@/helpers/utils';

const Item = styled.div`
  margin-bottom: 8px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Role = styled.div`
  font-size: 12px;
  font-weight: 700;
`;

const Company = styled.div`
  font-size: 11.5px;
  font-weight: 600;
`;

const Dates = styled.div`
  font-size: 10.5px;
  color: #6b7280;
`;

const Content = styled.div`
  font-size: 11.5px;
  color: #4b5563;
  margin-top: 2px;

  li {
    list-style: '◆ ';
    margin-left: 14px;
  }
`;

export default function Work({ work }: { work: IExperienceItem[] }) {
  return (
    <>
      {work.slice(0, 3).map((w, i) => (
        <Item key={i}>
          <Row>
            <Role>{w.position}</Role>
            <Company>{w.name}</Company>
          </Row>
          <Row>
            <div />
            <Dates>
              {dateParser(w.startDate)} – {w.isWorkingHere ? 'Present' : dateParser(w.endDate)}
            </Dates>
          </Row>
          {w.summary && (
            <Content>
              <HTMLRenderer htmlString={w.summary} />
            </Content>
          )}
        </Item>
      ))}
    </>
  );
}
