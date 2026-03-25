import parseHtmlStringToHtml, { domToReact } from 'html-react-parser';

import Link from 'next/link';
import styles from './richtext/jodit.module.css';
import { useMemo } from 'react';

export const HTMLRenderer = ({ htmlString }: { htmlString: string }) => {
  const parsedElement = useMemo(() => {
    if (typeof htmlString !== 'string' || !htmlString) return null;

    return parseHtmlStringToHtml(htmlString, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      replace: (domNode: any) => {
        if (domNode.attribs && domNode.attribs.href && domNode.name === 'a') {
          return <Link href={domNode.attribs.href}>{domToReact(domNode.children)}</Link>;
        } else if (domNode.name === 'script') {
          return <></>;
        }
      },
    });
  }, [htmlString]);

  if (!parsedElement) return null;

  return <div className={`${styles.richtextRuntimeWrapper} text-xs`}>{parsedElement}</div>;
};
