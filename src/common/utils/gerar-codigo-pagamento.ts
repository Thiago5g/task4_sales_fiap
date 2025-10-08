let contadorSequencial = 0;

export function gerarCodigoPagamento(): string {
  contadorSequencial += 1;
  const agora = Date.now().toString(16).toUpperCase();
  const frag = agora.slice(-6).padStart(6, '0');
  return `PAG-${contadorSequencial}-${frag}`;
}

export function __resetarContadorPagamento() {
  contadorSequencial = 0;
}
