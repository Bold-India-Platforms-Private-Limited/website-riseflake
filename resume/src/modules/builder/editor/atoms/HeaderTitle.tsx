import Image from 'next/image';
import { withBasePath } from '@/utils/withBasePath';

const HeaderTitle = ({ title }: { title: string }) => (
  <div className="flex items-center my-2 p-4 cursor-pointer rounded-xl transition-all duration-200 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 group">
    <p className="text-lg font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors ml-2">{title}</p>

    <div className="ml-auto pl-4 flex items-center transform transition-transform group-hover:translate-x-1">
      <Image src={withBasePath('/icons/right-arrow.svg')} alt="right-arrow" height="16" width="16" className="opacity-60 group-hover:opacity-100 transition-opacity" />
    </div>
  </div>
);

export default HeaderTitle;
