// Home.jsx
import Hero from "./Hero";
import Catalogo from "./Catalogo";
import Gallery from "./Gallery";
import Footer from "./Footer";
import Checkout from "./Checkout";
import AgendamentoForm from "./AgendamentoForm";
import Toast from "./Toast";

export default function Home({
  carrinho,
  setCarrinho,
  mostrarForm,
  setMostrarForm,
  toast,
  setToast,
  handleCarrinhoClick,
}) {
  return (
    <>
      <Hero carrinho={carrinho} onAgendarClick={() => setMostrarForm(true)} />

      <section id="servicos" className="py-20 px-6">
        <h2 className="text-4xl font-bold text-amber-600 mb-8 text-center tracking-wider">
          Catálogo de Serviços
        </h2>
        <Catalogo carrinho={carrinho} setCarrinho={setCarrinho} />
      </section>

      <section id="galeria">
        <Gallery />
      </section>

      <section id="contato" className="py-20 px-6 bg-black">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-amber-600 mb-4">Contato</h2>
          <p className="text-gray-400 mb-6">
            Para dúvidas ou sugestões, entre em contato pelo WhatsApp ou visite-nos pessoalmente.
          </p>
          <a
            href="https://wa.me/258879111730"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-600 text-black px-6 py-3 rounded hover:bg-amber-700 transition"
          >
            Falar pelo WhatsApp
          </a>
        </div>
      </section>

      {carrinho.length > 0 && (
        <section id="checkout">
          <Checkout carrinho={carrinho} setCarrinho={setCarrinho} />
        </section>
      )}

      {mostrarForm && (
        <AgendamentoForm
          carrinho={carrinho}
          setCarrinho={setCarrinho}
          onClose={() => setMostrarForm(false)}
        />
      )}

      {toast && (
        <Toast
          mensagem={toast.mensagem}
          tipo={toast.tipo}
          onClose={() => setToast(null)}
        />
      )}

      <Footer />
    </>
  );
}