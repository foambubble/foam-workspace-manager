/**
 * Adapted from vscode-markdown/src/util.ts
 * https://github.com/yzhang-gh/vscode-markdown/blob/master/src/util.ts
 */
'use strict';

export const REGEX_FENCED_CODE_BLOCK = /^( {0,3}|\t)```[^`\r\n]*$[\w\W]+?^( {0,3}|\t)``` *$/gm;

export function markdownHeadingToPlainText(text: string) {
  // Remove Markdown syntax (bold, italic, links etc.) in a heading
  // For example: `_italic_` -> `italic`
  return text.replace(/\[([^\]]*)\]\[[^\]]*\]/, (_, g1) => g1);
}

export function rxWikiLink(): RegExp {
  const pattern = '\\[\\[([^\\]]+)\\]\\]'; // [[wiki-link-regex]]
  return new RegExp(pattern, 'ig');
}

export function rxMarkdownHeading(level: number): RegExp {
  const pattern = `^#{${level}}\\s+(.+)$`;
  return new RegExp(pattern, 'im');
}

export const mdDocSelector = [
  { language: 'markdown', scheme: 'file' },
  { language: 'markdown', scheme: 'untitled' },
];

export function findTopLevelHeading(md: string): string | null {
  const regex = rxMarkdownHeading(1);
  const match = regex.exec(md);
  if (match) {
    return markdownHeadingToPlainText(match[1]);
  }

  return null;
}

export function findWikilinksInMarkdown(md: string): string[] {
  const regex = rxWikiLink();
  const unique = new Set<string>();

  let match;
  while ((match = regex.exec(md))) {
    // can be file-name or file.name.ext
    const [, name] = match;
    if (name) {
      unique.add(name);
    }
  }

  return Array.from(unique);
}
