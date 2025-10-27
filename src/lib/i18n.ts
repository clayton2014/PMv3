import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Traduções em português
const ptBR = {
  translation: {
    // Autenticação
    auth: {
      title: 'PrintManager Pro',
      subtitle: 'Gestão de Impressões',
      login: 'Login',
      register: 'Cadastro',
      name: 'Nome Completo',
      email: 'Email',
      phone: 'Telefone',
      password: 'Senha',
      enterName: 'Digite seu nome completo',
      enterEmail: 'Digite seu email',
      enterPhone: 'Digite seu telefone',
      enterPassword: 'Digite sua senha',
      signIn: 'Entrar',
      signUp: 'Cadastrar',
      signingIn: 'Entrando...',
      signingUp: 'Cadastrando...',
      noAccount: 'Não tem uma conta?',
      hasAccount: 'Já tem uma conta?',
      registerHere: 'Cadastre-se aqui',
      loginHere: 'Faça login aqui',
      registerSuccess: 'Cadastro realizado com sucesso! Faça login para continuar.',
      userDataError: 'Erro ao carregar dados do usuário'
    },
    // Navegação
    nav: {
      dashboard: 'Dashboard',
      newService: 'Novo Serviço',
      materials: 'Materiais',
      reports: 'Relatórios',
      hello: 'Olá',
      logout: 'Sair'
    },
    // Dashboard
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Visão geral dos seus serviços e resultados',
      services: 'Serviços',
      revenue: 'Receita',
      profit: 'Lucro',
      margin: 'Margem',
      totalServices: 'Total de serviços',
      totalSales: 'Total em vendas',
      totalProfit: 'Lucro total',
      averageMargin: 'Margem média',
      recentServices: 'Serviços Recentes',
      noServices: 'Nenhum serviço encontrado',
      createFirst: 'Comece criando seu primeiro serviço!',
      service: 'Serviço',
      material: 'Material',
      ink: 'Tinta',
      cost: 'Custo',
      sale: 'Venda',
      date: 'Data',
      allPeriods: 'Todos os períodos',
      lastWeek: 'Última semana',
      lastMonth: 'Último mês',
      loading: 'Carregando...'
    },
    // Formulário de Serviço
    service: {
      title: 'Novo Serviço',
      subtitle: 'Calcule custos e margem de lucro',
      serviceName: 'Nome do Serviço',
      serviceNamePlaceholder: 'Ex: Banner 2x1m',
      enterServiceName: 'Digite o nome do serviço',
      selectMaterial: 'Selecione um material',
      selectInk: 'Selecione uma tinta',
      quantity: 'Quantidade',
      salePrice: 'Preço de Venda',
      enterSalePrice: 'Digite o preço de venda',
      costSummary: 'Resumo de Custos',
      materialCost: 'Custo do Material',
      inkCost: 'Custo da Tinta',
      otherCosts: 'Outros Custos',
      totalCost: 'Custo Total',
      profit: 'Lucro',
      margin: 'Margem',
      calculations: 'Cálculos',
      save: 'Salvar Serviço',
      saving: 'Salvando...',
      success: 'Serviço salvo com sucesso!',
      error: 'Erro ao salvar serviço',
      fillRequired: 'Por favor, preencha todos os campos obrigatórios',
      add: 'Adicionar',
      description: 'Descrição'
    },
    // Materiais
    materials: {
      title: 'Gerenciar Materiais',
      subtitle: 'Gerencie seus materiais de impressão',
      addMaterial: 'Adicionar Material',
      materialName: 'Nome do Material',
      enterMaterialName: 'Digite o nome do material',
      pricePerM2: 'Preço por m²',
      enterPrice: 'Digite o preço',
      save: 'Salvar',
      cancel: 'Cancelar',
      edit: 'Editar',
      delete: 'Excluir',
      confirmDelete: 'Tem certeza que deseja excluir este material?',
      noMaterials: 'Nenhum material cadastrado',
      addFirst: 'Adicione seu primeiro material!'
    },
    // Tintas
    inks: {
      title: 'Gerenciar Tintas',
      subtitle: 'Gerencie suas tintas de impressão',
      addInk: 'Adicionar Tinta',
      inkName: 'Nome da Tinta',
      enterInkName: 'Digite o nome da tinta',
      pricePerMl: 'Preço por ml',
      enterPrice: 'Digite o preço',
      save: 'Salvar',
      cancel: 'Cancelar',
      edit: 'Editar',
      delete: 'Excluir',
      confirmDelete: 'Tem certeza que deseja excluir esta tinta?',
      noInks: 'Nenhuma tinta cadastrada',
      addFirst: 'Adicione sua primeira tinta!'
    },
    // Relatórios
    reports: {
      title: 'Relatórios',
      subtitle: 'Análise detalhada dos seus resultados',
      period: 'Período',
      thisMonth: 'Este mês',
      lastMonth: 'Mês passado',
      last3Months: 'Últimos 3 meses',
      thisYear: 'Este ano',
      export: 'Exportar',
      totalRevenue: 'Receita Total',
      totalProfit: 'Lucro Total',
      averageMargin: 'Margem Média',
      topServices: 'Serviços Mais Lucrativos',
      topMaterials: 'Materiais Mais Usados',
      profitTrend: 'Tendência de Lucro'
    },
    // Comum
    common: {
      language: 'Idioma',
      portuguese: 'Português',
      english: 'English',
      search: 'Pesquisar',
      filter: 'Filtrar',
      actions: 'Ações',
      yes: 'Sim',
      no: 'Não',
      close: 'Fechar',
      confirm: 'Confirmar'
    }
  }
};

// Traduções em inglês
const enUS = {
  translation: {
    // Authentication
    auth: {
      title: 'PrintManager Pro',
      subtitle: 'Print Management',
      login: 'Login',
      register: 'Register',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      password: 'Password',
      enterName: 'Enter your full name',
      enterEmail: 'Enter your email',
      enterPhone: 'Enter your phone',
      enterPassword: 'Enter your password',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signingIn: 'Signing in...',
      signingUp: 'Signing up...',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      registerHere: 'Register here',
      loginHere: 'Login here',
      registerSuccess: 'Registration successful! Please login to continue.',
      userDataError: 'Error loading user data'
    },
    // Navigation
    nav: {
      dashboard: 'Dashboard',
      newService: 'New Service',
      materials: 'Materials',
      reports: 'Reports',
      hello: 'Hello',
      logout: 'Logout'
    },
    // Dashboard
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Overview of your services and results',
      services: 'Services',
      revenue: 'Revenue',
      profit: 'Profit',
      margin: 'Margin',
      totalServices: 'Total services',
      totalSales: 'Total sales',
      totalProfit: 'Total profit',
      averageMargin: 'Average margin',
      recentServices: 'Recent Services',
      noServices: 'No services found',
      createFirst: 'Start by creating your first service!',
      service: 'Service',
      material: 'Material',
      ink: 'Ink',
      cost: 'Cost',
      sale: 'Sale',
      date: 'Date',
      allPeriods: 'All periods',
      lastWeek: 'Last week',
      lastMonth: 'Last month',
      loading: 'Loading...'
    },
    // Service Form
    service: {
      title: 'New Service',
      subtitle: 'Calculate costs and profit margin',
      serviceName: 'Service Name',
      serviceNamePlaceholder: 'Ex: Banner 2x1m',
      enterServiceName: 'Enter service name',
      selectMaterial: 'Select a material',
      selectInk: 'Select an ink',
      quantity: 'Quantity',
      salePrice: 'Sale Price',
      enterSalePrice: 'Enter sale price',
      costSummary: 'Cost Summary',
      materialCost: 'Material Cost',
      inkCost: 'Ink Cost',
      otherCosts: 'Other Costs',
      totalCost: 'Total Cost',
      profit: 'Profit',
      margin: 'Margin',
      calculations: 'Calculations',
      save: 'Save Service',
      saving: 'Saving...',
      success: 'Service saved successfully!',
      error: 'Error saving service',
      fillRequired: 'Please fill in all required fields',
      add: 'Add',
      description: 'Description'
    },
    // Materials
    materials: {
      title: 'Manage Materials',
      subtitle: 'Manage your printing materials',
      addMaterial: 'Add Material',
      materialName: 'Material Name',
      enterMaterialName: 'Enter material name',
      pricePerM2: 'Price per m²',
      enterPrice: 'Enter price',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      confirmDelete: 'Are you sure you want to delete this material?',
      noMaterials: 'No materials registered',
      addFirst: 'Add your first material!'
    },
    // Inks
    inks: {
      title: 'Manage Inks',
      subtitle: 'Manage your printing inks',
      addInk: 'Add Ink',
      inkName: 'Ink Name',
      enterInkName: 'Enter ink name',
      pricePerMl: 'Price per ml',
      enterPrice: 'Enter price',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      confirmDelete: 'Are you sure you want to delete this ink?',
      noInks: 'No inks registered',
      addFirst: 'Add your first ink!'
    },
    // Reports
    reports: {
      title: 'Reports',
      subtitle: 'Detailed analysis of your results',
      period: 'Period',
      thisMonth: 'This month',
      lastMonth: 'Last month',
      last3Months: 'Last 3 months',
      thisYear: 'This year',
      export: 'Export',
      totalRevenue: 'Total Revenue',
      totalProfit: 'Total Profit',
      averageMargin: 'Average Margin',
      topServices: 'Most Profitable Services',
      topMaterials: 'Most Used Materials',
      profitTrend: 'Profit Trend'
    },
    // Common
    common: {
      language: 'Language',
      portuguese: 'Português',
      english: 'English',
      search: 'Search',
      filter: 'Filter',
      actions: 'Actions',
      yes: 'Yes',
      no: 'No',
      close: 'Close',
      confirm: 'Confirm'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': ptBR,
      'en-US': enUS,
      pt: ptBR, // Fallback para pt
      en: enUS  // Fallback para en
    },
    fallbackLng: 'pt-BR',
    debug: false,
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;