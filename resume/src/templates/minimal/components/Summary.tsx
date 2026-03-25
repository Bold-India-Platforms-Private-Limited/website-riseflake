import { SectionHeading } from '../atoms/SectionHeading';
import { useTheme } from '@mui/material/styles';

export const SummarySection = ({ summary }: { summary: string }) => {
  const theme = useTheme();

  return (
    <div className="mb-6">
      <SectionHeading title="Summary" />
      <div
        className="rounded-md p-4 text-sm leading-relaxed"
        style={{
          backgroundColor: theme.palette.action.hover,
          color: theme.palette.text.primary,
        }}
      >
        {summary}
      </div>
    </div>
  );
};
