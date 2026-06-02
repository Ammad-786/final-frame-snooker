# Final Frame Snooker Club

Single-page website for Final Frame Snooker Club. Static HTML/CSS — no backend.
Bookings are handled via a WhatsApp link.

## Files

- `index.html` — the whole site (HTML + inline CSS/JS)
- `img/` — photos used on the page
- `logo.png` — club logo
- `_headers` — security headers applied automatically by Cloudflare Pages

## Hosting (Cloudflare Pages)

This site is hosted on **Cloudflare Pages** with a domain from the
**Cloudflare Registrar**.

### Deploy steps

1. In the Cloudflare dashboard go to **Workers & Pages → Create → Pages**.
2. Choose **Connect to Git** and pick this GitHub repository.
3. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/`
4. Click **Save and Deploy**.

Every push to the `main` branch redeploys automatically.

### Custom domain

1. Register/transfer the domain in **Cloudflare Registrar**.
2. In the Pages project go to **Custom domains → Set up a custom domain**.
3. Enter the domain — DNS is configured automatically since the domain is on
   Cloudflare.

## Local preview

Just open `index.html` in a browser, or run a static server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```
