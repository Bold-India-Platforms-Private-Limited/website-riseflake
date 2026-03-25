import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

/* ================= STYLES ================= */

const Wrapper = styled.div`
  font-size: 11.5px;
  line-height: 1.4;
  color: #333;

  ul {
    margin: 4px 0 0;
    padding-left: 16px;
  }

  li {
    margin-bottom: 2px;
  }

  p {
    margin: 0;
  }
`;

/* ================= HELPERS ================= */

/* 🔥 LIMIT ACHIEVEMENTS SAFELY */
function limitAchievements(html: string, maxItems = 5): string {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const ul = doc.querySelector('ul');

    if (!ul) return html;

    const items = Array.from(ul.querySelectorAll('li')).slice(0, maxItems);

    ul.innerHTML = '';
    items.forEach((li) => ul.appendChild(li));

    return ul.outerHTML;
  } catch {
    return html;
  }
}

/* ================= COMPONENT ================= */

export default function Achievements({ data }: { data: string }) {
  if (!data || data.trim() === '' || data === '<p><br></p>') return null;

  const trimmedHtml = limitAchievements(data, 4);

  return (
    <Wrapper>
      <HTMLRenderer htmlString={trimmedHtml} />
    </Wrapper>
  );
}
