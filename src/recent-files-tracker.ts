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

	rename(oldPath: string, newPath: string): void {
		this.entries = this.entries.map((entry) =>
			entry.path === oldPath ? { ...entry, path: newPath } : entry,
		);
	}

	setMaxEntries(maxEntries: number): void {
		this.maxEntries = maxEntries;
		this.trimToMax();
	}

	getEntries(): RecentFileEntry[] {
		return [...this.entries];
	}

	private sortedByRecency(entries: RecentFileEntry[]): RecentFileEntry[] {
		return [...entries].sort((a, b) => b.timestamp - a.timestamp);
	}

	private trimToMax(): void {
		if (this.entries.length > this.maxEntries) {
			this.entries = this.entries.slice(0, this.maxEntries);
		}
	}
}
