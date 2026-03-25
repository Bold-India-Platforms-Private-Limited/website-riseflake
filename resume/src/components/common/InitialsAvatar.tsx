import { useMemo } from 'react';

const COLOR_PAIRS = [
  { bg: '#f0f4ff', text: '#4f46e5' }, // Indigo
  { bg: '#f5f3ff', text: '#7c3aed' }, // Violet
  { bg: '#faf5ff', text: '#9333ea' }, // Purple
  { bg: '#fdf2f8', text: '#db2777' }, // Pink
  { bg: '#fff1f2', text: '#e11d48' }, // Rose
  { bg: '#f0fdf4', text: '#16a34a' }, // Green
  { bg: '#ecfdf5', text: '#059669' }, // Emerald
  { bg: '#f0f9ff', text: '#0284c7' }, // Sky
  { bg: '#eff6ff', text: '#2563eb' }, // Blue
  { bg: '#fefce8', text: '#ca8a04' }, // Yellow
];

const getInitials = (name?: string | null) => {
  if (!name || !name.trim()) return 'U';

  const tokens = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length === 1) {
    return tokens[0].slice(0, 2).toUpperCase();
  }

  return `${tokens[0][0]}${tokens[tokens.length - 1][0]}`.toUpperCase();
};

const getColorPair = (seed?: string | null) => {
  const value = seed || 'user';
  const hash = value.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  return COLOR_PAIRS[Math.abs(hash) % COLOR_PAIRS.length];
};

interface InitialsAvatarProps {
  name?: string | null;
  seed?: string | number | null;
  size?: number;
  className?: string;
}

const InitialsAvatar = ({ name, seed, size = 36, className = '' }: InitialsAvatarProps) => {
  const initials = useMemo(() => getInitials(name), [name]);
  const colors = useMemo(() => getColorPair(seed ? String(seed) : name), [seed, name]);

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-semibold select-none ${className}`.trim()}
      style={{
        width: size,
        height: size,
        backgroundColor: colors.bg,
        color: colors.text,
      }}
      aria-label={name || 'User'}
      title={name || 'User'}
    >
      <span style={{ fontSize: Math.max(12, Math.floor(size * 0.36)) }}>{initials}</span>
    </div>
  );
};

export default InitialsAvatar;
