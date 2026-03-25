import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Activity,
  BadgeIndianRupee,
  CheckCircle2,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  RefreshCw,
  Settings,
  Shield,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  UserCog,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AdminAnalytics,
  AdminUserListItem,
  getAdminSettings,
  getAdminDashboardAnalytics,
  getAdminUserPlans,
  getAdminUserProfile,
  getAdminUsers,
  PaymentSnapshot,
  updateAdminSettings,
} from '@/lib/authApi';
import { useAuthStore } from '@/stores/auth.store';
import CustomPagination from '@/components/CustomPagination';
import InitialsAvatar from '@/components/common/InitialsAvatar';

const PIE_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
const PAGE_SIZE_OPTIONS = [20, 30, 50, 100, 200, 300, 500];

type DrawerMode = 'profile' | 'plans' | null;
type AdminSection = 'dashboard' | 'users' | 'settings';

const StatCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="text-indigo-600">{icon}</div>
    </div>
    <p className="text-2xl font-bold text-slate-900 mt-2">{value}</p>
  </div>
);

const SummarySkeleton = () => (
  <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 animate-pulse">
    {Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="h-4 w-24 bg-slate-200 rounded" />
        <div className="h-8 w-20 bg-slate-300 rounded mt-3" />
      </div>
    ))}
  </section>
);

const ChartsSkeleton = () => (
  <section className="grid xl:grid-cols-2 gap-4 animate-pulse">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4 min-h-[280px]">
        <div className="h-5 w-40 bg-slate-200 rounded mb-4" />
        <div className="h-56 bg-slate-100 rounded" />
      </div>
    ))}
  </section>
);

const UsersTableSkeleton = () => (
  <div className="mt-5 overflow-auto animate-pulse">
    <div className="min-w-[960px]">
      {Array.from({ length: 7 }).map((_, index) => (
        <div key={index} className="grid grid-cols-9 gap-3 py-3 border-b border-slate-100">
          {Array.from({ length: 9 }).map((__, col) => (
            <div key={col} className="h-4 bg-slate-200 rounded" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

const ChartCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm min-h-[320px]">
    <h3 className="font-semibold text-slate-900 mb-4">{title}</h3>
    <div className="h-[250px]">{children}</div>
  </div>
);

const getRoleLabel = (role?: number) => {
  if (role === 1) return 'Admin';
  if (role === 2) return 'User';
  return 'User';
};

const getPaymentBadgeClass = (status?: string | null) => {
  const value = (status || '').toLowerCase();

  if (['active', 'success', 'completed', 'paid'].includes(value)) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }

  if (['failed', 'cancelled', 'rejected'].includes(value)) {
    return 'bg-red-50 text-red-700 border-red-200';
  }

  return 'bg-amber-50 text-amber-700 border-amber-200';
};

const getPlanBadgeClass = (status?: string | null) => {
  const value = (status || '').toLowerCase();

  if (['active', 'running'].includes(value)) {
    return 'bg-blue-50 text-blue-700 border-blue-200';
  }

  if (['pending'].includes(value)) {
    return 'bg-amber-50 text-amber-700 border-amber-200';
  }

  return 'bg-purple-50 text-purple-700 border-purple-200';
};

const getLatestPlanBadgeClass = (planName?: string | null) => {
  if (!planName) {
    return 'bg-slate-100 text-slate-600 border-slate-200';
  }

  const palette = [
    'bg-indigo-50 text-indigo-700 border-indigo-200',
    'bg-emerald-50 text-emerald-700 border-emerald-200',
    'bg-amber-50 text-amber-700 border-amber-200',
    'bg-purple-50 text-purple-700 border-purple-200',
    'bg-cyan-50 text-cyan-700 border-cyan-200',
    'bg-pink-50 text-pink-700 border-pink-200',
  ];

  const hash = Array.from(planName).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return palette[hash % palette.length];
};

const getQuotaBadgeClass = (quota?: { used: number; limit: number; available: number } | null) => {
  if (!quota || quota.limit <= 0 || quota.available <= 0) {
    return 'bg-red-50 text-red-700 border-red-200';
  }

  const availabilityRatio = quota.available / quota.limit;
  if (availabilityRatio <= 0.25) {
    return 'bg-amber-50 text-amber-700 border-amber-200';
  }

  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
};

const AdminPanelPage = () => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [builderFreeVisibility, setBuilderFreeVisibility] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<AdminUserListItem['user'] | null>(null);
  const [selectedPlanHistory, setSelectedPlanHistory] = useState<PaymentSnapshot[]>([]);
  const [drawerUserName, setDrawerUserName] = useState('');

  const [filters, setFilters] = useState({
    plan_select: '',
    payment_status: '',
    plan_status: '',
    download_used: '',
  });

  const isAdmin = user?.role === 1;

  const loadData = async () => {
    if (!token || !isAdmin) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [analyticsRes, usersRes] = await Promise.all([
        getAdminDashboardAnalytics(token),
        getAdminUsers(token, filters, { page, limit: pageSize }),
      ]);

      setAnalytics(analyticsRes.analytics);
      setUsers(usersRes.users || []);
      setTotalUsersCount(usersRes.pagination?.totalItems || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token, isAdmin, filters.plan_select, filters.payment_status, filters.plan_status, filters.download_used, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [filters.plan_select, filters.payment_status, filters.plan_status, filters.download_used]);

  const loadSettings = async () => {
    if (!token || !isAdmin) return;

    setSettingsLoading(true);
    try {
      const response = await getAdminSettings(token);
      setBuilderFreeVisibility(Boolean(response.settings.builder_free_visibility));
    } catch (_error) {
      setBuilderFreeVisibility(true);
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [token, isAdmin]);

  const cardEntries = useMemo(() => {
    if (!analytics) {
      return [] as Array<{ label: string; value: number; icon: ReactNode }>;
    }

    const successPayments = Math.max(analytics.cards.total_payments - analytics.cards.failed_payments, 0);
    const successRate = analytics.cards.total_payments
      ? Math.round((successPayments / analytics.cards.total_payments) * 100)
      : 0;
    const quotaConsumption = analytics.cards.total_download_limit
      ? Math.round((analytics.cards.total_download_used / analytics.cards.total_download_limit) * 100)
      : 0;

    return [
      { label: 'Total Users', value: analytics.cards.total_users, icon: <Users size={18} /> },
      { label: 'Active Users', value: analytics.cards.active_users, icon: <CheckCircle2 size={18} /> },
      { label: 'Total Admins', value: analytics.cards.total_admins, icon: <Shield size={18} /> },
      {
        label: 'Total Payments',
        value: analytics.cards.total_payments,
        icon: <BadgeIndianRupee size={18} />,
      },
      { label: 'Active Plans', value: analytics.cards.active_plans, icon: <Activity size={18} /> },
      { label: 'Expired Plans', value: analytics.cards.expired_plans, icon: <XCircle size={18} /> },
      { label: 'Failed Payments', value: analytics.cards.failed_payments, icon: <XCircle size={18} /> },
      {
        label: 'Payment Success %',
        value: successRate,
        icon: <TrendingUp size={18} />,
      },
      {
        label: 'Downloads Used',
        value: analytics.cards.total_download_used,
        icon: <TrendingUp size={18} />,
      },
      {
        label: 'Quota Consumption %',
        value: quotaConsumption,
        icon: <TrendingUp size={18} />,
      },
    ];
  }, [analytics]);

  const paymentsByPlanData = analytics?.charts.payments_by_plan || [];
  const paymentStatusData = analytics?.charts.payment_status_breakdown || [];
  const recentUsersData =
    analytics?.charts.recent_user_registrations.map((item) => ({
      date: String(item.date).slice(5),
      count: item.count,
    })) || [];
  const recentPaymentsData =
    analytics?.charts.recent_payments.map((item) => ({
      date: String(item.date).slice(5),
      count: item.count,
    })) || [];

  const quotaChartData = analytics
    ? [
        { label: 'Used', value: analytics.cards.total_download_used },
        { label: 'Remaining', value: Math.max(analytics.cards.total_download_limit - analytics.cards.total_download_used, 0) },
      ]
    : [];

  const openProfileDrawer = async (userId: number | string, userName: string) => {
    if (!token) return;
    setDrawerUserName(userName);
    setDrawerMode('profile');
    setDrawerOpen(true);
    setDrawerLoading(true);

    try {
      const profileRes = await getAdminUserProfile(token, userId);
      setSelectedProfile(profileRes.user);
      setSelectedPlanHistory([]);
    } finally {
      setDrawerLoading(false);
    }
  };

  const openPlanDrawer = async (userId: number | string, userName: string) => {
    if (!token) return;
    setDrawerUserName(userName);
    setDrawerMode('plans');
    setDrawerOpen(true);
    setDrawerLoading(true);

    try {
      const plansRes = await getAdminUserPlans(token, userId);
      setSelectedPlanHistory(plansRes.payments || []);
      setSelectedProfile(null);
    } finally {
      setDrawerLoading(false);
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDrawerMode(null);
    setSelectedProfile(null);
    setSelectedPlanHistory([]);
    setDrawerUserName('');
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/enter-404-refresh';
  };

  if (!token || !isAdmin) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center max-w-md">
          <p className="text-slate-700">Admin login required.</p>
          <Link href="/enter-404-refresh" className="text-indigo-600 font-semibold mt-3 inline-block">
            Go to Admin Access
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Panel | Riseflake</title>
      </Head>

      <main className="min-h-screen bg-slate-50">
        <aside
          className={`fixed left-0 top-0 z-30 h-screen border-r border-slate-200 bg-white transition-all duration-200 ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between">
            {!sidebarCollapsed && <span className="font-semibold text-slate-900">Admin Panel</span>}
            <button
              type="button"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              className="h-9 w-9 rounded-md border border-slate-200 flex items-center justify-center hover:bg-slate-50"
            >
              <Menu size={16} />
            </button>
          </div>

          <div className="p-3 flex flex-col h-[calc(100vh-4rem)]">
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setActiveSection('dashboard')}
                className={`w-full rounded-lg px-3 py-2.5 flex items-center gap-2 text-sm font-medium ${
                  activeSection === 'dashboard'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <LayoutDashboard size={16} />
                {!sidebarCollapsed && <span>Dashboard</span>}
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('users')}
                className={`w-full rounded-lg px-3 py-2.5 flex items-center gap-2 text-sm font-medium ${
                  activeSection === 'users'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <UserCog size={16} />
                {!sidebarCollapsed && <span>Manage Users</span>}
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('settings')}
                className={`w-full rounded-lg px-3 py-2.5 flex items-center gap-2 text-sm font-medium ${
                  activeSection === 'settings'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <Settings size={16} />
                {!sidebarCollapsed && <span>Settings</span>}
              </button>
            </div>

            <div className="mt-auto">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg px-3 py-2.5 flex items-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50 border border-transparent"
              >
                <LogOut size={16} />
                {!sidebarCollapsed && <span>Logout</span>}
              </button>
            </div>
          </div>
        </aside>

        <div className={`min-h-screen min-w-0 transition-all duration-200 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Riseflake Admin</p>
              <h1 className="text-lg font-semibold text-slate-900">
                {activeSection === 'dashboard'
                  ? 'Dashboard'
                  : activeSection === 'users'
                    ? 'Manage Users'
                    : 'Settings'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
              >
                <Home size={16} />
                Home
              </Link>
              <button
                type="button"
                onClick={loadData}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </header>

          <div className="p-4 sm:p-6 space-y-6">
            {activeSection === 'dashboard' && (
              <>
                {loading ? (
                  <>
                    <SummarySkeleton />
                    <ChartsSkeleton />
                  </>
                ) : (
                  analytics && (
                    <>
                      <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        {cardEntries.map((card) => (
                          <StatCard key={card.label} label={card.label} value={card.value} icon={card.icon} />
                        ))}
                      </section>

                      <section className="grid xl:grid-cols-2 gap-4">
                        <ChartCard title="Payments by Plan (Pie)">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={paymentsByPlanData}
                                dataKey="value"
                                nameKey="label"
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                innerRadius={45}
                                paddingAngle={2}
                              >
                                {paymentsByPlanData.map((_, index) => (
                                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard title="Payment Status (Bar)">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={paymentStatusData} margin={{ left: 8, right: 8 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                              <Tooltip />
                              <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#4f46e5" />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard title="Recent User Registrations (Line)">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={recentUsersData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                              <Tooltip />
                              <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#10b981"
                                strokeWidth={3}
                                dot={{ r: 3 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard title="Recent Payments (Area)">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={recentPaymentsData}>
                              <defs>
                                <linearGradient id="paymentsGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.55} />
                                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                              <Tooltip />
                              <Area
                                type="monotone"
                                dataKey="count"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                fill="url(#paymentsGradient)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard title="Download Quota Utilization">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={quotaChartData} margin={{ left: 8, right: 8 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                              <Tooltip />
                              <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#06b6d4" />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartCard>
                      </section>
                    </>
                  )
                )}
              </>
            )}

            {activeSection === 'users' && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Manage Users</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Apply filters and inspect user profile, plan and quota details.
                </p>

                <div className="mt-4 grid md:grid-cols-4 gap-3">
                  <input
                    value={filters.plan_select}
                    onChange={(event) => setFilters((prev) => ({ ...prev, plan_select: event.target.value }))}
                    placeholder="Plan Name / ID"
                    className="rounded-lg border border-slate-300 px-3 py-2.5"
                  />
                  <select
                    value={filters.payment_status}
                    onChange={(event) => setFilters((prev) => ({ ...prev, payment_status: event.target.value }))}
                    className="rounded-lg border border-slate-300 px-3 py-2.5"
                  >
                    <option value="">Payment Status</option>
                    <option value="pending">Pending</option>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                    <option value="expired">Expired</option>
                  </select>
                  <select
                    value={filters.plan_status}
                    onChange={(event) => setFilters((prev) => ({ ...prev, plan_status: event.target.value }))}
                    className="rounded-lg border border-slate-300 px-3 py-2.5"
                  >
                    <option value="">Plan Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="expired">Expired</option>
                  </select>
                  <select
                    value={filters.download_used}
                    onChange={(event) => setFilters((prev) => ({ ...prev, download_used: event.target.value }))}
                    className="rounded-lg border border-slate-300 px-3 py-2.5"
                  >
                    <option value="">Quota Availability</option>
                    <option value="available">Available (remaining quota)</option>
                    <option value="exhausted">Exhausted (0 available)</option>
                  </select>
                </div>

                <div className="mt-4">
                  <CustomPagination
                    totalItems={totalUsersCount}
                    currentPage={page}
                    pageSize={pageSize}
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                    onPageChange={setPage}
                    onPageSizeChange={(size) => {
                      setPageSize(size);
                      setPage(1);
                    }}
                  />
                </div>

                {loading ? (
                  <UsersTableSkeleton />
                ) : (
                  <div className="mt-5 overflow-auto rounded-xl border border-slate-100">
                    <table className="min-w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr className="text-left border-b border-slate-200 text-slate-600">
                          <th className="py-2 pr-3">Name</th>
                          <th className="py-2 pr-3">Email</th>
                          <th className="py-2 pr-3">Mobile</th>
                          <th className="py-2 pr-3">Latest Plan</th>
                          <th className="py-2 pr-3">Payment Status</th>
                          <th className="py-2 pr-3">Plan Status</th>
                          <th className="py-2 pr-3">Quota</th>
                          <th className="py-2 pr-3">Contact</th>
                          <th className="py-2 pr-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length === 0 && (
                          <tr>
                            <td className="py-10 text-center text-slate-500" colSpan={9}>
                              No users found for selected filters.
                            </td>
                          </tr>
                        )}
                        {users.map((item) => (
                          <tr key={String(item.user.id)} className="border-b border-slate-100 align-top hover:bg-slate-50/60">
                            <td className="py-3 pr-3">
                              <div className="flex items-center gap-2">
                                <InitialsAvatar name={item.user.full_name} seed={item.user.id} size={32} />
                                <span className="font-medium text-slate-800">{item.user.full_name}</span>
                              </div>
                            </td>
                            <td className="py-3 pr-3">{item.user.email}</td>
                            <td className="py-3 pr-3">{item.user.mobile_no || '-'}</td>
                            <td className="py-3 pr-3">
                              {item.latest_payment?.plan_name ? (
                                <div className="flex flex-col gap-1">
                                  <span
                                    className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getLatestPlanBadgeClass(
                                      item.latest_payment.plan_name
                                    )}`}
                                  >
                                    {item.latest_payment.plan_name}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    Payments: {item.payment_count ?? 0}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-500">- (Payments: {item.payment_count ?? 0})</span>
                              )}
                            </td>
                            <td className="py-3 pr-3">
                              {item.latest_payment?.status ? (
                                <span
                                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getPaymentBadgeClass(
                                    item.latest_payment.status
                                  )}`}
                                >
                                  {item.latest_payment.status}
                                </span>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td className="py-3 pr-3">
                              {item.latest_payment?.plan_status ? (
                                <span
                                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getPlanBadgeClass(
                                    item.latest_payment.plan_status
                                  )}`}
                                >
                                  {item.latest_payment.plan_status}
                                </span>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td className="py-3 pr-3">
                              {item.quota ? (
                                <span
                                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getQuotaBadgeClass(
                                    item.quota
                                  )}`}
                                >
                                  {`${item.quota.used}/${item.quota.limit} (left ${item.quota.available})`}
                                </span>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td className="py-3 pr-3">
                              <div className="flex items-center gap-2">
                                {item.user.mobile_no ? (
                                  <a
                                    href={`https://wa.me/${String(item.user.mobile_no).replace(/[^\d]/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="WhatsApp"
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <MessageCircle size={18} />
                                  </a>
                                ) : (
                                  <span className="text-slate-300">
                                    <MessageCircle size={18} />
                                  </span>
                                )}
                                <a
                                  href={`mailto:${item.user.email}`}
                                  title="Email"
                                  className="text-indigo-600 hover:text-indigo-700"
                                >
                                  <Mail size={18} />
                                </a>
                              </div>
                            </td>
                            <td className="py-3 pr-3">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => openProfileDrawer(item.user.id, item.user.full_name)}
                                  className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium hover:bg-slate-100"
                                >
                                  Profile View
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openPlanDrawer(item.user.id, item.user.full_name)}
                                  className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium hover:bg-slate-100"
                                >
                                  Plan View
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {activeSection === 'settings' && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Builder Settings</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Manage visibility of free and paid builder access points.
                </p>

                <div className="mt-5 rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">Free Builder Access</p>
                    <p className="text-sm text-slate-500 mt-1">
                      {builderFreeVisibility
                        ? 'Users can open /builder-free.'
                        : 'Users will see unavailable message on /builder-free.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={settingsLoading || settingsSaving}
                    onClick={async () => {
                      if (!token) return;

                      const nextValue = !builderFreeVisibility;
                      setSettingsSaving(true);
                      try {
                        const response = await updateAdminSettings(token, {
                          builder_free_visibility: nextValue,
                        });
                        setBuilderFreeVisibility(
                          Boolean(response.settings.builder_free_visibility)
                        );
                      } finally {
                        setSettingsSaving(false);
                      }
                    }}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      builderFreeVisibility
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {builderFreeVisibility ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    {settingsSaving
                      ? 'Saving...'
                      : builderFreeVisibility
                        ? 'Enabled'
                        : 'Disabled'}
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      {drawerOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/30 z-40" onClick={closeDrawer} />
          <aside className="fixed right-0 top-0 h-full w-full sm:w-[96vw] lg:w-[1120px] xl:w-[1220px] max-w-full bg-white border-l border-slate-200 z-50 shadow-2xl rounded-none overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {drawerMode === 'profile' ? 'User Profile' : `Payment History (${drawerUserName || 'User'})`}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Detailed view panel</p>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="p-2 border border-slate-200 hover:bg-slate-50"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5">
              {drawerLoading ? (
                <div className="animate-pulse space-y-3">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="h-12 bg-slate-100 rounded" />
                  ))}
                </div>
              ) : drawerMode === 'profile' && selectedProfile ? (
                <div className="grid gap-3 text-sm text-slate-700">
                  <div className="p-3 bg-slate-50"><strong>Name:</strong> {selectedProfile.full_name}</div>
                  <div className="p-3 bg-slate-50"><strong>Email:</strong> {selectedProfile.email}</div>
                  <div className="p-3 bg-slate-50"><strong>Mobile:</strong> {selectedProfile.mobile_no || '-'}</div>
                  <div className="p-3 bg-slate-50"><strong>Role:</strong> {getRoleLabel(selectedProfile.role)}</div>
                  <div className="p-3 bg-slate-50"><strong>Active:</strong> {selectedProfile.is_active ? 'Yes' : 'No'}</div>
                  <div className="p-3 bg-slate-50 break-all"><strong>Photo URL:</strong> {selectedProfile.avatar_url || '-'}</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[980px] text-sm">
                    <thead className="bg-slate-50">
                      <tr className="text-left border-b border-slate-200 text-slate-600">
                        <th className="py-2 pr-3">Plan</th>
                        <th className="py-2 pr-3">Payment Datetime</th>
                        <th className="py-2 pr-3">Payment Status</th>
                        <th className="py-2 pr-3">Plan Status</th>
                        <th className="py-2 pr-3">Quota</th>
                        <th className="py-2 pr-3">Start</th>
                        <th className="py-2 pr-3">End</th>
                        <th className="py-2 pr-3">Payment ID</th>
                        <th className="py-2 pr-3">Order ID</th>
                        <th className="py-2 pr-3">Invoice</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPlanHistory.length === 0 && (
                        <tr>
                          <td className="py-10 text-center text-slate-500" colSpan={10}>
                            No payment history available.
                          </td>
                        </tr>
                      )}
                      {selectedPlanHistory.map((payment) => (
                        <tr key={payment.id} className="border-b border-slate-100">
                          <td className="py-2 pr-3">{payment.plan_name}</td>
                          <td className="py-2 pr-3">
                            {payment.created_at ? new Date(payment.created_at).toLocaleString() : '-'}
                          </td>
                          <td className="py-2 pr-3">{payment.status}</td>
                          <td className="py-2 pr-3">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getPlanBadgeClass(
                                payment.plan_status
                              )}`}
                            >
                              {payment.plan_status}
                            </span>
                          </td>
                          <td className="py-2 pr-3">
                            {payment.download_used}/{payment.download_limit} (available {payment.downloads_left})
                          </td>
                          <td className="py-2 pr-3">
                            {payment.start_time ? new Date(payment.start_time).toLocaleString() : '-'}
                          </td>
                          <td className="py-2 pr-3">
                            {payment.end_time ? new Date(payment.end_time).toLocaleString() : '-'}
                          </td>
                          <td className="py-2 pr-3">{payment.razorpay_payment_id || '-'}</td>
                          <td className="py-2 pr-3">{payment.razorpay_order_id || '-'}</td>
                          <td className="py-2 pr-3">
                            {payment.razorpay_invoice_id ? (
                              <a
                                href={`https://invoices.razorpay.com/v1/t/${payment.razorpay_invoice_id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center rounded-lg border border-slate-300 p-2 text-slate-700 hover:bg-slate-100"
                                title="Open Invoice"
                              >
                                <FileText size={16} />
                              </a>
                            ) : (
                              '-'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default AdminPanelPage;
