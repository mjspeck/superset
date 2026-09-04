interface ResolveWorkspaceBaseBranchParams {
	explicitBaseBranch?: string;
	workspaceBaseBranch?: string | null;
	defaultBranch?: string | null;
	knownBranches?: string[];
}

function normalizeBranch(value?: string | null): string | undefined {
	const trimmed = value?.trim();
	return trimmed ? trimmed : undefined;
}

export function resolveWorkspaceBaseBranch({
	explicitBaseBranch,
	workspaceBaseBranch,
	defaultBranch,
	knownBranches,
}: ResolveWorkspaceBaseBranchParams): string {
	const fallbackBranch = normalizeBranch(defaultBranch) ?? "main";
	const explicit = normalizeBranch(explicitBaseBranch);
	if (explicit) {
		return explicit;
	}

	const preferred = normalizeBranch(workspaceBaseBranch);
	if (!preferred) {
		return fallbackBranch;
	}

	if (knownBranches?.length) {
		const knownBranchSet = new Set(knownBranches);
		if (!knownBranchSet.has(preferred)) {
			return fallbackBranch;
		}
	}

	return preferred;
}

/**
 * The PR's own base branch, when the repo actually has it. A base that never
 * landed locally (nor as a remote-tracking branch) would make every diff in
 * the workspace fail, so those fall back to the project's default.
 */
export function resolvePrBaseBranch({
	baseRefName,
	knownBranches,
}: {
	baseRefName?: string;
	knownBranches?: string[];
}): string | undefined {
	const base = normalizeBranch(baseRefName);
	if (!base) {
		return undefined;
	}
	if (knownBranches?.length && !knownBranches.includes(base)) {
		return undefined;
	}
	return base;
}
