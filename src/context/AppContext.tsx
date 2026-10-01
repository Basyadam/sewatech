import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CustomerUser,
  RentalOrder,
  PlatformIssue,
  AppNotification,
  ProductCategory,
  OrderStatus,
  PendingBookingConfig,
  AdminUser
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_ISSUES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ADMIN_USERS
} from '../data/mockData';
import { calculateRentalCost } from '../utils/pricing';

interface AppContextType {
  // Mode & navigation
  viewMode: 'renter' | 'admin';
  setViewMode: (mode: 'renter' | 'admin') => void;
  adminTab: 'verification' | 'issues' | 'financial' | 'customers' | 'products' | 'team';
  setAdminTab: (tab: 'verification' | 'issues' | 'financial' | 'customers' | 'products' | 'team') => void;
  categoryFilter: 'all' | ProductCategory;
  setCategoryFilter: (cat: 'all' | ProductCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Active Customer Session (null for guest browsing)
  currentUser: CustomerUser | null;
  setCurrentUser: (user: CustomerUser | null) => void;

  // Active Admin Session & Management
  currentAdmin: AdminUser | null;
  adminUsers: AdminUser[];
  isAdminAuthModalOpen: boolean;
  setIsAdminAuthModalOpen: (open: boolean) => void;
  adminLogin: (identifier: string, password: string) => { success: boolean; message: string };
  adminRegister: (data: {
    username: string;
    name: string;
    email: string;
    password: string;
    role?: 'admin';
  }) => { success: boolean; message: string };
  adminLogout: () => void;

  // Catalogs & Databases
  products: Product[];
  customers: CustomerUser[];
  orders: RentalOrder[];
  issues: PlatformIssue[];
  notifications: AppNotification[];

  // Action methods - Products
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  toggleProductStock: (id: string) => void;

  // Action methods - Customers & KTP
  registerCustomer: (customerData: Omit<CustomerUser, 'id' | 'registeredAt' | 'rentalsCompleted' | 'trustScore'>) => CustomerUser;
  verifyCustomerKtp: (id: string, approve: boolean, reason?: string) => void;

  // Action methods - Orders & Flow
  createOrder: (data: {
    product: Product;
    rentalDurationDays: number;
    startDate: string;
    endDate: string;
    deliveryMethod: 'delivery' | 'pickup';
    deliveryAddress: string;
    notes?: string;
  }) => RentalOrder;
  uploadPaymentProof: (orderId: string, proofUrl: string) => void;
  verifyPaymentProof: (orderId: string, approved: boolean) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;

  // Action methods - Issues (Pusat Penyelesaian Masalah)
  createIssue: (issue: Omit<PlatformIssue, 'id' | 'caseNumber' | 'reportedAt' | 'lastUpdated' | 'actionsLog'>) => void;
  logIssueAction: (issueId: string, action: string, note: string) => void;
  updateIssueStatus: (issueId: string, status: PlatformIssue['status'], note?: string) => void;

  // Action methods - Notifications
  markNotificationAsRead: (id: string) => void;
  sendSimulatedNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;

  // Modals & UI Controls
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  rentingProduct: Product | null;
  setRentingProduct: (p: Product | null) => void;
  isKtpModalOpen: boolean;
  setIsKtpModalOpen: (open: boolean) => void;
  isQrisModalOpen: boolean;
  setIsQrisModalOpen: (open: boolean) => void;
  isProofModalOpen: boolean;
  setIsProofModalOpen: (open: boolean) => void;
  isTrackingModalOpen: boolean;
  setIsTrackingModalOpen: (open: boolean) => void;
  activeOrder: RentalOrder | null;
  setActiveOrder: (order: RentalOrder | null) => void;
  pendingBookingConfig: PendingBookingConfig | null;
  setPendingBookingConfig: (config: PendingBookingConfig | null) => void;
  isAgreementModalOpen: boolean;
  setIsAgreementModalOpen: (open: boolean) => void;
  orderForAgreement: RentalOrder | null;
  setOrderForAgreement: (order: RentalOrder | null) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isWaChatOpen: boolean;
  setIsWaChatOpen: (open: boolean) => void;
  waPrefilledMessage: string;
  setWaPrefilledMessage: (msg: string) => void;
  selectedIssueForDetail: PlatformIssue | null;
  setSelectedIssueForDetail: (issue: PlatformIssue | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewModeState, setViewModeState] = useState<'renter' | 'admin'>('renter');
  const [adminTab, setAdminTab] = useState<'verification' | 'issues' | 'financial' | 'customers' | 'products' | 'team'>('verification');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Start with null as Guest browsing (user requirement #1: Penyewa bisa melihat-lihat website tanpa bikin akun)
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(null);

  // Active Admin Users & Session
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem('sewalaptop_admin_users');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_USERS;
    } catch {
      return INITIAL_ADMIN_USERS;
    }
  });

  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('sewalaptop_active_admin');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sewalaptop_admin_users', JSON.stringify(adminUsers));
  }, [adminUsers]);

  useEffect(() => {
    if (currentAdmin) {
      localStorage.setItem('sewalaptop_active_admin', JSON.stringify(currentAdmin));
    } else {
      localStorage.removeItem('sewalaptop_active_admin');
    }
  }, [currentAdmin]);

  const viewMode = viewModeState;
  const setViewMode = (mode: 'renter' | 'admin') => {
    if (mode === 'admin' && !currentAdmin) {
      setIsAdminAuthModalOpen(true);
      return;
    }
    setViewModeState(mode);
  };

  // Clean up any legacy localStorage data containing drone or camera
  useEffect(() => {
    try {
      localStorage.removeItem('sewatech_products');
      localStorage.removeItem('sewatech_products_v2');
      localStorage.removeItem('sewatech_recent_searches');
    } catch {
      // ignore
    }
  }, []);

  // Load from local storage or defaults with strict validation for laptop only
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      // Clear deprecated keys
      localStorage.removeItem('sewatech_products');
      localStorage.removeItem('sewatech_products_v2');
      const saved = localStorage.getItem('sewatech_laptop_catalog_v3');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        const validLaptops = parsed.filter(
          p => p.category === 'laptop-windows' || p.category === 'laptop-mac'
        );
        if (validLaptops.length > 0 && validLaptops.length === parsed.length) {
          return validLaptops;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  const [customers, setCustomers] = useState<CustomerUser[]>(() => {
    const saved = localStorage.getItem('sewatech_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [orders, setOrders] = useState<RentalOrder[]>(() => {
    try {
      localStorage.removeItem('sewatech_orders');
      const saved = localStorage.getItem('sewatech_laptop_orders_v3');
      if (saved) {
        const parsed: RentalOrder[] = JSON.parse(saved);
        const validOrders = parsed.filter(
          o => o.product.category === 'laptop-windows' || o.product.category === 'laptop-mac'
        );
        if (validOrders.length > 0) return validOrders;
      }
    } catch {
      // fallback
    }
    return INITIAL_ORDERS;
  });

  const [issues, setIssues] = useState<PlatformIssue[]>(() => {
    try {
      localStorage.removeItem('sewatech_issues');
      const saved = localStorage.getItem('sewatech_laptop_issues_v3');
      return saved ? JSON.parse(saved) : INITIAL_ISSUES;
    } catch {
      return INITIAL_ISSUES;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('sewatech_notifications_v3');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rentingProduct, setRentingProduct] = useState<Product | null>(null);
  const [isKtpModalOpen, setIsKtpModalOpen] = useState(false);
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<RentalOrder | null>(null);
  const [pendingBookingConfig, setPendingBookingConfig] = useState<PendingBookingConfig | null>(null);
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [orderForAgreement, setOrderForAgreement] = useState<RentalOrder | null>(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isWaChatOpen, setIsWaChatOpen] = useState(false);
  const [waPrefilledMessage, setWaPrefilledMessage] = useState('');
  const [selectedIssueForDetail, setSelectedIssueForDetail] = useState<PlatformIssue | null>(null);

  // Sync to local storage with fresh laptop-only keys
  useEffect(() => {
    const cleanLaptops = products.filter(
      p => p.category === 'laptop-windows' || p.category === 'laptop-mac'
    );
    localStorage.setItem('sewatech_laptop_catalog_v3', JSON.stringify(cleanLaptops));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sewatech_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('sewatech_laptop_orders_v3', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('sewatech_laptop_issues_v3', JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem('sewatech_notifications_v3', JSON.stringify(notifications));
  }, [notifications]);

  // Product actions
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const toggleProductStock = (id: string) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const newAvailable = p.availableStock > 0 ? 0 : p.stock;
          return { ...p, availableStock: newAvailable };
        }
        return p;
      })
    );
  };

  // Customer actions
  const registerCustomer = (data: Omit<CustomerUser, 'id' | 'registeredAt' | 'rentalsCompleted' | 'trustScore'>): CustomerUser => {
    const newCustomer: CustomerUser = {
      ...data,
      id: `cust-${Date.now()}`,
      registeredAt: new Date().toISOString().split('T')[0],
      rentalsCompleted: 0,
      trustScore: 4.0
    };
    setCustomers(prev => [newCustomer, ...prev]);
    setCurrentUser(newCustomer);

    // Notify admin
    sendSimulatedNotification({
      type: 'ktp_verified',
      channel: 'wa',
      title: 'Pendaftaran Akun Baru',
      message: `Penyewa ${data.fullName} mendaftar & mengunggah KTP (${data.nik}). Menunggu validasi admin/bot.`
    });

    return newCustomer;
  };

  const verifyCustomerKtp = (id: string, approve: boolean, reason?: string) => {
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            ktpStatus: approve ? 'verified' : 'rejected',
            rejectionReason: approve ? undefined : (reason || 'Foto KTP buram / tidak sesuai dengan nama akun.')
          };
        }
        return c;
      })
    );

    // Update currentUser if same
    if (currentUser && currentUser.id === id) {
      setCurrentUser(prev => prev ? {
        ...prev,
        ktpStatus: approve ? 'verified' : 'rejected',
        rejectionReason: approve ? undefined : reason
      } : null);
    }

    sendSimulatedNotification({
      type: 'ktp_verified',
      channel: 'wa',
      title: approve ? 'KTP Berhasil Terverifikasi' : 'Verifikasi KTP Memerlukan Perbaikan',
      message: approve
        ? `Akun Anda telah terverifikasi penuh. Anda sekarang dapat menyewa semua unit peralatan di SewaTech!`
        : `Verifikasi KTP Anda ditolak: ${reason || 'Silakan unggah ulang foto identitas yang lebih jelas.'}`
    });
  };

  // Order actions
  const createOrder = ({
    product,
    rentalDurationDays,
    startDate,
    endDate,
    deliveryMethod,
    deliveryAddress,
    notes
  }: {
    product: Product;
    rentalDurationDays: number;
    startDate: string;
    endDate: string;
    deliveryMethod: 'delivery' | 'pickup';
    deliveryAddress: string;
    notes?: string;
  }): RentalOrder => {
    if (!currentUser) {
      throw new Error('Wajib mendaftar / masuk akun untuk melakukan peminjaman.');
    }

    const costCalc = calculateRentalCost(product, rentalDurationDays);
    const rentalFeeTotal = costCalc.totalFee;
    const totalAmount = rentalFeeTotal + product.depositAmount;
    const orderNumber = `SLP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: RentalOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerId: currentUser.id,
      customerName: currentUser.fullName,
      customerPhone: currentUser.phone,
      customerEmail: currentUser.email,
      ktpVerified: currentUser.ktpStatus === 'verified',
      product,
      rentalDurationDays,
      startDate,
      endDate,
      dailyRate: costCalc.effectiveDailyRate,
      rentalFeeTotal,
      depositAmount: product.depositAmount,
      deliveryMethod,
      deliveryAddress,
      notes,
      totalAmount,
      paymentMethod: 'QRIS',
      paymentStatus: 'pending',
      status: 'awaiting_payment',
      returnDueDate: `${endDate} 18:00 WIB`,
      createdAt: new Date().toLocaleString('id-ID'),
      timeline: [
        {
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
          status: 'awaiting_payment',
          title: 'Pesanan Dibuat',
          description: `Sewa ${product.name} selama ${rentalDurationDays} hari (${costCalc.appliedTierName}: Rp ${rentalFeeTotal.toLocaleString('id-ID')}). Menunggu pembayaran QRIS.`,
          completed: true
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);

    // Decrement available stock
    setProducts(prev =>
      prev.map(p => (p.id === product.id ? { ...p, availableStock: Math.max(0, p.availableStock - 1) } : p))
    );

    // Trigger notification
    sendSimulatedNotification({
      type: 'reminder_payment',
      channel: 'wa',
      title: `Pembayaran QRIS ${orderNumber}`,
      message: `Halo ${currentUser.fullName}, silakan selesaikan pembayaran QRIS Rp ${totalAmount.toLocaleString('id-ID')} sebelum 15 menit.`,
      orderId: newOrder.id
    });

    return newOrder;
  };

  const uploadPaymentProof = (orderId: string, proofUrl: string) => {
    const timestampStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const updatedTimeline = [
            ...ord.timeline,
            {
              timestamp: timestampStr,
              status: 'validating_proof' as OrderStatus,
              title: 'Bukti Bayar Diunggah',
              description: 'Slip transfer QRIS telah diunggah. Menunggu validasi otomatis / admin.',
              completed: true
            }
          ];
          const updatedOrder: RentalOrder = {
            ...ord,
            paymentStatus: 'proof_submitted',
            paymentProofUrl: proofUrl,
            proofSubmittedAt: `${new Date().toLocaleDateString('id-ID')} ${timestampStr}`,
            status: 'validating_proof',
            timeline: updatedTimeline
          };
          if (activeOrder && activeOrder.id === orderId) {
            setActiveOrder(updatedOrder);
          }
          return updatedOrder;
        }
        return ord;
      })
    );

    sendSimulatedNotification({
      type: 'order_update',
      channel: 'system',
      title: 'Bukti Bayar Masuk',
      message: `Bukti bayar QRIS untuk pesanan #${orderId} telah masuk antrean validasi.`
    });
  };

  const verifyPaymentProof = (orderId: string, approved: boolean) => {
    const timestampStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          if (approved) {
            const nextStatus: OrderStatus = 'in_delivery_or_ready';
            const updatedTimeline = [
              ...ord.timeline,
              {
                timestamp: timestampStr,
                status: 'validating_proof' as OrderStatus,
                title: 'Pembayaran Terverifikasi Lunas',
                description: 'Validasi slip QRIS berhasil. Unit masuk ke tahap penyiapan kurir/siap diambil.',
                completed: true
              },
              {
                timestamp: timestampStr,
                status: nextStatus,
                title: ord.deliveryMethod === 'delivery' ? 'Sedang Diantar Kurir' : 'Siap Diambil di Hub',
                description: ord.deliveryMethod === 'delivery'
                  ? 'Kurir khusus SewaLaptop.id sedang menuju alamat pengiriman.'
                  : 'Peralatan siap diambil di Hub SewaLaptop.id dengan menunjukkan KTP asli.',
                completed: true
              }
            ];
            const updatedOrder: RentalOrder = {
              ...ord,
              paymentStatus: 'verified',
              status: nextStatus,
              timeline: updatedTimeline
            };
            if (activeOrder && activeOrder.id === orderId) {
              setActiveOrder(updatedOrder);
            }
            return updatedOrder;
          } else {
            const updatedOrder: RentalOrder = {
              ...ord,
              paymentStatus: 'rejected',
              status: 'awaiting_payment'
            };
            if (activeOrder && activeOrder.id === orderId) {
              setActiveOrder(updatedOrder);
            }
            return updatedOrder;
          }
        }
        return ord;
      })
    );

    sendSimulatedNotification({
      type: approved ? 'order_update' : 'warning',
      channel: 'wa',
      title: approved ? 'Pembayaran QRIS Diterima!' : 'Bukti Pembayaran Ditolak',
      message: approved
        ? `Pembayaran Anda telah diverifikasi oleh tim SewaTech. Status pesanan kini: Sedang Diantar / Siap Diambil.`
        : `Bukti transfer tidak valid atau nominal tidak sesuai. Silakan upload ulang slip QRIS yang sah.`
    });
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    const timestampStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    const statusTitleMap: Record<OrderStatus, string> = {
      awaiting_payment: 'Menunggu Pembayaran',
      validating_proof: 'Validasi Bukti Bayar',
      in_delivery_or_ready: 'Sedang Diantar / Siap Diambil',
      received_in_use: 'Barang Diterima & Masa Sewa Berjalan',
      completed: 'Sewa Selesai & Unit Dikembalikan',
      disputed: 'Terjadi Kendala / Masalah Sewa'
    };

    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const updatedTimeline = [
            ...ord.timeline,
            {
              timestamp: timestampStr,
              status: newStatus,
              title: statusTitleMap[newStatus],
              description: note || `Status diperbarui menjadi ${statusTitleMap[newStatus]}.`,
              completed: true
            }
          ];

          // If completed, restore product stock & increment customer completed rentals
          if (newStatus === 'completed' && ord.status !== 'completed') {
            setProducts(pList =>
              pList.map(p => (p.id === ord.product.id ? { ...p, availableStock: Math.min(p.stock, p.availableStock + 1) } : p))
            );
            setCustomers(cList =>
              cList.map(c => (c.id === ord.customerId ? { ...c, rentalsCompleted: c.rentalsCompleted + 1 } : c))
            );
          }

          const updatedOrder: RentalOrder = {
            ...ord,
            status: newStatus,
            timeline: updatedTimeline,
            ...(newStatus === 'completed'
              ? {
                  completedAt:
                    new Date().toLocaleDateString('id-ID') +
                    ' ' +
                    new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) +
                    ' WIB',
                  refundedDeposit: ord.depositAmount
                }
              : {})
          };

          if (activeOrder && activeOrder.id === orderId) {
            setActiveOrder(updatedOrder);
          }
          return updatedOrder;
        }
        return ord;
      })
    );

    sendSimulatedNotification({
      type: 'order_update',
      channel: 'wa',
      title: `Update Pesanan: ${statusTitleMap[newStatus]}`,
      message: note || `Pesanan Anda kini berstatus ${statusTitleMap[newStatus]}. Terima kasih atas kerja sama Anda.`
    });
  };

  // Issues actions
  const createIssue = (issueData: Omit<PlatformIssue, 'id' | 'caseNumber' | 'reportedAt' | 'lastUpdated' | 'actionsLog'>) => {
    const newIssue: PlatformIssue = {
      ...issueData,
      id: `iss-${Date.now()}`,
      caseNumber: `DSP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      reportedAt: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      lastUpdated: 'Baru saja',
      actionsLog: [
        {
          date: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
          action: 'Laporan Dibuat',
          note: issueData.description
        }
      ]
    };

    setIssues(prev => [newIssue, ...prev]);

    // Mark order as disputed
    updateOrderStatus(issueData.orderId, 'disputed', `Masalah dilaporkan: ${issueData.title}`);
  };

  const logIssueAction = (issueId: string, action: string, note: string) => {
    const dateStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    setIssues(prev =>
      prev.map(iss => {
        if (iss.id === issueId) {
          return {
            ...iss,
            lastUpdated: dateStr,
            actionsLog: [
              ...iss.actionsLog,
              {
                date: dateStr,
                action,
                note
              }
            ]
          };
        }
        return iss;
      })
    );
  };

  const updateIssueStatus = (issueId: string, status: PlatformIssue['status'], note?: string) => {
    const dateStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    setIssues(prev =>
      prev.map(iss => {
        if (iss.id === issueId) {
          const updatedLogs = note
            ? [...iss.actionsLog, { date: dateStr, action: `Status diubah ke ${status}`, note }]
            : iss.actionsLog;
          return {
            ...iss,
            status,
            lastUpdated: dateStr,
            actionsLog: updatedLogs
          };
        }
        return iss;
      })
    );
  };

  // Notification actions
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const sendSimulatedNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Baru saja',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const adminLogin = (identifier: string, password: string): { success: boolean; message: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const found = adminUsers.find(
      u => u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId
    );

    if (!found) {
      return { success: false, message: 'Username atau email admin tidak terdaftar.' };
    }

    if (found.password && found.password !== password) {
      return { success: false, message: 'Kata sandi tidak sesuai. Silakan periksa kembali.' };
    }

    setCurrentAdmin(found);
    setViewModeState('admin');
    setIsAdminAuthModalOpen(false);
    return { success: true, message: `Selamat datang kembali, ${found.name}!` };
  };

  const adminRegister = (data: {
    username: string;
    name: string;
    email: string;
    password: string;
    role?: 'admin';
  }): { success: boolean; message: string } => {
    const cleanUsername = data.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    const cleanEmail = data.email.trim().toLowerCase();

    if (!cleanUsername || cleanUsername.length < 3) {
      return { success: false, message: 'Username minimal 3 karakter (huruf/angka/garis bawah).' };
    }

    if (!data.name.trim()) {
      return { success: false, message: 'Nama lengkap wajib diisi.' };
    }

    if (!cleanEmail.includes('@')) {
      return { success: false, message: 'Format email tidak valid.' };
    }

    if (!data.password || data.password.length < 6) {
      return { success: false, message: 'Kata sandi minimal 6 karakter.' };
    }

    const exists = adminUsers.some(
      u => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanEmail
    );

    if (exists) {
      return { success: false, message: 'Username atau email sudah digunakan oleh admin lain.' };
    }

    const newAdmin: AdminUser = {
      id: `adm-${Date.now()}`,
      username: cleanUsername,
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password,
      role: 'admin',
      createdAt: `${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    };

    setAdminUsers(prev => [newAdmin, ...prev]);
    setCurrentAdmin(newAdmin);
    setViewModeState('admin');
    setIsAdminAuthModalOpen(false);
    return { success: true, message: `Akun admin ${newAdmin.name} berhasil didaftarkan dan langsung aktif!` };
  };

  const adminLogout = () => {
    setCurrentAdmin(null);
    setViewModeState('renter');
  };

  return (
    <AppContext.Provider
      value={{
        viewMode,
        setViewMode,
        adminTab,
        setAdminTab,
        categoryFilter,
        setCategoryFilter,
        searchQuery,
        setSearchQuery,
        currentUser,
        setCurrentUser,
        currentAdmin,
        adminUsers,
        isAdminAuthModalOpen,
        setIsAdminAuthModalOpen,
        adminLogin,
        adminRegister,
        adminLogout,
        products,
        customers,
        orders,
        issues,
        notifications,
        addProduct,
        updateProduct,
        toggleProductStock,
        registerCustomer,
        verifyCustomerKtp,
        createOrder,
        uploadPaymentProof,
        verifyPaymentProof,
        updateOrderStatus,
        createIssue,
        logIssueAction,
        updateIssueStatus,
        markNotificationAsRead,
        sendSimulatedNotification,
        selectedProduct,
        setSelectedProduct,
        rentingProduct,
        setRentingProduct,
        isKtpModalOpen,
        setIsKtpModalOpen,
        isQrisModalOpen,
        setIsQrisModalOpen,
        isProofModalOpen,
        setIsProofModalOpen,
        isTrackingModalOpen,
        setIsTrackingModalOpen,
        activeOrder,
        setActiveOrder,
        pendingBookingConfig,
        setPendingBookingConfig,
        isAgreementModalOpen,
        setIsAgreementModalOpen,
        orderForAgreement,
        setOrderForAgreement,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        isWaChatOpen,
        setIsWaChatOpen,
        waPrefilledMessage,
        setWaPrefilledMessage,
        selectedIssueForDetail,
        setSelectedIssueForDetail
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
