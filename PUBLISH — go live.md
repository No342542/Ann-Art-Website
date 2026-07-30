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

**The setup this assumes** (already true, nothing to change):

| | |
|---|---|
| GitHub account | **No342542** (northdeskai@gmail.com) — the same account that serves `josiewong.art` |
| Repository | **`No342542/Ann-Art-Website`** — already created and fully pushed |
| Push authentication | SSH alias `github-no342542` on Gordon's Mac; a deploy key on Ann's Mac |

There is **nothing to do in this part** — no new repo, no rename. The repository
name is invisible to visitors once the custom domain is attached, so
`Ann-Art-Website` is a perfectly good permanent name. Skip straight to Part A.

---

## Part A — Turn on GitHub Pages (5 minutes)

1. Go to **github.com → No342542/Ann-Art-Website** (sign in as
   northdeskai@gmail.com)
2. **Settings** (the top tab) → **Pages** (left sidebar)
3. **Source**: *Deploy from a branch* · **Branch**: `main` · **Folder**:
   `/ (root)` → **Save**
4. Wait ~1 minute, then reload the page. It will show a link like
   `https://no342542.github.io/Ann-Art-Website/` — click it. **The gallery
   should appear.** (Some styling may look off at this temporary address; that's
   normal and corrects itself once the domain is attached in the next step.)
5. Still on the Pages screen: **Custom domain** → type **`annwongstudio.com`**
   → **Save**.
   GitHub now checks the DNS and will show a warning until Part B is done —
   expected, ignore it for now.

> The repo already contains a file named **`CNAME`** holding
> `annwongstudio.com`. That's how Pages remembers the custom domain, and it's
> why the domain survives every future publish. Don't delete it.

---

## Part B — Point the domain at GitHub, in Squarespace (10 minutes + waiting)

Squarespace is both the **registrar and the DNS host**, so all of this happens
in Squarespace — nothing changes on the GitHub side.

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

   Those four IPs are GitHub Pages' published addresses (the same ones
   `josiewong.art` resolves to today). The `www` value is the **No342542**
   account's Pages host — note it is the account name, not the repo name.

   *Known quirk from Josie's setup:* Squarespace refused to save the fourth
   record (`185.199.111.153`). **Three A records is plenty** — don't fight it.

5. **Leave any TXT records alone**, especially email-verification /
   *Email Security* ones. Deleting those can break email on the domain.
6. Save. DNS changes take **15 minutes to a few hours** to spread (occasionally
   up to 24).

### Part B checkpoint

Once it has propagated, this shows GitHub's IPs instead of Squarespace's:

```bash
dig +short annwongstudio.com A
```

Expect `185.199.108.153`, `185.199.109.153`, `185.199.110.153` (and possibly
`.111.153`). Until then you'll still see the `198.x` Squarespace addresses.

---

## Part C — Lock in HTTPS (2 minutes, after DNS has propagated)

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
`No342542/Ann-Art-Website`, and GitHub Pages rebuilds the public site in about a
minute. Nothing in this guide has to be repeated.

> Note the trade-off this creates: from the moment Pages is on, **a Publish is a
> live deploy**. That's the same arrangement Josie has.

---

## If something looks wrong

- **Still the "Coming Soon" page** → DNS hasn't propagated, or the old
  Squarespace `A`/`www` records are still there. Re-check step B3, then run the
  `dig` command above.
- **GitHub says "domain does not resolve to the GitHub Pages server"** →
  normal until DNS propagates; recheck after an hour.
- **Site loads but images/styles are missing** → make sure Pages is set to the
  **`main`** branch and the **`/ (root)`** folder, not `/docs`.
- **`www.annwongstudio.com` doesn't work but the bare domain does** → the `www`
  CNAME in step B4 is missing or still pointing at Squarespace.
- **Ann's email on this domain stops** → a TXT/MX record was removed in step
  B3. Squarespace support can restore the mail records; the A/CNAME changes
  above don't touch email.
