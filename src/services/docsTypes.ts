export interface DocMetadata {
  slug: string;
  title: string;
  section: string;
  description: string;
  filename: string;
  category: string;
  isTemplate?: boolean;
}

export interface TOCHeading {
  id: string;
  text: string;
  level: number;
}

export interface DocContent {
  metadata: DocMetadata;
  markdown: string;
  toc: TOCHeading[];
  revision: string;
  fetchedAt: string;
}

export interface DocCategory {
  id: string;
  name: string;
  items: DocMetadata[];
}

export interface DocManifest {
  revision: string;
  generatorVersion?: string;
  generatedAt: string;
  categories: DocCategory[];
  aliases: Record<string, string>;
  totalCount: number;
}
