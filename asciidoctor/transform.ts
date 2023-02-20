// @ts-nocheck
import posthtml from 'posthtml';
import { closingSingleTagOptionEnum, render as posthtmlRender } from 'posthtml-render';

function render(tree) {
  return posthtmlRender(tree, {
    singleTags: [/^[A-Z][\w+]/],
    closingSingleTag: closingSingleTagOptionEnum.slash
  });
}

function setExprAttr(node, attr, value) {
  delete node.attrs[attr];
  node.attrs[`${attr}={${value}}`] = true;
}

export async function transform(html) {
  return (
    await posthtml()
      .use((tree) => {
        tree.match({ tag: 'img' }, (node) => {
          node.tag = 'Image';
          const imgSrc = node.attrs.src;
          setExprAttr(node, 'src', `import("${imgSrc}")`);
          return node;
        });

        tree.match({ tag: 'pre' }, (node) => {
          node.attrs['is:raw'] = true;
          return node;
        });
      })
      .process(html, { render })
  ).html;
}
