export interface GymSettings {
  gym_name: string;
  tagline: string;
  is_open: boolean;
  status_message: string;
  opening_time: string;
  closing_time: string;
  sunday_timing: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  whatsapp: string;
  email: string;
  upi_id: string;
  map_query: string;
  allow_member_registration: boolean;
}

export interface MembershipPlan {
  id: string;
  name: string;
  duration_months: number;
  fee_inr: number;
  features: string[];
  badge?: string;
  active: boolean;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'member';
  name: string;
  phone: string;
  created_at: string;
}

export interface Member {
  id: string;
  user_id: string;
  member_code: string;
  name: string;
  email: string;
  phone: string;
  plan_id: string;
  plan_name: string;
  fee_inr: number;
  status: 'active' | 'expiring_soon' | 'expired' | 'inactive';
  joining_date: string;
  expiry_date: string;
  gender?: string;
  blood_group?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  notes?: string;
  fitness_goal?: 'cardio' | 'fat_loss' | 'diet_plan' | 'bodybuilding';
  created_at: string;
}

export interface Payment {
  id: string;
  receipt_no: string;
  member_id: string;
  member_code: string;
  member_name: string;
  plan_id: string;
  plan_name: string;
  amount_inr: number;
  method: 'razorpay' | 'upi' | 'cash' | 'bank_transfer';
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  order_id?: string;
  payment_id?: string;
  notes?: string;
  paid_at: string;
  recorded_by: string;
}

export interface AttendanceRecord {
  id: string;
  member_id: string;
  member_code: string;
  member_name: string;
  date: string;
  check_in_time: string;
  method: 'qr_pass' | 'admin_manual';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'normal' | 'urgent';
  created_at: string;
  author: string;
}

export interface SummaryStats {
  totalMembers: number;
  activeMembers: number;
  expiringSoon: number;
  expired: number;
  inactive: number;
  totalRevenue: number;
  thisMonthRevenue: number;
  todayCheckIns: number;
  paymentMethods: {
    razorpay: number;
    upi: number;
    cash: number;
    bank_transfer: number;
  };
}
