import katex from "katex";

const DELIMITER_LIST = [
  { left: "$$", right: "$$", display: false },
  { left: "$", right: "$", display: false },
  { left: "\\pu{", right: "}", display: false },
  { left: "\\ce{", right: "}", display: false },
  { left: "\\(", right: "\\)", display: false },
  { left: "( ", right: " )", display: false },
  { left: "\\[", right: "\\]", display: true },
  { left: "[ ", right: " ]", display: true },
];

// const DELIMITER_LIST = [
//     { left: '$$', right: '$$', display: false },
//     { left: '$', right: '$', display: false },
// ];

// const inlineRule = /^(\${1,2})(?!\$)((?:\\.|[^\\\n])*?(?:\\.|[^\\\n\$]))\1(?=[\s?!\.,:？！。，：]|$)/;
// const blockRule = /^(\${1,2})\n((?:\\[^]|[^\\])+?)\n\1(?:\n|$)/;

let inlinePatterns: string[] = [];
let blockPatterns: string[] = [];

function escapeRegex(string: string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

function generateRegexRules(delimiters: any[]) {
  delimiters.forEach((delimiter: { left: any; right: any }) => {
    const { left, right } = delimiter;
    // Ensure regex-safe delimiters
    const escapedLeft = escapeRegex(left);
    const escapedRight = escapeRegex(right);

    // Inline pattern - Capture group $1, token content, followed by end delimiter and normal punctuation marks.
    // Example: $text$
    inlinePatterns.push(
      `${escapedLeft}((?:\\\\.|[^\\\\\\n])*?(?:\\\\.|[^\\\\\\n${escapedRight}]))${escapedRight}`,
    );

    // Block pattern - Starts and ends with the delimiter on new lines. Example:
    // $$\ncontent here\n$$
    blockPatterns.push(
      `${escapedLeft}\n((?:\\\\[^]|[^\\\\])+?)\n${escapedRight}`,
    );
  });

  const inlineRule = new RegExp(
    `^(${inlinePatterns.join("|")})(?=[\\s?!.,:？！。，：]|$)`,
    "u",
  );
  const blockRule = new RegExp(`^(${blockPatterns.join("|")})(?:\n|$)`, "u");

  return { inlineRule, blockRule };
}

const { inlineRule, blockRule } = generateRegexRules(DELIMITER_LIST);

// eslint-disable-next-line import/no-anonymous-default-export
export default function (options = {}) {
  return {
    extensions: [
      inlineKatex(options, createRenderer(options, false)),
      blockKatex(options, createRenderer(options, true)),
    ],
  };
}

function createRenderer(
  options: katex.KatexOptions | undefined,
  newlineAfter: boolean,
) {
  return (token: { text: string; displayMode: any }) =>
    katex.renderToString(token.text, {
      ...options,
      displayMode: token.displayMode,
    }) + (newlineAfter ? "\n" : "");
}

function inlineKatex(options: {}, renderer: (token: any) => string) {
  const ruleReg = inlineRule;
  return {
    name: "inlineKatex",
    level: "inline",
    start(src: any) {
      let index;
      let indexSrc = src;

      while (indexSrc) {
        index = indexSrc.indexOf("$");
        if (index === -1) {
          return;
        }
        const f = index === 0 || indexSrc.charAt(index - 1) === " ";
        if (f) {
          const possibleKatex = indexSrc.substring(index);

          if (possibleKatex.match(ruleReg)) {
            return index;
          }
        }

        indexSrc = indexSrc.substring(index + 1).replace(/^\$+/, "");
      }
    },
    tokenizer(src: string, tokens: any) {
      const match = src.match(ruleReg);

      if (match) {
        const text = match
          .slice(2)
          .filter((item: any) => item)
          .find((item: string) => item.trim());

        return {
          type: "inlineKatex",
          raw: match[0],
          text: text,
        };
      }
    },
    renderer,
  };
}

function blockKatex(options: {}, renderer: (token: any) => string) {
  return {
    name: "blockKatex",
    level: "block",
    tokenizer(src: string, tokens: any) {
      const match = src.match(blockRule);

      if (match) {
        const text = match
          .slice(2)
          .filter((item: any) => item)
          .find((item: string) => item.trim());

        return {
          type: "blockKatex",
          raw: match[0],
          text: text,
        };
      }
    },
    renderer,
  };
}
