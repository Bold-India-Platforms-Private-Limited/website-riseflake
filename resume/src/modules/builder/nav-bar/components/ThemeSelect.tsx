import { ColorBox, ColorBoxWrapper } from '../atoms';
import { IThemeColor } from '@/helpers/constants/index.interface';
import Image from 'next/image';
import { withBasePath } from '@/utils/withBasePath';
import { SYSTEM_COLORS } from '@/helpers/constants/index';
import { useThemes } from '@/stores/themes';
import { useMemo } from 'react';

const PRIORITY_THEME_IDS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22];
const BOTTOM_THEME_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const ThemeSelect = ({ onClose }: { onClose?: () => void }) => {
  const activeTheme = useThemes((state) => state.selectedTheme);

  const orderedThemes = useMemo(() => {
    const byId = new Map(SYSTEM_COLORS.map((theme) => [theme.id, theme]));

    const topThemes = PRIORITY_THEME_IDS.map((id) => byId.get(id)).filter(Boolean) as IThemeColor[];
    const bottomThemes = BOTTOM_THEME_IDS.map((id) => byId.get(id)).filter(Boolean) as IThemeColor[];

    const usedIds = new Set([...PRIORITY_THEME_IDS, ...BOTTOM_THEME_IDS]);
    const remainingThemes = SYSTEM_COLORS.filter((theme) => !usedIds.has(theme.id));

    return [...topThemes, ...bottomThemes, ...remainingThemes];
  }, []);

  const handleActiveTheme = (themeObject: IThemeColor) => {
    useThemes.getState().chooseTheme(themeObject);
  };

  return (
    <div className={`h-auto md:w-[400px] bg-white flex flex-col px-6 py-6 shadow-2xl rounded-xl`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-resume-800 font-bold text-sm md:text-lg">
          Choose a resume colour scheme
        </span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <Image src={withBasePath('/icons/close.svg')} alt="close" width={18} height={18} />
        </button>
      </div>

      <div className="w-full">
        {orderedThemes.map((themeObject, index) => {
          const isActive = themeObject.id === activeTheme.id;

          return (
            <div
              key={themeObject.id}
              className={`flex border rounded mb-[16px] justify-between items-center py-[14px] px-4 ${isActive ? 'bg-resume-50 border-resume-500' : 'border-[#a9a9a9]'
                } hover:cursor-pointer`}
              onClick={() => handleActiveTheme(themeObject)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${isActive
                    ? 'bg-resume-500 text-white border-resume-500'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                    }`}
                >
                  {index + 1}
                </div>
                <ColorBoxWrapper>
                  <ColorBox bgColor={themeObject.backgroundColor} />
                  <ColorBox bgColor={themeObject.fontColor} />
                  <ColorBox bgColor={themeObject.titleColor} />
                  <ColorBox bgColor={themeObject.highlighterColor} />
                </ColorBoxWrapper>
              </div>
              {isActive && (
                <Image src={withBasePath('/icons/selected-tick.svg')} alt="selected" width={28} height={20} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
