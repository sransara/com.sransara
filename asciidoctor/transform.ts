// @ts-nocheck
import posthtml from 'posthtml';

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
          const src = node.attrs['src'];
          setExprAttr(node, 'src', `import("${src}")`);
          return node;
        });

        tree.match({ tag: 'code' }, (node) => {
          node.attrs['is:raw'] = true;
          return node;
        });

        tree.match(
          [
            { tag: 'span', attrs: { class: 'math' } },
            { tag: 'div', attrs: { class: 'math' } }
          ],
          (node) => {
            node.attrs['block'] = node.tag == 'div';
            node.tag = 'Katex';
            delete node.attrs['class'];
            const lang = node.attrs['data-lang'];
            delete node.attrs['data-lang'];
            node.attrs['lang'] = lang;
            node.attrs['is:raw'] = true;
            // remove stem delimitters added by the backend
            const content = (node.content || ['\\(\\)'])[0];
            node.content = [content.slice(2, content.length - 2)];
            return node;
          }
        );
      })
      .process(html)
  ).html;
}
