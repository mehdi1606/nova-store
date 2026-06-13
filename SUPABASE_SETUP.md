# Nova Cavalia — Dashboard setup (Supabase)

This connects the site to a small admin panel at **`/admin`** where you can edit
product prices & texts, and read contact messages + newsletter signups.

Until you finish these steps, the site works **exactly as before** (it just falls
back to the values written in the code). Nothing breaks while you set it up.

---

## 1. Create the Supabase project

1. Go to **https://supabase.com** → sign in with GitHub → **New Project**.
2. Name it `nova-cavalia`, choose a strong **database password** (save it),
   region **Europe (London or Frankfurt)** — closest to Morocco.
3. Wait ~2 minutes for it to finish provisioning.

## 2. Copy your keys into `.env.local`

In Supabase: **Project Settings → API**. Copy these into the file `.env.local`
at the root of the project (it is git-ignored — your keys never get committed):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci....         (the "anon / public" key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci....             (the "service_role" key)
NEXT_PUBLIC_ADMIN_EMAIL=hoaurimehdi7@gmail.com      (your login email)
NEXT_PUBLIC_WHATSAPP_NUMBER=212XXXXXXXXX            (orders WhatsApp — digits only)
```

> **WhatsApp number:** international format, digits only. A Moroccan number like
> `0612345678` becomes `212648673266`. This is where customer orders are sent.

## 3. Create the database tables

In Supabase: **SQL Editor → New query**, paste the **entire contents of
`supabase/schema.sql`**, and click **Run**. You should see "Success".
(This also seeds your three current products.)

## 4. Create your owner login

In Supabase: **Authentication → Users → Add user → Create new user**.

- **Email:** the same address as `NEXT_PUBLIC_ADMIN_EMAIL` above
  (`hoaurimehdi7@gmail.com`)
- **Password:** pick one you'll remember
- Tick **"Auto Confirm User"** so you can log in right away.

> Only this account can reach `/admin`. There is no public sign-up.

## 5. Use it

- **Local:** stop the dev server and run `npm run dev` again (so it picks up the
  new `.env.local`), then open **http://localhost:3000/admin**.
- Log in → edit a product price → save → refresh the site: the new price shows.
- Contact-form messages and newsletter signups now appear under **Messages** and
  **Abonnés**.

## 6. On Vercel (for the live site)

Add the **same four variables** from step 2 under
**Vercel → your project → Settings → Environment Variables**, then redeploy.
That's it — the live `/admin` will work the same way.

---

### What the dashboard controls (v1)

- ✅ **Commandes** — every cash-on-delivery order placed on the site (with status)
- ✅ Product **price, name, tagline, descriptions, visibility, order** → live on the site
- ✅ **Messages** inbox (contact form) and **Abonnés** (newsletter)

### How ordering works

The customer fills the cart, opens **/commande**, enters name / phone / city /
address, and taps **"Commander sur WhatsApp"**. The order is **saved to your
dashboard** *and* a pre-filled WhatsApp message is sent to your number —
**paiement à la livraison**, no online card needed.

### Later (phase 2, when you want it)

- 🔜 Upload/swap product **photos** from the dashboard
- 🔜 Manage **sizes / colours / stock**
- 🔜 Online card payment (Stripe) — *optional, alongside cash on delivery*

### Good to know

- Photos, sizes and colours still live in the code for now — the panel changes
  the fields that change often.
- If a dashboard page shows "this table doesn't exist", you haven't run step 3 yet.
- The `service_role` key is a master key — keep it only in `.env.local` and in
  Vercel's env vars, never anywhere public.
