interface GlyphProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Terminal vocabulary drawn for the eye only (`_❯`, `▐`, `⤘`, `❯`). Screen readers skip it,
 * so a heading reads "Projects", not "underscore, heavy right-pointing angle, Projects".
 */
export function Glyph({ children, className }: GlyphProps) {
  return (
    <span className={className} aria-hidden="true">
      {children}
    </span>
  );
}
