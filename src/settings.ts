import { App, PluginSettingTab, Setting } from 'obsidian';
import type { RecentFileEntry } from './recent-files-tracker';
import type RecentFilesPlugin from './main';

export interface RecentFilesPluginSettings {
	maxRecentFiles: number;
	recentFiles: RecentFileEntry[];
}

export const DEFAULT_SETTINGS: RecentFilesPluginSettings = {
	maxRecentFiles: 50,
	recentFiles: [],
};

export class RecentFilesSettingTab extends PluginSettingTab {
	plugin: RecentFilesPlugin;

	constructor(app: App, plugin: RecentFilesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('Files to remember')
			.setDesc('The number of recently modified and opened files to keep track of.')
			.addText((text) =>
				text
					.setPlaceholder(String(DEFAULT_SETTINGS.maxRecentFiles))
					.setValue(String(this.plugin.settings.maxRecentFiles))
					.onChange(async (value) => {
						const parsed = Number.parseInt(value, 10);
						if (!Number.isFinite(parsed) || parsed <= 0) {
							return;
						}
						this.plugin.settings.maxRecentFiles = parsed;
						this.plugin.tracker.setMaxEntries(parsed);
						await this.plugin.saveSettings();
					}),
			);
	}
}
