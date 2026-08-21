# Tapaiko Bazar Sanity Studio

This is the content management studio for **Tapaiko Bazar** powered by [Sanity.io](https://www.sanity.io).

- **Project ID**: `m8sr7eub`
- **Dataset**: `production`

---

## 🚀 How to Run the Studio

From the root directory:
```bash
npm run studio
```
Or from inside the `studio` folder:
```bash
cd studio
npm run dev
```

This will launch Sanity Studio at **http://localhost:3333** (or the port shown in terminal).

---

## 🛠️ Features in the Dashboard

1. **Vans, Cars, Scooters, Bikes**:
   - Sidebar organized into **Electric Vans**, **Electric Cars**, **Electric Scooters**, **Petrol Bikes**, and **All Vehicles**.
   - Create new listings with the **+ Create** button.
   - Delete any vehicle listing using the document action menu (**Delete document**).

2. **Photo Management**:
   - **Main Photograph**: Upload high-res images directly with crop/hotspot controls. Delete or replace with one click.
   - **Photo Gallery**: Upload multiple showroom & interior shots, drag to reorder, delete anytime.

3. **Pricing & Status**:
   - Update vehicle price in NPR.
   - Update downpayment figures.
   - Set custom price labels (e.g. `NPR 46,50,000 – 63,50,000` or `Priced at counter`).
   - Add status badges (e.g. *Available*, *New arrival*, *Pre-booking open*, *Coming soon*).

4. **Specifications & Highlights**:
   - Add or edit key-value specification rows (e.g. *Range*, *Motor*, *Mileage*, *Battery*).
   - Add or edit bullet highlights.

5. **Hero Carousel Slides**:
   - Link featured vehicles to the hero carousel on the homepage with custom eyebrow titles.

---

## 🔑 One-Time Setup: Adding CORS in Sanity

To allow your website running on `localhost:5173` to read from Sanity:

1. Open [https://www.sanity.io/manage/project/m8sr7eub/api](https://www.sanity.io/manage/project/m8sr7eub/api)
2. Under **CORS Origins**, click **+ Add CORS origin**
3. Origin: `http://localhost:5173` (and any production domain when you deploy, e.g. `https://tapaikobazar.com`)
4. Check **Allow credentials** and click **Save**.

---

## 📦 Seeding Existing Vehicles (Optional)

To push all 40+ existing vehicles from the website into Sanity in one go:

1. Create a write token at [https://www.sanity.io/manage/project/m8sr7eub/api](https://www.sanity.io/manage/project/m8sr7eub/api) with `Editor` permissions.
2. In terminal, run:
```bash
cd studio
node seedSanity.js <YOUR_SANITY_TOKEN>
```
3. Refresh your Sanity Studio dashboard to see all vehicles loaded!
