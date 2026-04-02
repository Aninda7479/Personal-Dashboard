import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { Leaf, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await client.post('/auth/login', { email, password });
      login(res.data.access_token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#FDFBF7', color: '#4A4036', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Decorative Rustic Shapes */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-pulse pointer-events-none" style={{ backgroundColor: '#E2C2A4', animationDuration: '8s' }}></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-pulse pointer-events-none" style={{ backgroundColor: '#B8CABC', animationDuration: '10s' }}></div>

      <div className="w-[90%] max-w-[400px] bg-white p-6 sm:p-8 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.06)] relative z-10 box-border">
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-sm" style={{ backgroundColor: '#F4EBE1', color: '#B36A5E' }}>
            <Leaf className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-center" style={{ color: '#3A322C' }}>Welcome Back</h2>
          <p className="mt-1 text-sm text-center" style={{ color: '#857B70' }}>Sign in to continue your journey</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl mb-6 text-sm text-center font-medium" style={{ backgroundColor: '#FDECEA', color: '#D32F2F', border: '1px solid #F8D7D4' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold tracking-wide ml-1" style={{ color: '#5B534B' }}>Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#B36A5E]">
                <Mail size={16} style={{ color: 'inherit' }} className="text-[#B0A8A0]" />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 text-sm rounded-xl transition-all focus:outline-none focus:ring-4 placeholder-gray-400"
                style={{ backgroundColor: '#F9F8F6', border: '2px solid #EAE5DE', color: '#3A322C', '--tw-ring-color': 'rgba(179,106,94,0.2)', borderColor: email ? '#CDC5BD' : '#EAE5DE' }}
                placeholder="hello@example.com"
                required 
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold tracking-wide ml-1" style={{ color: '#5B534B' }}>Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#B36A5E]">
                <Lock size={16} style={{ color: 'inherit' }} className="text-[#B0A8A0]" />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 text-sm rounded-xl transition-all focus:outline-none focus:ring-4 placeholder-gray-400"
                style={{ backgroundColor: '#F9F8F6', border: '2px solid #EAE5DE', color: '#3A322C', '--tw-ring-color': 'rgba(179,106,94,0.2)', borderColor: password ? '#CDC5BD' : '#EAE5DE' }}
                placeholder="••••••••"
                required 
              />
            </div>
          </div>

          <button type="submit" className="w-full py-3 mt-4 rounded-xl font-bold text-sm flex items-center justify-center transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_20px_rgba(179,106,94,0.25)] hover:shadow-[0_12px_25px_rgba(179,106,94,0.35)]" style={{ backgroundColor: '#B36A5E', color: '#FFFFFF' }}>
            Sign In
          </button>
        </form>
        
        <p className="text-center mt-6 text-xs font-medium" style={{ color: '#857B70' }}>
          Don't have an account? <Link to="/register" className="hover:opacity-80 transition-opacity font-bold underline decoration-2 underline-offset-4" style={{ color: '#B36A5E' }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
