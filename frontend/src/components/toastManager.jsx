// toastManager.js
import { createRoot } from "react-dom/client";
import Toast from "./Toast";

export function showToast(mensagem, tipo = "sucesso") {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = createRoot(container);

  const remove = () => {
    root.unmount();
    container.remove();
  };

  root.render(<Toast mensagem={mensagem} tipo={tipo} onClose={remove} />);
}
