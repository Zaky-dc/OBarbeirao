require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const adminRoutes = require("./routes/admin");
const app = express();
const atendimentoRoutes = require("./routes/atendimentos");
const barbeiroRoutes = require("./routes/barbeiros")
const searchRoutes = require("./routes/search");



app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Erro ao conectar:", err));

app.use("/servicos", require("./routes/servicos"));
app.use("/checkin", require("./routes/checkin"));
app.use("/admin", adminRoutes);
app.use("/atendimentos", atendimentoRoutes);
app.use("/barbeiros",barbeiroRoutes)
app.use("/", searchRoutes);

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));