import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { portfolioService } from '../services/portfolioService';
import { anonymousService } from '../services/anonymousService';
import { exportPortfolioJSON } from '../utils/exportJSON';
import { importPortfolioJSON } from '../utils/importJSON';
import GlassCard from '../components/GlassCard';
import Loading from '../components/Loading';
import { Plus, Upload, Download, Trash2, TrendingUp, TrendingDown, ChevronDown, ChevronRight } from 'lucide-react';

export default function Portfolio() {
  const { user, isAnonymous } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [cryptos, setCryptos] = useState([]);
  const [expandedCryptos, setExpandedCryptos] = useState({});
  const [newTransaction, setNewTransaction] = useState({
    symbol: '',
    quantity: '',
    price_paid: '',
    transaction_type: 'buy',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadPortfolio();
    loadCryptos();
  }, []);

  const loadCryptos = async () => {
    try {
      // Sempre usar a API real para criptomoedas
      const response = await portfolioService.getTopCryptos();
      setCryptos(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar criptomoedas:', error);
      // Fallback para dados simulados em caso de erro
      try {
        const fallbackResponse = await anonymousService.getTopCryptos();
        setCryptos(fallbackResponse.data || []);
      } catch (fallbackError) {
        console.error('Erro no fallback:', fallbackError);
      }
    }
  };

  const loadPortfolio = async () => {
    setLoading(true);
    try {
      if (isAnonymous) {
        const data = anonymousService.getPortfolio();
        setPortfolio(data);
        setTransactions(data.transactions || []);
      } else {
        // Para usuários logados, carregar do backend
        const portfolios = await portfolioService.getPortfolios();
        if (portfolios.length > 0) {
          setPortfolio(portfolios[0]);
          const txs = await portfolioService.getTransactions(portfolios[0].id);
          setTransactions(txs);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoSelect = (cryptoId) => {
    const selectedCrypto = cryptos.find(c => c.id === cryptoId);
    if (selectedCrypto) {
      setNewTransaction(prev => ({
        ...prev,
        symbol: selectedCrypto.symbol.toUpperCase(),
        price_paid: selectedCrypto.current_price.toString()
      }));
    }
  };

  const formatNumber = (num, decimals = 8) => {
    if (num === 0) return '0';
    if (num < 0.000001) {
      return num.toFixed(decimals);
    }
    return num.toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    });
  };

  const calculateTransactionTotal = () => {
    const quantity = parseFloat(newTransaction.quantity) || 0;
    const price = parseFloat(newTransaction.price_paid) || 0;
    return quantity * price;
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      if (isAnonymous) {
        const updatedPortfolio = anonymousService.addTransaction(newTransaction);
        setPortfolio(updatedPortfolio);
        setTransactions(updatedPortfolio.transactions);
      } else {
        // Para usuários logados, salvar no backend
        const transaction = await portfolioService.addTransaction(portfolio.id, newTransaction);
        setTransactions([...transactions, transaction]);
      }
      
      setNewTransaction({
        symbol: '',
        quantity: '',
        price_paid: '',
        transaction_type: 'buy',
        date: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      if (isAnonymous) {
        const updatedPortfolio = anonymousService.deleteTransaction(transactionId);
        setPortfolio(updatedPortfolio);
        setTransactions(updatedPortfolio.transactions);
      } else {
        await portfolioService.deleteTransaction(transactionId);
        setTransactions(transactions.filter(t => t.id !== transactionId));
      }
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
    }
  };

  const handleExport = () => {
    if (portfolio) {
      exportPortfolioJSON(portfolio);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await importPortfolioJSON(file);
      const importedPortfolio = {
        name: data.portfolio_name || 'Portfolio Importado',
        transactions: data.transactions
      };
      
      if (isAnonymous) {
        anonymousService.savePortfolio(importedPortfolio);
        setPortfolio(importedPortfolio);
        setTransactions(importedPortfolio.transactions);
      } else {
        // Para usuários logados, salvar no backend
        // Implementar lógica de importação para backend
        console.log('Importação para usuários logados não implementada ainda');
      }
    } catch (error) {
      alert(`Erro ao importar: ${error.message}`);
    }
  };

  const calculateTotalValue = () => {
    return transactions.reduce((total, tx) => {
      const quantity = parseFloat(tx.quantity);
      const price = parseFloat(tx.price_paid);
      const isBuy = tx.transaction_type === 'buy';
      
      if (isBuy) {
        return total + (quantity * price);
      } else {
        // Para vendas, subtrair o valor
        return total - (quantity * price);
      }
    }, 0);
  };

  const calculateCurrentValue = () => {
    // Primeiro, calcular a quantidade líquida por criptomoeda
    const netQuantities = transactions.reduce((acc, tx) => {
      const symbol = tx.symbol.toUpperCase();
      const quantity = parseFloat(tx.quantity);
      const isBuy = tx.transaction_type === 'buy';
      
      if (!acc[symbol]) {
        acc[symbol] = 0;
      }
      
      if (isBuy) {
        acc[symbol] += quantity;
      } else {
        acc[symbol] -= quantity;
      }
      
      return acc;
    }, {});
    
    // Calcular o valor atual baseado nas quantidades líquidas
    return Object.entries(netQuantities).reduce((total, [symbol, quantity]) => {
      if (quantity > 0) {
        const crypto = cryptos.find(c => c.symbol.toUpperCase() === symbol);
        if (crypto) {
          return total + (quantity * crypto.current_price);
        }
      }
      return total;
    }, 0);
  };

  const calculateAppreciationPercentage = () => {
    const investedValue = calculateTotalValue();
    const currentValue = calculateCurrentValue();
    if (investedValue === 0) return 0;
    return ((currentValue - investedValue) / investedValue) * 100;
  };

  const toggleCryptoExpansion = (symbol) => {
    setExpandedCryptos(prev => ({
      ...prev,
      [symbol]: !prev[symbol]
    }));
  };

  const groupTransactionsByCrypto = () => {
    const grouped = transactions.reduce((acc, tx) => {
      const symbol = tx.symbol.toUpperCase();
      if (!acc[symbol]) {
        acc[symbol] = {
          symbol,
          transactions: [],
          totalQuantity: 0,
          totalInvested: 0,
          avgPrice: 0
        };
      }
      
      acc[symbol].transactions.push(tx);
      
      // Considerar o tipo de transação: compra (+) ou venda (-)
      const quantity = parseFloat(tx.quantity);
      const isBuy = tx.transaction_type === 'buy';
      
      if (isBuy) {
        acc[symbol].totalQuantity += quantity;
        acc[symbol].totalInvested += quantity * parseFloat(tx.price_paid);
      } else {
        // Para vendas, subtrair a quantidade e o valor investido
        acc[symbol].totalQuantity -= quantity;
        acc[symbol].totalInvested -= quantity * parseFloat(tx.price_paid);
      }
      
      // Calcular preço médio apenas se houver quantidade positiva
      if (acc[symbol].totalQuantity > 0) {
        acc[symbol].avgPrice = acc[symbol].totalInvested / acc[symbol].totalQuantity;
      } else {
        acc[symbol].avgPrice = 0;
      }
      
      return acc;
    }, {});
    
    // Filtrar apenas criptomoedas com quantidade positiva
    return Object.values(grouped)
      .filter(crypto => crypto.totalQuantity > 0)
      .sort((a, b) => b.totalInvested - a.totalInvested);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {portfolio?.name || 'Meu Portfolio'}
          </h1>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Adicionar Transação
            </button>
            
            <label className="btn-secondary flex items-center gap-2 cursor-pointer">
              <Upload size={20} />
              Importar
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            
            <button
              onClick={handleExport}
              className="btn-secondary flex items-center gap-2"
            >
              <Download size={20} />
              Exportar
            </button>
          </div>
        </div>

        {/* Resumo do Portfolio */}
        <GlassCard className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Resumo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Valor Total Investido</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--accent-blue)' }}>
                $ {calculateTotalValue().toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Valor Atual</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--accent-green)' }}>
                $ {calculateCurrentValue().toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Valorização</p>
              <p className={`text-3xl font-bold ${calculateAppreciationPercentage() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {calculateAppreciationPercentage() >= 0 ? '+' : ''}{calculateAppreciationPercentage().toFixed(2)}%
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Formulário de Nova Transação */}
        {showForm && (
          <GlassCard className="mb-8">
            <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
              Nova Transação
            </h3>
            <form onSubmit={handleAddTransaction} className="space-y-6">
              {/* Primeira linha: Criptomoeda e Tipo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Criptomoeda
                  </label>
                  <div className="relative">
                    <select
                      value={cryptos.find(c => c.symbol.toUpperCase() === newTransaction.symbol)?.id || ''}
                      onChange={(e) => handleCryptoSelect(e.target.value)}
                      className="input-field appearance-none pr-10"
                      required
                    >
                      <option value="">Selecione uma criptomoeda</option>
                      {cryptos.map((crypto) => (
                        <option key={crypto.id} value={crypto.id}>
                          {crypto.symbol.toUpperCase()} - {crypto.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Tipo de Transação
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setNewTransaction({...newTransaction, transaction_type: 'buy'})}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                        newTransaction.transaction_type === 'buy' 
                          ? 'bg-green-500 text-white' 
                          : 'glass-morphism text-gray-400 hover:text-white'
                      }`}
                    >
                      Compra
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewTransaction({...newTransaction, transaction_type: 'sell'})}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                        newTransaction.transaction_type === 'sell' 
                          ? 'bg-red-500 text-white' 
                          : 'glass-morphism text-gray-400 hover:text-white'
                      }`}
                    >
                      Venda
                    </button>
                  </div>
                </div>
              </div>

              {/* Segunda linha: Preço e Quantidade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Preço Atual (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newTransaction.price_paid}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Validar se é um número positivo
                      if (value === '' || (parseFloat(value) >= 0 && !isNaN(parseFloat(value)))) {
                        setNewTransaction({...newTransaction, price_paid: value});
                      }
                    }}
                    className="input-field"
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Quantidade
                  </label>
                  <input
                    type="number"
                    step="0.00000001"
                    min="0"
                    value={newTransaction.quantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Validar se é um número positivo
                      if (value === '' || (parseFloat(value) >= 0 && !isNaN(parseFloat(value)))) {
                        setNewTransaction({...newTransaction, quantity: value});
                      }
                    }}
                    className="input-field"
                    placeholder="0.00000000"
                    required
                  />
                </div>
              </div>

              {/* Terceira linha: Valor Total e Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Valor Total (USD)
              </label>
              <div className="input-field bg-transparent border-dashed text-lg font-bold" style={{ color: 'var(--accent-blue)' }}>
                $ {calculateTransactionTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Data
                  </label>
                  <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              
              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Adicionar Transação
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </GlassCard>
        )}

        {/* Lista de Transações Agrupadas por Moeda */}
        <GlassCard>
          <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Portfolio por Criptomoeda
          </h3>
          
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Nenhuma transação encontrada. Adicione sua primeira transação!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupTransactionsByCrypto().map((cryptoGroup) => (
                <div key={cryptoGroup.symbol} className="glass-morphism rounded-xl p-6">
                  {/* Cabeçalho da Criptomoeda */}
                  <div 
                    className="flex justify-between items-center mb-4 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-all duration-200"
                    onClick={() => toggleCryptoExpansion(cryptoGroup.symbol)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`transform transition-transform duration-200 ${expandedCryptos[cryptoGroup.symbol] ? 'rotate-90' : ''}`}>
                        <ChevronRight size={20} style={{ color: 'var(--text-secondary)' }} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                          {cryptoGroup.symbol}
                        </h4>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {cryptoGroup.transactions.length} transação(ões)
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold" style={{ color: 'var(--accent-blue)' }}>
                        {formatNumber(cryptoGroup.totalQuantity)} {cryptoGroup.symbol}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        $ {cryptoGroup.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Preço médio: $ {cryptoGroup.avgPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  {/* Lista de Transações da Criptomoeda */}
                  {expandedCryptos[cryptoGroup.symbol] && (
                    <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-3 text-sm" style={{ color: 'var(--text-primary)' }}>Tipo</th>
                          <th className="text-left py-2 px-3 text-sm" style={{ color: 'var(--text-primary)' }}>Quantidade</th>
                          <th className="text-left py-2 px-3 text-sm" style={{ color: 'var(--text-primary)' }}>Preço (USD)</th>
                          <th className="text-left py-2 px-3 text-sm" style={{ color: 'var(--text-primary)' }}>Total (USD)</th>
                          <th className="text-left py-2 px-3 text-sm" style={{ color: 'var(--text-primary)' }}>Data</th>
                          <th className="text-center py-2 px-3 text-sm" style={{ color: 'var(--text-primary)' }}>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cryptoGroup.transactions.map((transaction) => {
                          const totalValue = parseFloat(transaction.quantity) * parseFloat(transaction.price_paid);
                          const isBuy = transaction.transaction_type === 'buy';
                          return (
                            <tr key={transaction.id} className="border-b border-white/5 hover:bg-white/5">
                              <td className="py-2 px-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  isBuy 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {isBuy ? 'Compra' : 'Venda'}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {formatNumber(parseFloat(transaction.quantity))}
                              </td>
                              <td className="py-2 px-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                $ {parseFloat(transaction.price_paid).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-2 px-3 text-sm font-medium" style={{ color: 'var(--accent-blue)' }}>
                                $ {totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-2 px-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {new Date(transaction.date || transaction.created_at).toLocaleDateString('pt-BR')}
                              </td>
                              <td className="py-2 px-3 text-center">
                                <button
                                  onClick={() => handleDeleteTransaction(transaction.id)}
                                  className="p-1 rounded-full hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                                  title="Deletar transação"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
