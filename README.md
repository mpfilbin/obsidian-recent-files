# Recent Files

Quickly reopen files you recently modified or opened, from a command or ribbon icon.

## What it does

Recent Files keeps a running, most-recent-first list of the notes you've been working in, and
gives you a fast fuzzy-search picker to jump back to any of them:

* **Tracks both opening and editing.** A file is tracked the moment you open it *or* the moment
  it's modified — so a note you're actively editing stays at the top even if you never
  re-opened it through the file explorer.
* **Trigger it two ways.** Use the **Open a recent file** command from the command palette
  (<kbd>Ctrl/Cmd+P</kbd>), or click the clock/history icon in the left ribbon bar.
* **Fuzzy search.** Start typing to filter the list by path; use the arrow keys and
  <kbd>Enter</kbd>, or your mouse, to pick a file and open it.
* **Folder-aware.** If you rename or delete a folder, every tracked file underneath it is
  updated or removed automatically — the list never points at a file that no longer exists.
* **Persists across restarts.** The recent-files list is saved with the plugin's data, so it
  survives closing and reopening Obsidian.
* **Configurable history size.** Choose how many recent files to remember in the plugin's
  settings (default 50) — see [Settings](#settings) below.

## Installation

### From BRAT (recommended for beta testing)

[BRAT](https://github.com/TfTHacker/obsidian42-brat) (Beta Reviewers Auto-update Tool) lets you
install this plugin directly from GitHub, without waiting for it to be listed in the Community
Plugins directory.

1. Install BRAT itself: in Obsidian, go to **Settings → Community plugins → Browse**, search for
   **BRAT**, install it, and enable it.
2. Open the command palette (<kbd>Ctrl/Cmd+P</kbd>) and run **BRAT: Add a beta plugin for
   testing**.
3. Enter this repository as `mpfilbin/obsidian-recent-files` and click **Add Plugin**. BRAT
   downloads the latest [release](https://github.com/mpfilbin/obsidian-recent-files/releases)
   (`main.js`, `manifest.json`, `styles.css`) and installs it.
4. Go to **Settings → Community plugins** and enable **Recent Files** if it isn't already on.
5. To pick up new versions later, run **BRAT: Check for updates to all beta plugins** from the
   command palette, or let BRAT's periodic auto-update handle it.

> A GitHub release must exist before BRAT can install the plugin — see
> [Creating a release](#creating-a-release) below.

### Manual installation

1. Download `main.js`, `manifest.json`, and `styles.css` from the latest release
2. Verify checksums against `SHA256SUMS.txt`: `sha256sum -c SHA256SUMS.txt`
3. Copy the files to `<vault>/.obsidian/plugins/recent-files/`
4. Enable the plugin in Community Plugins settings

## Settings

* **Files to remember** — how many recent files are tracked and shown in the picker (default 50)

## Development

Prerequisites: [Node.js](https://nodejs.org/) (LTS), [just](https://github.com/casey/just). The
Node version is pinned in `.tool-versions` — if you use [asdf](https://asdf-vm.com/), run
`asdf install` to pick it up automatically.

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
