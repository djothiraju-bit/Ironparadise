import {
  GymSettings,
  MembershipPlan,
  User,
  Member,
  Payment,
  AttendanceRecord,
  Announcement,
  SummaryStats,
} from '../types';

const TOKEN_KEY = 'ip_fitness_token';

export const api = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const token = this.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMsg = `Server error (${response.status})`;
      try {
        const errorData = await response.json();
        if (errorData.error) errorMsg = errorData.error;
      } catch (e) {
        // ignore json parse error
      }
      throw new Error(errorMsg);
    }

    return response.json();
  },

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User; member?: Member }> {
    const res = await this.request<{ token: string; user: User; member?: Member }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(res.token);
    return res;
  },

  async register(data: { name: string; email: string; phone: string; password: string; plan_id?: string; gender?: string }) {
    const res = await this.request<{ token: string; user: User; member: Member }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(res.token);
    return res;
  },

  async resetPassword(email: string, new_password: string) {
    return this.request<{ success: boolean; message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, new_password }),
    });
  },

  async getMe(): Promise<{ user: User; member?: Member }> {
    return this.request<{ user: User; member?: Member }>('/api/auth/me');
  },

  // Gym Settings
  async getSettings(): Promise<GymSettings> {
    return this.request<GymSettings>('/api/gym/settings');
  },

  async updateSettings(settings: Partial<GymSettings>): Promise<GymSettings> {
    return this.request<GymSettings>('/api/gym/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  },

  async toggleGymStatus(is_open: boolean, status_message?: string): Promise<GymSettings> {
    return this.request<GymSettings>('/api/gym/status', {
      method: 'POST',
      body: JSON.stringify({ is_open, status_message }),
    });
  },

  // Plans
  async getPlans(): Promise<MembershipPlan[]> {
    return this.request<MembershipPlan[]>('/api/plans');
  },

  async getAllPlans(): Promise<MembershipPlan[]> {
    return this.request<MembershipPlan[]>('/api/plans/all');
  },

  async savePlan(plan: Partial<MembershipPlan>): Promise<MembershipPlan> {
    return this.request<MembershipPlan>('/api/plans', {
      method: 'POST',
      body: JSON.stringify(plan),
    });
  },

  async deletePlan(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/plans/${id}`, {
      method: 'DELETE',
    });
  },

  // Members
  async getMembers(search?: string, status?: string): Promise<Member[]> {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status && status !== 'all') params.set('status', status);
    return this.request<Member[]>(`/api/members?${params.toString()}`);
  },

  async getMember(id: string): Promise<Member> {
    return this.request<Member>(`/api/members/${id}`);
  },

  async createMember(data: Partial<Member>): Promise<Member> {
    return this.request<Member>('/api/members', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateMember(id: string, updates: Partial<Member>): Promise<Member> {
    return this.request<Member>(`/api/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async toggleMemberStatus(id: string): Promise<Member> {
    return this.request<Member>(`/api/members/${id}/toggle-status`, {
      method: 'POST',
    });
  },

  // Payments
  async getPayments(): Promise<Payment[]> {
    return this.request<Payment[]>('/api/payments');
  },

  async getMemberPayments(memberId: string): Promise<Payment[]> {
    return this.request<Payment[]>(`/api/payments/member/${memberId}`);
  },

  async recordOfflinePayment(data: {
    member_id: string;
    plan_id?: string;
    amount_inr: number;
    method: 'cash' | 'upi' | 'bank_transfer';
    notes?: string;
  }): Promise<{ payment: Payment; member: Member }> {
    return this.request<{ payment: Payment; member: Member }>('/api/payments/record-offline', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async createRazorpayOrder(member_id: string, plan_id: string) {
    return this.request<{
      order_id: string;
      amount: number;
      amount_inr: number;
      currency: string;
      key_id: string;
      member: { id: string; name: string; email: string; phone: string; code: string };
      plan: { id: string; name: string; duration_months: number };
    }>('/api/payments/razorpay/create-order', {
      method: 'POST',
      body: JSON.stringify({ member_id, plan_id }),
    });
  },

  async verifyRazorpayPayment(data: {
    order_id: string;
    payment_id: string;
    signature: string;
    member_id: string;
    plan_id: string;
  }): Promise<{ success: boolean; payment: Payment; member: Member; receipt_no: string }> {
    return this.request<{ success: boolean; payment: Payment; member: Member; receipt_no: string }>(
      '/api/payments/razorpay/verify',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  // Attendance
  async getTodayAttendance(): Promise<AttendanceRecord[]> {
    return this.request<AttendanceRecord[]>('/api/attendance/today');
  },

  async getMemberAttendance(memberId: string): Promise<AttendanceRecord[]> {
    return this.request<AttendanceRecord[]>(`/api/attendance/member/${memberId}`);
  },

  async checkIn(data: { member_code?: string; member_id?: string; method?: 'qr_pass' | 'admin_manual' }) {
    return this.request<{ success: boolean; record: AttendanceRecord; message: string; member: Member }>(
      '/api/attendance/check-in',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    return this.request<Announcement[]>('/api/announcements');
  },

  async createAnnouncement(data: { title: string; content: string; priority: 'normal' | 'urgent'; author?: string }) {
    return this.request<Announcement>('/api/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteAnnouncement(id: string) {
    return this.request<{ success: boolean }>(`/api/announcements/${id}`, {
      method: 'DELETE',
    });
  },

  // Reports
  async getSummaryStats(): Promise<SummaryStats> {
    return this.request<SummaryStats>('/api/reports/summary');
  },
};
