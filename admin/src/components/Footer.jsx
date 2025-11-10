import { Scissors, Phone, MapPin, Mail } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer id="contato" className="bg-gray-900 border-t border-indigo-500/20 py-12 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Logo e missão */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 border-2 border-indigo-500 rounded-full flex items-center justify-center">
              <Scissors className="w-6 h-6 text-indigo-500" />
            </div>
            <span className="text-2xl font-bold text-indigo-500 tracking-wide">O BARBEIRÃO</span>
          </div>
          <p className="text-sm leading-relaxed font-medium">
            Mais que cortes, criamos experiências. Estilo, tradição e acolhimento no coração de Maputo.
          </p>
        </div>

        {/* Contato */}
        <div className="space-y-2">
          <h4 className="text-indigo-500 font-semibold mb-2">Contato</h4>
          <a href="tel:84 682 4465" className="flex items-center gap-2 hover:text-indigo-300">
            <Phone className="w-5 h-5" /> 84 682 4465
          </a>
          <a href="mailto:grupobarbeirao@gmail.com" className="flex items-center gap-2 hover:text-indigo-300">
            <Mail className="w-5 h-5" /> grupobarbeirao@gmail.com
          </a>
          <p className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-500" /> Maxaquene C, atrás do Shifaa
          </p>
        </div>

        {/* Horário */}
        <div className="space-y-2">
          <h4 className="text-indigo-500 font-semibold mb-2">Horário</h4>
          <p>Seg–Sáb: 08h às 18h</p>
          <p>Domingo: fechado</p>
        </div>

        {/* Redes sociais */}
        <div className="space-y-2">
          <h4 className="text-indigo-500 font-semibold mb-2">Redes</h4>
          <div className="flex gap-4 text-lg">
            <a href="https://www.facebook.com/profile.php?id=61583135071095" className="hover:text-indigo-300"><FaFacebookF /></a>
            <a href="https://www.instagram.com/grupo_barbeirao/" className="hover:text-indigo-300"><FaInstagram /></a>
            <a href="https://wa.me/258879111730" className="hover:text-indigo-300"><FaWhatsapp /></a>
          </div>
        </div>
      </div>

      {/* Linha final */}
      <div className="mt-10 border-t border-indigo-500/20 pt-4 text-center text-sm text-gray-500">
        &copy; 2025 O Barbeirão. Todos os direitos reservados.
      </div>
    </footer>
  );
}
