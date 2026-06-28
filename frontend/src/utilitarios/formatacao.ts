export function dataRelativa(valor: string, somenteData = false) {
  const data = somenteData ? new Date(`${valor}T12:00:00`) : new Date(valor);
  const agora = new Date();
  const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const alvo = new Date(data.getFullYear(), data.getMonth(), data.getDate());
  const dias = Math.floor((+hoje - +alvo) / 86400000);
  if (dias <= 0) return "hoje";
  if (dias === 1) return "ontem";
  if (dias < 7) return `há ${dias} dias`;
  return `em ${data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}`;
}

export const formatarData = (valor: string) => new Date(`${valor}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
export const formatarDataHora = (valor: string) => new Date(valor).toLocaleString("pt-BR", { dateStyle: "medium", timeStyle: "short" });
export const slug = (valor: string) => valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
export const iniciais = (valor: string) => valor.split(/\s+/).filter(Boolean).slice(0, 2).map(item => item[0]).join("").toUpperCase() || "TJ";
export const gradiente = (valor: string) => {
  const paletas = [["#fb923c", "#ea580c"], ["#f59e0b", "#c2410c"], ["#fdba74", "#e85d04"], ["#f97316", "#9a3412"]];
  const codigo = [...valor].reduce((total, caractere) => total + caractere.charCodeAt(0), 0);
  const paleta = paletas[codigo % paletas.length]!;
  return `linear-gradient(135deg, ${paleta[0]}, ${paleta[1]})`;
};

export function baixarArquivo(conteudo: BlobPart[], nome: string, tipo: string) {
  const endereco = URL.createObjectURL(new Blob(conteudo, { type: tipo }));
  const link = document.createElement("a");
  link.href = endereco;
  link.download = nome;
  link.click();
  URL.revokeObjectURL(endereco);
}
