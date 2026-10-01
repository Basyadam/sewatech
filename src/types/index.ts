export type ProductCategory = 'laptop-windows' | 'laptop-mac';

export interface RentalPriceTier {
  harian: number;        // Rate 1-2 hari (e.g. 175000 or 200000)
  tigaHariPlus: number;  // Rate 3 hari+ per hari (e.g. 160000 or 175000)
  mingguan: number;      // Paket 7 hari total (e.g. 875000 or 975000)
  bulanan: number;       // Paket 30 hari total (e.g. 2400000 or 2700000)
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  subCategory?: string; // e.g. "Gaming / Creator", "Consumer / Ultrabook", "Cinema / Hybrid", "FPV"
  headline: string;
  description: string;
  dailyRate: number;
  depositAmount: number;
  stock: number;
  availableStock: number;
  image: string;
  rating: number;
  reviewsCount: number;
  specs: {
    label: string;
    value: string;
  }[];
  includedAccessories: string[];
  condition: 'Mulus 99%' | 'Like New' | 'Grade A';
  serialNumbers?: string[];
  featured?: boolean;
  ramSpec?: '8GB' | '16GB' | '32GB' | '48GB';
  rentalPriceTier?: RentalPriceTier;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin';
  createdAt: string;
  avatarUrl?: string;
}

export interface CustomerUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  nik: string;
  address: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  ktpPhotoUrl: string;
  ktpStatus: 'verified' | 'pending' | 'rejected';
  rejectionReason?: string;
  registeredAt: string;
  rentalsCompleted: number;
  trustScore: number; // 1 to 5
}

export type OrderStatus =
  | 'awaiting_payment'
  | 'validating_proof'
  | 'in_delivery_or_ready'
  | 'received_in_use'
  | 'completed'
  | 'disputed';

export interface OrderTimelineEvent {
  timestamp: string;
  status: OrderStatus;
  title: string;
  description: string;
  completed: boolean;
}

export interface RentalOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  ktpVerified: boolean;
  product: Product;
  rentalDurationDays: number;
  startDate: string;
  endDate: string;
  dailyRate: number;
  rentalFeeTotal: number;
  depositAmount: number;
  deliveryMethod: 'delivery' | 'pickup';
  deliveryAddress: string;
  notes?: string;
  totalAmount: number; // rentalFeeTotal + depositAmount
  paymentMethod: 'QRIS';
  paymentStatus: 'pending' | 'proof_submitted' | 'verified' | 'rejected';
  paymentProofUrl?: string;
  proofSubmittedAt?: string;
  status: OrderStatus;
  timeline: OrderTimelineEvent[];
  createdAt: string;
  returnDueDate: string;
  damageReported?: boolean;
  completedAt?: string;
  refundedDeposit?: number;
}

export interface PendingBookingConfig {
  product: Product;
  rentalDurationDays: number;
  startDate: string;
  endDate: string;
  deliveryMethod: 'delivery' | 'pickup';
  deliveryAddress: string;
  notes?: string;
}

export type IssueType =
  | 'barang_hilang'
  | 'belum_kembali'
  | 'barang_rusak'
  | 'terlambat'
  | 'penipuan_ktp';

export interface PlatformIssue {
  id: string;
  caseNumber: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  productName: string;
  issueType: IssueType;
  title: string;
  description: string;
  fineAmount: number;
  status: 'open' | 'contacted_wa' | 'investigating' | 'resolved' | 'legal_action';
  reportedAt: string;
  lastUpdated: string;
  actionsLog: {
    date: string;
    action: string;
    note: string;
  }[];
}

export interface AppNotification {
  id: string;
  type: 'reminder_return' | 'reminder_payment' | 'order_update' | 'ktp_verified' | 'warning';
  channel: 'wa' | 'email' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  orderId?: string;
}

export interface FinancialMetric {
  month: string;
  revenue: number;
  rentalCount: number;
  finesCollected: number;
  activeDeposits: number;
}
