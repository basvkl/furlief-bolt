import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Download, 
  Search, 
  Filter,
  BarChart3,
  PieChart,
  Mail,
  Eye,
  UserCheck,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';

interface DashboardStats {
  totalSignups: number;
  todaySignups: number;
  weeklySignups: number;
  monthlySignups: number;
  conversionRate: number;
  avgPosition: number;
  topReferrers: Array<{ email: string; referrals: number }>;
  signupTrend: Array<{ date: string; count: number }>;
}

interface WaitlistSignup {
  id: string;
  email: string;
  first_name?: string;
  dog_breed?: string;
  position?: number;
  status: string;
  created_at: string;
  referral_code: string;
  referred_by?: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSignups: 0,
    todaySignups: 0,
    weeklySignups: 0,
    monthlySignups: 0,
    conversionRate: 0,
    avgPosition: 0,
    topReferrers: [],
    signupTrend: []
  });
  
  const [signups, setSignups] = useState<WaitlistSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const itemsPerPage = 50;

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Check if user is admin
          const { data: adminUser } = await supabase
            .from('admin_users')
            .select('role')
            .eq('id', user.id)
            .single();
          
          setIsAuthenticated(!!adminUser);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Load dashboard data
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load waitlist signups
      const { data: signupsData, error: signupsError } = await supabase
        .from('waitlist_signups')
        .select('*')
        .order('created_at', { ascending: false });

      if (signupsError) throw signupsError;
      setSignups(signupsData || []);

      // Calculate stats
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      const totalSignups = signupsData?.length || 0;
      const todaySignups = signupsData?.filter(s => new Date(s.created_at) >= today).length || 0;
      const weeklySignups = signupsData?.filter(s => new Date(s.created_at) >= weekAgo).length || 0;
      const monthlySignups = signupsData?.filter(s => new Date(s.created_at) >= monthAgo).length || 0;

      // Calculate referral stats
      const referralCounts = signupsData?.reduce((acc, signup) => {
        if (signup.referred_by) {
          const referrer = signupsData.find(s => s.id === signup.referred_by);
          if (referrer) {
            acc[referrer.email] = (acc[referrer.email] || 0) + 1;
          }
        }
        return acc;
      }, {} as Record<string, number>) || {};

      const topReferrers = Object.entries(referralCounts)
        .map(([email, referrals]) => ({ email, referrals }))
        .sort((a, b) => b.referrals - a.referrals)
        .slice(0, 5);

      // Generate signup trend (last 30 days)
      const signupTrend = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        const count = signupsData?.filter(s => 
          s.created_at.startsWith(dateStr)
        ).length || 0;
        signupTrend.push({ date: dateStr, count });
      }

      setStats({
        totalSignups,
        todaySignups,
        weeklySignups,
        monthlySignups,
        conversionRate: totalSignups > 0 ? (weeklySignups / totalSignups) * 100 : 0,
        avgPosition: totalSignups > 0 ? totalSignups / 2 : 0,
        topReferrers,
        signupTrend
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Email', 'First Name', 'Dog Breed', 'Position', 'Status', 'Created At', 'Referral Code'].join(','),
      ...signups.map(signup => [
        signup.email,
        signup.first_name || '',
        signup.dog_breed || '',
        signup.position || '',
        signup.status,
        new Date(signup.created_at).toLocaleDateString(),
        signup.referral_code
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `furlief-waitlist-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Filter signups
  const filteredSignups = signups.filter(signup => {
    const matchesSearch = !searchTerm || 
      signup.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (signup.first_name && signup.first_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || signup.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const paginatedSignups = filteredSignups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSignups.length / itemsPerPage);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9A826] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 flex items-center justify-center min-h-screen">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
            <h1 className="text-2xl font-bold text-[#0E2A47] mb-4 text-center">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mb-6 text-center">
              Sign in to access the Furlief admin dashboard
            </p>
            <button
              onClick={handleSignIn}
              className="w-full bg-[#F9A826] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#F9A826]/90 transition-colors"
            >
              Sign In with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9A826] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0E2A47] mb-2">
              Furlief Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Monitor waitlist performance and manage signups
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Signups</p>
                  <p className="text-2xl font-bold text-[#0E2A47]">
                    {stats.totalSignups.toLocaleString()}
                  </p>
                </div>
                <Users className="text-[#F9A826]" size={24} />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <ArrowUpRight size={16} className="text-green-500 mr-1" />
                <span className="text-green-500">+{stats.weeklySignups}</span>
                <span className="text-gray-500 ml-1">this week</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Signups</p>
                  <p className="text-2xl font-bold text-[#0E2A47]">
                    {stats.todaySignups}
                  </p>
                </div>
                <Calendar className="text-[#F9A826]" size={24} />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <Clock size={16} className="text-gray-400 mr-1" />
                <span className="text-gray-500">Last 24 hours</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Growth</p>
                  <p className="text-2xl font-bold text-[#0E2A47]">
                    {stats.monthlySignups}
                  </p>
                </div>
                <TrendingUp className="text-[#F9A826]" size={24} />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <ArrowUpRight size={16} className="text-green-500 mr-1" />
                <span className="text-green-500">
                  {((stats.monthlySignups / stats.totalSignups) * 100).toFixed(1)}%
                </span>
                <span className="text-gray-500 ml-1">of total</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Top Referrers</p>
                  <p className="text-2xl font-bold text-[#0E2A47]">
                    {stats.topReferrers.length}
                  </p>
                </div>
                <UserCheck className="text-[#F9A826]" size={24} />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-gray-500">
                  {stats.topReferrers.reduce((sum, r) => sum + r.referrals, 0)} total referrals
                </span>
              </div>
            </div>
          </div>

          {/* Top Referrers */}
          {stats.topReferrers.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h3 className="text-lg font-semibold text-[#0E2A47] mb-4">
                Top Referrers
              </h3>
              <div className="space-y-3">
                {stats.topReferrers.map((referrer, index) => (
                  <div key={referrer.email} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-[#F9A826]/10 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-[#F9A826]">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-[#0E2A47]">{referrer.email}</span>
                    </div>
                    <span className="font-semibold text-[#F9A826]">
                      {referrer.referrals} referrals
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Waitlist Management */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h3 className="text-lg font-semibold text-[#0E2A47]">
                  Waitlist Signups ({filteredSignups.length})
                </h3>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by email or name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F9A826] focus:border-transparent outline-none"
                    />
                  </div>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F9A826] focus:border-transparent outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="converted">Converted</option>
                    <option value="unsubscribed">Unsubscribed</option>
                  </select>
                  
                  <button
                    onClick={exportData}
                    className="flex items-center px-4 py-2 bg-[#F9A826] text-white rounded-lg hover:bg-[#F9A826]/90 transition-colors"
                  >
                    <Download size={18} className="mr-2" />
                    Export CSV
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dog Breed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referral Code
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedSignups.map((signup) => (
                    <tr key={signup.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0E2A47]">
                        #{signup.position || 'TBD'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0E2A47]">
                        {signup.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {signup.first_name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {signup.dog_breed || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          signup.status === 'active' ? 'bg-green-100 text-green-800' :
                          signup.status === 'converted' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {signup.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(signup.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                        {signup.referral_code}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSignups.length)} of {filteredSignups.length} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;