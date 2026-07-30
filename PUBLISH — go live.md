# Publishing Ann's site to annwongstudio.com

Two things have to meet: **GitHub** holds the files and serves them (GitHub
Pages), and **Squarespace** — which runs the DNS for `annwongstudio.com` —
points the domain at GitHub instead of at Squarespace's own servers.

Right now `annwongstudio.com` shows a Squarespace **"Coming Soon"** page, and
its DNS lives on Squarespace's nameservers (`nsb1–nsb4.squarespacedns.com`).
That's exactly the starting point Josie's site had, and `josiewong.art` has been
running on this setup since June.

Nothing here can break the artwork: the files already live in git, and every
step below is reversible.

---

## Part A — The repository (5 minutes)

### A0. What already exists

The site is **already on GitHub**, fully pushed, at
`No342542/Ann-Art-Website`. Nothing needs re-uploading. So there are two
sensible paths — pick one:

| | What you do | Why |
|---|---|---|
| **Recommended** | **Rename** the existing repo to `annwongstudio.com` | Keeps all history and the deploy key; the name then matches the domain, so it's obvious a year from now which repo is the live site |
| Alternative | Leave the name as `Ann-Art-Website` | Zero steps. Visitors never see the repo name |

Creating a *brand-new empty* repo is the one option to avoid — it would mean
re-pushing everything and re-adding Ann's deploy key for no gain.

**On repo names in general:** the name is invisible to visitors once a custom
domain is attached, so the only rule is "name it so you recognise it later."
Matching the domain (`annwongstudio.com`) is the clearest choice. The one name
with special behaviour is `<username>.github.io`, which serves at the account
root — not needed here.

### A1. Rename it (the recommended path)

1. github.com → **No342542/Ann-Art-Website** → **Settings** (top tab)
2. The **Repository name** box is the first field: replace it with
   **`annwongstudio.com`** → **Rename**

GitHub automatically forwards the old address, so nothing breaks in the
meantime. Tell Gordon afterwards and he'll run one command on each Mac that has
a copy, so they point at the new name directly:

```bash
git remote set-url origin git@github-no342542:No342542/annwongstudio.com.git
```

*(On Ann's Mac the alias is `ann-site` instead of `github-no342542` — see
`SETUP — Ann's Mac.md`.)*

---

## Part B — Turn on GitHub Pages (5 minutes)

1. In the repo → **Settings** → **Pages** (left sidebar)
2. **Source**: *Deploy from a branch* · **Branch**: `main` · **Folder**:
   `/ (root)` → **Save**
3. Wait ~1 minute, then reload the page. It will show a link like
   `https://no342542.github.io/annwongstudio.com/` — click it. **The gallery
   should appear.** (Some styling may look off at this temporary address; that's
   normal and fixes itself once the domain is attached.)
4. Still on the Pages screen: **Custom domain** → type **`annwongstudio.com`**
   → **Save**.
   GitHub now checks the DNS and will show a warning until Part C is done —
   expected.

> The repo already contains a file named **`CNAME`** holding
> `annwongstudio.com`. That's how Pages remembers the custom domain, and it's
> why the domain survives future publishes. Don't delete it.

---

## Part C — Point the domain at GitHub, in Squarespace (10 minutes + waiting)

Squarespace is the **registrar and the DNS host**, so all of this happens in
Squarespace — nothing changes on the GitHub side.

1. Log in at squarespace.com → **Domains** → click **annwongstudio.com**
2. Open **DNS** → **DNS Settings** (older accounts call it *Advanced DNS*)
3. **Remove** the records that currently point the domain at Squarespace's own
   hosting — the four `A` records for host `@` (`198.185.159.144`,
   `198.185.159.145`, `198.49.23.144`, `198.49.23.145`) and the `CNAME` for host
   `www` pointing to `ext-sq.squarespace.com`. Squarespace labels these
   *Squarespace Defaults*.
4. **Add** these instead:

   | Host | Type | Value |
   |---|---|---|
   | `@` | A | `185.199.108.153` |
   | `@` | A | `185.199.109.153` |
   | `@` | A | `185.199.110.153` |
   | `@` | A | `185.199.111.153` |
   | `www` | CNAME | `no342542.github.io` |

   These four IPs are GitHub Pages' published addresses (the same ones
   `josiewong.art` resolves to today).

   *Known quirk from Josie's setup:* Squarespace refused to save the fourth
   record (`185.199.111.153`). **Three A records is plenty** — don't fight it.

5. **Leave any TXT records alone**, especially email-verification /
   *Email Security* ones. Deleting those can break email on the domain.
6. Save. DNS changes take **15 minutes to a few hours** to spread (occasionally
   up to 24).

### Part C checkpoint

Once it has propagated, this shows GitHub's IPs instead of Squarespace's:

```bash
dig +short annwongstudio.com A
```

Expect `185.199.108.153`, `185.199.109.153`, `185.199.110.153` (and possibly
`.111.153`). Until then you'll still see the `198.x` Squarespace addresses.

---

## Part D — Lock in HTTPS (2 minutes, after DNS has propagated)

1. Repo → **Settings** → **Pages**. The custom-domain warning should be gone
   and it should say the site is live at `https://annwongstudio.com`.
2. Tick **Enforce HTTPS**. If it's greyed out, GitHub is still issuing the
   certificate — check back in an hour.

### Final checks

```bash
curl -sI https://annwongstudio.com | head -1
```

Then in a browser: load the site, click a category, open one artwork, and
confirm the little chick shows in the browser tab.

---

## Afterwards: how updates go live

Ann opens **Manage Ann.command**, edits, presses **🌐 Publish** — that pushes to
GitHub, and GitHub Pages rebuilds the public site in about a minute. Nothing in
this guide has to be repeated.

> Note the trade-off this creates: from the moment Pages is on, **a Publish is a
> live deploy**. That's the same arrangement Josie has.

---

## If something looks wrong

- **Still the "Coming Soon" page** → DNS hasn't propagated, or the old
  Squarespace `A`/`www` records are still there. Re-check step C3, then run the
  `dig` command above.
- **GitHub says "domain does not resolve to the GitHub Pages server"** →
  normal until DNS propagates; recheck after an hour.
- **Site loads but images/styles are missing** → make sure Pages is set to the
  **`main`** branch and the **`/ (root)`** folder, not `/docs`.
- **`www.annwongstudio.com` doesn't work but the bare domain does** → the `www`
  CNAME in step C4 is missing or still pointing at Squarespace.
- **Ann's email on this domain stops** → a TXT/MX record was removed in step
  C3. Squarespace support can restore the mail records; the A/CNAME changes
  above don't touch email.
