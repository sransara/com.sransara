// @ts-nocheck
import posthtml from 'posthtml';

function getAttr(node, key, default_) {
  if (!node.attrs) node.attrs = {};
  return node.attrs[key] || default_;
}

function setAttrExpr(node, key, value) {
  const old = getAttr(node, key);
  delete node.attrs[key];
  node.attrs[`${key}={${value}}`] = true;
  return old;
}

function setAttr(node, key, value) {
  const old = getAttr(node, key);
  node.attrs[key] = value;
  return old;
}

export async function transform(html) {
  return (
    await posthtml()
      .use((tree) => {
        tree.match({ tag: 'img' }, (node) => {
          node.tag = 'Image';
          const src = getAttr(node, 'src');
          setAttrExpr(node, 'src', `import("${src}")`);
          return node;
        });

        tree.match({ tag: 'code' }, (node) => {
          setAttr(node, 'is:raw', true);
          return node;
        });

        tree.match({ tag: 'pre' }, (node) => {
          if (getAttr(node, 'class', '').includes('highlight')) {
            const code = node.content[0];
            setAttr(node, 'lang', getAttr(code, 'data-lang', 'python'));
            node.content = code.content;
            node.tag = 'Shiki';
          }
          setAttr(node, 'is:raw', true);
          return node;
        });

        tree.match({ tag: 'span', attrs: { class: 'math' } }, (node) => {
          node.tag = 'Katex';
          setAttr(node, 'lang', getAttr(node, 'data-lang', 'latexmath'));
          setAttr(node, 'is:raw', true);
          return node;
        });

        tree.match({ tag: 'div', attrs: { class: 'stemblock' } }, (node) => {
          const mathNode = node.content?.find((node) => node.attrs?.class == 'content');
          mathNode.tag = 'Katex';

          // remove stem delimitters added by the backend
          const content = (mathNode.content || ['\\(\\)'])[0];
          const match = content.match(/^\s*(?<delim>\\[\[$])(?<mathContent>[\s\S]*)\\[\]$]\s*$/);
          mathNode.content = [match.groups['mathContent']];

          setAttr(mathNode, 'lang', match.groups['delim'] == '[' ? 'latexmath' : 'asciimath');
          setAttr(mathNode, 'is:raw', true);
          return node;
        });
      })
      .process(html)
  ).html;
}
