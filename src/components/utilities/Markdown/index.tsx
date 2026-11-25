import React from 'react';
import ReactMarkdown from 'react-markdown';

interface Props {
  text: string;
  styles?: string;
}

function Markdown({ text, styles }: Props): JSX.Element {
  return <ReactMarkdown children={text} className={styles} />;
}
export default Markdown;
