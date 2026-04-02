import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { Activity } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirm) {
      return setError('Passwords do not match');
    }
    
    try {
      await client.post('/auth/register', { name, email, password });
      // auto login
      const res = await client.post('/auth/login', { email, password });
      login(res.data.access_token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]+/)) strength += 25;
    if (password.match(/[A-Z]+/)) strength += 25;
    if (password.match(/[0-9]+/) || password.match(/[^a-zA-Z0-9]+/)) strength += 25;
    return strength;
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary py-12" style={{ backgroundImage: 'radial-gradient(circle at center, #1C1C27 0%, #0A0A0F 100%)' }}>
      <div className="max-w-md w-full bg-card p-8 rounded-3xl border border-subtle relative overflow-hidden" style={{ boxShadow: '0 0 40px rgba(107, 170, 255, 0.1)' }}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-happy via-neon-fitness to-neon-wealth"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-neon-happy to-neon-fitness flex items-center justify-center text-primary mb-4 shadow-[0_0_20px_rgba(107,170,255,0.5)]">
            <Activity size={32} />
          </div>
          <h2 className="text-3xl font-display font-bold text-primary tracking-wide">INITIALIZE LIFE OS</h2>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-neon-health p-3 rounded-xl mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-secondary mb-2 text-sm uppercase tracking-wider font-bold">Designation (Name)</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-bg-elevated border border-subtle rounded-xl p-4 text-primary focus:outline-none focus:border-neon-happy transition-colors placeholder-gray-600"
              placeholder="Commander"
              required 
            />
          </div>
          <div>
            <label className="block text-secondary mb-2 text-sm uppercase tracking-wider font-bold">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-bg-elevated border border-subtle rounded-xl p-4 text-primary focus:outline-none focus:border-neon-happy transition-colors placeholder-gray-600"
              placeholder="you@example.com"
              required 
            />
          </div>
          <div>
            <label className="block text-secondary mb-2 text-sm uppercase tracking-wider font-bold">Access Code (Password)</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-bg-elevated border border-subtle rounded-xl p-4 text-primary focus:outline-none focus:border-neon-happy transition-colors placeholder-gray-600"
              placeholder="••••••••"
              required 
            />
            {password && (
              <div className="mt-2 flex gap-1 h-1 w-full bg-bg-elevated rounded overflow-hidden">
                <div className={`h-full ${strength >= 25 ? 'bg-neon-health' : 'bg-transparent'} transition-all`} style={{ width: '25%' }}></div>
                <div className={`h-full ${strength >= 50 ? 'bg-neon-wealth' : 'bg-transparent'} transition-all`} style={{ width: '25%' }}></div>
                <div className={`h-full ${strength >= 75 ? 'bg-neon-happy' : 'bg-transparent'} transition-all`} style={{ width: '25%' }}></div>
                <div className={`h-full ${strength === 100 ? 'bg-neon-fitness' : 'bg-transparent'} transition-all`} style={{ width: '25%' }}></div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-secondary mb-2 text-sm uppercase tracking-wider font-bold">Confirm Access Code</label>
            <input 
              type="password" 
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full bg-bg-elevated border border-subtle rounded-xl p-4 text-primary focus:outline-none focus:border-neon-happy transition-colors placeholder-gray-600"
              placeholder="••••••••"
              required 
            />
          </div>
          
          <button type="submit" className="w-full bg-neon-happy text-primary font-bold py-4 rounded-xl hover:opacity-90 transition-opacity font-display text-lg mt-6 shadow-[0_4px_14px_rgba(107,170,255,0.4)] hover:shadow-[0_6px_20px_rgba(107,170,255,0.6)]">
            Create Account
          </button>
        </form>
        
        <p className="text-secondary text-center mt-8">
          Already active? <Link to="/login" className="text-neon-happy hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}
