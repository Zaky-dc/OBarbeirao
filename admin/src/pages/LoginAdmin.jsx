import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Scissors, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginAdmin() {
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();
  const { setLogado } = useAuth();
  const BASE_URL ="https://o-barbeirao-back.vercel.app/api";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/admin/login`, {
        username,
        senha,
      });
      localStorage.setItem("token", res.data.token);
      setLogado(true);
      navigate("/");
    } catch {
      alert("Login inválido.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 bg-gray-900 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Scissors className="mx-auto h-10 w-auto text-indigo-500" />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
          Acesso Administrativo
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-100">
              Usuário
            </label>
            <div className="mt-2">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white placeholder:text-gray-500 outline outline-1 outline-white/10 focus:outline-2 focus:outline-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-100">
              Senha
            </label>
            <div className="mt-2 relative">
              <input
                id="senha"
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 pr-10 text-white placeholder:text-gray-500 outline outline-1 outline-white/10 focus:outline-2 focus:outline-indigo-500"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-2 top-2 text-white hover:text-indigo-300"
              >
                {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Entrar
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-400">
          Sistema exclusivo para administradores do Barbeirão.
        </p>
      </div>
    </div>
  );
}
