import styled from '@emotion/styled';
import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';

const Wrapper = styled.div`
  font-size: 12.5px;
  line-height: 1.6;
  color: #111827; /* 🔥 FORCE NORMAL TEXT COLOR */

  p {
    margin: 0;
    color: #111827; /* 🔥 HTMLRenderer FIX */
  }

  span {
    color: #111827;
  }
`;

export default function AboutMe({ summary }: { summary: string }) {
  if (!summary) return null;

  return (
    <Wrapper>
      <HTMLRenderer htmlString={summary} />
    </Wrapper>
  );
}
