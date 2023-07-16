import type { Metadata } from '@src/lib/types/notes';

export const getNoteMetadata = async (year?: string) => {
  const notes: Record<string, Array<{ route: string; metadata: Metadata }>> = {};
  const metadataPaths = import.meta.glob('/src/text/notes/**/metadata.ts', { import: 'metadata' });
  const pathPattern = /^\/src\/text\/notes\/(?<year>\d\d\d\d)\/(?<slug>[^/]+)\/metadata.ts$/;
  const notesList = await Promise.all(
    Object.entries(metadataPaths).map(async ([path, metadataT]) => {
      const match = pathPattern.exec(path);
      if (!match?.groups) {
        throw new Error('Invalid path globbed.');
      }

      const pathYear = match.groups.year;
      if (year && year !== pathYear) return;
      const metadata = (await metadataT()) as Metadata;
      return [
        pathYear,
        {
          route: `/notes/${pathYear}/${match.groups.slug}/`,
          metadata
        }
      ] as [string, { route: string; metadata: Metadata }];
    })
  );

  for (const note of notesList) {
    if (!note) continue;
    const [pathYear, metadata] = note;
    if (!notes[pathYear]) notes[pathYear] = [];
    notes[pathYear].push(metadata);
  }

  return notes;
};
