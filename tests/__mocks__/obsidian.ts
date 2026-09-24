/**
 * Minimal runtime stand-ins for the Obsidian API used in tests.
 * The real "obsidian" npm package ships type declarations only (no runtime
 * JS), so this mock is aliased in place of it via vitest.config.ts.
 */

export class Component {
	registerEvent(_eventRef: unknown): void {}
	registerInterval(_id: number): void {}
	registerDomEvent(_el: unknown, _type: string, _cb: unknown): void {}
	load(): void {}
	unload(): void {}
}

export class Plugin extends Component {
	app: unknown;
	manifest: unknown;

	constructor(app: unknown, manifest: unknown) {
		super();
		this.app = app;
		this.manifest = manifest;
	}

	async loadData(): Promise<unknown> {
		return undefined;
	}

	async saveData(_data: unknown): Promise<void> {}

	addCommand(_command: unknown): void {}

	addRibbonIcon(_icon: string, _title: string, _callback: (evt: MouseEvent) => void): HTMLElement {
		return document.createElement('div');
	}

	addSettingTab(_tab: unknown): void {}
}

export class App {
	workspace = {
		on: () => ({}),
		getLeaf: () => ({ openFile: async (_file: unknown) => {} }),
	};

	vault = {
		on: () => ({}),
		getAbstractFileByPath: (_path: string) => null,
	};
}

class TextComponentStub {
	setPlaceholder(_value: string): this {
		return this;
	}

	setValue(_value: string): this {
		return this;
	}

	onChange(_callback: (value: string) => void): this {
		return this;
	}
}

export class Setting {
	constructor(_containerEl: HTMLElement) {}

	setName(_name: string): this {
		return this;
	}

	setDesc(_desc: string): this {
		return this;
	}

	addText(callback: (text: TextComponentStub) => void): this {
		callback(new TextComponentStub());
		return this;
	}
}

export class PluginSettingTab {
	app: unknown;
	plugin: unknown;
	containerEl: HTMLElement;

	constructor(app: unknown, plugin: unknown) {
		this.app = app;
		this.plugin = plugin;
		this.containerEl = document.createElement('div');
	}

	display(): void {}

	hide(): void {}
}

export class Modal {
	app: unknown;
	contentEl: HTMLElement;

	constructor(app: unknown) {
		this.app = app;
		this.contentEl = document.createElement('div');
	}

	open(): void {}

	close(): void {}

	onOpen(): void {}

	onClose(): void {}
}

export class FuzzySuggestModal<T> extends Modal {
	setPlaceholder(_placeholder: string): void {}

	getItems(): T[] {
		return [];
	}

	getItemText(_item: T): string {
		return '';
	}

	onChooseItem(_item: T, _evt: MouseEvent | KeyboardEvent): void {}
}

export class TFile {
	path = '';
	basename = '';
	extension = '';
	stat = { mtime: 0, ctime: 0, size: 0 };
}

export class TFolder {
	path = '';
	children: unknown[] = [];
}

export class Notice {
	constructor(_message: string | DocumentFragment, _timeout?: number) {}
}

export function normalizePath(path: string): string {
	return path;
}

export const Platform = {
	isDesktop: true,
	isMobile: false,
};

export async function requestUrl(_options: unknown): Promise<unknown> {
	return {};
}
