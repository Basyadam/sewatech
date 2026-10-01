import { Product, CustomerUser, RentalOrder, PlatformIssue, FinancialMetric, AppNotification, AdminUser } from '../types';
import { LAPTOP_PRICELIST_STANDARD, LAPTOP_PRICELIST_RAM16 } from '../utils/pricing';

import laptopWindowsImg from '../assets/images/laptop_windows_1790398764498.jpg';
import laptopMacImg from '../assets/images/laptop_mac_1790398778318.jpg';

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Laptop Standar (RAM 8GB) - Harian: 175k, 3 Hari+: 160k/hari, Mingguan: 875k, Bulanan: 2400k
  {
    id: 'prod-win-std-1',
    name: 'Lenovo ThinkPad L14 Gen 4 (RAM 8GB)',
    category: 'laptop-windows',
    subCategory: 'Laptop Standar Kantor & Kuliah',
    headline: 'Intel Core i5-1335U, RAM 8GB DDR4, 512GB NVMe SSD, 14" FHD IPS Anti-Glare',
    description: 'Pilihan laptop paling andal untuk operasional kantor, admin, tugas kuliah, dan meeting daring. Keyboard ergonomis tahan tumpahan air, baterai awet hingga 9 jam, dan performa mulus.',
    dailyRate: 175000,
    depositAmount: 350000,
    stock: 8,
    availableStock: 6,
    image: laptopWindowsImg,
    rating: 4.9,
    reviewsCount: 42,
    condition: 'Mulus 99%',
    ramSpec: '8GB',
    rentalPriceTier: LAPTOP_PRICELIST_STANDARD,
    specs: [
      { label: 'Processor', value: 'Intel Core i5-1335U (10 Cores, up to 4.6GHz)' },
      { label: 'RAM', value: '8GB DDR4 3200MHz' },
      { label: 'Penyimpanan', value: '512GB NVMe PCIe 4.0 SSD' },
      { label: 'Layar', value: '14.0" Full HD (1920x1080) IPS 300 nits' },
      { label: 'OS & Software', value: 'Windows 11 Pro + Microsoft Office 2024 Original' }
    ],
    includedAccessories: ['Charger Original Type-C 65W', 'Tas Laptop ThinkPad', 'Mouse Wireless Silent'],
    featured: true
  },
  {
    id: 'prod-win-std-2',
    name: 'Dell Latitude 3420 Business (RAM 8GB)',
    category: 'laptop-windows',
    subCategory: 'Laptop Standar Bisnis',
    headline: 'Intel Core i5-1135G7, RAM 8GB, 256GB SSD, 14" HD Anti-Glare, Ringan 1.5kg',
    description: 'Laptop standar operasional harian yang ringkas dan tangguh. Sangat cocok untuk sewa jangka pendek harian, mingguan, maupun pengadaan sewa bulanan instansi atau perusahaan.',
    dailyRate: 175000,
    depositAmount: 350000,
    stock: 6,
    availableStock: 4,
    image: laptopWindowsImg,
    rating: 4.8,
    reviewsCount: 28,
    condition: 'Grade A',
    ramSpec: '8GB',
    rentalPriceTier: LAPTOP_PRICELIST_STANDARD,
    specs: [
      { label: 'Processor', value: 'Intel Core i5-1135G7 Quad-Core' },
      { label: 'RAM', value: '8GB DDR4' },
      { label: 'Penyimpanan', value: '256GB M.2 PCIe SSD' },
      { label: 'Layar', value: '14" HD Anti-Glare WLED' },
      { label: 'Bobot', value: '1.52 kg' }
    ],
    includedAccessories: ['Charger Dell 65W Original', 'Tas Ransel Laptop'],
    featured: false
  },
  {
    id: 'prod-win-std-3',
    name: 'HP ProBook 440 G10 (RAM 8GB)',
    category: 'laptop-windows',
    subCategory: 'Laptop Standar Event & Admin',
    headline: 'Intel Core i5-1334U, RAM 8GB DDR4, 512GB SSD, Aluminium Chassis',
    description: 'Bodi aluminium elegan dengan durabilitas militer MIL-STD 810H. Sangat diminati untuk sewa event pameran, registrasi tamu, ujian instansi, dan kasir/POS.',
    dailyRate: 175000,
    depositAmount: 350000,
    stock: 7,
    availableStock: 5,
    image: laptopWindowsImg,
    rating: 4.8,
    reviewsCount: 24,
    condition: 'Mulus 99%',
    ramSpec: '8GB',
    rentalPriceTier: LAPTOP_PRICELIST_STANDARD,
    specs: [
      { label: 'Processor', value: 'Intel Core i5-1334U (10 Cores, 12 Threads)' },
      { label: 'RAM', value: '8GB DDR4 3200MHz' },
      { label: 'Penyimpanan', value: '512GB PCIe NVMe SSD' },
      { label: 'Layar', value: '14.0" FHD IPS Narrow Bezel' },
      { label: 'Baterai', value: 'HP Long Life 3-cell 51 Wh' }
    ],
    includedAccessories: ['Charger HP 65W Smart AC Adapter', 'Sleeve Bag'],
    featured: false
  },
  {
    id: 'prod-mac-air-std',
    name: 'Apple MacBook Air 13" M2 (RAM 8GB)',
    category: 'laptop-mac',
    subCategory: 'MacBook Air Portabel',
    headline: 'Apple M2 8-Core CPU / 8-Core GPU, 8GB Unified RAM, 256GB SSD, Starlight',
    description: 'Bodi super ramping 1.13 cm dengan bobot hanya 1.24 kg. Layar Liquid Retina yang memukau dan baterai yang sanggup bertahan hingga 18 jam pemakaian tanpa charger.',
    dailyRate: 175000,
    depositAmount: 400000,
    stock: 6,
    availableStock: 4,
    image: laptopMacImg,
    rating: 4.9,
    reviewsCount: 39,
    condition: 'Like New',
    ramSpec: '8GB',
    rentalPriceTier: LAPTOP_PRICELIST_STANDARD,
    specs: [
      { label: 'Chipset', value: 'Apple M2 (8-Core CPU, 8-Core GPU, 16-Core Neural Engine)' },
      { label: 'Memory', value: '8GB Unified RAM' },
      { label: 'Penyimpanan', value: '256GB SSD' },
      { label: 'Layar', value: '13.6" Liquid Retina Display 500 nits' },
      { label: 'Port', value: 'MagSafe 3, 2x Thunderbolt / USB 4, Headphone Jack' }
    ],
    includedAccessories: ['MagSafe 3 Cable', '30W USB-C Power Adapter', 'Pouch Wool Pelindung'],
    featured: false
  },

  // 2. Laptop Performa (RAM 16GB) - Harian: 200k, 3 Hari+: 175k/hari, Mingguan: 975k, Bulanan: 2700k
  {
    id: 'prod-win-ram16-1',
    name: 'Lenovo ThinkPad T14s Gen 3 (RAM 16GB)',
    category: 'laptop-windows',
    subCategory: 'Laptop Multitasking & Development',
    headline: 'Intel Core i7-1260P, RAM 16GB LPDDR5, 512GB SSD, Layar 14" WUXGA Low Power',
    description: 'Laptop premium dengan RAM 16GB untuk kebutuhan kerja berat: olah spreadsheet jutaan baris, coding/programming, Photoshop, Figma, dan puluhan tab browser tanpa jeda.',
    dailyRate: 200000,
    depositAmount: 400000,
    stock: 6,
    availableStock: 5,
    image: laptopWindowsImg,
    rating: 4.9,
    reviewsCount: 35,
    condition: 'Like New',
    ramSpec: '16GB',
    rentalPriceTier: LAPTOP_PRICELIST_RAM16,
    specs: [
      { label: 'Processor', value: 'Intel Core i7-1260P (12 Cores / 16 Threads)' },
      { label: 'RAM', value: '16GB LPDDR5 4800MHz Dual Channel' },
      { label: 'Penyimpanan', value: '512GB PCIe Gen4 Performance SSD' },
      { label: 'Layar', value: '14.0" WUXGA (1920x1200) IPS 400 nits 100% sRGB' },
      { label: 'Konektivitas', value: 'Thunderbolt 4, Wi-Fi 6E, HDMI 2.0' }
    ],
    includedAccessories: ['Charger USB-C 65W Fast Charge', 'Tas Laptop ThinkPad Premium', 'Mouse Wireless'],
    featured: true
  },
  {
    id: 'prod-win-ram16-2',
    name: 'ASUS Vivobook 15 OLED (RAM 16GB)',
    category: 'laptop-windows',
    subCategory: 'Laptop Desain & Presentasi',
    headline: 'AMD Ryzen 7 7730U, RAM 16GB DDR4, 512GB SSD, 15.6" OLED 600 nits Pantone Validated',
    description: 'Layar OLED kelas profesional dengan akurasi warna 100% DCI-P3 dan RAM 16GB lega. Sangat direkomendasikan untuk fotografer, graphic designer, dan eksekutif presentasi.',
    dailyRate: 200000,
    depositAmount: 400000,
    stock: 5,
    availableStock: 3,
    image: laptopWindowsImg,
    rating: 4.9,
    reviewsCount: 31,
    condition: 'Mulus 99%',
    ramSpec: '16GB',
    rentalPriceTier: LAPTOP_PRICELIST_RAM16,
    specs: [
      { label: 'Processor', value: 'AMD Ryzen 7 7730U (8 Cores / 16 Threads)' },
      { label: 'RAM', value: '16GB DDR4 3200MHz' },
      { label: 'Storage', value: '512GB M.2 NVMe SSD' },
      { label: 'Layar', value: '15.6" OLED FHD 0.2ms 600 nits HDR True Black' }
    ],
    includedAccessories: ['Charger ASUS 65W', 'Sleeve Bag Eksklusif'],
    featured: false
  },
  {
    id: 'prod-win-ram16-3',
    name: 'Dell XPS 15 9530 (RAM 16GB)',
    category: 'laptop-windows',
    subCategory: 'Ultrabook Kreator Premium',
    headline: 'Intel Core i7-13700H, RAM 16GB DDR5, Intel Arc A370M, 15.6" FHD+ InfinityEdge',
    description: 'Desain ikonik Dell XPS dengan material carbon fiber dan aluminium CNC. Layar InfinityEdge 4-sisi nyaris tanpa bezel dengan trackpad kaca raksasa yang nyaman.',
    dailyRate: 200000,
    depositAmount: 450000,
    stock: 4,
    availableStock: 3,
    image: laptopWindowsImg,
    rating: 4.9,
    reviewsCount: 27,
    condition: 'Like New',
    ramSpec: '16GB',
    rentalPriceTier: LAPTOP_PRICELIST_RAM16,
    specs: [
      { label: 'Processor', value: 'Intel Core i7-13700H (14 Cores / 20 Threads)' },
      { label: 'RAM', value: '16GB DDR5 4800MHz' },
      { label: 'GPU', value: 'Intel Arc A370M 4GB GDDR6' },
      { label: 'Layar', value: '15.6" FHD+ (1920x1200) 500 nits 100% sRGB' }
    ],
    includedAccessories: ['Charger Dell Type-C 130W', 'Dongle USB-C to USB-A/HDMI', 'Tas Kulit Eksklusif'],
    featured: false
  },
  {
    id: 'prod-mac-ram16',
    name: 'Apple MacBook Air 15" M3 (RAM 16GB)',
    category: 'laptop-mac',
    subCategory: 'MacBook Air Ultraportable',
    headline: 'Apple M3 8-Core CPU / 10-Core GPU, 16GB Unified RAM, 512GB SSD, Midnight',
    description: 'Desain fanless hening total dengan bentang layar lega 15.3 inci dan RAM 16GB Unified. Sangat ideal untuk kebutuhan presentasi klien, meeting luar kota, UI/UX design, dan produktivitas harian.',
    dailyRate: 200000,
    depositAmount: 450000,
    stock: 5,
    availableStock: 4,
    image: laptopMacImg,
    rating: 4.9,
    reviewsCount: 47,
    condition: 'Mulus 99%',
    ramSpec: '16GB',
    rentalPriceTier: LAPTOP_PRICELIST_RAM16,
    specs: [
      { label: 'Chipset', value: 'Apple M3 with 16-core Neural Engine' },
      { label: 'Memory', value: '16GB Unified RAM' },
      { label: 'Penyimpanan', value: '512GB Superfast SSD' },
      { label: 'Layar', value: '15.3" Liquid Retina 500 nits True Tone' },
      { label: 'Baterai', value: 'Up to 18 jam hemat daya' }
    ],
    includedAccessories: ['MagSafe 3 Cable braided', '35W Dual USB-C Adapter', 'Felt Wool Protective Pouch'],
    featured: true
  },

  // 3. Laptop Gaming, Heavy 3D & Flagship Mac (RAM 18GB - 48GB)
  {
    id: 'prod-mac-3',
    name: 'Apple MacBook Pro 14" M3 Pro',
    category: 'laptop-mac',
    subCategory: 'MacBook Pro Portabel',
    headline: 'Apple M3 Pro (12-Core CPU, 18-Core GPU), 18GB Memory, Silver',
    description: 'Keseimbangan sempurna antara portabilitas 14 inci dan performa Pro. Ideal untuk live audio mixer, color grading DaVinci on-set, dan software development.',
    dailyRate: 260000,
    depositAmount: 500000,
    stock: 4,
    availableStock: 3,
    image: laptopMacImg,
    rating: 4.9,
    reviewsCount: 29,
    condition: 'Like New',
    ramSpec: '18GB' as any,
    specs: [
      { label: 'Chipset', value: 'Apple M3 Pro 12-Core CPU / 18-Core GPU' },
      { label: 'Memory', value: '18GB Unified Memory' },
      { label: 'Layar', value: '14.2" Liquid Retina XDR 120Hz ProMotion' },
      { label: 'Storage', value: '512GB SSD PCIe' }
    ],
    includedAccessories: ['MagSafe 3 Cable', '70W USB-C Adapter', 'Hardshell Bag'],
    featured: false
  },
  {
    id: 'prod-mac-1',
    name: 'Apple MacBook Pro 16" M3 Max',
    category: 'laptop-mac',
    subCategory: 'MacBook Pro Flagship Studio',
    headline: 'Apple M3 Max (16-Core CPU, 40-Core GPU), 48GB Unified Memory, Space Black',
    description: 'Puncak performa komputasi portabel untuk video editor 8K ProRes, sound engineer Dolby Atmos, dan machine learning engineer. Daya tahan baterai hingga 22 jam kerja nyata.',
    dailyRate: 350000,
    depositAmount: 700000,
    stock: 3,
    availableStock: 2,
    image: laptopMacImg,
    rating: 5.0,
    reviewsCount: 52,
    condition: 'Like New',
    ramSpec: '48GB',
    specs: [
      { label: 'Chipset', value: 'Apple M3 Max (16-Core CPU, 40-Core GPU)' },
      { label: 'Memory', value: '48GB Unified Memory (300GB/s bandwidth)' },
      { label: 'Penyimpanan', value: '1TB Superfast SSD' },
      { label: 'Layar', value: '16.2" Liquid Retina XDR 1600 nits ProMotion 120Hz' },
      { label: 'Port', value: '3x Thunderbolt 4, HDMI, SDXC, MagSafe 3' }
    ],
    includedAccessories: ['MagSafe 3 Cable braided', '140W USB-C Power Adapter', 'Hardshell Leather Case'],
    featured: true
  },
  {
    id: 'prod-win-1',
    name: 'ASUS ROG Zephyrus G16 (2024)',
    category: 'laptop-windows',
    subCategory: 'Laptop Gaming & 3D Render Flagship',
    headline: 'Intel Core Ultra 9, RTX 4070 8GB, 32GB LPDDR5X, 2.5K OLED 240Hz',
    description: 'Laptop gaming ultra-tipis dengan chassis aluminium CNC. Sangat powerful untuk render 3D Blender, editing 4K Premiere/DaVinci Resolve, dan gaming AAA rata kanan.',
    dailyRate: 250000,
    depositAmount: 500000,
    stock: 4,
    availableStock: 3,
    image: laptopWindowsImg,
    rating: 4.9,
    reviewsCount: 38,
    condition: 'Mulus 99%',
    ramSpec: '32GB',
    specs: [
      { label: 'Processor', value: 'Intel Core Ultra 9 185H (16 Cores)' },
      { label: 'GPU', value: 'NVIDIA GeForce RTX 4070 8GB GDDR6' },
      { label: 'RAM / Storage', value: '32GB LPDDR5X / 1TB NVMe PCIe 4.0' },
      { label: 'Layar', value: '16" OLED 2.5K (2560x1600) 240Hz 0.2ms' },
      { label: 'Bobot', value: '1.85 kg (Super Ringan)' }
    ],
    includedAccessories: ['Charger Original 240W', 'ROG Sleeve Case', 'Mouse Gaming Wireless', 'Kabel Type-C 100W'],
    featured: false
  },
  {
    id: 'prod-win-legion',
    name: 'Lenovo Legion Pro 5i (2024)',
    category: 'laptop-windows',
    subCategory: 'Workstation CAD & Gaming Berat',
    headline: 'Intel Core i9-14900HX, RTX 4060 8GB 140W TGP, 32GB DDR5, 16" WQXGA 240Hz',
    description: 'Ditenagai prosesor desktop-class i9-14900HX 24 cores dan pendingin Coldfront 5.0. Pilihan terfavorit arsitek (AutoCAD, Revit, SketchUp) dan simulator engineer.',
    dailyRate: 260000,
    depositAmount: 500000,
    stock: 3,
    availableStock: 2,
    image: laptopWindowsImg,
    rating: 4.9,
    reviewsCount: 33,
    condition: 'Like New',
    ramSpec: '32GB',
    specs: [
      { label: 'Processor', value: 'Intel Core i9-14900HX (24 Cores / 32 Threads)' },
      { label: 'GPU', value: 'NVIDIA GeForce RTX 4060 8GB 140W TGP' },
      { label: 'RAM', value: '32GB DDR5 5600MHz' },
      { label: 'Layar', value: '16.0" WQXGA (2560x1600) IPS 500 nits 240Hz 100% sRGB' },
      { label: 'Keyboard', value: 'Legion TrueStrike 4-Zone RGB' }
    ],
    includedAccessories: ['Charger Slim 300W', 'Backpack Lenovo Legion', 'Mouse Gaming Ergonomis'],
    featured: false
  }
];

export const INITIAL_CUSTOMERS: CustomerUser[] = [
  {
    id: 'cust-1',
    fullName: 'Budi Santoso',
    email: 'budi.santoso@gmail.com',
    phone: '081288991122',
    nik: '3201140509890001',
    address: 'Jl. Senopati Raya No. 42, Kebayoran Baru, Jakarta Selatan',
    emergencyContact: {
      name: 'Rina Puspita (Istri)',
      relation: 'Istri',
      phone: '081299887766'
    },
    ktpPhotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    ktpStatus: 'verified',
    registeredAt: '2026-08-12',
    rentalsCompleted: 5,
    trustScore: 4.9
  },
  {
    id: 'cust-2',
    fullName: 'Siti Rahma Azzahra',
    email: 'siti.rahma@studioart.id',
    phone: '085712345678',
    nik: '3171025501980003',
    address: 'Apartemen Green Pramuka Tower Chrysant Lt. 15, Cempaka Putih, Jakarta Pusat',
    emergencyContact: {
      name: 'Ahmad Fauzi (Kakak)',
      relation: 'Kakak Kandung',
      phone: '085799112233'
    },
    ktpPhotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    ktpStatus: 'verified',
    registeredAt: '2026-09-01',
    rentalsCompleted: 2,
    trustScore: 4.8
  },
  {
    id: 'cust-3',
    fullName: 'Farhan Haekal (Customer Baru)',
    email: 'haekal.creativestudio@gmail.com',
    phone: '081377889900',
    nik: '3276011204010005',
    address: 'Jl. Margonda Raya No. 108, Beji, Kota Depok, Jawa Barat',
    emergencyContact: {
      name: 'Drs. Hendro Wibowo (Ayah)',
      relation: 'Orang Tua',
      phone: '081311224455'
    },
    ktpPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    ktpStatus: 'pending',
    registeredAt: '2026-09-25',
    rentalsCompleted: 0,
    trustScore: 4.0
  },
  {
    id: 'cust-4',
    fullName: 'Rizky Alamsyah',
    email: 'rizky.alamsyah88@yahoo.com',
    phone: '087899001144',
    nik: '3174092207950002',
    address: 'Jl. Tebet Timur Dalam VII No. 14, Tebet, Jakarta Selatan',
    emergencyContact: {
      name: 'Maya Sartika (Rekan Kerja)',
      relation: 'Rekan Kerja',
      phone: '087811223344'
    },
    ktpPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    ktpStatus: 'verified',
    registeredAt: '2026-07-15',
    rentalsCompleted: 1,
    trustScore: 2.1
  }
];

export const INITIAL_ORDERS: RentalOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'SWT-2026-0901',
    customerId: 'cust-1',
    customerName: 'Budi Santoso',
    customerPhone: '081288991122',
    customerEmail: 'budi.santoso@gmail.com',
    ktpVerified: true,
    product: INITIAL_PRODUCTS[9], // Apple MacBook Pro 16" M3 Max
    rentalDurationDays: 3,
    startDate: '2026-09-24',
    endDate: '2026-09-27',
    dailyRate: 350000,
    rentalFeeTotal: 1050000,
    depositAmount: 700000,
    deliveryMethod: 'delivery',
    deliveryAddress: 'Jl. Senopati Raya No. 42, Kebayoran Baru, Jakarta Selatan',
    totalAmount: 1750000,
    paymentMethod: 'QRIS',
    paymentStatus: 'verified',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80',
    proofSubmittedAt: '2026-09-24 10:15 WIB',
    status: 'received_in_use',
    returnDueDate: '2026-09-27 18:00 WIB',
    timeline: [
      {
        timestamp: '2026-09-24 09:30 WIB',
        status: 'awaiting_payment',
        title: 'Pesanan Dibuat',
        description: 'Penyewa memilih Apple MacBook Pro 16" M3 Max untuk durasi 3 hari.',
        completed: true
      },
      {
        timestamp: '2026-09-24 10:20 WIB',
        status: 'validating_proof',
        title: 'Bukti Bayar QRIS Terverifikasi',
        description: 'Admin menyetujui slip transfer QRIS sejumlah Rp 1.750.000.',
        completed: true
      },
      {
        timestamp: '2026-09-24 13:45 WIB',
        status: 'in_delivery_or_ready',
        title: 'Unit Dikirim oleh Kurir Khusus',
        description: 'Kurir SewaTech Express mengantar unit ke lokasi penyewa.',
        completed: true
      },
      {
        timestamp: '2026-09-24 15:10 WIB',
        status: 'received_in_use',
        title: 'Barang Diterima Penyewa',
        description: 'Penyewa menandatangani berita acara serah terima & cek fisik unit.',
        completed: true
      }
    ],
    createdAt: '2026-09-24 09:30'
  },
  {
    id: 'ord-102',
    orderNumber: 'SWT-2026-0902',
    customerId: 'cust-2',
    customerName: 'Siti Rahma Azzahra',
    customerPhone: '085712345678',
    customerEmail: 'siti.rahma@studioart.id',
    ktpVerified: true,
    product: INITIAL_PRODUCTS[7], // Apple MacBook Air 15" M3 (RAM 16GB)
    rentalDurationDays: 2,
    startDate: '2026-09-26',
    endDate: '2026-09-28',
    dailyRate: 200000,
    rentalFeeTotal: 400000,
    depositAmount: 450000,
    deliveryMethod: 'pickup',
    deliveryAddress: 'Self Pickup di Hub SewaTech Senopati',
    totalAmount: 850000,
    paymentMethod: 'QRIS',
    paymentStatus: 'verified',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80',
    proofSubmittedAt: '2026-09-25 14:00 WIB',
    status: 'in_delivery_or_ready',
    returnDueDate: '2026-09-28 20:00 WIB',
    timeline: [
      {
        timestamp: '2026-09-25 13:50 WIB',
        status: 'awaiting_payment',
        title: 'Booking MacBook Diterima',
        description: 'Booking Apple MacBook Air 15" M3 (RAM 16GB) durasi 2 hari.',
        completed: true
      },
      {
        timestamp: '2026-09-25 14:15 WIB',
        status: 'validating_proof',
        title: 'Pembayaran QRIS Lunas',
        description: 'Dana Rp 850.000 masuk ke sistem.',
        completed: true
      },
      {
        timestamp: '2026-09-25 16:00 WIB',
        status: 'in_delivery_or_ready',
        title: 'Unit Siap Diambil di Hub',
        description: 'Unit telah melewati quality control (kondisi fisik bersih, baterai 100%). Menunggu kedatangan penyewa.',
        completed: true
      }
    ],
    createdAt: '2026-09-25 13:50'
  },
  {
    id: 'ord-103',
    orderNumber: 'SWT-2026-0903',
    customerId: 'cust-3',
    customerName: 'Farhan Haekal (Customer Baru)',
    customerPhone: '081377889900',
    customerEmail: 'haekal.creativestudio@gmail.com',
    ktpVerified: false,
    product: INITIAL_PRODUCTS[10], // ASUS ROG Zephyrus G16
    rentalDurationDays: 4,
    startDate: '2026-09-27',
    endDate: '2026-10-01',
    dailyRate: 250000,
    rentalFeeTotal: 1000000,
    depositAmount: 500000,
    deliveryMethod: 'delivery',
    deliveryAddress: 'Jl. Margonda Raya No. 108, Beji, Depok',
    totalAmount: 1500000,
    paymentMethod: 'QRIS',
    paymentStatus: 'proof_submitted',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80',
    proofSubmittedAt: '2026-09-25 20:30 WIB',
    status: 'validating_proof',
    returnDueDate: '2026-10-01 12:00 WIB',
    timeline: [
      {
        timestamp: '2026-09-25 20:10 WIB',
        status: 'awaiting_payment',
        title: 'Pesanan Dibuat',
        description: 'Penyewa baru mendaftarkan akun & mengunggah KTP.',
        completed: true
      },
      {
        timestamp: '2026-09-25 20:35 WIB',
        status: 'validating_proof',
        title: 'Menunggu Verifikasi Admin/Bot',
        description: 'Penyewa telah mengupload bukti transfer QRIS. Menunggu validasi slip dan KTP oleh tim admin.',
        completed: false
      }
    ],
    createdAt: '2026-09-25 20:10'
  },
  {
    id: 'ord-104',
    orderNumber: 'SWT-2026-0889',
    customerId: 'cust-4',
    customerName: 'Rizky Alamsyah',
    customerPhone: '087899001144',
    customerEmail: 'rizky.alamsyah88@yahoo.com',
    ktpVerified: true,
    product: INITIAL_PRODUCTS[4], // Lenovo ThinkPad T14s Gen 3 (RAM 16GB)
    rentalDurationDays: 3,
    startDate: '2026-09-18',
    endDate: '2026-09-21',
    dailyRate: 200000,
    rentalFeeTotal: 600000,
    depositAmount: 400000,
    deliveryMethod: 'delivery',
    deliveryAddress: 'Jl. Tebet Timur Dalam VII No. 14, Jakarta Selatan',
    totalAmount: 1000000,
    paymentMethod: 'QRIS',
    paymentStatus: 'verified',
    status: 'disputed',
    returnDueDate: '2026-09-21 17:00 WIB (Telat 4 Hari)',
    timeline: [
      {
        timestamp: '2026-09-18 10:00 WIB',
        status: 'received_in_use',
        title: 'Barang Diterima',
        description: 'Lenovo ThinkPad T14s Gen 3 diserahkan ke penyewa.',
        completed: true
      },
      {
        timestamp: '2026-09-21 17:00 WIB',
        status: 'disputed',
        title: 'Melewati Jatuh Tempo Pengembalian',
        description: 'Penyewa tidak merespons panggilan WA dan unit laptop belum dikembalikan.',
        completed: false
      }
    ],
    createdAt: '2026-09-18 09:00'
  }
];

export const INITIAL_ISSUES: PlatformIssue[] = [
  {
    id: 'iss-1',
    caseNumber: 'DSP-2026-001',
    orderId: 'ord-104',
    customerId: 'cust-4',
    customerName: 'Rizky Alamsyah',
    customerPhone: '087899001144',
    productName: 'Lenovo ThinkPad T14s Gen 3 (RAM 16GB)',
    issueType: 'belum_kembali',
    title: 'Unit Laptop Belum Kembali (Terlambat 4+ Hari)',
    description: 'Batas sewa berakhir pada 21 September 2026 pukul 17:00 WIB. Chat WA pertama hanya dibaca (centang biru), telepon seluler dialihkan. Terindikasi menolak mengembalikan barang.',
    fineAmount: 800000,
    status: 'contacted_wa',
    reportedAt: '2026-09-22 09:00 WIB',
    lastUpdated: '2026-09-25 15:30 WIB',
    actionsLog: [
      {
        date: '2026-09-22 09:15 WIB',
        action: 'Kirim Pengingat WA 1',
        note: 'Peringatan keterlambatan harian + estimasi denda Rp 200.000/hari.'
      },
      {
        date: '2026-09-23 14:00 WIB',
        action: 'Hubungi Kontak Darurat',
        note: 'Menghubungi rekan kerja (Maya Sartika). Rekan kerja menyatakan Rizky jarang masuk kantor.'
      },
      {
        date: '2026-09-25 15:30 WIB',
        action: 'Kirim Surat Peringatan (Somasi Digital WA)',
        note: 'Batas akhir 24 jam sebelum pelaporan tindak pidana penggelapan ke Polsek Tebet.'
      }
    ]
  },
  {
    id: 'iss-2',
    caseNumber: 'DSP-2026-002',
    orderId: 'ord-095',
    customerId: 'cust-1',
    customerName: 'Budi Santoso',
    customerPhone: '081288991122',
    productName: 'ASUS ROG Zephyrus G16 (2024)',
    issueType: 'barang_rusak',
    title: 'Klaim Retak Bezel Layar & Keyboard Spasi Keras',
    description: 'Unit dikembalikan dengan kondisi tombol spasi macet terkena sisa cairan kopi dan ada goresan pada bezel samping akibat benturan saat dibawa bepergian.',
    fineAmount: 650000,
    status: 'investigating',
    reportedAt: '2026-09-23 11:00 WIB',
    lastUpdated: '2026-09-24 16:00 WIB',
    actionsLog: [
      {
        date: '2026-09-23 11:30 WIB',
        action: 'Inspeksi Kerusakan',
        note: 'Foto fisik didokumentasikan di Hub. Estimasi perbaikan keyboard dan sparepart cover Rp 650.000.'
      },
      {
        date: '2026-09-24 16:00 WIB',
        action: 'Klarifikasi ke Penyewa',
        note: 'Penyewa bersikap kooperatif dan setuju biaya dibebankan dari pemotongan uang deposit Rp 500.000 + transfer sisa Rp 150.000.'
      }
    ]
  }
];

export const FINANCIAL_METRICS: FinancialMetric[] = [
  { month: 'Apr 2026', revenue: 14500000, rentalCount: 42, finesCollected: 450000, activeDeposits: 6200000 },
  { month: 'Mei 2026', revenue: 18200000, rentalCount: 56, finesCollected: 720000, activeDeposits: 8400000 },
  { month: 'Jun 2026', revenue: 23100000, rentalCount: 68, finesCollected: 300000, activeDeposits: 11000000 },
  { month: 'Jul 2026', revenue: 28900000, rentalCount: 84, finesCollected: 1200000, activeDeposits: 13500000 },
  { month: 'Ags 2026', revenue: 34500000, rentalCount: 98, finesCollected: 950000, activeDeposits: 15200000 },
  { month: 'Sep 2026 (MTD)', revenue: 39800000, rentalCount: 114, finesCollected: 1850000, activeDeposits: 18900000 }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'reminder_return',
    channel: 'wa',
    title: 'Pengingat Pengembalian (H-1)',
    message: 'Halo Budi Santoso, sewa Apple MacBook Pro 16" M3 Max Anda berakhir besok (27 Sep 18:00 WIB). Tim kami siap jemput atau silakan drop ke Hub.',
    timestamp: '10 menit yang lalu',
    read: false,
    orderId: 'ord-101'
  },
  {
    id: 'notif-2',
    type: 'order_update',
    channel: 'system',
    title: 'Unit Siap Diambil di Hub Senopati',
    message: 'Apple MacBook Air 15" M3 atas nama Siti Rahma Azzahra telah selesai melewati QC dan siap diambil hari ini.',
    timestamp: '1 jam yang lalu',
    read: false,
    orderId: 'ord-102'
  },
  {
    id: 'notif-3',
    type: 'reminder_payment',
    channel: 'wa',
    title: 'Verifikasi Bukti QRIS Sedang Diproses',
    message: 'Bukti pembayaran untuk pesanan SWT-2026-0903 telah kami terima dan sedang divalidasi oleh sistem/admin.',
    timestamp: '2 jam yang lalu',
    read: true,
    orderId: 'ord-103'
  }
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'adm-1',
    username: 'adam',
    name: 'Adam Malik',
    email: 'malikadam186@gmail.com',
    password: 'admin123',
    role: 'admin',
    createdAt: '2026-09-01 08:00 WIB',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'adm-2',
    username: 'operasional',
    name: 'Staff Operasional Hub Senopati',
    email: 'admin@sewalaptop.id',
    password: 'admin123',
    role: 'admin',
    createdAt: '2026-09-10 09:30 WIB',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  }
];
