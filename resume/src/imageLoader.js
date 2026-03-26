export default function imageLoader({ src }) {
  if (src.startsWith('http') || src.startsWith('data:')) return src;
  if (src.startsWith('/resume/')) return src;
  return `/resume${src.startsWith('/') ? '' : '/'}${src}`;
}
