# 🎯 Duel Bullet Roulette — Gameplay Expansion Plan (`plan.md`)

> **Goal**: Mengembangkan *Duel Bullet Roulette* menjadi game duel taktis multi-mode (ala *Buckshot Roulette*) berorientasi **Pixel Neo-Brutalisme**, yang mendukung pengacakan peluru otomatis antar-babak (Round System), Item Taktis baru yang diperluas, serta pilihan **Normal Mode** & **Custom Mode**.

---

## 1. Mode Permainan (Game Modes)

Pemain dapat memilih 2 mode permainan di layar awal setup:

```
┌────────────────────────────────────────────────────────┐
│                   SELECT GAME MODE                     │
│                                                        │
│   ┌────────────────────────┐  ┌─────────────────────┐   │
│   │ 🕹️ NORMAL MODE         │  │ 🛠️ CUSTOM MODE      │   │
│   │ • Multi-Round (3 Babak)│  │ • Setup Peluru      │   │
│   │ • Dealer Bullet Reveal │  │   Manual (Safe/Dngr)│   │
│   │ • Auto-Random Chamber  │  │ • Item ON / OFF     │   │
│   │ • Item Pembagian Auto  │  │ • Single Match      │   │
│   └────────────────────────┘  └─────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

### 1.1 Normal Mode (Buckshot Authentic Mode)
- **Struktur Multi-Round (3 Babak)**:
  - **Babak 1 (Introduction)**: 2 HP per pemain. Peluru sedikit (misal 1 Safe / 2 Danger), belum ada item atau item terbatas (1 item per pemain).
  - **Babak 2 (Full Arsenal)**: 4 HP per pemain. 2–4 item acak dibagikan setiap kali chamber diisi ulang. Kombinasi peluru bervariasi (misal 3 Safe / 2 Danger, 4 Safe / 4 Danger).
  - **Babak 3 (Sudden Death / Wire Cutter Mode)**: 6 HP per pemain. Jika HP pemain turun di bawah 2 HP, sistem mengunci penyembuhan (Cigarette/Medkit tidak dapat digunakan) dan damage menjadi semakin berbahaya!
- **Sistem Pengacakan & Pengumuman Peluru Dealer**:
  - Di awal setiap pengisian chamber, sistem mengumumkan jumlah peluru yang dimasukkan (misal: *"Dealer loads 3 Safe bullets and 2 Danger bullets"*).
  - Urutan peluru dimasukkan ke dalam chamber senapan secara **acak rahasia (RNG Shuffle)**.
  - Setiap kali chamber kosong, dealer memasukkan peluru acak baru dan membagikan item baru ke pemain!

### 1.2 Custom Mode (Sandbox Mode)
- **Konfigurasi Manual**: Pemain bebas mengatur jumlah peluru *Safe* (1–7) dan *Danger* (3–9) menggunakan tombol `[ + ]` dan `[ - ]`.
- **Pengaturan Fitur**: Pemain bisa memilih apakah ingin bermain **dengan Item** atau **tanpa Item**.
- **Single Match**: Permainan berlangsung 1 kali pertempuran hingga salah satu pemain gugur.

---

## 2. Katalog Item Taktis Lengkap (Expanded Item Pool)

Item dibagi menjadi **Core Items** (Item Utama) dan **Advanced Items** (Item Lanjutan).

### 2.1 Core Items (Item Utama)

| Ikon / Nama Item | Nama Teknis | Fungsi & Efek Mekanis | Dampak Strategis |
|---|---|---|---|
| 🔍 **Magnifying Glass** | `magnifier` | Mengintip tipe peluru yang sedang berada di ujung senapan (*Safe* / *Danger*). Keterangan hanya terlihat oleh penggunanya. | Kepastian 100% untuk menentukan sasaran tembak. |
| 🔗 **Handcuffs** | `handcuffs` | Mengunci lawan sehingga giliran berikutnya dilewati (*skip 1 turn*). | Mendapatkan 2x giliran berturut-turut untuk eksekusi taktis. |
| 🪚 **Hand Saw** | `saw` | Memotong laras senapan. Peluru berikutnya menghasilkan **2x Damage (2 HP)**. | High-risk high-reward untuk menguras HP lawan. |
| 🍺 **Beer** | `beer` | Membuang (*eject*) peluru saat ini keluar dari senapan tanpa menembakkannya. Tipe peluru yang terbuang diumumkan ke layar. | Membersihkan peluru berbahaya saat giliran Anda. |
| 🔄 **Inverter** | `inverter` | Membalik tipe peluru saat ini (*Safe* ↔ *Danger*). | Mengubah peluru kosong menjadi mematikan, atau menetralkan peluru tajam. |
| 🚬 **Cigarette / Medkit** | `cigarette` | Memulihkan 1 HP pemain (maksimal HP sesuai batas babak). | Bertahan hidup saat HP tersisa sedikit. |

### 2.2 Advanced Items (Item Lanjutan Baru)

| Ikon / Nama Item | Nama Teknis | Fungsi & Efek Mekanis | Dampak Strategis |
|---|---|---|---|
| 📞 **Burner Phone** | `phone` | Memberikan petunjuk posisi peluru spesifik di chamber (misal: *"Peluru ke-3 adalah Danger"*). | Perencanaan strategi jangka panjang untuk beberapa langkah ke depan. |
| ✂️ **Adrenaline** | `adrenaline` | Mencuri 1 item milik lawan dan **langsung menggunakannya** saat itu juga. | Membalikkan keadaan dengan memanfaatkan senjata lawan. |
| 🍾 **Expired Medicine** | `medicine` | Mengkonsumsi obat acak: **50% peluang menyembuhkan 2 HP**, **50% peluang kehilangan 1 HP**. | Perjudian kesehatan yang sangat krusial saat terdesak. |
| 🧯 **Bulletproof Vest** | `vest` | Memberikan perisai sementara. Menahan 1 tembakan peluru tajam berikutnya sehingga HP tidak berkurang. | Perlindungan dari tembakan mendadak lawan. |
| 📻 **Radio Jammer** | `jammer` | Mengunci inventaris item lawan pada giliran berikutnya (*Silence / Item Lock*). Lawan tidak dapat menggunakan item sama sekali saat gilirannya tiba. | Melumpuhkan pertahanan/serangan taktis lawan (mencegah lawan memakai Medkit, Vest, atau Saw). |

---

## 3. Alur Babak & Pembagian Peluru (Round Flow)

### 3.1 Diagram Alur Babak (Normal Mode)

```
[Mulai Game Normal Mode]
       │
       ▼
 ┌───────────────┐
 │   BABAK 1     │ ──► Load Peluru Acak (misal 2 Safe, 1 Danger) + 1 Item
 └───────────────┘
       │ (Salah satu HP Player = 0)
       ▼
 ┌───────────────┐
 │   BABAK 2     │ ──► Reset HP (4 HP) + Load Peluru Acak + 2 Item Baru
 └───────────────┘
       │ (Salah satu HP Player = 0)
       ▼
 ┌───────────────┐
 │   BABAK 3     │ ──► Sudden Death (6 HP, Heals Disabled) + Peluru Acak Maksimal
 └───────────────┘
       │
       ▼
 [Pemenang Utama Diumumkan]
```

### 3.2 Pengacakan Peluru Otomatis (Auto-Chamber Generator)
```javascript
function generateRandomChamber(roundNumber) {
  let safeCount, dangerCount;
  if (roundNumber === 1) {
    safeCount = Math.floor(Math.random() * 2) + 1; // 1-2
    dangerCount = Math.floor(Math.random() * 2) + 1; // 1-2
  } else if (roundNumber === 2) {
    safeCount = Math.floor(Math.random() * 3) + 2; // 2-4
    dangerCount = Math.floor(Math.random() * 3) + 2; // 2-4
  } else {
    safeCount = Math.floor(Math.random() * 3) + 2; // 2-4
    dangerCount = Math.floor(Math.random() * 4) + 3; // 3-6
  }
  return { safeCount, dangerCount, bullets: buildBulletPool(safeCount, dangerCount) };
}
```

---

## 4. UI Neo-Brutalisme Untuk Mode & Item

### 4.1 Layout Inventaris Item & Status Babak
Inventaris item dan indikator babak tetap mengunci aturan **karakter & UI bersebelahan (Side-by-Side)** di semua layar.

```
┌────────────────────────────────────────────────────────┐
│ ╔════════════════════════════════════════════════════╗ │
│ ║ [ROUND 2/3] ▸ PLAYER 1'S TURN ◂ | Chamber: 4/7     ║ │
│ ╚════════════════════════════════════════════════════╝ │
│                                                        │
│  ┌────────────────────┐            ┌────────────────────┐ │
│  │ █ PLAYER 1         │   ┌────┐   │ █ PLAYER 2         │ │
│  │ [Player1 Sprite]   │   │ VS │   │ [Player2 Sprite]   │ │
│  │ [♥][♥][♥][♥] HP    │   └────┘   │ [♥][♥][♥] HP       │ │
│  ├────────────────────┤            ├────────────────────┤ │
│  │ ITEMS:             │            │ ITEMS:             │ │
│  │ [🔍][🪚][📞][🍺]   │            │ [🔗][✂️][🧯][EMPTY] │ │
│  └────────────────────┘            └────────────────────┘ │
│                                                        │
│  ┌────────────────────────┐    ┌────────────────────────┐ │
│  │ [•] SHOOT SELF         │    │ [✕] SHOOT ENEMY        │ │
│  └────────────────────────┘    └────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

### 4.2 Tampilan Pengumuman Peluru Dealer (Dealer Reveal Banner)
Saat dealer mengisi peluru baru di Normal Mode, tampilkan banner pengumuman Neo-Brutalis:
```
╔══════════════════════════════════════════════════════════╗
║  [DEALER LOAD] 3 Safe Bullets, 2 Danger Bullets Loaded!  ║
╚══════════════════════════════════════════════════════════╝
```

---

## 5. Ekstensi State Manager (`script.js`)

```javascript
function createInitialState() {
  return {
    gameMode: "normal",      // "normal" | "custom"
    currentRound: 1,         // 1, 2, 3 (untuk Normal Mode)
    phase: PHASE.CONFIG,
    safeBullets: 4,
    dangerBullets: 6,
    bullets: [],
    currentPlayer: 1,
    lives: { 1: 3, 2: 3 },
    maxLives: 3,
    items: { 1: [], 2: [] },
    maxItemsPerPlayer: 4,
    sawActive: false,
    handcuffedPlayer: null,
    jammedPlayer: null,      // Player yang sedang di-jam (tidak bisa pakai item di gilirannya)
    vestActive: { 1: false, 2: false },
    knownCurrentBullet: null,
    pendingTarget: null,
    resultText: "",
    timerId: null,
  };
}
```

---

## 6. Tahapan Pengembangan (Updated Roadmap)

### 📌 Milestone 1: Game Mode Selector & Round Engine
- [ ] Menambahkan UI pemilih mode (**Normal Mode** vs **Custom Mode**) di layar setup.
- [ ] Mengimplementasikan *Round Engine* (Babak 1, 2, 3) & pengacak peluru otomatis ala Buckshot Roulette.
- [ ] Menambahkan banner pengumuman peluru dealer (*Dealer Load Reveal Banner*).

### 📌 Milestone 2: Core Item System
- [ ] Menambahkan data struktur inventaris item di `state.js`.
- [ ] Mengimplementasikan 6 Core Items (`magnifier`, `handcuffs`, `saw`, `beer`, `inverter`, `cigarette`).
- [ ] Membuat slot inventaris item Neo-Brutalisme di HTML & CSS.

### 📌 Milestone 3: Advanced Item Expansion
- [ ] Mengimplementasikan 5 Advanced Items (`phone`, `adrenaline`, `medicine`, `vest`, `magnet`).
- [ ] Menambahkan logika curi item (*Adrenaline*) dan petunjuk peluru (*Burner Phone*).

### 📌 Milestone 4: Polishing & Responsive Side-by-Side Verification
- [ ] Memastikan seluruh UI & slot item tetap bersebelahan (*side-by-side*) di HP 320px.
- [ ] Bebas emoji OS — murni menggunakan ikon piksel & simbol monospace.
- [ ] Pengujian menyeluruh tanpa bug.
