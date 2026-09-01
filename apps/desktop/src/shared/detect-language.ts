// Files identified by name rather than extension, keyed by lowercase basename.
// Also matched against the extension and the stem so conventional variants
// resolve: `prod.Dockerfile`, and `Dockerfile.prod` when `.prod` is not itself
// a known extension.
const filenameMap: Record<string, string> = {
	dockerfile: "dockerfile",
	containerfile: "dockerfile",
	makefile: "makefile",
	gnumakefile: "makefile",
};

const extensionMap: Record<string, string> = {
	// JavaScript/TypeScript
	ts: "typescript",
	tsx: "typescript",
	js: "javascript",
	jsx: "javascript",
	mjs: "javascript",
	cjs: "javascript",

	// Web
	html: "html",
	htm: "html",
	astro: "html",
	css: "css",
	scss: "scss",
	less: "less",

	// Data formats
	json: "json",
	yaml: "yaml",
	yml: "yaml",
	xml: "xml",
	toml: "toml",

	// Markdown/Documentation
	md: "markdown",
	mdx: "markdown",

	// Shell
	sh: "shell",
	bash: "shell",
	zsh: "shell",
	fish: "shell",

	// Other languages
	py: "python",
	rb: "ruby",
	go: "go",
	rs: "rust",
	java: "java",
	kt: "kotlin",
	swift: "swift",
	c: "c",
	cpp: "cpp",
	h: "c",
	hpp: "cpp",
	cs: "csharp",
	php: "php",
	sql: "sql",
	graphql: "graphql",
	gql: "graphql",
};

export function detectLanguage(filePath: string): string {
	const fileName = filePath.split("/").pop()?.toLowerCase() ?? "";

	const byFilename = filenameMap[fileName];
	if (byFilename) return byFilename;

	const parts = fileName.split(".");
	if (parts.length < 2) return "plaintext";

	const ext = parts[parts.length - 1];

	// A real extension wins over the stem, so `Dockerfile.md` stays markdown.
	const byExtension = extensionMap[ext] ?? filenameMap[ext];
	if (byExtension) return byExtension;

	return filenameMap[parts[0]] ?? "plaintext";
}
