function calcularMedia(avaliacoes) {
    if (avaliacoes.length === 0) return 0;  // Retorna 0 se não houver avaliações

    const soma = avaliacoes.reduce((acc, val) => acc + val, 0); // Soma todos os valores
    const media = soma / avaliacoes.length; // Divide a soma pelo número de avaliações para obter a média

    return media; // Retorna a média calculada
}