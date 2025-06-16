// Exemplo de função para buscar dados da API
export async function getInquilinos() {
  const response = await fetch('http://localhost:3000/inquilinos');
  const data = await response.json();
  return data;
}
