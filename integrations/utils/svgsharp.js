import { optimize } from 'svgo';
import { BaseSSRService } from '@astrojs/image/dist/loaders/index.js';
import { default as sharpService } from '@astrojs/image/dist/loaders/sharp.js';

class SvgSharpService extends BaseSSRService {
  async transform(inputBuffer, transform) {
    if (transform.format === 'svg') {
      const { data } = optimize(inputBuffer.toString());
      const optimizedBuffer = Buffer.from(data);
      return {
        data: optimizedBuffer,
        format: transform.format
      };
    }

    return sharpService.transform(inputBuffer, transform);
  }
}

const service = new SvgSharpService();

export default service;
