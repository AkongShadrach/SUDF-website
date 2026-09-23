# SUDF Website

Initial Next.js implementation for the **Sylvester Ujong Diabetes Foundation**.

## What is included

- Mobile-first responsive homepage
- SUDF visual direction: deep forest green, white, gold and cream
- Hero, About, Programs, Impact, Legacy, Events, Funding, Partners, Resources and Contact sections
- No invented impact statistics: metrics are placeholders until verified SUDF records are supplied
- Initial Supabase public-content schema in `supabase/schema.sql`
- `.env.example` for Supabase configuration

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Next implementation steps

1. Create the SUDF GitHub repository.
2. Push this project.
3. Create the Supabase project and run `supabase/schema.sql`.
4. Add the Supabase environment variables.
5. Replace image placeholders with approved SUDF photographs/logo assets.
6. Add secure server-side contact/newsletter endpoints.
7. Add authentication, RBAC and the admin dashboard.
8. Connect verified Programs, Events, Impact, News and Resources to Supabase.
9. Configure Vercel deployment and the official domain.
10. Add the final organizational facts only after SUDF supplies/approves them.

## Content integrity

This starter deliberately does not invent:
- registration numbers
- trustees/leadership names
- addresses or phone numbers
- financial figures
- impact totals
- event dates
- healthcare claims beyond the broad program framing already established

Those should be inserted from verified SUDF source material.
