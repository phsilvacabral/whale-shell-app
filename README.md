# 🐋 Whale Shell App

Frontend principal do sistema Whale para gerenciamento de portfólio de criptomoedas.

## 🚀 Deploy no Azure Static Web Apps

### **Configuração de Variáveis de Ambiente**

No Azure Portal, configure as seguintes variáveis de ambiente:

```bash
# URLs dos serviços
VITE_BFF_URL=https://whale-bff.azurewebsites.net
VITE_DASHBOARD_URL=https://red-desert-069ed9f0f.3.azurestaticapps.net
```

### **Estrutura do Projeto**

```
shell-app/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── context/        # Contextos React (Auth, Theme)
│   ├── pages/          # Páginas da aplicação
│   ├── services/       # Serviços de API
│   └── utils/          # Utilitários
├── .github/workflows/  # GitHub Actions
└── staticwebapp.config.json  # Configuração do Azure
```

### **Funcionalidades**

- ✅ **Autenticação**: Login/Registro de usuários
- ✅ **Modo Anônimo**: Uso sem cadastro
- ✅ **Portfolio**: Gerenciamento de transações
- ✅ **Dashboard**: Iframe com criptomoedas em tempo real
- ✅ **Tema**: Dark/Light mode
- ✅ **Responsivo**: Mobile-first design

### **Tecnologias**

- **React 18** com Vite
- **Tailwind CSS** para estilização
- **React Router DOM** para navegação
- **Axios** para requisições HTTP
- **Lucide React** para ícones

### **Deploy Automático**

O deploy é feito automaticamente via GitHub Actions quando há push na branch `main`.

### **URLs de Produção**

- **Shell App**: `https://whale-shell-app.azurestaticapps.net`
- **BFF**: `https://whale-bff.azurewebsites.net`
- **Dashboard MFE**: `https://red-desert-069ed9f0f.3.azurestaticapps.net`
