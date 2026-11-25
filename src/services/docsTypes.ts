export interface DocMetadata {
  slug: string;
  title: string;
  section: string;
  description: string;
  filename: string;
}

export interface DocCommandNode {
  slug: string;
  title: string;
  label: string;
  section: string;
  description: string;
  filename: string;
  subcommands: DocCommandNode[];
}

export interface DocManifest {
  revision: string;
  generatorVersion?: string;
  generatedAt: string;
  commands: DocCommandNode[];
  totalCount: number;
}
