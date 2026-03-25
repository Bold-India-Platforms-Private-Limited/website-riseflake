import { IBasics } from '@/stores/index.interface';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  text-align: center;
  margin-bottom: 16px;
`;

const NameLine = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 0;
`;

const Contact = styled.div`
  font-size: 11.5px;
  color: #4b5563;
  margin-top: 6px;

  a {
    color: inherit;
    text-decoration: none;
    cursor: pointer;
  }

  a:hover {
    text-decoration: none;
  }
`;

export default function BasicInfo({ basics }: { basics: IBasics }) {
  return (
    <Wrapper>
      <NameLine>
        {basics.name}
        {basics.label && `, ${basics.label}`}
      </NameLine>

      <Contact>
        {basics.email && <a href={`mailto:${basics.email}`}>{basics.email}</a>}

        {basics.email && (basics.phone || basics.url) && ' | '}

        {basics.phone && <span>{basics.phone}</span>}

        {basics.phone && basics.url && ' | '}

        {basics.url && (
          <a href={basics.url} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        )}
      </Contact>
    </Wrapper>
  );
}
