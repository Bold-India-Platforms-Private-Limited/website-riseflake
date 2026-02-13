import CollegeCard, { CollegeListItem } from './CollegeCard';

export default function CollegeList({ colleges }: { colleges: CollegeListItem[] }) {
  if (!colleges.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <h3 className="text-xl font-semibold text-slate-900">No colleges found</h3>
        <p className="mt-2 text-sm text-slate-600">
          Please check back later for new college profiles.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
      {colleges.map((college) => (
        <CollegeCard key={college.slug} college={college} />
      ))}
    </div>
  );
}
