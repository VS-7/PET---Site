import React, { useState } from 'react';
import { useAuthentication } from '../../hooks/useAuthentication';
import { FaGoogle } from "react-icons/fa";
import styles from './Modal.module.css'

const Register = ({ onClose }) => {
  const { createUser, error, loading } = useAuthentication();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser({ email, password, displayName });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Cadastro</h2>
      <input
        type="text"
        placeholder="Nome"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading} className={styles.button}>
        {loading ? 'Carregando...' : 'Cadastrar'}
      </button>
      {error && <p>{error}</p>}
      <button type="button" onClick={handleGoogleLogin} disabled={loading} className={styles.googleButton}>
        <FaGoogle />
        {loading ? 'Carregando...' : 'Entrar com Google'}
      </button>
    </form>
  );
};

export default Register;
