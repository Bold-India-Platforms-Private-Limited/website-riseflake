import styled from '@emotion/styled';
import { SectionValidator } from './ValidSectionRenderer';
import { withBasePath } from '@/utils/withBasePath';

const RoundedImage = styled.img`
  border-radius: 50%;
  border: 0.5px solid ${(props) => props.theme.fontColor};
`;

export const ProfileImage = ({
  src,
  height = '108px',
  width = '108px',
  imageWrapperClassname = '',
}: {
  src: string;
  height?: string;
  width?: string;
  imageWrapperClassname?: string;
}) => {
  return (
    <div className={imageWrapperClassname}>
      <SectionValidator value={src}>
        <RoundedImage alt="Profile image" src={withBasePath(src || '/default-avatar.png')} height={height} width={width} />
      </SectionValidator>
    </div>
  );
};
