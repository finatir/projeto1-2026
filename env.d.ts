declare const Bun: {
  file(path: string): { text(): Promise<string> };
  write(path: string, contents: string): Promise<void>;
};

declare const process: {
  argv: string[];
  exit(code?: number): never;
};
