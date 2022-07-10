import type { FC } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

SyntaxHighlighter.registerLanguage('javascript', js);

const customStyles = {
  padding: '1.5rem',
  height: '24rem',
  overflow: 'auto',
};

const Code: FC<{ children: string }> = ({ children }) => (
  <SyntaxHighlighter
    language="javascript"
    style={atomOneDark}
    customStyle={customStyles}
  >
    {children}
  </SyntaxHighlighter>
);

export default Code;
