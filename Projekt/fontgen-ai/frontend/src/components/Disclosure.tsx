import { ReactNode, useState } from 'react';

interface DisclosureProps {
  title: ReactNode;
  titleClassName?: string;
  children: ReactNode;
  /** render the content only once the section has been opened (for heavy content) */
  lazy?: boolean;
}

/** A clearly clickable collapsible section (arrow, border, 44px tap height). */
export function Disclosure({ title, titleClassName = 'text-neutral-700', children, lazy }: DisclosureProps) {
  const [opened, setOpened] = useState(false);
  return (
    <details className="rounded-md border border-neutral-200" onToggle={(e) => (e.currentTarget as HTMLDetailsElement).open && setOpened(true)}>
      <summary className={`flex items-center gap-2 px-3 min-h-[44px] cursor-pointer text-sm font-medium hover:bg-neutral-50 rounded-md ${titleClassName}`}>
        <span className="chev text-neutral-400" aria-hidden="true">▸</span>
        {title}
      </summary>
      <div className="px-3 pb-3 pt-1">{lazy && !opened ? null : children}</div>
    </details>
  );
}
