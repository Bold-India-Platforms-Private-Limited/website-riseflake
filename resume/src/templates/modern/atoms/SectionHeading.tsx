export const SectionHeading = ({ title, color }: { title: string; color?: string }) => {
  return (
    <div
      className="relative mb-2 text-base font-medium before:content-[''] before:w-full before:border-b-4 before:absolute before:-bottom-0.5"
      style={{ color: color, '--tw-border-opacity': 1, borderColor: color || '#e5e7eb' } as any}
    >
      {title}
    </div>
  );
};
