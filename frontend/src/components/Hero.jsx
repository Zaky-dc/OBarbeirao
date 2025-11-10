export default function Hero({ carrinho }) {
  const handleAgendarClick = () => {
    const destino = carrinho.length > 0 ? "checkout" : "servicos";
    const secao = document.getElementById(destino);
    if (secao) {
      secao.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  
  

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20">
      {/* Gradiente e imagem de fundo */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=1920')",
          filter: "brightness(0.4)",
        }}
      ></div>

      {/* Conteúdo */}
      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-amber-600 tracking-wider">
            O BARBEIRÃO
          </h1>
          <p className="text-3xl md:text-4xl font-light mb-8 text-amber-500 tracking-wide">
            SALÃO DE CORTE
          </p>
          <button
  onClick={handleAgendarClick}
  className="bg-amber-600 hover:bg-amber-700 text-black font-bold py-4 px-8 text-lg tracking-wider transition-all transform hover:scale-105"
>
  AGENDAR CORTE
</button>
        </div>
      </div>
    </section>
  );
}