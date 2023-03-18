import type { Metadata } from '@src/lib/types/notes';

export async function getNoteMetadata(year?: string) {
  const notes: { [key: string]: { route: string; metadata: Metadata }[] } = {};
  const metadataPaths = import.meta.glob('/src/text/notes/**/metadata.ts', { import: 'metadata' });
  const pathPattern = /^\/src\/text\/notes\/(?<year>\d\d\d\d)\/(?<slug>[^/]+)\/metadata.ts$/;
  for (const [path, metadataT] of Object.entries(metadataPaths)) {
    const match = path.match(pathPattern);
    if (!match || !match.groups) {
      throw new Error('Invalid path globbed.');
    }
    const pathYear = match.groups.year;
    if (year && year !== pathYear) continue;
    if (!notes[pathYear]) notes[pathYear] = [];
    const metadata = (await metadataT()) as Metadata;
    notes[pathYear].push({
      route: `/notes/${pathYear}/${match.groups.slug}`,
      metadata
    });
  }
  return notes;
}
