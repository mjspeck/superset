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

// Own-property lookup only. A file named `constructor` or `__proto__` would
// otherwise pick up an inherited value and return something that is not a
// language at all.
function lookup(map: Record<string, string>, key: string): string | undefined {
	return Object.hasOwn(map, key) ? map[key] : undefined;
}

/**
 * Resolve a file path to the language id used by the CodeMirror editor and the
 * diff viewer, or `"plaintext"` when nothing matches.
 *
 * Matching runs against the lowercased basename, in order: the whole filename
 * (`Dockerfile`, `Makefile`), then the final extension, then the stem. The
 * extension outranks the stem so `Dockerfile.md` stays markdown while
 * `Dockerfile.prod` resolves to dockerfile.
 *
 * Callers pass either an absolute host path or a repository-relative one, and
 * both separators count — on Windows nothing would match a filename otherwise.
 */
export function detectLanguage(filePath: string): string {
	const fileName = filePath.split(/[/\\]/).pop()?.toLowerCase() ?? "";

	const byFilename = lookup(filenameMap, fileName);
	if (byFilename) return byFilename;

	const parts = fileName.split(".");
	if (parts.length < 2) return "plaintext";

	const ext = parts[parts.length - 1];

	const byExtension = lookup(extensionMap, ext) ?? lookup(filenameMap, ext);
	if (byExtension) return byExtension;

	return lookup(filenameMap, parts[0]) ?? "plaintext";
}
