export async function importPortfolioJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Validar estrutura
        if (!data.transactions || !Array.isArray(data.transactions)) {
          throw new Error('Estrutura inválida: falta array de transações');
        }

        // Validar cada transação
        data.transactions.forEach((t, index) => {
          if (!t.symbol || !t.quantity || !t.price_paid) {
            throw new Error(`Transação ${index + 1} inválida: faltam campos obrigatórios`);
          }
        });

        resolve(data);
      } catch (error) {
        reject(new Error(`Erro ao processar arquivo: ${error.message}`));
      }
    };

    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsText(file);
  });
}
