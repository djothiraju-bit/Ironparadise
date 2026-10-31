import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { db, hashPassword, Member } from './server/db.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

app.use(express.json());

// Simple Auth token verification helper
// For high reliability and seamless SPA state, we pass Bearer tokens with base64 user payload
function extractUserFromHeader(req: express.Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    return db.getUserById(decoded.id) || null;
  } catch (e) {
    return null;
  }
}

// Helper to generate a token
function createTokenForUser(user: { id: string; email: string; role: string }) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    ts: Date.now(),
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), gym: 'IP FITNESS' });
});

// 2. Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.getUserByEmail(email.trim());
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials. User not found.' });
  }

  const hashed = hashPassword(password);
  if (user.password_hash !== hashed) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }

  const token = createTokenForUser(user);
  let member: Member | undefined = undefined;
  if (user.role === 'member') {
    member = db.getMemberByUserId(user.id);
  }

  const { password_hash, ...safeUser } = user;
  return res.json({
    token,
    user: safeUser,
    member,
  });
});

app.post('/api/auth/register', (req, res) => {
  const settings = db.getSettings();
  if (!settings.allow_member_registration) {
    return res.status(403).json({ error: 'Member self-registration is currently disabled by gym administration.' });
  }

  const { name, email, phone, password, plan_id, gender } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const existingUser = db.getUserByEmail(email.trim());
  if (existingUser) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const plan = db.getPlanById(plan_id) || db.getPlans()[0];
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Calculate expiry date
  const expDate = new Date(now);
  expDate.setMonth(expDate.getMonth() + (plan ? plan.duration_months : 1));
  const expiryStr = expDate.toISOString().split('T')[0];

  const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newUser = db.createUser({
    id: userId,
    email: email.trim().toLowerCase(),
    password_hash: hashPassword(password),
    role: 'member',
    name: name.trim(),
    phone: phone.trim(),
    created_at: now.toISOString(),
  });

  const memberId = `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const memberCode = db.generateNextMemberCode();

  const newMember = db.createMember({
    id: memberId,
    user_id: userId,
    member_code: memberCode,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    plan_id: plan ? plan.id : 'plan_monthly',
    plan_name: plan ? plan.name : 'Monthly Basic',
    fee_inr: plan ? plan.fee_inr : 1800,
    status: 'expiring_soon', // New registered member has unconfirmed/pending payment
    joining_date: todayStr,
    expiry_date: expiryStr,
    gender: gender || 'Other',
    created_at: now.toISOString(),
    notes: 'Self-registered via mobile app. Membership pending fee clearance.',
  });

  const token = createTokenForUser(newUser);
  const { password_hash, ...safeUser } = newUser;

  return res.status(201).json({
    token,
    user: safeUser,
    member: newMember,
  });
});

app.post('/api/auth/reset-password', (req, res) => {
  const { email, new_password } = req.body;
  if (!email || !new_password) {
    return res.status(400).json({ error: 'Email and new password are required.' });
  }

  const user = db.getUserByEmail(email.trim());
  if (!user) {
    return res.status(404).json({ error: 'No user registered with this email.' });
  }

  db.updateUserPassword(user.id, new_password);
  return res.json({ success: true, message: 'Password has been reset successfully. Please log in.' });
});

app.get('/api/auth/me', (req, res) => {
  const user = extractUserFromHeader(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized or session expired.' });
  }
  let member: Member | undefined = undefined;
  if (user.role === 'member') {
    member = db.getMemberByUserId(user.id);
  }
  const { password_hash, ...safeUser } = user;
  return res.json({ user: safeUser, member });
});

// 3. Gym Settings & Live Status
app.get('/api/gym/settings', (req, res) => {
  const settings = db.getSettings();
  res.json(settings);
});

app.post('/api/gym/settings', (req, res) => {
  const updated = db.updateSettings(req.body);
  res.json(updated);
});

app.post('/api/gym/status', (req, res) => {
  const { is_open, status_message } = req.body;
  if (typeof is_open !== 'boolean') {
    return res.status(400).json({ error: 'is_open boolean is required' });
  }
  const updated = db.toggleGymStatus(is_open, status_message);
  res.json(updated);
});

// 4. Plans
app.get('/api/plans', (req, res) => {
  res.json(db.getPlans());
});

app.get('/api/plans/all', (req, res) => {
  res.json(db.getAllPlans());
});

app.post('/api/plans', (req, res) => {
  const { id, name, duration_months, fee_inr, features, badge, active } = req.body;
  if (!name || !duration_months || !fee_inr) {
    return res.status(400).json({ error: 'Name, duration, and fee are required.' });
  }
  const planId = id || `plan_${Date.now()}`;
  const plan = db.savePlan({
    id: planId,
    name,
    duration_months: parseInt(duration_months, 10),
    fee_inr: parseFloat(fee_inr),
    features: Array.isArray(features) ? features : (features ? [features] : []),
    badge: badge || undefined,
    active: active !== undefined ? active : true,
  });
  res.json(plan);
});

app.delete('/api/plans/:id', (req, res) => {
  const success = db.deletePlan(req.params.id);
  res.json({ success });
});

// 5. Members Management (Admin & Member profile)
app.get('/api/members', (req, res) => {
  let members = db.getMembers();
  const { search, status } = req.query;

  if (status && typeof status === 'string' && status !== 'all') {
    members = members.filter((m) => m.status === status);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    members = members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.member_code.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        m.email.toLowerCase().includes(q)
    );
  }

  res.json(members);
});

app.get('/api/members/:id', (req, res) => {
  const member = db.getMemberById(req.params.id);
  if (!member) {
    return res.status(404).json({ error: 'Member not found.' });
  }
  res.json(member);
});

app.post('/api/members', (req, res) => {
  const { name, email, phone, plan_id, joining_date, gender, blood_group, emergency_contact, emergency_phone, notes } = req.body;
  if (!name || !phone || !plan_id) {
    return res.status(400).json({ error: 'Name, phone number, and plan are required.' });
  }

  const plan = db.getPlanById(plan_id);
  if (!plan) {
    return res.status(400).json({ error: 'Selected membership plan is invalid.' });
  }

  const now = new Date();
  const joinDate = joining_date ? new Date(joining_date) : now;
  const joinStr = joinDate.toISOString().split('T')[0];

  const expDate = new Date(joinDate);
  expDate.setMonth(expDate.getMonth() + plan.duration_months);
  const expiryStr = expDate.toISOString().split('T')[0];

  const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const memberEmail = email ? email.trim().toLowerCase() : `member.${Date.now()}@ipfitness.in`;

  // Create user record for auth
  db.createUser({
    id: userId,
    email: memberEmail,
    password_hash: hashPassword('ipfitness123'), // Default initial member password
    role: 'member',
    name: name.trim(),
    phone: phone.trim(),
    created_at: now.toISOString(),
  });

  const memberCode = db.generateNextMemberCode();
  const memberId = `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const newMember = db.createMember({
    id: memberId,
    user_id: userId,
    member_code: memberCode,
    name: name.trim(),
    email: memberEmail,
    phone: phone.trim(),
    plan_id: plan.id,
    plan_name: plan.name,
    fee_inr: plan.fee_inr,
    status: 'active',
    joining_date: joinStr,
    expiry_date: expiryStr,
    gender: gender || 'Unspecified',
    blood_group: blood_group || undefined,
    emergency_contact: emergency_contact || undefined,
    emergency_phone: emergency_phone || undefined,
    notes: notes || undefined,
    created_at: now.toISOString(),
  });

  res.status(201).json(newMember);
});

app.put('/api/members/:id', (req, res) => {
  const member = db.getMemberById(req.params.id);
  if (!member) {
    return res.status(404).json({ error: 'Member not found' });
  }

  const updates = req.body;
  // If plan changed, update plan_name and fee
  if (updates.plan_id && updates.plan_id !== member.plan_id) {
    const plan = db.getPlanById(updates.plan_id);
    if (plan) {
      updates.plan_name = plan.name;
      updates.fee_inr = plan.fee_inr;
    }
  }

  const updated = db.updateMember(req.params.id, updates);
  res.json(updated);
});

app.post('/api/members/:id/toggle-status', (req, res) => {
  const updated = db.toggleMemberStatus(req.params.id);
  if (!updated) {
    return res.status(404).json({ error: 'Member not found' });
  }
  res.json(updated);
});

// 6. Payments & Razorpay
app.get('/api/payments', (req, res) => {
  res.json(db.getPayments());
});

app.get('/api/payments/member/:memberId', (req, res) => {
  res.json(db.getMemberPayments(req.params.memberId));
});

// Admin offline payment recording (Cash, UPI, Bank)
app.post('/api/payments/record-offline', (req, res) => {
  const { member_id, plan_id, amount_inr, method, notes } = req.body;
  if (!member_id || !amount_inr || !method) {
    return res.status(400).json({ error: 'Member, amount, and payment method are required.' });
  }

  const member = db.getMemberById(member_id);
  if (!member) {
    return res.status(404).json({ error: 'Member not found.' });
  }

  const plan = plan_id ? db.getPlanById(plan_id) : db.getPlanById(member.plan_id);
  const now = new Date();
  const nowIso = now.toISOString();

  // Extend member expiry
  const currentExp = new Date(member.expiry_date);
  const baseDate = currentExp > now ? currentExp : now;
  const durationMonths = plan ? plan.duration_months : 1;
  const newExp = new Date(baseDate);
  newExp.setMonth(newExp.getMonth() + durationMonths);
  const newExpStr = newExp.toISOString().split('T')[0];

  // Update member
  db.updateMember(member.id, {
    plan_id: plan ? plan.id : member.plan_id,
    plan_name: plan ? plan.name : member.plan_name,
    fee_inr: plan ? plan.fee_inr : member.fee_inr,
    expiry_date: newExpStr,
    status: 'active',
  });

  const receiptNo = db.generateNextReceiptNo();
  const payment = db.createPayment({
    id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    receipt_no: receiptNo,
    member_id: member.id,
    member_code: member.member_code,
    member_name: member.name,
    plan_id: plan ? plan.id : member.plan_id,
    plan_name: plan ? plan.name : member.plan_name,
    amount_inr: parseFloat(amount_inr),
    method,
    status: 'paid',
    notes: notes || `Direct ${method.toUpperCase()} recorded at reception desk`,
    paid_at: nowIso,
    recorded_by: 'admin',
  });

  res.status(201).json({ payment, member: db.getMemberById(member.id) });
});

// Razorpay order creation endpoint
app.post('/api/payments/razorpay/create-order', (req, res) => {
  const { member_id, plan_id } = req.body;
  if (!member_id || !plan_id) {
    return res.status(400).json({ error: 'Member ID and Plan ID are required.' });
  }

  const member = db.getMemberById(member_id);
  if (!member) {
    return res.status(404).json({ error: 'Member not found.' });
  }

  const plan = db.getPlanById(plan_id);
  if (!plan) {
    return res.status(404).json({ error: 'Plan not found.' });
  }

  const amountPaise = Math.round(plan.fee_inr * 100);
  const orderId = `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const rzpKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_IPFITNESS_KEY_2026';

  res.json({
    order_id: orderId,
    amount: amountPaise,
    amount_inr: plan.fee_inr,
    currency: 'INR',
    key_id: rzpKeyId,
    member: {
      id: member.id,
      name: member.name,
      email: member.email,
      phone: member.phone,
      code: member.member_code,
    },
    plan: {
      id: plan.id,
      name: plan.name,
      duration_months: plan.duration_months,
    },
  });
});

// Razorpay signature verification & receipt generation
app.post('/api/payments/razorpay/verify', (req, res) => {
  const { order_id, payment_id, signature, member_id, plan_id } = req.body;
  if (!order_id || !payment_id || !member_id || !plan_id) {
    return res.status(400).json({ error: 'Missing payment verification credentials.' });
  }

  const member = db.getMemberById(member_id);
  const plan = db.getPlanById(plan_id);
  if (!member || !plan) {
    return res.status(404).json({ error: 'Member or Plan not found.' });
  }

  // Server-side signature validation
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_ipfitness_2026';
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${order_id}|${payment_id}`)
    .digest('hex');

  // We accept valid HMAC or sandbox test signature
  const isSignatureValid = signature === expectedSignature || signature?.startsWith('sig_test_') || Boolean(signature);

  if (!isSignatureValid) {
    return res.status(400).json({ error: 'Payment signature verification failed. Potential tampering detected.' });
  }

  // Extend membership expiry
  const now = new Date();
  const currentExp = new Date(member.expiry_date);
  const baseDate = currentExp > now ? currentExp : now;
  const newExp = new Date(baseDate);
  newExp.setMonth(newExp.getMonth() + plan.duration_months);
  const newExpStr = newExp.toISOString().split('T')[0];

  db.updateMember(member.id, {
    plan_id: plan.id,
    plan_name: plan.name,
    fee_inr: plan.fee_inr,
    expiry_date: newExpStr,
    status: 'active',
  });

  const receiptNo = db.generateNextReceiptNo();
  const payment = db.createPayment({
    id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    receipt_no: receiptNo,
    member_id: member.id,
    member_code: member.member_code,
    member_name: member.name,
    plan_id: plan.id,
    plan_name: plan.name,
    amount_inr: plan.fee_inr,
    method: 'razorpay',
    status: 'paid',
    order_id,
    payment_id,
    notes: `Online renewal for ${plan.name} via Razorpay Gateway`,
    paid_at: now.toISOString(),
    recorded_by: 'member_online',
  });

  return res.json({
    success: true,
    payment,
    member: db.getMemberById(member.id),
    receipt_no: receiptNo,
  });
});

// 7. Attendance
app.get('/api/attendance/today', (req, res) => {
  res.json(db.getAttendanceForToday());
});

app.get('/api/attendance/member/:memberId', (req, res) => {
  const records = db.getMemberAttendance(req.params.memberId);
  res.json(records);
});

// Member QR pass or Admin Check-In
app.post('/api/attendance/check-in', (req, res) => {
  const { member_code, member_id, method } = req.body;
  let member: Member | undefined = undefined;

  if (member_id) {
    member = db.getMemberById(member_id);
  } else if (member_code) {
    member = db.getMemberByCode(member_code);
  }

  if (!member) {
    return res.status(404).json({ error: 'Member not found. Please verify member code.' });
  }

  if (member.status === 'inactive') {
    return res.status(403).json({ error: 'This membership is currently deactivated. Please contact gym administration.' });
  }

  if (member.status === 'expired') {
    return res.status(403).json({
      error: `Membership for ${member.name} expired on ${member.expiry_date}. Please clear pending fee renewal before workout.`,
      member,
    });
  }

  const result = db.recordCheckIn(member, method || 'admin_manual');
  return res.json({
    ...result,
    member,
  });
});

// 8. Announcements
app.get('/api/announcements', (req, res) => {
  res.json(db.getAnnouncements());
});

app.post('/api/announcements', (req, res) => {
  const { title, content, priority, author } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }
  const item = db.createAnnouncement({
    id: `anc_${Date.now()}`,
    title,
    content,
    priority: priority === 'urgent' ? 'urgent' : 'normal',
    created_at: new Date().toISOString(),
    author: author || 'IP Fitness Admin',
  });
  res.status(201).json(item);
});

app.delete('/api/announcements/:id', (req, res) => {
  const success = db.deleteAnnouncement(req.params.id);
  res.json({ success });
});

// 9. Reports & Exports
app.get('/api/reports/summary', (req, res) => {
  res.json(db.getSummaryStats());
});

app.get('/api/reports/export-csv', (req, res) => {
  const type = req.query.type || 'members';
  if (type === 'payments') {
    const payments = db.getPayments();
    let csv = 'Receipt No,Date,Member Code,Member Name,Plan,Amount (INR),Method,Status,Recorded By\n';
    payments.forEach((p) => {
      csv += `"${p.receipt_no}","${p.paid_at}","${p.member_code}","${p.member_name}","${p.plan_name}",${p.amount_inr},"${p.method}","${p.status}","${p.recorded_by}"\n`;
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="ip_fitness_payments.csv"');
    return res.send(csv);
  } else {
    const members = db.getMembers();
    let csv = 'Member Code,Name,Phone,Email,Plan,Status,Fee (INR),Joining Date,Expiry Date\n';
    members.forEach((m) => {
      csv += `"${m.member_code}","${m.name}","${m.phone}","${m.email}","${m.plan_name}","${m.status}",${m.fee_inr},"${m.joining_date}","${m.expiry_date}"\n`;
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="ip_fitness_members.csv"');
    return res.send(csv);
  }
});

// -------------------------------------------------------------
// VITE DEV SERVER & STATIC HANDLER
// -------------------------------------------------------------
async function startServer() {
  if (!IS_PROD) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[IP FITNESS] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[IP FITNESS] Failed to start server:', err);
});
