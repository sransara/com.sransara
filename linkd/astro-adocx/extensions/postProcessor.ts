import type { Document as AdocDocument, Extensions } from 'asciidoctor';
import posthtml from 'posthtml';

import { isExtensionSingleton } from '../types.ts';

export function register(registry: typeof Extensions | Extensions.Registry) {
  if (isExtensionSingleton(registry)) {
    registry.register(function () {
      this.postprocessor(extension);
    });
  } else {
    registry.postprocessor(extension);
  }
}

function extension(this: Extensions.PostprocessorDsl) {
  this.process(function (adoc: AdocDocument, output: string) {
    const result = posthtml([swapImgWithImage({ adoc })]).process(output, {
      sync: true,
      directives: [{ name: '$', start: '{', end: '}' }],
    });
    // @ts-ignore: Ignore error because types are wrong in posthtml
    return result.html;
  });
}

type Node = posthtml.Node<any, any>;

function getAttr(node: Node, key: string, default_: string | undefined = undefined) {
  if (!node.attrs) node.attrs = {};
  return node.attrs[key] ?? default_;
}

function setAttrExpr(node: Node, key: string, value: string) {
  const old = getAttr(node, key);
  delete node.attrs[key];
  node.attrs[`${key}={${value}}`] = true;
  return old;
}

function setAttr(node: Node, key: string, value: string | boolean) {
  const old = getAttr(node, key);
  node.attrs[key] = value;
  return old;
}

const swapImgWithImage = ({ adoc }: { adoc: AdocDocument }) => {
  let astroFenced = adoc.getAttribute('front-matter') ?? '';
  astroFenced = `import { Image } from "astro:assets";\n${astroFenced.trimStart()}`;
  adoc.setAttribute('front-matter', astroFenced);

  return (tree: Node) => {
    tree.match({ tag: 'img' }, (node: Node) => {
      const src = getAttr(node, 'src');
      if (!src) {
        return node;
      }
      const alt = getAttr(node, 'alt');
      if (!alt) {
        setAttr(node, 'alt', '');
      }
      if (src.startsWith('/') && !src.startsWith('//')) {
        if (!getAttr(node, 'width') || !getAttr(node, 'height')) {
          console.warn(`Image ${src} is missing width and height attributes`);
          return node;
        }
      } else if (src.startsWith('http') || src.startsWith('//')) {
        setAttr(node, 'inferSize', true);
      } else if (src.startsWith('data:')) {
        return node;
      } else {
        let srcPath = src;
        if (!src.startsWith('.')) {
          srcPath = `./${src}`;
        }
        setAttrExpr(node, 'src', `import("${srcPath}")`);
      }
      node.tag = 'Image';
      return node;
    });
  };
};
