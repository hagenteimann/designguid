import { FontParams } from './engine/params';
import { STYLE_KEYS, STYLE_LABEL, StyleKey } from './engine/variants';
import { renderFont } from './generate';
import { zip } from './zip';

export const fileSlug = (name: string) => name.replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '') || 'font';

export const styleFileName = (name: string, style: StyleKey) => `${fileSlug(name)}-${STYLE_LABEL[style].replace(' ', '')}.otf`;

/** Regular, Bold, Italic and Bold Italic as one ZIP of OTF files. */
export function buildFamilyZip(params: FontParams, name: string): Blob {
  const files = STYLE_KEYS.map((style) => ({
    name: styleFileName(name, style),
    data: new Uint8Array(renderFont(params, name, style).buffer)
  }));
  return zip(files);
}
