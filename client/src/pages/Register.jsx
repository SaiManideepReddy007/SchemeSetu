import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { registerUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import LanguagePicker from '../components/LanguagePicker';

function Register() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await registerUser(formData.name, formData.email, formData.password);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || t('auth.genericError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <LanguagePicker compact />
        <h1>{t('auth.registerTitle')}</h1>
        <p className="auth-subtitle">{t('auth.registerSubtitle')}</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            {t('auth.fullName')}
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            {t('auth.email')}
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>
          <label>
            {t('auth.password')}
            <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} />
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
          </button>
        </form>

        <p className="auth-switch">
          {t('auth.alreadyHaveAccount')} <Link to="/login">{t('auth.logIn')}</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;