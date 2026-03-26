// import { Divider, styled, alpha } from '@mui/material';
// import Link from '@mui/material/Link';
// import { OutlinedButton } from '@/helpers/common/atoms/Buttons';

// import { TemplateSlider } from './TemplatesSlider';

// export const StyledLink = styled(Link)(({ theme }) => ({
//   color: theme.palette.resume[800],
//   borderColor: theme.palette.resume[100],
//   ':hover': {
//     borderColor: theme.palette.resume[800],
//     backgroundColor: alpha(theme.palette.resume[800], 0.04),
//   },
// }));

// export const TemplateSelect = () => {
//   return (
//     <div
//       className={`md:h-[459px] md:w-[600px] bg-white flex flex-col px-3 md:px-10 py-[23px] shadow-2xl`}
//     >
//       <TemplateSlider />
//       <Divider />
//       <span className="text-resume-800 font-bold text-lg my-[14px]">
//         View 100K+ IT Jobs
//       </span>
//       <div>
//         <OutlinedButton
//           onClick={() => {
//             window.open('https://hirenext-alpha.vercel.app/all-jobs/', '_blank');
//           }}
//         >
//         Quick Apply
//         </OutlinedButton>
//       </div>
//     </div>
//   );
// };

import { OutlinedButton } from '@/helpers/common/atoms/Buttons';
import { TemplateSlider } from './TemplatesSlider';
import Image from 'next/image';
import { withBasePath } from '@/utils/withBasePath';
import { useTemplates } from '@/stores/useTemplate';
import Link from 'next/link';

export const TemplateSelect = ({ onClose }: { onClose?: () => void }) => {
  const builderMode = useTemplates((state) => state.builderMode);

  return (
    <div className="md:w-[480px] bg-white flex flex-col px-4 md:px-8 py-6 shadow-2xl rounded-xl">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-gray-500 font-semibold text-sm">Choose Template</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <Image src={withBasePath('/icons/close.svg')} alt="close" width={18} height={18} />
        </button>
      </div>
      <TemplateSlider />
      <div className="mt-4 pt-4 border-t border-gray-100">
        {builderMode === 'trial' ? (
          <div className="mb-4">
            <span className="text-orange-600 font-bold text-sm block leading-tight">
              Due to Trial there is Only Few Templates - try Premium Builder where you access more
              features
            </span>
          </div>
        ) : (
          <span className="text-resume-800 font-bold text-lg block mb-3">View 100K+ IT Jobs</span>
        )}

        {builderMode === 'trial' ? (
          <Link href="/plans" className="w-full block">
            <OutlinedButton
              onClick={() => { }}
              className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50"
            >
              Upgrade to Premium
            </OutlinedButton>
          </Link>
        ) : (
          <OutlinedButton
            className="w-full"
            onClick={() => {
              window.open('https://riseflake.com/jobs/', '_blank');
            }}
          >
            Quick Apply
          </OutlinedButton>
        )}
      </div>
    </div>
  );
};
