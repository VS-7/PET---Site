import { useState } from "react";
import { useAuthentication } from "../hooks/useAuthentication";
import styles from "./ResetPassword.module.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { resetPassword } = useAuthentication();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await resetPassword(email);
      setMessage("Verifique seu e-mail para instruções de redefinição de senha.");
    } catch (error) {
      let errorMessage = "Falha ao redefinir a senha. Por favor, tente novamente.";
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "O e-mail fornecido é inválido. Por favor, verifique e tente novamente.";
          break;
        case "auth/user-not-found":
          errorMessage = "Não foi possível encontrar uma conta com este e-mail. Por favor, verifique o e-mail digitado.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Bloqueamos todas as solicitações deste dispositivo devido a atividades incomuns. Tente novamente mais tarde.";
          break;
        // Inclua outros códigos de erro conforme necessário
        default:
          // Mantém a mensagem de erro genérica caso não seja um dos erros acima
          break;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className={styles.reset}>
       <img src="../../../public/IF.svg" alt="" />
      <h2>Redefinir Senha</h2>
      <p>Forneça seu e-mail para redefinição de senha</p>
        <form onSubmit={handleSubmit}>
            <label>
            <span>E-mail:</span>
            <input
                type="email"
                name="email"
                required
                placeholder="E-mail para redefinição de senha"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            </label>
            <button className="btn">Enviar</button>
            {error && <p className="error">{error}</p>}
            {message && <p className="success">{message}</p>}
        </form>
    </div>
  );
};

export default ResetPassword;