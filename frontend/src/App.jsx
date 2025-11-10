import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import MeusAgendamentos from "./components/MeusAgendamentos";
import CheckinPresencial from "./components/CheckinPresencial"

export default function App() {
  const [carrinho, setCarrinho] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [toast, setToast] = useState(null);

  const handleCarrinhoClick = () => {
    const checkout = document.getElementById("checkout");
    if (carrinho.length > 0 && checkout) {
      checkout.scrollIntoView({ behavior: "smooth" });
    } else {
      setToast({ mensagem: "Adicione serviços antes de agendar!", tipo: "info" });
    }
  };

  return (
    <Router>
      <div className="bg-black text-white">
        <Header
          carrinho={carrinho}
          onCarrinhoClick={handleCarrinhoClick}
        />

        <Routes>
          <Route
            path="/"
            element={
              <Home
                carrinho={carrinho}
                setCarrinho={setCarrinho}
                mostrarForm={mostrarForm}
                setMostrarForm={setMostrarForm}
                toast={toast}
                setToast={setToast}
                handleCarrinhoClick={handleCarrinhoClick}
              />
            }
          />
          <Route path="/meus-agendamentos" element={<MeusAgendamentos />} />
          <Route path="/checkin-presencial" element={<CheckinPresencial />} />
        </Routes>
        <a
  href="https://wa.me/258879111730?text=Olá%2C%20quero%20agendar%20um%20corte"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-6 right-6 z-50"
>
  <div className="relative">
    {/* Pulse suave */}
    <span className="absolute inset-0 rounded-full bg-green-500 opacity-30 animate-pulse scale-110 blur-sm"></span>

    {/* Botão principal */}
    <div className="relative bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20.52 3.48A11.78 11.78 0 0012 0C5.37 0 0 5.37 0 12a11.8 11.8 0 001.64 6L0 24l6.26-1.64A11.8 11.8 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.18-3.48-8.52zM12 22a9.94 9.94 0 01-5.1-1.4l-.36-.22-3.7.97.99-3.6-.24-.37A9.94 9.94 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.4-7.6c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.34.22-.63.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.5.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.9-2.2-.24-.6-.48-.52-.66-.52h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.23 5.14 4.53.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.34z" />
      </svg>
      WhatsApp
    </div>
  </div>
</a>


      </div>
    </Router>
  );
}
