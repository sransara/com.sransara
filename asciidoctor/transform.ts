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

        tree.match(
          [
            { tag: 'span', attrs: { class: 'math' } },
            { tag: 'div', attrs: { class: 'math' } }
          ],
          (node) => {
            setAttr(node, 'block', node.tag == 'div');
            node.tag = 'Katex';
            setAttr(node, 'lang', getAttr(node, 'data-lang', 'tex'));

            // remove stem delimitters added by the backend
            const content = (node.content || ['\\(\\)'])[0];
            node.content = [content.slice(2, content.length - 2)];

            setAttr(node, 'is:raw', true);
            return node;
          }
        );
      })
      .process(html)
  ).html;
}
