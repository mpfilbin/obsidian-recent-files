import { describe, it, expect } from 'vitest';
import { DEFAULT_SETTINGS } from '../src/settings';

describe('RecentFilesPluginSettings', () => {
	describe('DEFAULT_SETTINGS', () => {
		it('remembers 50 recent files by default', () => {
			expect(DEFAULT_SETTINGS.maxRecentFiles).toBe(50);
		});

		it('starts with an empty recent files list', () => {
			expect(DEFAULT_SETTINGS.recentFiles).toEqual([]);
		});
	});
});
