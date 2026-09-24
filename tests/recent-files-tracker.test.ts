import { describe, it, expect } from 'vitest';
import { RecentFilesTracker } from '../src/recent-files-tracker';

describe('RecentFilesTracker', () => {
	describe('getEntries', () => {
		describe('when constructed with no initial entries', () => {
			it('returns an empty list', () => {
				const tracker = new RecentFilesTracker(50);
				expect(tracker.getEntries()).toEqual([]);
			});
		});

		describe('when constructed with initial entries', () => {
			it('returns those entries', () => {
				const tracker = new RecentFilesTracker(50, [{ path: 'a.md', timestamp: 1 }]);
				expect(tracker.getEntries()).toEqual([{ path: 'a.md', timestamp: 1 }]);
			});
		});

		describe('when constructed with duplicate paths in the initial entries', () => {
			it('keeps only one entry per path', () => {
				const tracker = new RecentFilesTracker(50, [
					{ path: 'a.md', timestamp: 1 },
					{ path: 'a.md', timestamp: 5 },
				]);
				expect(tracker.getEntries()).toHaveLength(1);
			});

			it('keeps the most recent timestamp for that path', () => {
				const tracker = new RecentFilesTracker(50, [
					{ path: 'a.md', timestamp: 1 },
					{ path: 'a.md', timestamp: 5 },
				]);
				expect(tracker.getEntries()[0].timestamp).toBe(5);
			});
		});
	});

	describe('touch', () => {
		describe('when the path is new', () => {
			it('adds it to the front of the list', () => {
				const tracker = new RecentFilesTracker(50);
				tracker.touch('a.md', 100);
				expect(tracker.getEntries()[0]).toEqual({ path: 'a.md', timestamp: 100 });
			});

			describe('when other entries already exist', () => {
				it('places the new entry before the existing ones', () => {
					const tracker = new RecentFilesTracker(50, [{ path: 'a.md', timestamp: 1 }]);
					tracker.touch('b.md', 2);
					expect(tracker.getEntries().map((e) => e.path)).toEqual(['b.md', 'a.md']);
				});
			});
		});

		describe('when the path already exists in the list', () => {
			it('moves it to the front', () => {
				const tracker = new RecentFilesTracker(50, [
					{ path: 'a.md', timestamp: 1 },
					{ path: 'b.md', timestamp: 2 },
				]);
				tracker.touch('a.md', 3);
				expect(tracker.getEntries().map((e) => e.path)).toEqual(['a.md', 'b.md']);
			});

			it('updates its timestamp', () => {
				const tracker = new RecentFilesTracker(50, [{ path: 'a.md', timestamp: 1 }]);
				tracker.touch('a.md', 99);
				expect(tracker.getEntries()[0].timestamp).toBe(99);
			});

			it('does not create a duplicate entry', () => {
				const tracker = new RecentFilesTracker(50, [{ path: 'a.md', timestamp: 1 }]);
				tracker.touch('a.md', 2);
				expect(tracker.getEntries()).toHaveLength(1);
			});
		});

		describe('when the list is already at capacity', () => {
			describe('when touching a new path', () => {
				it('drops the oldest entry', () => {
					const tracker = new RecentFilesTracker(2, [
						{ path: 'a.md', timestamp: 1 },
						{ path: 'b.md', timestamp: 2 },
					]);
					tracker.touch('c.md', 3);
					expect(tracker.getEntries().map((e) => e.path)).toEqual(['c.md', 'b.md']);
				});
			});

			describe('when touching an existing path', () => {
				it('keeps the list at the same size', () => {
					const tracker = new RecentFilesTracker(2, [
						{ path: 'a.md', timestamp: 1 },
						{ path: 'b.md', timestamp: 2 },
					]);
					tracker.touch('a.md', 3);
					expect(tracker.getEntries()).toHaveLength(2);
				});
			});
		});
	});

	describe('remove', () => {
		describe('when the path exists', () => {
			it('removes it from the list', () => {
				const tracker = new RecentFilesTracker(50, [
					{ path: 'a.md', timestamp: 1 },
					{ path: 'b.md', timestamp: 2 },
				]);
				tracker.remove('a.md');
				expect(tracker.getEntries().map((e) => e.path)).toEqual(['b.md']);
			});
		});

		describe('when the path does not exist', () => {
			it('leaves the list unchanged', () => {
				const tracker = new RecentFilesTracker(50, [{ path: 'a.md', timestamp: 1 }]);
				tracker.remove('missing.md');
				expect(tracker.getEntries()).toEqual([{ path: 'a.md', timestamp: 1 }]);
			});
		});
	});

	describe('removeUnderFolder', () => {
		describe('when entries exist under the folder', () => {
			it('removes entries nested directly under the folder', () => {
				const tracker = new RecentFilesTracker(50, [
					{ path: 'notes/a.md', timestamp: 1 },
					{ path: 'other.md', timestamp: 2 },
				]);
				tracker.removeUnderFolder('notes');
				expect(tracker.getEntries().map((e) => e.path)).toEqual(['other.md']);
			});

			it('removes entries nested several levels under the folder', () => {
				const tracker = new RecentFilesTracker(50, [{ path: 'notes/sub/a.md', timestamp: 1 }]);
				tracker.removeUnderFolder('notes');
				expect(tracker.getEntries()).toEqual([]);
			});
		});

		describe('when an entry path only shares a prefix with the folder name', () => {
			it('does not remove that entry', () => {
				const tracker = new RecentFilesTracker(50, [{ path: 'notes-2/a.md', timestamp: 1 }]);
				tracker.removeUnderFolder('notes');
				expect(tracker.getEntries()).toHaveLength(1);
			});
		});

		describe('when no entries exist under the folder', () => {
			it('leaves the list unchanged', () => {
				const tracker = new RecentFilesTracker(50, [{ path: 'other.md', timestamp: 1 }]);
				tracker.removeUnderFolder('notes');
				expect(tracker.getEntries()).toEqual([{ path: 'other.md', timestamp: 1 }]);
			});
		});
	});

	describe('rename', () => {
		describe('when the old path exists', () => {
			it('updates the entry to the new path', () => {
				const tracker = new RecentFilesTracker(50, [{ path: 'a.md', timestamp: 1 }]);
				tracker.rename('a.md', 'renamed.md');
				expect(tracker.getEntries()[0].path).toBe('renamed.md');
			});

			it('preserves the entry timestamp', () => {
				const tracker = new RecentFilesTracker(50, [{ path: 'a.md', timestamp: 42 }]);
				tracker.rename('a.md', 'renamed.md');
				expect(tracker.getEntries()[0].timestamp).toBe(42);
			});
		});

		describe('when the old path does not exist', () => {
			it('leaves the list unchanged', () => {
				const tracker = new RecentFilesTracker(50, [{ path: 'a.md', timestamp: 1 }]);
				tracker.rename('missing.md', 'renamed.md');
				expect(tracker.getEntries()).toEqual([{ path: 'a.md', timestamp: 1 }]);
			});
		});
	});

	describe('renamePrefix', () => {
		describe('when entries exist under the old folder path', () => {
			it('rewrites entries nested directly under the folder', () => {
				const tracker = new RecentFilesTracker(50, [{ path: 'notes/a.md', timestamp: 1 }]);
				tracker.renamePrefix('notes', 'archive');
				expect(tracker.getEntries()[0].path).toBe('archive/a.md');
			});

			it('rewrites entries nested several levels under the folder', () => {
				const tracker = new RecentFilesTracker(50, [{ path: 'notes/sub/a.md', timestamp: 1 }]);
				tracker.renamePrefix('notes', 'archive');
				expect(tracker.getEntries()[0].path).toBe('archive/sub/a.md');
			});

			it('preserves the entry timestamp', () => {
				const tracker = new RecentFilesTracker(50, [{ path: 'notes/a.md', timestamp: 42 }]);
				tracker.renamePrefix('notes', 'archive');
				expect(tracker.getEntries()[0].timestamp).toBe(42);
			});
		});

		describe('when an entry matches the old folder path exactly', () => {
			it('rewrites it to the new folder path', () => {
				const tracker = new RecentFilesTracker(50, [{ path: 'notes', timestamp: 1 }]);
				tracker.renamePrefix('notes', 'archive');
				expect(tracker.getEntries()[0].path).toBe('archive');
			});
		});

		describe('when an entry path only shares a prefix with the folder name', () => {
			it('does not rewrite that entry', () => {
				const tracker = new RecentFilesTracker(50, [{ path: 'notes-2/a.md', timestamp: 1 }]);
				tracker.renamePrefix('notes', 'archive');
				expect(tracker.getEntries()[0].path).toBe('notes-2/a.md');
			});
		});

		describe('when no entries exist under the old folder path', () => {
			it('leaves the list unchanged', () => {
				const tracker = new RecentFilesTracker(50, [{ path: 'other.md', timestamp: 1 }]);
				tracker.renamePrefix('notes', 'archive');
				expect(tracker.getEntries()).toEqual([{ path: 'other.md', timestamp: 1 }]);
			});
		});
	});

	describe('setMaxEntries', () => {
		describe('when the new max is smaller than the current entry count', () => {
			it('trims the list down to the new max, keeping the most recent entries', () => {
				const tracker = new RecentFilesTracker(50, [
					{ path: 'a.md', timestamp: 1 },
					{ path: 'b.md', timestamp: 2 },
					{ path: 'c.md', timestamp: 3 },
				]);
				tracker.setMaxEntries(2);
				expect(tracker.getEntries().map((e) => e.path)).toEqual(['c.md', 'b.md']);
			});
		});

		describe('when the new max is larger than the current entry count', () => {
			it('leaves the list unchanged', () => {
				const tracker = new RecentFilesTracker(50, [{ path: 'a.md', timestamp: 1 }]);
				tracker.setMaxEntries(100);
				expect(tracker.getEntries()).toEqual([{ path: 'a.md', timestamp: 1 }]);
			});
		});

		describe('when a later touch would exceed the new, smaller max', () => {
			it('enforces the new max', () => {
				const tracker = new RecentFilesTracker(50, [
					{ path: 'a.md', timestamp: 1 },
					{ path: 'b.md', timestamp: 2 },
				]);
				tracker.setMaxEntries(2);
				tracker.touch('c.md', 3);
				expect(tracker.getEntries()).toHaveLength(2);
			});
		});
	});
});
