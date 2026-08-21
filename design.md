# 🎨 Duel Bullet Roulette — Pixel Neo-Brutalism Design Document

> **Status**: Planning & Visual Specification  
> **Aesthetic Theme**: **Pixel Neo-Brutalisme** (Bold Black Outlines, Hard Offset Shadows, High-Contrast Solid Colors, Pixel-perfect Assets)  
> **Layout Constraint**: Karakter P1 & P2 **SELALU Bersebelahan (Side-by-Side)** di semua layar (desktop hingga mobile 320px).  
> **Icon Standard**: **Selalu gunakan Icon/Simbol Pixel / Image Assets, DILARANG Menggunakan Emoji Bawaan OS.**

---

## 1. Konsep & Filosofi Design (Mengapa Neo-Brutalisme?)

Seni pixel art pada asset game (`player1_idle.png`, `player2_idle.png`, peluru, hati, pistol) memiliki **outline hitam tebal** dan warna yang terisolasi tajam. Gaya **Neo-Brutalisme** sangat cocok karena:
1. **Harmoni Visual**: Menggunakan border hitam tegas (`3px - 4px solid #000000`) yang menyatu sempurna dengan outline pixel art.
2. **Konsistensi Lintas Platform**: **Menghindari penggunaan emoji bawaan OS** (seperti 🎯, 🔥, 💥, ⚡, 🏆) karena tampilan emoji berbeda-beda di iOS, Android, Termux, Windows, dan Linux. Semua ikon menggunakan **image assets asli, SVG pixelated, atau simbol teks ASCII/Unicode netral (`▸`, `•`, `✕`, `✓`, `+`, `-`)**.
3. **Tanpa Glassmorphic Blur**: Menghapus blur, gradient halus, atau efek kaca transparan yang sering bentrok dengan pixel art retro.
4. **Taktil & Interaktif**: Efek tombol Neo-Brutalis (*hard shadow 4px 4px 0 #000*) yang ketika diklik "tenggelam" (*translate 3px 3px*) memberikan respons motorik yang sangat memuaskan di game arcade.
5. **High Contrast & Clarity**: Informasi status game (giliran, sisa HP, jenis peluru) dapat dibaca secara instan.

---

## 2. Palet Warna Neo-Brutalisme (Pixel Harmony)

Warna UI diambil langsung dari asset game dan dipadukan dengan aksen warna solid bersaturasi tinggi khas Neo-Brutalisme.

```
┌─────────────────────────────────────────────────────────┐
│  BACKGROUND & LAYOUT                                    │
│  ───────────────────                                    │
│  Main BG        : #181824  (Dark Charcoal / Arcade Dark)│
│  Card Surface   : #FFFDF5  (Warm Canvas / Cream White)  │
│  Border Color   : #000000  (Pure Pitch Black, 3px-4px)  │
│  Hard Shadow    : #000000  (Solid Offset Shadow)        │
│                                                         │
│  PLAYER ACCENTS                                         │
│  ──────────────                                         │
│  Player 1 (Cat Grey)   : #00E5FF  (Cyber Cyan / Slate)  │
│  Player 2 (Cat Orange) : #FF9100  (Vibrant Amber/Orange)│
│                                                         │
│  GAMEPLAY ACCENTS                                       │
│  ────────────────                                       │
│  Safe Bullet    : #00E676  (Neon Mint Green / Safe)     │
│  Danger Bullet  : #FF2A5F  (Crimson Red / Danger)       │
│  Gold / Warning : #FFE600  (Arcade Yellow)              │
│  Text Color     : #000000  (Di atas kartu/tombol light)│
│  Text Inverted  : #FFFFFF  (Di atas elemen dark)       │
└─────────────────────────────────────────────────────────┘
```

### Aturan Warna & Asset:
- ❌ **Dilarang**: Gradient halus (*soft linear/radial gradient*), efek blur kaca (*backdrop-filter: blur*), warna pastel pudar tanpa border.
- ❌ **Dilarang Gunakan Emoji**: Dilarang memakai emoji bawaan OS (`🎯`, `🔥`, `💥`, `⚡`, `🏆`, `🔊`, `🔇`, `🤝`, `🐱`, `🔫`).
- ✅ **Wajib**: Gunakan image assets asli (`assets/safe_bullet.png`, `assets/danger_bullet.png`, `assets/pistol.png`, `assets/heart.png`), ikon SVG bergaris tegas, atau simbol monospace (`▸`, `•`, `✕`, `[+]`, `[-]`).
- ✅ **Wajib**: Border hitam tebal (**3px - 4px solid #000**) dan bayangan tajam tanpa blur (**`box-shadow: 4px 4px 0px #000`**).

---

## 3. Tipografi Retro Pixel

Untuk memperkuat impresi arcade retro, digunakan font pixel art resmi dari Google Fonts.

* **Primary Font**: `'Press Start 2P'`, cursive / pixel-sans  
* **Secondary Font (Alternative)**: `'Silkscreen'`, display-pixel  
* **Fallback**: `'Courier New'`, monospace  

### Aturan Tipografi:
* Semua judul, badge status, dan teks tombol menggunakan huruf kapital (**UPPERCASE**).
* Teks judul menggunakan **hard text-shadow**: `2px 2px 0px #000`.
* Menyesuaikan ukuran font agar tetap terbaca di layar terkecil (minimal 9px–10px untuk mobile, 12px–14px untuk desktop).

---

## 4. Layout Responsif — Karakter Bersebelahan (Side-by-Side)

### 4.1 Persyaratan Kritis Layout
> Karakter Player 1 dan Player 2 **HARUS SELALU BERSEBELAHAN (Side-by-Side)** secara horizontal di SEMUA ukuran layar (termasuk layar smartphone portrait 320px). Karakter **TIDAK BOLEH** menumpuk secara vertikal.

### 4.2 Skema Layout Battleground Neo-Brutalis (Bebas Emoji)

```
┌────────────────────────────────────────────────────────┐
│ ╔════════════════════════════════════════════════════╗ │
│ ║  ▸ PLAYER 1'S TURN ◂  | Chamber: 6/10 Bullets      ║ │
│ ╚════════════════════════════════════════════════════╝ │
│                                                        │
│  ┌────────────────────┐            ┌────────────────────┐ │
│  │ █ PLAYER 1         │   ┌────┐   │ █ PLAYER 2         │ │
│  │ ┌────────────────┐ │   │ VS │   │ ┌────────────────┐ │ │
│  │ │ [Player1 Img]  │ │   └────┘   │ │ [Player2 Img]  │ │ │
│  │ └────────────────┘ │            │ └────────────────┘ │ │
│  │  [♥][♥][♥] HP      │            │  [♥][♥][♥] HP      │ │
│  └────────────────────┘            └────────────────────┘ │
│      (Cyber Cyan)                       (Amber Orange)    │
│                                                        │
│  ┌────────────────────────┐    ┌────────────────────────┐ │
│  │ [•] SHOOT SELF         │    │ [✕] SHOOT ENEMY        │ │
│  └────────────────────────┘    └────────────────────────┘ │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │  ▸ Player 1 shot Player 2 with a dangerous bullet! │ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

### 4.3 Spesifikasi CSS Responsive

```css
/* Menjamin karakter selalu bersebelahan di semua breakpoint */
#gameArea {
    display: flex !important;
    flex-direction: row !important; /* Dilarang flex-direction: column */
    flex-wrap: nowrap !important;   /* Dilarang memotong ke bawah */
    justify-content: center;
    align-items: center;
    gap: clamp(8px, 3vw, 24px);
    width: 100%;
}

/* Ukuran kartu & sprite fleksibel sesuai lebar layar */
.player-card {
    flex: 1;
    min-width: 0; /* Mencegah overflow flex container */
    background: #FFFDF5;
    border: 3px solid #000000;
    box-shadow: 4px 4px 0px #000000;
    padding: clamp(8px, 2vw, 16px);
}

.player {
    width: clamp(65px, 22vw, 140px); /* Skala otomatis: min 65px di mobile 320px */
    height: auto;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
}
```

---

## 5. Komponen UI Neo-Brutalisme (Bebas Emoji)

### 5.1 Tombol Neo-Brutalis (Tactile Button)
- **Visual**: Warna solid mencolok, border `3px solid #000`, bayangan `4px 4px 0px #000`.
- **Ikon Tombol**: Menggunakan simbol Unicode netral atau SVG pixel art (`[•]` untuk Shoot Self, `[✕]` untuk Shoot Enemy, `[+]` / `[-]` untuk counter).
- **Efek Hover**: Warna sedikit lebih terang, bayangan membesar `5px 5px 0px #000`, terangkat `translate(-1px, -1px)`.
- **Efek Press (Active)**: Mendorong tombol ke bawah `translate(3px, 3px)`, bayangan mengecil `1px 1px 0px #000` (efek tombol mekanis arcade).

### 5.2 Kartu Karakter (Player Cards)
- **Player 1 Card**: Aksen warna Cyan `#00E5FF` pada header badge & border highlight saat giliran aktif.
- **Player 2 Card**: Aksen warna Orange/Amber `#FF9100` pada header badge & border highlight saat giliran aktif.
- **HP Display**: Menggunakan file image asset `assets/heart.png` dan `assets/heart_break.png` (bukan emoji hati).
- **Active Turn Highlight**: Kartu pemain yang aktif mendapatkan border `4px solid #000`, warna latar badge yang mencolok, dan efek *pulse translateY(-4px)*.

### 5.3 Popup Konfirmasi Neo-Brutalis (Modal Overlay)
- **Overlay**: Background `rgba(0, 0, 0, 0.8)` tanpa blur.
- **Modal Box**: Latar `#FFE600` (Kuning Arcade), border `4px solid #000`, bayangan `6px 6px 0px #000`.
- **Tombol Konfirmasi**: Tombol "YES, FIRE!" berlatar merah `#FF2A5F` (Danger), tombol "CANCEL" berlatar abu-abu `#E0E0E0`.

### 5.4 Banner Teks Hasil (Result Feed)
- Kotak Neo-Brutalis berlatar putih `#FFFDF5`, border `3px solid #000`, bayangan `4px 4px 0px #000`.
- Teks menggunakan penanda simbol pixel (`▸`, `[BANG!]`, `[SAFE]`) tanpa emoji OS.

---

## 6. Efek Animasi Pixel & Transisi Game

Semua animasi dikoreografikan agar selaras dengan estetika **pixel art arcade**:

1. **Idle Pixel Bounce**: Sprite bergerak naik-turun 3px secara konstan dengan `animation-timing-function: steps(2)` agar terasa seperti animasi frame 8-bit.
2. **Recoil Menembak**: Saat pemain menembak, sprite menggeser tubuhnya ke arah lawan/diri sendiri dalam 150ms dengan `steps(3)`.
3. **Hit Flash (Tembakan Tajam Selamat)**: Korban berkedip (*visibility toggle*) 3x dengan transisi langkah patah.
4. **Death Shake & Ghost**: Saat nyawa 0, karakter bergoyang horizontal tajam (*steps(8)*) lalu berganti menjadi `.gif` hantu.
5. **Flash Partikel Pixel (Ganti Emoji)**: Saat peluru tajam atau aman meletus, tampilkan efek flash warna/sprite partikel bergaris hitam tegas bukannya emoji 💥/✨.
6. **Sprite Reset (Fix Bug)**: Setelah resolusi tembakan atau pergantian giliran, kedua pemain yang masih hidup dipastikan kembali ke pose `idle` tanpa bug tertahan di pose menembak.

---

## 7. Detail Layar Konfigurasi (Setup - Bebas Emoji)

### Layout

```
┌─────────────────────────────────────┐
│                                     │
│         [Pistol Image Asset]        │
│                                     │
│         SET UP GAME                 │
│                                     │
│   Safe Bullets:                     │
│   [ - ] [Safe Bullet Img] 4 [ + ]   │
│                                     │
│   Danger Bullets:                   │
│   [ - ] [Danger Bullet Img] 6 [ + ] │
│                                     │
│   Total Chamber Preview:            │
│   [Safe Img][Safe Img]...[Danger Img]│
│                                     │
│   ╔═══════════════════════╗         │
│   ║     START DUEL        ║         │
│   ╚═══════════════════════╝         │
└─────────────────────────────────────┘
```

- Ikon peluru & pistol: Murni menggunakan `assets/safe_bullet.png`, `assets/danger_bullet.png`, `assets/pistol.png`.
- Tombol `[ - ]` dan `[ + ]`: Kotak neo-brutalis dengan font monospace `Press Start 2P`.
- Tombol "START DUEL": Berlatar `#FFE600`, border `4px solid #000`, bayangan `4px 4px 0 #000`.

---

## 8. Rencana Langkah Implementasi

1. **Memperbarui `design.md`**: Memastikan aturan larangan emoji bawaan OS dicatat sebagai standar visual resmi.
2. **Penerapan CSS Neo-Brutalisme ([style.css](file:///data/data/com.termux/files/home/DuelBulletRoulette/style.css))**:
   - Menghapus styling awal / glassmorphism.
   - Menambahkan variabel warna Neo-Brutalisme, border `3px - 4px solid #000`, dan hard shadow `4px 4px 0px #000`.
   - Mengatur font `Press Start 2P` & `image-rendering: pixelated;`.
3. **Penyelarasan HTML ([index.html](file:///data/data/com.termux/files/home/DuelBulletRoulette/index.html))**:
   - Menghapus semua emoji teks dan menggantinya dengan simbol ASCII/SVG atau image assets.
   - Memastikan struktur flex container `#gameArea` mengunci kedua karakter agar selalu bersebelahan.
4. **Integrasi Logika & Sprite Reset ([script.js](file:///data/data/com.termux/files/home/DuelBulletRoulette/script.js))**:
   - Mengganti teks `resultText` ber-emoji dengan teks berformat simbol pixel (`[BANG!]`, `▸`).
   - Mempertahankan bug fix sprite reset Player 2 & Player 1.
