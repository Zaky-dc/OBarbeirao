import { Scissors, Phone, MapPin, Mail } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer id="contato" className="bg-black border-t border-amber-600/20 py-12 text-gray-400">
    <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Logo e missão */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 border-2 border-amber-600 rounded-full flex items-center justify-center">
            <Scissors className="w-6 h-6 text-amber-600" />
          </div>
          <span className="text-2xl font-bold text-amber-600 tracking-wider">O BARBEIRÃO</span>
        </div>
        <p className="text-sm leading-relaxed">
          Mais que cortes, criamos experiências. Estilo, tradição e acolhimento no coração de Maputo.
        </p>
      </div>
  
      {/* Contato */}
      <div className="space-y-2">
        <h4 className="text-amber-600 font-semibold mb-2">Contato</h4>
        <a href="tel:87 911 1730" className="flex items-center gap-2 hover:text-amber-600">
          <Phone className="w-5 h-5" /> 87 911 1730
        </a>
        <a href="mailto:grupobarbeirao@gmail.com" className="flex items-center gap-2 hover:text-amber-600">
          <Mail className="w-5 h-5" /> grupobarbeirao@gmail.com
        </a>
        <p className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-600" /> Maxaquene C, atrás do Shifaa
        </p>
      </div>
  
      {/* Horário */}
      <div className="space-y-2">
        <h4 className="text-amber-600 font-semibold mb-2">Horário</h4>
        <p>Seg–Sáb: 08h às 18h</p>
        <p>Domingo: 11h às 19h</p>
      </div>
  
      {/* Redes sociais */}
      <div className="space-y-2">
        <h4 className="text-amber-600 font-semibold mb-2">Redes</h4>
        <div className="flex gap-4">
          <a href="https://www.facebook.com/profile.php?id=61583135071095" className="hover:text-amber-600"><FaFacebookF /></a>
          <a href="https://www.instagram.com/grupo_barbeirao/" className="hover:text-amber-600"><FaInstagram /></a>
          <a href="https://wa.me/258879111730" className="hover:text-amber-600"><FaWhatsapp /></a>
        </div>
      </div>
    </div>
  
    {/* Linha final */}
    <div className="mt-8 border-t border-amber-600/20 pt-4 text-center text-sm text-gray-500">
      &copy; 2025 O Barbeirão. Todos os direitos reservados.
    </div>
  </footer>
  );
}
