import React, { Fragment, useState } from 'react';
import { INavMenuItemProps } from './MenuItem.interface';
import Image from 'next/image';
import { NavMenuPopover } from './NavMenuPopover';
import { StyledButton } from '../atoms';

export const NavMenuItem = ({ caption, popoverChildren }: INavMenuItemProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <StyledButton
        variant="text"
        size="small"
        onClick={handleClick}
        aria-describedby="mark"
        sx={{
          fontSize: { xs: '10px', lg: '16px' },
          fontWeight: 600,
          color: '#000000',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.06)',
          },
        }}
        endIcon={
          <Image
            src="/icons/dropdown-arrow.svg"
            alt="dropdown-arrow"
            width={20}
            height={20}
            className={`${anchorEl ? 'scale-y-[-1]' : ''}`}
            style={{
              filter: 'brightness(0)',
            }}
          />
        }
      >
        {caption}
      </StyledButton>

      <NavMenuPopover isOpen={!!anchorEl} anchorElement={anchorEl} id="mark" onClose={handleClose}>
        {popoverChildren && typeof popoverChildren === 'object' && 'props' in popoverChildren
          ? (popoverChildren as any).type
            ? React.cloneElement(popoverChildren as any, { onClose: handleClose })
            : popoverChildren
          : popoverChildren}
      </NavMenuPopover>
    </Fragment>
  );
};
