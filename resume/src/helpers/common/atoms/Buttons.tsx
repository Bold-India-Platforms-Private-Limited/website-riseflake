// import { Button } from '@mui/material';

// export const OutlinedButton = ({
//   onClick,
//   children,
//   disabled = false,
// }: {
//   onClick: () => void;
//   children: React.ReactNode | string;
//   disabled?: boolean;
// }) => (
//   <Button variant="outlined" onClick={onClick} className="text-resume-900" disabled={disabled}>
//     {children}
//   </Button>
// );

// export const TextButton = ({
//   onClick,
//   children,
//   disabled = false,
// }: {
//   onClick: () => void;
//   children: React.ReactNode | string;
//   disabled?: boolean;
// }) => (
//   <Button variant="outlined" onClick={onClick} className="text-resume-900" disabled={disabled}>
//     {children}
//   </Button>
// );

import { Button } from '@mui/material';

export const OutlinedButton = ({
  onClick,
  children,
  disabled = false,
  className,
}: {
  onClick: () => void;
  children: React.ReactNode | string;
  disabled?: boolean;
  className?: string;
}) => (
  <Button
    variant="outlined"
    onClick={onClick}
    className={`text-resume-900 ${className || ''}`}
    disabled={disabled}
  >
    {children}
  </Button>
);

export const TextButton = ({
  onClick,
  children,
  disabled = false,
  className,
}: {
  onClick: () => void;
  children: React.ReactNode | string;
  disabled?: boolean;
  className?: string;
}) => (
  <Button
    variant="text"
    onClick={onClick}
    className={`text-resume-900 ${className || ''}`}
    disabled={disabled}
  >
    {children}
  </Button>
);
