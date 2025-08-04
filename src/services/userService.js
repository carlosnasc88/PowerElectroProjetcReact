// Simulação com localStorage (pode ser trocado por API real)
const STORAGE_KEY = "usuarios";

// Obter todos os usuários
export function getUsuarios() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// Criar novo usuário
export function criarUsuario(novoUsuario) {
  const usuarios = getUsuarios();
  usuarios.push(novoUsuario);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
}

// Atualizar usuário (por email como ID)
export function editarUsuario(email, dadosAtualizados) {
  const usuarios = getUsuarios();
  const index = usuarios.findIndex((u) => u.email === email);
  if (index !== -1) {
    usuarios[index] = { ...usuarios[index], ...dadosAtualizados };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
  }
}

// Deletar usuário
export function deletarUsuario(email) {
  const usuarios = getUsuarios().filter((u) => u.email !== email);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
}
