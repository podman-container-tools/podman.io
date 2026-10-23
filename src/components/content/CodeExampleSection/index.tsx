import React from 'react';
import CodeBlock from '@theme/CodeBlock';
import Markdown from '@site/src/components/utilities/Markdown';
import { searchExample, searchFilterExample, imagesExample } from './data';

interface CodeProps {
  command: string;
  code: string;
  label: string;
  extra?: string;
  className?: string;
}
const RenderLabelledCode = (props: CodeProps) => {
  const { command, code, label, extra, className } = props;

  return (
    <div className={`w-96 md:max-w-md ${className}`}>
      <div className="m-4 max-w-md rounded-md bg-blue-700 p-4 text-center shadow-md dark:bg-blue-900 md:max-w-sm md:text-start lg:mx-0">
        <Markdown text={label} styles="text-white dark:text-white" />
      </div>
      {extra && (
        <div className="mx-4 mb-2 mt-4 hidden max-w-md rounded-md bg-blue-700 p-4 shadow-md dark:bg-blue-900 md:mx-0 md:block md:max-w-sm">
          <Markdown text={extra} styles="text-white dark:text-white" />
        </div>
      )}
      <CodeBlock language="bash" showLineNumbers className="mx-4 my-2 max-w-md md:hidden">
        {command}
        {code}
      </CodeBlock>
    </div>
  );
};

interface DeskProps {
  className: string;
}
const DesktopCodeBlock = (props: DeskProps) => {
  return (
    <div className={`container hidden md:block ${props.className}`}>
      <CodeBlock language="bash" showLineNumbers>
        {searchExample.command}
        {searchExample.code}
        {searchFilterExample.command}
        {searchFilterExample.code}
        {imagesExample.command}
        {imagesExample.code}
      </CodeBlock>
    </div>
  );
};

function CodeExampleSection() {
  return (
    <div className="container my-12 grid place-items-center gap-4 md:grid-cols-12 md:place-items-end">
      <DesktopCodeBlock className="-z-50 md:col-span-11 md:col-start-1 md:row-start-1 md:row-end-4 md:place-self-center lg:col-span-10 lg:col-start-1" />
      <RenderLabelledCode
        {...searchExample}
        className="row-start-1 md:col-span-5 md:col-start-9 md:self-end lg:col-span-3 lg:col-start-10"
      />
      <RenderLabelledCode
        {...searchFilterExample}
        className="row-start-2 md:col-span-5 md:col-start-9 lg:col-span-3 lg:col-start-10"
      />
      <RenderLabelledCode
        {...imagesExample}
        className="row-start-3 md:col-span-5 md:col-start-9 lg:col-span-3 lg:col-start-10"
      />
    </div>
  );
}

export default CodeExampleSection;
