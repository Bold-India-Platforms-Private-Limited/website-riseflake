import styled from '@emotion/styled';
import { ISkillItem } from '@/stores/skill.interface';

const Group = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.div`
  font-size: 11.5px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px 14px;
  font-size: 11.5px;
  color: #4b5563;
`;

function SkillGrid({ items }: { items: ISkillItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <Grid>
      {items.map((s, i) => (
        <div key={`${s.name}-${i}`}>{s.name}</div>
      ))}
    </Grid>
  );
}

export default function Skills({
  spoken,
  core,
  tools,
}: {
  spoken: ISkillItem[];
  core: ISkillItem[];
  tools: ISkillItem[];
}) {
  return (
    <>
      {/* 🗣 Spoken Languages */}
      <Group>
        <Label>Spoken Languages</Label>
        <SkillGrid items={spoken} />
      </Group>

      {/* 💻 Core Technical Skills */}
      <Group>
        <Label>Core Technical Skills</Label>
        <SkillGrid items={core} />
      </Group>

      {/* 🛠 Tools & Practices */}
      <Group>
        <Label>Tools & Practices</Label>
        <SkillGrid items={tools} />
      </Group>
    </>
  );
}
