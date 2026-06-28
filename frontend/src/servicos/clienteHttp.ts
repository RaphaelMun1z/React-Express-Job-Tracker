const CHAVE_TOKEN = "trackjobs-token";

export const armazenamentoToken = {
  obter: () => localStorage.getItem(CHAVE_TOKEN),
  salvar: (token: string) => localStorage.setItem(CHAVE_TOKEN, token),
  remover: () => localStorage.removeItem(CHAVE_TOKEN)
};

export async function requisitar<T>(
  endereco: string,
  opcoes?: RequestInit
): Promise<T> {
  const token = armazenamentoToken.obter();
  const resposta = await fetch(endereco, {
    ...opcoes,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opcoes?.headers
    }
  });

  if (!resposta.ok) {
    const erro = await resposta.json()
      .catch(() => ({ mensagem: "Erro de comunicação com o servidor." }));
    if (resposta.status === 401 && token) {
      armazenamentoToken.remover();
      window.dispatchEvent(new Event("sessao-expirada"));
    }
    throw new Error(erro.mensagem);
  }

  return resposta.status === 204 ? undefined as T : resposta.json();
}
