import { describe, it, expect } from 'vitest';
import { App, TFile, TFolder } from 'obsidian';
import RecentFilesPlugin from '../src/main';

async function createLoadedPlugin(): Promise<{ plugin: RecentFilesPlugin; app: App }> {
	const app = new App();
	const manifest = {
		id: 'recent-files',
		name: 'Recent Files',
		version: '0.1.0',
		minAppVersion: '1.7.2',
		description: 'test',
		author: 'test',
	};
	const plugin = new RecentFilesPlugin(app, manifest);
	await plugin.onload();
	return { plugin, app };
}

function makeFile(path: string): TFile {
	const file = new TFile();
	file.path = path;
	return file;
}

function makeFolder(path: string): TFolder {
	const folder = new TFolder();
	folder.path = path;
	return folder;
}

describe('RecentFilesPlugin', () => {
	describe('onload', () => {
		describe('when a file is opened', () => {
			it('adds it to persisted recentFiles', async () => {
				const { plugin, app } = await createLoadedPlugin();

				app.workspace.trigger('file-open', makeFile('a.md'));

				expect(plugin.settings.recentFiles.map((entry) => entry.path)).toEqual(['a.md']);
			});
		});

		describe('when a file is modified', () => {
			it('adds it to persisted recentFiles', async () => {
				const { plugin, app } = await createLoadedPlugin();

				app.vault.trigger('modify', makeFile('a.md'));

				expect(plugin.settings.recentFiles.map((entry) => entry.path)).toEqual(['a.md']);
			});
		});

		describe('when a tracked file is deleted', () => {
			it('removes it from persisted recentFiles', async () => {
				const { plugin, app } = await createLoadedPlugin();
				const file = makeFile('a.md');
				app.workspace.trigger('file-open', file);

				app.vault.trigger('delete', file);

				expect(plugin.settings.recentFiles).toEqual([]);
			});
		});

		describe('when a folder containing tracked files is deleted', () => {
			it('removes files nested under that folder from persisted recentFiles', async () => {
				const { plugin, app } = await createLoadedPlugin();
				app.workspace.trigger('file-open', makeFile('notes/a.md'));

				app.vault.trigger('delete', makeFolder('notes'));

				expect(plugin.settings.recentFiles).toEqual([]);
			});
		});

		describe('when a tracked file is renamed', () => {
			it('updates its path in persisted recentFiles', async () => {
				const { plugin, app } = await createLoadedPlugin();
				app.workspace.trigger('file-open', makeFile('a.md'));

				app.vault.trigger('rename', makeFile('renamed.md'), 'a.md');

				expect(plugin.settings.recentFiles.map((entry) => entry.path)).toEqual(['renamed.md']);
			});
		});

		describe('when a folder containing tracked files is renamed', () => {
			it('updates the paths of files nested under that folder in persisted recentFiles', async () => {
				const { plugin, app } = await createLoadedPlugin();
				app.workspace.trigger('file-open', makeFile('notes/a.md'));

				app.vault.trigger('rename', makeFolder('archive'), 'notes');

				expect(plugin.settings.recentFiles.map((entry) => entry.path)).toEqual(['archive/a.md']);
			});
		});
	});
});
