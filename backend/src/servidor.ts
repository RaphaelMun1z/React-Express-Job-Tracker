import { criarAplicacao } from "./app.js";

const porta = Number(process.env.PORT) || 3000;

criarAplicacao().listen(porta, () => {
  console.log(`API do TrackJobs disponível em http://localhost:${porta}`);
});
