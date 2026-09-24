export interface RecentFileEntry {
	path: string;
	timestamp: number;
}

/**
 * Tracks recently touched file paths, most recent first, with no dependency
 * on the Obsidian API so it can be unit tested in isolation.
 */
export class RecentFilesTracker {
	private entries: RecentFileEntry[];
	private maxEntries: number;

	constructor(maxEntries: number, entries: RecentFileEntry[] = []) {
		this.maxEntries = maxEntries;
		this.entries = this.sortedByRecency(entries);
		this.trimToMax();
	}

	touch(path: string, timestamp: number): void {
		const withoutPath = this.entries.filter((entry) => entry.path !== path);
		this.entries = this.sortedByRecency([...withoutPath, { path, timestamp }]);
		this.trimToMax();
	}

	remove(path: string): void {
		this.entries = this.entries.filter((entry) => entry.path !== path);
	}

	removeUnderFolder(folderPath: string): void {
		const prefix = `${folderPath}/`;
		this.entries = this.entries.filter(
			(entry) => entry.path !== folderPath && !entry.path.startsWith(prefix),
		);
	}

	rename(oldPath: string, newPath: string): void {
		this.entries = this.entries.map((entry) =>
			entry.path === oldPath ? { ...entry, path: newPath } : entry,
		);
	}

	renamePrefix(oldFolderPath: string, newFolderPath: string): void {
		const prefix = `${oldFolderPath}/`;
		this.entries = this.entries.map((entry) => {
			if (entry.path === oldFolderPath) {
				return { ...entry, path: newFolderPath };
			}
			if (entry.path.startsWith(prefix)) {
				return { ...entry, path: newFolderPath + entry.path.slice(oldFolderPath.length) };
			}
			return entry;
		});
	}

	setMaxEntries(maxEntries: number): void {
		this.maxEntries = maxEntries;
		this.trimToMax();
	}

	getEntries(): RecentFileEntry[] {
		return [...this.entries];
	}

	private sortedByRecency(entries: RecentFileEntry[]): RecentFileEntry[] {
		const latestByPath = new Map<string, RecentFileEntry>();
		for (const entry of entries) {
			const existing = latestByPath.get(entry.path);
			if (!existing || entry.timestamp > existing.timestamp) {
				latestByPath.set(entry.path, entry);
			}
		}
		return [...latestByPath.values()].sort((a, b) => b.timestamp - a.timestamp);
	}

	private trimToMax(): void {
		if (this.entries.length > this.maxEntries) {
			this.entries = this.entries.slice(0, this.maxEntries);
		}
	}
}
