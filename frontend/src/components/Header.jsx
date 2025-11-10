import { useEffect, useState } from "react";
import { Scissors, Menu, X, ShoppingCart, UserCheck } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function Header({ carrinho, onCarrinhoClick }) {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const sections = ["home", "servicos", "galeria", "contato"];

  const navigate = useNavigate();
  const location = useLocation();

  // Scroll inteligente para seções
  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Detecta seção visível
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveSection(visible.target.id);
      },
      { threshold: 0.4 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
  to="/"
  className="flex items-center gap-3 hover:opacity-90 transition-all"
>
  <div className="w-10 h-10 border-2 border-amber-600 rounded-full flex items-center justify-center">
    <Scissors className="w-5 h-5 text-amber-600" />
  </div>
  <span className="text-xl font-bold text-amber-600 tracking-wider">
    O BARBEIRÃO
  </span>
</Link>


          {/* Menu Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {sections.map((sec) => (
              <button
                key={sec}
                onClick={() => scrollToSection(sec)}
                className={`cursor-pointer transition-colors ${
                  activeSection === sec
                    ? "text-amber-600"
                    : "text-white hover:text-amber-600"
                }`}
              >
                {sec.charAt(0).toUpperCase() + sec.slice(1)}
              </button>
            ))}

            {/* Link para Meus Agendamentos */}
            <Link
              to="/meus-agendamentos"
              className="flex items-center gap-2 text-white hover:text-amber-500 transition"
            >
              <UserCheck className="w-5 h-5 text-amber-500" />
              <span>Meus Agendamentos</span>
            </Link>

            {/* *Check-in presencial*/}

            <Link
              to="/checkin-presencial"
              className="flex items-center gap-2 text-white hover:text-amber-500 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4h4v4H4V4zm0 6h4v4H4v-4zm6-6h4v4h-4V4zm6 0h4v4h-4V4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"
                />
              </svg>
              <span>Check-in Presencial</span>
            </Link>

            {/* Carrinho */}
            <div
              onClick={onCarrinhoClick}
              className="cursor-pointer flex items-center gap-1 text-white hover:text-amber-500 transition"
            >
              <ShoppingCart className="w-5 h-5 text-amber-600" />
              <span>{carrinho.length}</span>
            </div>
          </nav>

          {/* Menu Mobile */}
          <div className="lg:hidden flex items-center gap-4">
            <div
              onClick={onCarrinhoClick}
              className="cursor-pointer flex items-center gap-1 text-white hover:text-amber-500 transition"
            >
              <ShoppingCart className="w-5 h-5 text-amber-600" />
              <span>{carrinho.length}</span>
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white"
              aria-label="Abrir menu"
            >
              {menuOpen ? (
                <X className="w-6 h-6 text-amber-600" />
              ) : (
                <Menu className="w-6 h-6 text-amber-600" />
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile Expandido */}
        {menuOpen && (
          <div className="lg:hidden mt-4 flex flex-col items-center gap-4 bg-black/90 backdrop-blur-sm py-4 rounded-lg">
            {sections.map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  scrollToSection(sec);
                  setMenuOpen(false);
                }}
                className={`text-lg ${
                  activeSection === sec
                    ? "text-amber-600"
                    : "text-white hover:text-amber-600"
                }`}
              >
                {sec.charAt(0).toUpperCase() + sec.slice(1)}
              </button>
            ))}

            <Link
              to="/meus-agendamentos"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-white hover:text-amber-500 transition"
            >
              <UserCheck className="w-5 h-5 text-amber-500" />
              <span>Meus Agendamentos</span>
            </Link>
            <Link
              to="/checkin-presencial"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-white hover:text-amber-500 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4h4v4H4V4zm0 6h4v4H4v-4zm6-6h4v4h-4V4zm6 0h4v4h-4V4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"
                />
              </svg>
              <span>Check-in Presencial</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
