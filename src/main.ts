import { Plugin, TFile, TFolder } from 'obsidian';
import { DEFAULT_SETTINGS, RecentFilesSettingTab, type RecentFilesPluginSettings } from './settings';
import { RecentFilesTracker } from './recent-files-tracker';
import { RecentFilesModal } from './recent-files-modal';

export default class RecentFilesPlugin extends Plugin {
	settings: RecentFilesPluginSettings;
	tracker: RecentFilesTracker;

	async onload() {
		await this.loadSettings();
		this.tracker = new RecentFilesTracker(this.settings.maxRecentFiles, this.settings.recentFiles);

		this.addRibbonIcon('history', 'Open a recent file', () => {
			this.openRecentFilesModal();
		});

		this.addCommand({
			id: 'open-recent-file',
			name: 'Open a recent file',
			callback: () => {
				this.openRecentFilesModal();
			},
		});

		this.registerEvent(
			this.app.workspace.on('file-open', (file) => {
				if (file) {
					this.touchFile(file.path);
				}
			}),
		);

		this.registerEvent(
			this.app.vault.on('modify', (file) => {
				if (file instanceof TFile) {
					this.touchFile(file.path);
				}
			}),
		);

		this.registerEvent(
			this.app.vault.on('delete', (file) => {
				if (file instanceof TFolder) {
					this.tracker.removeUnderFolder(file.path);
				} else {
					this.tracker.remove(file.path);
				}
				void this.saveRecentFiles();
			}),
		);

		this.registerEvent(
			this.app.vault.on('rename', (file, oldPath) => {
				if (file instanceof TFolder) {
					this.tracker.renamePrefix(oldPath, file.path);
				} else {
					this.tracker.rename(oldPath, file.path);
				}
				void this.saveRecentFiles();
			}),
		);

		this.addSettingTab(new RecentFilesSettingTab(this.app, this));
	}

	onunload() {
		// Cleanup is handled automatically by registerEvent
	}

	async loadSettings() {
		const savedData = (await this.loadData()) as Partial<RecentFilesPluginSettings> | null;
		this.settings = Object.assign({}, DEFAULT_SETTINGS, savedData);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private touchFile(path: string): void {
		this.tracker.touch(path, Date.now());
		void this.saveRecentFiles();
	}

	private async saveRecentFiles(): Promise<void> {
		this.settings.recentFiles = this.tracker.getEntries();
		await this.saveSettings();
	}

	private openRecentFilesModal(): void {
		const files = this.tracker
			.getEntries()
			.map((entry) => this.app.vault.getAbstractFileByPath(entry.path))
			.filter((file): file is TFile => file instanceof TFile);

		new RecentFilesModal(this.app, files, (file) => {
			void this.app.workspace.getLeaf(false).openFile(file);
		}).open();
	}
}
