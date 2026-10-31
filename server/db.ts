import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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
  password_hash: string;
  role: 'admin' | 'member';
  name: string;
  phone: string;
  created_at: string;
}

export interface Member {
  id: string;
  user_id: string;
  member_code: string; // e.g. IP-1001
  name: string;
  email: string;
  phone: string;
  plan_id: string;
  plan_name: string;
  fee_inr: number;
  status: 'active' | 'expiring_soon' | 'expired' | 'inactive';
  joining_date: string; // YYYY-MM-DD
  expiry_date: string; // YYYY-MM-DD
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
  receipt_no: string; // e.g. IPF-REC-2026-001
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
  recorded_by: string; // 'member_online' or 'admin'
}

export interface AttendanceRecord {
  id: string;
  member_id: string;
  member_code: string;
  member_name: string;
  date: string; // YYYY-MM-DD
  check_in_time: string; // HH:mm:ss
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

export interface DatabaseSchema {
  settings: GymSettings;
  plans: MembershipPlan[];
  users: User[];
  members: Member[];
  payments: Payment[];
  attendance: AttendanceRecord[];
  announcements: Announcement[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'gym-db.json');

// Helper to hash passwords simply & securely
export function hashPassword(plain: string): string {
  return crypto.createHash('sha256').update(`ip_fitness_${plain}`).digest('hex');
}

// Initial default seed
function getSeedData(): DatabaseSchema {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Helper date adder
  const addMonths = (date: Date, months: number) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().split('T')[0];
  };

  const addDays = (date: Date, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const plans: MembershipPlan[] = [
    {
      id: 'plan_monthly',
      name: 'Monthly Basic',
      duration_months: 1,
      fee_inr: 1800,
      features: ['Full gym equipment access', 'Locker room & shower', 'General trainer assistance', 'Cardio & Free Weights'],
      active: true,
    },
    {
      id: 'plan_quarterly',
      name: 'Quarterly Pro',
      duration_months: 3,
      fee_inr: 4800,
      badge: 'Popular',
      features: ['Save ₹600 (₹1,600/mo)', 'Full gym access & cardio floor', '1 Personal trainer assessment', 'Diet & workout guidance', 'Free locker allocation'],
      active: true,
    },
    {
      id: 'plan_halfyearly',
      name: 'Half-Yearly Elite',
      duration_months: 6,
      fee_inr: 8500,
      badge: 'Great Value',
      features: ['Save ₹2,300 (₹1,416/mo)', 'Unlimited gym + Crossfit area', 'Steam bath on weekends', 'Monthly body composition scan', '1 Guest pass per month'],
      active: true,
    },
    {
      id: 'plan_yearly',
      name: 'Annual Champion',
      duration_months: 12,
      fee_inr: 15000,
      badge: 'Best Value',
      features: ['Save ₹6,600 (₹1,250/mo)', 'VIP all-hours gym access', 'Complimentary IP Fitness gym bag', 'Steam & sauna bath access', 'Quarterly diet re-evaluations', '3 Guest passes per month'],
      active: true,
    },
  ];

  const adminUser: User = {
    id: 'user_admin_01',
    email: 'vignesh@ipfitness.in',
    password_hash: hashPassword('ironparadise@1234'),
    role: 'admin',
    name: 'Vignesh',
    phone: '+91 97913 61041',
    created_at: '2026-01-01T08:00:00Z',
  };

  const memberUsers: User[] = [
    {
      id: 'user_mem_01',
      email: 'rahul.sharma@gmail.com',
      password_hash: hashPassword('rahul123'),
      role: 'member',
      name: 'Rahul Sharma',
      phone: '+91 98111 22233',
      created_at: '2026-01-10T10:00:00Z',
    },
    {
      id: 'user_mem_02',
      email: 'priya.patel@gmail.com',
      password_hash: hashPassword('priya123'),
      role: 'member',
      name: 'Priya Patel',
      phone: '+91 98222 33344',
      created_at: '2026-08-01T11:00:00Z',
    },
    {
      id: 'user_mem_03',
      email: 'amit.verma@gmail.com',
      password_hash: hashPassword('amit123'),
      role: 'member',
      name: 'Amit Verma',
      phone: '+91 98333 44455',
      created_at: '2026-06-15T09:30:00Z',
    },
    {
      id: 'user_mem_04',
      email: 'sneha.reddy@gmail.com',
      password_hash: hashPassword('sneha123'),
      role: 'member',
      name: 'Sneha Reddy',
      phone: '+91 98444 55566',
      created_at: '2026-09-01T14:20:00Z',
    },
  ];

  // Members data
  const members: Member[] = [
    {
      id: 'mem_01',
      user_id: 'user_mem_01',
      member_code: 'IP-1001',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@gmail.com',
      phone: '+91 98111 22233',
      plan_id: 'plan_yearly',
      plan_name: 'Annual Champion',
      fee_inr: 15000,
      status: 'active',
      joining_date: '2026-01-15',
      expiry_date: addMonths(now, 5),
      gender: 'Male',
      blood_group: 'B+',
      emergency_contact: 'Suresh Sharma (Father)',
      emergency_phone: '+91 98111 99988',
      notes: 'Morning workout batch. Focus on hypertrophy.',
      created_at: '2026-01-15T10:00:00Z',
    },
    {
      id: 'mem_02',
      user_id: 'user_mem_02',
      member_code: 'IP-1002',
      name: 'Priya Patel',
      email: 'priya.patel@gmail.com',
      phone: '+91 98222 33344',
      plan_id: 'plan_monthly',
      plan_name: 'Monthly Basic',
      fee_inr: 1800,
      status: 'expiring_soon',
      joining_date: addDays(now, -26),
      expiry_date: addDays(now, 4), // 4 days remaining
      gender: 'Female',
      blood_group: 'O+',
      emergency_contact: 'Neha Patel (Sister)',
      emergency_phone: '+91 98222 77766',
      notes: 'Evening HIIT and cardio sessions.',
      created_at: '2026-08-01T11:00:00Z',
    },
    {
      id: 'mem_03',
      user_id: 'user_mem_03',
      member_code: 'IP-1003',
      name: 'Amit Verma',
      email: 'amit.verma@gmail.com',
      phone: '+91 98333 44455',
      plan_id: 'plan_quarterly',
      plan_name: 'Quarterly Pro',
      fee_inr: 4800,
      status: 'expired',
      joining_date: addMonths(now, -4),
      expiry_date: addDays(now, -5), // expired 5 days ago
      gender: 'Male',
      blood_group: 'A+',
      emergency_contact: 'Kavita Verma (Wife)',
      emergency_phone: '+91 98333 11122',
      notes: 'Needs fee reminder for quarterly renewal.',
      created_at: '2026-06-15T09:30:00Z',
    },
    {
      id: 'mem_04',
      user_id: 'user_mem_04',
      member_code: 'IP-1004',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@gmail.com',
      phone: '+91 98444 55566',
      plan_id: 'plan_halfyearly',
      plan_name: 'Half-Yearly Elite',
      fee_inr: 8500,
      status: 'active',
      joining_date: addMonths(now, -2),
      expiry_date: addMonths(now, 4),
      gender: 'Female',
      blood_group: 'AB+',
      emergency_contact: 'Arjun Reddy (Brother)',
      emergency_phone: '+91 98444 88877',
      notes: 'Strength training and weekend steam bath.',
      created_at: '2026-09-01T14:20:00Z',
    },
  ];

  const payments: Payment[] = [
    {
      id: 'pay_01',
      receipt_no: 'IPF-REC-2026-001',
      member_id: 'mem_01',
      member_code: 'IP-1001',
      member_name: 'Rahul Sharma',
      plan_id: 'plan_yearly',
      plan_name: 'Annual Champion',
      amount_inr: 15000,
      method: 'razorpay',
      status: 'paid',
      order_id: 'order_rzp_mock_001',
      payment_id: 'pay_rzp_mock_001',
      paid_at: '2026-01-15T10:15:00Z',
      recorded_by: 'member_online',
      notes: 'Annual membership paid via Razorpay Netbanking',
    },
    {
      id: 'pay_02',
      receipt_no: 'IPF-REC-2026-002',
      member_id: 'mem_02',
      member_code: 'IP-1002',
      member_name: 'Priya Patel',
      plan_id: 'plan_monthly',
      plan_name: 'Monthly Basic',
      amount_inr: 1800,
      method: 'upi',
      status: 'paid',
      payment_id: 'UPI-9822233344@ybl',
      paid_at: addDays(now, -26) + 'T11:30:00Z',
      recorded_by: 'admin',
      notes: 'Paid at desk via Google Pay UPI QR',
    },
    {
      id: 'pay_03',
      receipt_no: 'IPF-REC-2026-003',
      member_id: 'mem_04',
      member_code: 'IP-1004',
      member_name: 'Sneha Reddy',
      plan_id: 'plan_halfyearly',
      plan_name: 'Half-Yearly Elite',
      amount_inr: 8500,
      method: 'cash',
      status: 'paid',
      paid_at: addMonths(now, -2) + 'T14:45:00Z',
      recorded_by: 'admin',
      notes: 'Cash receipt acknowledged by Gym Director',
    },
  ];

  const attendance: AttendanceRecord[] = [
    {
      id: 'att_01',
      member_id: 'mem_01',
      member_code: 'IP-1001',
      member_name: 'Rahul Sharma',
      date: todayStr,
      check_in_time: '06:15:22',
      method: 'qr_pass',
    },
    {
      id: 'att_02',
      member_id: 'mem_04',
      member_code: 'IP-1004',
      member_name: 'Sneha Reddy',
      date: todayStr,
      check_in_time: '07:30:10',
      method: 'qr_pass',
    },
    {
      id: 'att_03',
      member_id: 'mem_01',
      member_code: 'IP-1001',
      member_name: 'Rahul Sharma',
      date: addDays(now, -1),
      check_in_time: '06:20:00',
      method: 'qr_pass',
    },
    {
      id: 'att_04',
      member_id: 'mem_02',
      member_code: 'IP-1002',
      member_name: 'Priya Patel',
      date: addDays(now, -1),
      check_in_time: '18:45:12',
      method: 'admin_manual',
    },
    {
      id: 'att_05',
      member_id: 'mem_01',
      member_code: 'IP-1001',
      member_name: 'Rahul Sharma',
      date: addDays(now, -2),
      check_in_time: '06:10:45',
      method: 'qr_pass',
    },
  ];

  const announcements: Announcement[] = [
    {
      id: 'anc_01',
      title: 'New Olympic Lifting Bar & Plates Arrived',
      content: 'We have upgraded our strength area with 3 new Eleiko competition bars and calibrated bumper plates. Please remember to re-rack your weights after your sets!',
      priority: 'normal',
      created_at: addDays(now, -3) + 'T09:00:00Z',
      author: 'Vikram Singh (Director)',
    },
    {
      id: 'anc_02',
      title: 'Sunday Deep Cleaning & Maintenance',
      content: 'The gym will observe modified hours this Sunday (6:00 AM - 1:00 PM) for weekly deep sanitization of all machines and shower areas.',
      priority: 'urgent',
      created_at: addDays(now, -1) + 'T12:00:00Z',
      author: 'Vikram Singh (Director)',
    },
  ];

  const settings: GymSettings = {
    gym_name: 'IRON PARADISE Unisex Fitness',
    tagline: 'TRAIN HARD. STAY CONSISTENT.',
    is_open: true,
    status_message: 'Open Now — Peak Evening Session in Progress',
    opening_time: '05:30 AM',
    closing_time: '10:30 PM',
    sunday_timing: '06:00 AM - 01:00 PM',
    address: 'Radhakrishnan Nagar',
    city: 'Puducherry',
    pincode: '605009',
    phone: '+91 97913 61041',
    whatsapp: '+91 97913 61041',
    email: 'contact@ipfitness.in',
    upi_id: 'ipfitness@okhdfcbank',
    map_query: 'IRON PARADISE Unisex Fitness, Radhakrishnan Nagar, Puducherry, 605009',
    allow_member_registration: true,
  };

  return {
    settings,
    plans,
    users: [adminUser, ...memberUsers],
    members,
    payments,
    attendance,
    announcements,
  };
}

class DatabaseStore {
  private db: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.db = this.load();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed reading db file, regenerating defaults:', e);
    }
    const seed = getSeedData();
    this.save(seed);
    return seed;
  }

  private save(data?: DatabaseSchema) {
    try {
      const toWrite = data || this.db;
      fs.writeFileSync(DB_FILE, JSON.stringify(toWrite, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed saving db file:', e);
    }
  }

  // Refresh dynamic statuses based on current date
  public refreshMemberStatuses() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let changed = false;
    for (const mem of this.db.members) {
      if (mem.status === 'inactive') continue;

      const exp = new Date(mem.expiry_date);
      exp.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      let newStatus: Member['status'] = 'active';
      if (diffDays < 0) {
        newStatus = 'expired';
      } else if (diffDays <= 7) {
        newStatus = 'expiring_soon';
      }

      if (mem.status !== newStatus) {
        mem.status = newStatus;
        changed = true;
      }
    }

    if (changed) {
      this.save();
    }
  }

  // Settings
  public getSettings(): GymSettings {
    return { ...this.db.settings };
  }

  public updateSettings(updates: Partial<GymSettings>): GymSettings {
    this.db.settings = { ...this.db.settings, ...updates };
    this.save();
    return this.getSettings();
  }

  public toggleGymStatus(is_open: boolean, status_message?: string): GymSettings {
    this.db.settings.is_open = is_open;
    if (status_message !== undefined) {
      this.db.settings.status_message = status_message;
    } else {
      this.db.settings.status_message = is_open ? 'Gym is Open — Welcome to workout!' : 'Gym is currently Closed';
    }
    this.save();
    return this.getSettings();
  }

  // Plans
  public getPlans(): MembershipPlan[] {
    return this.db.plans.filter((p) => p.active);
  }

  public getAllPlans(): MembershipPlan[] {
    return [...this.db.plans];
  }

  public getPlanById(id: string): MembershipPlan | undefined {
    return this.db.plans.find((p) => p.id === id);
  }

  public savePlan(plan: MembershipPlan): MembershipPlan {
    const idx = this.db.plans.findIndex((p) => p.id === plan.id);
    if (idx >= 0) {
      this.db.plans[idx] = plan;
    } else {
      this.db.plans.push(plan);
    }
    this.save();
    return plan;
  }

  public deletePlan(id: string): boolean {
    const plan = this.db.plans.find((p) => p.id === id);
    if (plan) {
      plan.active = false; // soft deactivate
      this.save();
      return true;
    }
    return false;
  }

  // Users & Auth
  public getUserByEmail(emailOrUsername: string): User | undefined {
    const q = emailOrUsername.trim().toLowerCase();
    return this.db.users.find(
      (u) =>
        u.email.toLowerCase() === q ||
        u.email.split('@')[0].toLowerCase() === q ||
        u.id.toLowerCase() === q ||
        (u.role === 'admin' && (q === 'vignesh' || q === 'admin'))
    );
  }

  public getUserById(id: string): User | undefined {
    return this.db.users.find((u) => u.id === id);
  }

  public createUser(user: User): User {
    this.db.users.push(user);
    this.save();
    return user;
  }

  public updateUserPassword(userId: string, newPlainPassword: string): boolean {
    const user = this.db.users.find((u) => u.id === userId);
    if (!user) return false;
    user.password_hash = hashPassword(newPlainPassword);
    this.save();
    return true;
  }

  // Members
  public getMembers(): Member[] {
    this.refreshMemberStatuses();
    return [...this.db.members];
  }

  public getMemberById(id: string): Member | undefined {
    this.refreshMemberStatuses();
    return this.db.members.find((m) => m.id === id);
  }

  public getMemberByUserId(userId: string): Member | undefined {
    this.refreshMemberStatuses();
    return this.db.members.find((m) => m.user_id === userId);
  }

  public getMemberByCode(code: string): Member | undefined {
    this.refreshMemberStatuses();
    return this.db.members.find((m) => m.member_code.toUpperCase() === code.toUpperCase().trim());
  }

  public createMember(member: Member): Member {
    this.db.members.push(member);
    this.save();
    return member;
  }

  public updateMember(id: string, updates: Partial<Member>): Member | undefined {
    const idx = this.db.members.findIndex((m) => m.id === id);
    if (idx < 0) return undefined;
    this.db.members[idx] = { ...this.db.members[idx], ...updates };
    this.refreshMemberStatuses();
    this.save();
    return this.db.members[idx];
  }

  public toggleMemberStatus(id: string): Member | undefined {
    const member = this.getMemberById(id);
    if (!member) return undefined;
    if (member.status === 'inactive') {
      // Recompute based on expiry
      this.refreshMemberStatuses();
    } else {
      member.status = 'inactive';
      this.save();
    }
    return this.getMemberById(id);
  }

  public generateNextMemberCode(): string {
    const maxCode = this.db.members.reduce((acc, m) => {
      const match = m.member_code.match(/IP-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        return Math.max(acc, num);
      }
      return acc;
    }, 1000);
    return `IP-${maxCode + 1}`;
  }

  // Payments
  public getPayments(): Payment[] {
    return [...this.db.payments].sort((a, b) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime());
  }

  public getMemberPayments(memberId: string): Payment[] {
    return this.db.payments
      .filter((p) => p.member_id === memberId)
      .sort((a, b) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime());
  }

  public createPayment(payment: Payment): Payment {
    this.db.payments.push(payment);
    this.save();
    return payment;
  }

  public generateNextReceiptNo(): string {
    const year = new Date().getFullYear();
    const count = this.db.payments.length + 1;
    return `IPF-REC-${year}-${String(count).padStart(4, '0')}`;
  }

  // Attendance
  public getAttendanceForToday(): AttendanceRecord[] {
    const today = new Date().toISOString().split('T')[0];
    return this.db.attendance
      .filter((a) => a.date === today)
      .sort((a, b) => b.check_in_time.localeCompare(a.check_in_time));
  }

  public getMemberAttendance(memberId: string): AttendanceRecord[] {
    return this.db.attendance
      .filter((a) => a.member_id === memberId)
      .sort((a, b) => `${b.date} ${b.check_in_time}`.localeCompare(`${a.date} ${a.check_in_time}`));
  }

  public recordCheckIn(member: Member, method: 'qr_pass' | 'admin_manual'): { success: boolean; record?: AttendanceRecord; message: string } {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0]; // HH:mm:ss

    // Check if already checked in today
    const existing = this.db.attendance.find((a) => a.member_id === member.id && a.date === today);
    if (existing) {
      return {
        success: true,
        record: existing,
        message: `Already checked in today at ${existing.check_in_time}`,
      };
    }

    const record: AttendanceRecord = {
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      member_id: member.id,
      member_code: member.member_code,
      member_name: member.name,
      date: today,
      check_in_time: timeStr,
      method,
    };

    this.db.attendance.push(record);
    this.save();
    return {
      success: true,
      record,
      message: `Checked in successfully at ${timeStr}`,
    };
  }

  // Announcements
  public getAnnouncements(): Announcement[] {
    return [...this.db.announcements].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  public createAnnouncement(item: Announcement): Announcement {
    this.db.announcements.push(item);
    this.save();
    return item;
  }

  public deleteAnnouncement(id: string): boolean {
    const prevLen = this.db.announcements.length;
    this.db.announcements = this.db.announcements.filter((a) => a.id !== id);
    this.save();
    return this.db.announcements.length < prevLen;
  }

  // Reports
  public getSummaryStats() {
    this.refreshMemberStatuses();
    const members = this.db.members;
    const totalMembers = members.length;
    const activeMembers = members.filter((m) => m.status === 'active').length;
    const expiringSoon = members.filter((m) => m.status === 'expiring_soon').length;
    const expired = members.filter((m) => m.status === 'expired').length;
    const inactive = members.filter((m) => m.status === 'inactive').length;

    const totalRevenue = this.db.payments.reduce((acc, p) => (p.status === 'paid' ? acc + p.amount_inr : acc), 0);

    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const thisMonthRevenue = this.db.payments
      .filter((p) => p.status === 'paid' && p.paid_at.startsWith(currentYearMonth))
      .reduce((acc, p) => acc + p.amount_inr, 0);

    const todayStr = now.toISOString().split('T')[0];
    const todayCheckIns = this.db.attendance.filter((a) => a.date === todayStr).length;

    // Payment methods breakdown
    const paymentMethods: Record<string, number> = {
      razorpay: 0,
      upi: 0,
      cash: 0,
      bank_transfer: 0,
    };

    this.db.payments.forEach((p) => {
      if (p.status === 'paid') {
        paymentMethods[p.method] = (paymentMethods[p.method] || 0) + p.amount_inr;
      }
    });

    return {
      totalMembers,
      activeMembers,
      expiringSoon,
      expired,
      inactive,
      totalRevenue,
      thisMonthRevenue,
      todayCheckIns,
      paymentMethods,
    };
  }
}

export const db = new DatabaseStore();
