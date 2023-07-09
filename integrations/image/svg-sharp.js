import { BaseSSRService } from '@astrojs/image/dist/loaders/index.js';
import { default as sharpService } from '@astrojs/image/dist/loaders/sharp.js';

class SvgSharpService extends BaseSSRService {
  async transform(inputBuffer, transform) {
    if (transform.format === 'svg') {
      // .excalidraw.svg optimizations
      if (inputBuffer.indexOf('<!-- svg-source:excalidraw -->') > -1) {
        const optimizedBuffer = Buffer.concat([
          inputBuffer.slice(0, inputBuffer.indexOf('<!-- payload-start -->') + 22),
          Buffer.from('snipped by integrations/image/svg-sharp.js'),
          inputBuffer.slice(inputBuffer.indexOf('<!-- payload-end -->'))
        ]);

        return {
          data: optimizedBuffer,
          format: transform.format
        };
      }

      return {
        data: inputBuffer,
        format: transform.format
      };
    }

    return sharpService.transform(inputBuffer, transform);
  }
}

const service = new SvgSharpService();

export default service;
