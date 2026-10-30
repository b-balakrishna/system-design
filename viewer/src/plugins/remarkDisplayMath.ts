import type { Root } from "mdast";
import { visit } from "unist-util-visit";

// remark-math treats single-line $$...$$ as inline math. Keep the display
// layout intended by the notes while leaving $...$ expressions inline.
export default function remarkDisplayMath() {
  return (tree: Root, file: { value: unknown }) => {
    const source = String(file.value);

    visit(tree, "inlineMath", (node) => {
      const offset = node.position?.start.offset;
      if (offset === undefined || !source.startsWith("$$", offset)) return;

      node.data = {
        ...node.data,
        hProperties: {
          ...node.data?.hProperties,
          className: ["language-math", "math-display"],
        },
      };
    });
  };
}
