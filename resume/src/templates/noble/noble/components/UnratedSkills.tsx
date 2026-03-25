import { ISkillItem } from '@/stores/skill.interface';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Name = styled.div`
  font-size: 11.5px;
  font-weight: 600;
  color: #111827; /* 🔒 fixed */
`;

const Bars = styled.div`
  display: flex;
  gap: 4px;
`;

const Bar = styled.div<{ active: boolean }>`
  width: 18px;
  height: 4px;
  background: ${(p) => (p.active ? '#9ca3af' : '#e5e7eb')};
`;

export default function UnratedSkills({ items }: { items: ISkillItem[] }) {
  if (!items?.length) return null;

  return (
    <Wrapper>
      {items.map((s) => {
        const filled = Math.round(((s.level ?? 60) / 100) * 6);

        return (
          <div key={s.name}>
            <Name>{s.name}</Name>
            <Bars>
              {Array.from({ length: 6 }).map((_, i) => (
                <Bar key={i} active={i < filled} />
              ))}
            </Bars>
          </div>
        );
      })}
    </Wrapper>
  );
}
