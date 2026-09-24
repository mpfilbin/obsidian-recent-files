import { describe, it, expect, vi } from 'vitest';
import { App, TFile } from 'obsidian';
import { RecentFilesModal } from '../src/recent-files-modal';

function makeFile(path: string): TFile {
	const file = new TFile();
	file.path = path;
	file.basename = path.replace(/\.md$/, '');
	return file;
}

describe('RecentFilesModal', () => {
	describe('getItems', () => {
		it('returns the files passed in, most recent first', () => {
			const files = [makeFile('b.md'), makeFile('a.md')];
			const modal = new RecentFilesModal(new App(), files, () => {});
			expect(modal.getItems()).toBe(files);
		});
	});

	describe('getItemText', () => {
		it('returns the file path', () => {
			const modal = new RecentFilesModal(new App(), [], () => {});
			expect(modal.getItemText(makeFile('folder/note.md'))).toBe('folder/note.md');
		});
	});

	describe('onChooseItem', () => {
		it('invokes the onChoose callback with the selected file', () => {
			const onChoose = vi.fn();
			const modal = new RecentFilesModal(new App(), [], onChoose);
			const file = makeFile('a.md');

			modal.onChooseItem(file, new MouseEvent('click'));

			expect(onChoose).toHaveBeenCalledWith(file);
		});
	});
});
