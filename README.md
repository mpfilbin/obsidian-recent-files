# Recent Files

Quickly reopen files you recently modified or opened, from a command or ribbon icon.

* Trigger it from the command palette or from a button in the ribbon bar
* Triggering the plugin displays a list of your recently modified and opened files
* Use your keyboard or mouse to select a file and open it in Obsidian

## Installation

### From BRAT (recommended for beta testing)

1. Install the [BRAT plugin](https://github.com/TfTHacker/obsidian42-brat)
2. Add this repository: `mpfilbin/obsidian-recent-files`
3. Enable the plugin in Community Plugins settings

### Manual installation

1. Download `main.js`, `manifest.json`, and `styles.css` from the latest release
2. Verify checksums against `SHA256SUMS.txt`: `sha256sum -c SHA256SUMS.txt`
3. Copy the files to `<vault>/.obsidian/plugins/recent-files/`
4. Enable the plugin in Community Plugins settings

## Settings

* **Files to remember** — how many recent files are tracked and shown in the picker (default 50)

## Development

Prerequisites: [Node.js](https://nodejs.org/) (LTS), [just](https://github.com/casey/just)

```bash
# Install dependencies
just setup

# Start development (watch mode)
just dev

# Run tests
just test

# Run all checks
just check

# Install to your test vault
echo 'OBSIDIAN_VAULT=/path/to/your/vault' > .env
just install
```

## Creating a release

```bash
# Bump version (patch/minor/major)
just version-bump patch

# Run full release pipeline
just release-build

# Tag and push (triggers GitHub Action)
just tag
```

The GitHub Action will automatically create a BRAT-compatible release with build artifacts
and SHA-256 checksums.
