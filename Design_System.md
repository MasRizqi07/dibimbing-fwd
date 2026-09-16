# Nexa Studio Design System

**Version:** 1.0  
**Style:** Editorial minimalism / flat UI with soft depth  
**Source of truth:** `app/globals.css`, `app/page.tsx`, dan `components/ServiceCatalog.tsx`

## 1. Brand principles

1. **Clear before clever** — copy dan CTA harus mudah dipahami.
2. **Warm precision** — gunakan whitespace, grid, dan alignment yang rapi.
3. **Proof over noise** — portfolio dan hasil kerja lebih penting daripada dekorasi.
4. **One confident action** — setiap section memiliki next step yang jelas.

## 2. Color tokens

| Token | Value | Usage |
| --- | --- | --- |
| `--ink` | `#102027` | Primary text |
| `--navy` | `#102A31` | Dark surfaces, primary CTA |
| `--muted` | `#64747A` | Body copy |
| `--line` | `#DFE6E4` | Borders and dividers |
| `--lime` | `#C3F35B` | Accent and selected states |
| `--cream` | `#F7F8F4` | Page background |

Contrast harus dicek setiap kali warna baru ditambahkan. Lime adalah accent,
bukan warna untuk paragraf panjang.

## 3. Typography

- Primary font adalah Geist dari `next/font/google`.
- Fallback stack: `Arial, Helvetica, sans-serif`.
- Headings menggunakan tight tracking dan compact line-height.
- Body text menggunakan line-height 1.5–1.65.
- Eyebrow label uppercase, kecil, dan letter-spaced.
- Gunakan `em` hanya untuk emphasis intentional pada heading.

## 4. Layout tokens

| Rule | Value |
| --- | --- |
| Content max width | `1160px` |
| Mobile shell | `calc(100% - 32px)` |
| Desktop shell | `calc(100% - 64px)` capped at `1160px` |
| Card radius | `15px` |
| Large surface radius | `18–20px` |
| Base touch target | `44px` minimum |
| Primary section spacing | `92–150px` vertical |

## 5. Component standards

### Navigation

- Sticky, translucent surface.
- Brand left, section anchors center, primary contact CTA right.
- Mobile menyembunyikan secondary links tetapi mempertahankan primary CTA.

### Button

- Pill shape.
- Primary: navy background, white text.
- Accent: lime background, navy text.
- Outline: transparent/white surface dengan line border.
- Hover menggunakan subtle translate dan background change; jangan bergantung
  pada hover saja.

### Service card

- Border surface dengan number dan category yang terlihat.
- Title dan description tetap readable tanpa hover.
- CTA berupa text-link menuju consultation action.

### Search field

- Icon, labeled input, optional clear button.
- `:focus-within` menunjukkan border dan ring.
- Search result count menggunakan `aria-live="polite"`.
- Filter controls menggunakan `aria-pressed`.

### Pricing card

- Featured plan menggunakan navy surface dan lime badge.
- Feature list menggunakan check marks plus readable text.
- CTA memenuhi lebar card untuk scanning yang predictable.

### Contact form

- Visible labels.
- Inline field errors.
- Loading menonaktifkan controls.
- Success dan error states explicit serta diumumkan.

## 6. Interaction states

| State | Expected treatment |
| --- | --- |
| Default | Neutral border, readable surface |
| Hover | Small elevation atau color shift |
| Focus-visible | Strong outline, browser access tetap tersedia |
| Active/selected | Lime-tinted surface dan navy text |
| Disabled/loading | Reduced opacity, no pointer interaction |
| Error | Inline message, `aria-invalid`, input tetap dipertahankan |
| Success | Positive icon, concise confirmation, next action |

## 7. Motion

- Default transition sekitar `0.2–0.25s`.
- Gunakan transform dan opacity untuk interaction ringan.
- Hindari layout shift besar.
- `prefers-reduced-motion: reduce` menonaktifkan motion non-esensial.

## 8. Accessibility checklist

- [ ] Keyboard dapat menjangkau semua link, button, input, dan filter.
- [ ] Focus-visible outline terlihat pada cream dan navy surface.
- [ ] Form controls memiliki labels dan error descriptions.
- [ ] Dynamic search count diumumkan.
- [ ] Touch controls minimal 44px.
- [ ] Reduced motion dihormati.
- [ ] Color bukan satu-satunya cara menyampaikan state.
