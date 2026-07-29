# Setting up Ann's Gallery on Ann's own Mac

This guide takes a fresh Mac to a fully working, independent copy of Ann's
website + the Manage editor (the "uploader"). After it, Ann's daily routine is
just: **double-click `Manage Ann.command` → edit → Publish.**

It mirrors the setup that already works on Josie's MacBook. Everything is
self-contained in the one `Ann` folder — no dependency on Josie's site, no
shared computer, no Tailscale.

**Who does what:** Part 1 is one-time technical setup — ideally done by (or
with) Gordon, because step 1.4 needs the GitHub account. Part 2 is Ann's
everyday use — no terminal ever again.

---

## Part 1 — One-time setup (≈20 minutes)

### 1.1 Install Apple's command-line tools (gives you `git` + `swift`)

Open **Terminal** (Applications → Utilities → Terminal), paste, press Return:

```bash
xcode-select --install
```

Click **Install** in the dialog that pops up (≈5 min). If it says
*"already installed"*, you're done with this step.
Python 3 is already part of macOS — nothing to install for it.

### 1.2 Create Ann's own key to GitHub (a "deploy key")

This lets the **Publish** button push to Ann's website repo — and only that
repo — without any password typing. In Terminal:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_annsite -N "" -C "ann-gallery-deploy"
```

Then add a shortcut so git knows when to use it:

```bash
printf '\nHost ann-site\n  HostName github.com\n  User git\n  IdentityFile ~/.ssh/id_ed25519_annsite\n  IdentitiesOnly yes\n' >> ~/.ssh/config
```

### 1.3 Copy the key so you can paste it into GitHub

```bash
pbcopy < ~/.ssh/id_ed25519_annsite.pub
```

(The key is now on the clipboard.)

### 1.4 Add the key to the repo (needs the **No342542** GitHub login — Gordon)

1. In a browser: **github.com → No342542/Ann-Art-Website → Settings →
   Deploy keys → Add deploy key**.
2. Title: `Ann's MacBook` · Key: **paste** (⌘V) · ✅ tick **Allow write access**
   · **Add key**.

### 1.5 Put the site on this Mac

```bash
cd ~/Documents
git clone git@ann-site:No342542/Ann-Art-Website.git "Ann Gallery"
```

(First time it asks *"Are you sure you want to continue connecting?"* — type
`yes`.) You now have `~/Documents/Ann Gallery` with the whole site + editor.

### 1.6 Tell git who Ann is (labels her published edits)

```bash
cd ~/Documents/"Ann Gallery"
git config user.name  "Ann Wong"
git config user.email "ann@example.com"    # use Ann's real email
git config pull.ff only
```

(That last line prevents the tangled-history state Josie's Mac once hit when
two computers published at nearly the same time.)

### 1.7 First launch

1. In Finder open `~/Documents/Ann Gallery`.
2. **Right-click `Manage Ann.command` → Open → Open** (needed only this once —
   after that a normal double-click works).
3. A Terminal window opens, then the browser shows **the website** and **the
   editor**. Setup done.

> The launcher self-updates: each time it opens it quietly pulls the latest
> site code from GitHub — but only when Ann has no unpublished edits, so it
> can never overwrite her work.

---

## Part 2 — Ann's everyday use (no terminal)

1. **Double-click `Manage Ann.command`** (in `Documents → Ann Gallery`).
   Keep the little Terminal window open while working.
2. In the editor page that opens:
   - **Add art** — drag image files from Finder (or Photos) anywhere onto the
     page, or press **＋ Add photos**. TIFF/HEIC scans convert automatically;
     huge photos are downsized for the web automatically.
   - **Edit** — click a card: title, date, comment. These show on the site —
     the title appears in the hover bloom and, with the date + comment, in the
     line above the artwork on its own page.
   - **Reorder** — drag cards. **The order here is exactly the order on the
     website** — reading across a row in the editor = reading across a row on
     the site.
   - **Galleries** (tabs at the top) — "All" is the master list and the page
     visitors land on. Each category tab is a curated gallery: drag or click
     photos from the right-hand panel to add; drag a photo onto the
     **Remove from collection** bar to take it out of just that gallery.
   - **Trash** — drag a card onto the trash can. Trashed photos are kept
     30 days (🗑 Trash → Restore).
   - **⚙ About** — the About text and the Instagram link.
3. **Preview ↗** to see the draft site. Everything autosaves locally.
4. **🌐 Publish** to make it live. Done — close the Terminal window.

*(The website isn't public yet — when Ann picks a domain, Gordon enables
GitHub Pages + DNS exactly as was done for josiewong.art; steps are in
`README.md` §"One-time setup". Publishing already works and stores everything
safely on GitHub in the meantime.)*

---

## If something's odd

- **"Manage Ann.command can't be opened…"** → right-click → Open → Open
  (first launch only).
- **Browser says "can't connect"** → the Terminal window was closed;
  double-click the `.command` again.
- **"Port 8090 is in use"** → an old copy is still running; the launcher
  usually fixes this itself — otherwise restart the Mac (simplest) and launch
  again.
- **Publish says it couldn't reach GitHub** → check Wi-Fi and try once more;
  the button automatically repairs the common "site moved ahead" case by
  merging (Ann's content always wins). If it still fails, the deploy key
  (steps 1.2–1.4) is the thing to re-check.
- **Two Macs publishing** — fine, but publish from one at a time. Gordon
  pushes code changes; Ann owns the content (`assets/js/data.js`); the tools
  are set up so a clash resolves in Ann's favor.
