import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { navigate } = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData);
    if (result.success) {
      const userRole = result.data.role.toLowerCase();
      switch (userRole) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'manager':
          navigate('/manager/dashboard');
          break;
        case 'employee':
        default:
          navigate('/employee/dashboard');
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div>
          <h2 className="login-heading">Sign In</h2>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <div>
            <label htmlFor="username" className="login-label">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="login-input"
            />
          </div>

          <div>
            <label htmlFor="password" className="login-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="login-input"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="login-button"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          <div className="login-footer">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="signup-link"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
