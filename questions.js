/**
 * Lords of Logic - Question Bank
 * Separado para facilitar manutenção
 */

const CATEGORIES = [
    { id: 'stack', name: 'DESENVOLVIMENTO' },
    { id: 'salesforce', name: 'PLATAFORMAS' },
    { id: 'culture', name: 'CULTURA & BOAS PRÁTICAS' }
];

const QUESTION_BANK = [
    // --- LEVEL 0: VIBECODER (Multiplicador x0.8) ---
    { 
        level: 0, 
        category: 'stack', 
        question: 'Qual tag HTML define um parágrafo?', 
        options: ['<p>', '<div>', '<span>', '<a>'], 
        answer: '<p>', 
        explanation: '<p> é a tag semântica para paragraphs (parágrafos) em HTML.' 
    },
    { 
        level: 0, 
        category: 'stack', 
        question: 'Qual símbolo é usado para comentários em CSS?', 
        options: ['//', '<!-- -->', '/* */', '#'], 
        answer: '/* */', 
        explanation: 'Em CSS, comentários são delimitados por /* e */.' 
    },
    { 
        level: 0, 
        category: 'stack', 
        question: 'Qual cor é representada pelo hex #FFFFFF?', 
        options: ['Preto', 'Branco', 'Azul', 'Vermelho'], 
        answer: 'Branco', 
        explanation: 'Hexadecimal #FFFFFF representa a cor branca (mistura de todas as cores luz).' 
    },
    // --- STACK EXTRA QUESTIONS ---
    { 
        level: 0,
        category: 'stack',
        question: 'Qual atributo HTML é usado para identificar um elemento de forma única?',
        options: ['class', 'id', 'name', 'key'],
        answer: 'id',
        explanation: 'O atributo id deve ser único dentro do documento HTML.'
    },
    { 
        level: 1,
        category: 'stack',
        question: 'Qual desses NÃO é um tipo primitivo em JavaScript?',
        options: ['string', 'number', 'boolean', 'object'],
        answer: 'object',
        explanation: 'Object é um tipo complexo, não primitivo.'
    },
    { 
        level: 1,
        category: 'stack',
        question: 'Qual comando instala dependências listadas no package.json?',
        options: ['npm start', 'npm install', 'npm build', 'npm run'],
        answer: 'npm install',
        explanation: 'npm install baixa e instala todas as dependências do projeto.'
    },
    { 
        level: 2,
        category: 'stack',
        question: 'Qual método de array retorna um novo array sem modificar o original?',
        options: ['push', 'splice', 'map', 'sort'],
        answer: 'map',
        explanation: 'map cria um novo array baseado no retorno da função callback.'
    },
    { 
        level: 2,
        category: 'stack',
        question: 'O que significa REST?',
        options: [
            'Remote Execution Standard Transfer',
            'Representational State Transfer',
            'Resource State Transport',
            'Relational State Transfer'
        ],
        answer: 'Representational State Transfer',
        explanation: 'REST é um estilo arquitetural para sistemas distribuídos.'
    },
    { 
        level: 3,
        category: 'stack',
        question: 'Qual estrutura de dados é usada internamente na Call Stack?',
        options: ['Queue', 'Heap', 'Stack', 'Linked List'],
        answer: 'Stack',
        explanation: 'A Call Stack segue o padrão LIFO (Last In, First Out).'
    },
    { 
        level: 3,
        category: 'stack',
        question: 'O que é memoization?',
        options: [
            'Técnica de cache de resultados',
            'Processo de minificação',
            'Forma de paralelismo',
            'Garbage Collection manual'
        ],
        answer: 'Técnica de cache de resultados',
        explanation: 'Memoization evita recomputações armazenando resultados anteriores.'
    },
    { 
        level: 4,
        category: 'stack',
        question: 'O que acontece se uma Promise não tratada for rejeitada no Node.js?',
        options: [
            'Nada acontece',
            'O processo pode ser finalizado',
            'Ela vira undefined',
            'É ignorada silenciosamente'
        ],
        answer: 'O processo pode ser finalizado',
        explanation: 'Unhandled Promise Rejection pode crashar a aplicação.'
    },
    { 
        level: 4,
        category: 'stack',
        question: 'Qual é a principal vantagem de usar Imutabilidade?',
        options: [
            'Menor uso de memória',
            'Código mais rápido',
            'Previsibilidade e segurança',
            'Menos linhas de código'
        ],
        answer: 'Previsibilidade e segurança',
        explanation: 'Imutabilidade reduz efeitos colaterais e bugs.'
    },
    { 
        level: 5,
        category: 'stack',
        question: 'O que é ABA Problem em sistemas concorrentes?',
        options: [
            'Deadlock entre duas threads',
            'Problema em algoritmos lock-free',
            'Erro de alocação de heap',
            'Race condition simples'
        ],
        answer: 'Problema em algoritmos lock-free',
        explanation: 'O ABA Problem ocorre quando um valor muda e retorna ao original sem ser detectado.'
    },
    { 
        level: 0, 
        category: 'culture', 
        question: 'O que significa "LGTM" no code review?', 
        options: ['Luigi Got The Mushrooms', 'Looks Good To Me', 'Let\'s Get The Money', 'Lagging Game Too Much'], 
        answer: 'Looks Good To Me', 
        explanation: 'Sigla comum para aprovar Pull Requests: "Parece bom para mim".' 
    },
    { 
        level: 0, 
        category: 'salesforce', 
        question: 'Qual o mascote principal do Salesforce (o guaxinim)?', 
        options: ['Einstein', 'Codey', 'Astro', 'Appy'], 
        answer: 'Astro', 
        explanation: 'Astro é o mascote principal que guia a comunidade (Trailblazers).' 
    },
    // --- CULTURE EXTRA QUESTIONS ---
    {
        level: 0,
        category: 'culture',
        question: 'O que significa DRY?',
        options: [
            'Do Repeat Yourself',
            'Don\'t Repeat Yourself',
            'Dynamic Runtime Yield',
            'Deploy Rapidly Yourself'
        ],
        answer: 'Don\'t Repeat Yourself',
        explanation: 'Evita duplicação de código.'
    },
    {
        level: 1,
        category: 'culture',
        question: 'O que é Code Smell?',
        options: [
            'Bug em produção',
            'Indício de problema no código',
            'Erro de compilação',
            'Falha de segurança'
        ],
        answer: 'Indício de problema no código',
        explanation: 'Não é bug, mas indica design ruim.'
    },
    {
        level: 1,
        category: 'culture',
        question: 'Qual prática melhora qualidade e compartilhamento de conhecimento?',
        options: ['Pair Programming', 'Deploy manual', 'Código isolado', 'Feature flags'],
        answer: 'Pair Programming',
        explanation: 'Dois devs trabalhando juntos.'
    },
    {
        level: 2,
        category: 'culture',
        question: 'O que é Refatoração?',
        options: [
            'Adicionar features',
            'Reescrever tudo',
            'Melhorar código sem mudar comportamento',
            'Corrigir bugs'
        ],
        answer: 'Melhorar código sem mudar comportamento',
        explanation: 'Refatoração foca em qualidade.'
    },
    {
        level: 2,
        category: 'culture',
        question: 'Qual métrica indica qualidade de testes?',
        options: ['Coverage', 'FPS', 'Latency', 'Throughput'],
        answer: 'Coverage',
        explanation: 'Mostra percentual de código coberto por testes.'
    },
    {
        level: 3,
        category: 'culture',
        question: 'O que é Observabilidade?',
        options: [
            'Monitoramento básico',
            'Logs apenas',
            'Capacidade de entender o estado do sistema',
            'Deploy automático'
        ],
        answer: 'Capacidade de entender o estado do sistema',
        explanation: 'Logs, métricas e traces juntos.'
    },
    {
        level: 3,
        category: 'culture',
        question: 'Qual anti-pattern o Clean Code combate?',
        options: ['Código legível', 'Código simples', 'Código espaguete', 'Código testável'],
        answer: 'Código espaguete',
        explanation: 'Código difícil de entender e manter.'
    },
    {
        level: 4,
        category: 'culture',
        question: 'O que é Technical Debt?',
        options: [
            'Bug crítico',
            'Código legado',
            'Custo futuro por atalhos técnicos',
            'Falha de arquitetura'
        ],
        answer: 'Custo futuro por atalhos técnicos',
        explanation: 'Dívida técnica cobra juros.'
    },
    {
        level: 4,
        category: 'culture',
        question: 'Qual prática reduz falhas em produção?',
        options: ['Deploy sexta', 'Code Review', 'Hotfix direto', 'Bypass de testes'],
        answer: 'Code Review',
        explanation: 'Revisão reduz erros e espalha conhecimento.'
    },
    {
        level: 5,
        category: 'culture',
        question: 'Lei de Conway afirma que:',
        options: [
            'Sistemas refletem a comunicação das equipes',
            'Código cresce exponencialmente',
            'Arquitetura define o time',
            'Microservices são inevitáveis'
        ],
        answer: 'Sistemas refletem a comunicação das equipes',
        explanation: 'A estrutura do software espelha a estrutura organizacional.'
    },
        
    // --- LEVEL 1: JUNINHO (Multiplicador x1.0) ---
    { 
        level: 1, 
        category: 'stack', 
        question: 'Qual método HTTP é ideal para ATUALIZAR um recurso existente?', 
        options: ['GET', 'POST', 'PUT', 'DELETE'], 
        answer: 'PUT', 
        explanation: 'PUT (substituição completa) ou PATCH (parcial) são usados para atualizações.' 
    },
    { 
        level: 1, 
        category: 'culture', 
        question: 'Qual comando git envia seus commits locais para o repositório remoto?', 
        options: ['git pull', 'git push', 'git commit', 'git add'], 
        answer: 'git push', 
        explanation: '`git push` empurra (envia) as alterações confirmadas para o remoto.' 
    },
    // --- SALESFORCE + ECOMMERCE ECOSYSTEM ---
    {
        level: 0,
        category: 'salesforce',
        question: 'Qual protocolo é mais comum para integrações entre Salesforce e e-commerces?',
        options: ['SOAP', 'REST', 'FTP', 'GraphQL apenas'],
        answer: 'REST',
        explanation: 'REST é o padrão moderno para integrações por APIs entre plataformas.'
    },
    {
        level: 1,
        category: 'salesforce',
        question: 'No Salesforce, qual objeto é frequentemente usado como "pedido" em integrações?',
        options: ['Case', 'Opportunity', 'Order', 'Quote'],
        answer: 'Order',
        explanation: 'O objeto Order representa pedidos confirmados.'
    },
    {
        level: 1,
        category: 'salesforce',
        question: 'Qual formato de dados é mais comum em webhooks do Shopify?',
        options: ['XML', 'CSV', 'JSON', 'YAML'],
        answer: 'JSON',
        explanation: 'Shopify utiliza JSON como padrão em webhooks e APIs.'
    },
    {
        level: 2,
        category: 'salesforce',
        question: 'Qual recurso do Salesforce é indicado para processar integrações assíncronas?',
        options: ['Trigger síncrono', 'Batch Apex', 'Queueable Apex', 'Visualforce'],
        answer: 'Queueable Apex',
        explanation: 'Queueable é ideal para integrações assíncronas e encadeáveis.'
    },
    {
        level: 2,
        category: 'salesforce',
        question: 'Na VTEX, qual conceito representa um pedido fechado?',
        options: ['Cart', 'Checkout', 'OrderForm', 'Order'],
        answer: 'Order',
        explanation: 'Order é criado após o fechamento do OrderForm.'
    },
    {
        level: 3,
        category: 'salesforce',
        question: 'Qual padrão evita lógica de integração diretamente em triggers?',
        options: [
            'Singleton',
            'Trigger Handler',
            'Observer',
            'Monolithic Trigger'
        ],
        answer: 'Trigger Handler',
        explanation: 'Isola regras de negócio e integração, evitando triggers gigantes.'
    },
    {
        level: 3,
        category: 'salesforce',
        question: 'Qual prática evita estouro de Governor Limits em integrações?',
        options: [
            'Executar SOQL dentro de loops',
            'Bulkificar código',
            'Usar muitos triggers',
            'Executar tudo síncrono'
        ],
        answer: 'Bulkificar código',
        explanation: 'Processar listas de registros evita múltiplas execuções custosas.'
    },
    {
        level: 4,
        category: 'salesforce',
        question: 'Qual problema ocorre ao reprocessar o mesmo webhook sem controle?',
        options: [
            'Cache miss',
            'Deadlock',
            'Duplicidade de dados',
            'Timeout de API'
        ],
        answer: 'Duplicidade de dados',
        explanation: 'Sem idempotência, o mesmo evento pode gerar dados duplicados.'
    },
    {
        level: 4,
        category: 'salesforce',
        question: 'Qual técnica garante segurança ao receber webhooks do Shopify ou VTEX?',
        options: [
            'Token fixo em querystring',
            'IP Whitelist apenas',
            'Validação de assinatura (HMAC)',
            'Campo hidden no payload'
        ],
        answer: 'Validação de assinatura (HMAC)',
        explanation: 'HMAC garante que o payload foi realmente enviado pela plataforma.'
    },
    {
        level: 5,
        category: 'salesforce',
        question: 'Qual arquitetura reduz acoplamento entre Salesforce e múltiplos e-commerces?',
        options: [
            'Integração ponto a ponto',
            'Trigger direto chamando APIs',
            'Camada de orquestração (Middleware)',
            'Customizações por org'
        ],
        answer: 'Camada de orquestração (Middleware)',
        explanation: 'Middleware desacopla sistemas, facilita manutenção e escalabilidade.'
    },

    { 
        level: 1, 
        category: 'salesforce', 
        question: 'Qual linguagem proprietária é usada no backend do Salesforce?', 
        options: ['Java', 'Apex', 'Python', 'C#'], 
        answer: 'Apex', 
        explanation: 'Apex é a linguagem OO do Salesforce, com sintaxe muito similar a Java.' 
    },
    { 
        level: 1, 
        category: 'stack', 
        question: 'O que significa DOM?', 
        options: ['Document Object Model', 'Data Oriented Model', 'Digital Ordinance Method', 'Disk Operating Mode'], 
        answer: 'Document Object Model', 
        explanation: 'DOM é a representação em árvore da estrutura de uma página web.' 
    },
    
    // --- LEVEL 2: PLENO (Multiplicador x1.5) ---
    { 
        level: 2, 
        category: 'stack', 
        question: 'O que é "Hoisting" em JavaScript?', 
        options: ['Elevação de declarações', 'Um padrão de design', 'Uma biblioteca de gráficos', 'Erro de compilação'], 
        answer: 'Elevação de declarações', 
        explanation: 'Comportamento onde declarações de variáveis/funções são "movidas" para o topo do escopo.' 
    },
    { 
        level: 2, 
        category: 'culture', 
        question: 'No SOLID, o que diz o Princípio de Liskov (LSP)?', 
        options: ['Classes filhas devem substituir as pais', 'Uma classe deve ter resp. única', 'Dependa de abstrações', 'Interfaces devem ser específicas'], 
        answer: 'Classes filhas devem substituir as pais', 
        explanation: 'Objetos de uma superclasse devem ser substituíveis por objetos de subclasses sem quebrar a aplicação.' 
    },
    { 
        level: 2, 
        category: 'salesforce', 
        question: 'Qual o limite governador (Governor Limit) padrão de linhas retornadas por SOQL?', 
        options: ['2.000', '10.000', '50.000', '100'], 
        answer: '50.000', 
        explanation: 'Em uma transação síncrona, você pode recuperar até 50.000 registros no total.' 
    },

    // --- LEVEL 3: SENIOR (Multiplicador x2.0) ---
    { 
        level: 3, 
        category: 'stack', 
        question: 'No Event Loop do JS, qual fila tem prioridade de execução?', 
        options: ['Macrotasks', 'Microtasks', 'SetTimeout', 'Renderização'], 
        answer: 'Microtasks', 
        explanation: 'A fila de Microtasks (ex: Promises prop) é processada imediatamente após a stack atual esvaziar, antes de macrotasks.' 
    },
    { 
        level: 3, 
        category: 'culture', 
        question: 'Arquitetura Hexagonal também é conhecida como:', 
        options: ['Ports and Adapters', 'MVC', 'Clean Architecture', 'Microkernel'], 
        answer: 'Ports and Adapters', 
        explanation: 'Foca em isolar o núcleo da aplicação de ferramentas externas através de Portas e Adaptadores.' 
    },
    { 
        level: 3, 
        category: 'salesforce', 
        question: 'Para expor um método Apex como serviço REST personalizado, qual anotação usamos na classe?', 
        options: ['@RestResource', '@AuraEnabled', '@Future', '@InvocableMethod'], 
        answer: '@RestResource', 
        explanation: '@RestResource(urlMapping=\'/...\') define a classe como um recurso REST acessível externamente.' 
    },

    // --- LEVEL 4: LINUS TORVALDS (Multiplicador x3.0 | Erro -5pts) ---
    { 
        level: 4, 
        category: 'stack', 
        question: 'Qual flag do V8 (Node.js) permite aumentar o limite de memória Heap?', 
        options: ['--max-old-space-size', '--increase-ram', '--v8-options', '--memory-limit'], 
        answer: '--max-old-space-size', 
        explanation: 'Ex: --max-old-space-size=4096 define o limite para 4GB.' 
    },
    { 
        level: 4, 
        category: 'culture', 
        question: 'O que é "False Sharing" em programação concorrente?', 
        options: ['Thrashing de cache L1/L2', 'Compartilhamento ilegal de código', 'Race condition em DB', 'Erro de pointer'], 
        answer: 'Thrashing de cache L1/L2', 
        explanation: 'Ocorre quando threads em CPUs diferentes invalidam linhas de cache umas das outras por escreverem em variáveis adjacentes.' 
    },
    { 
        level: 4, 
        category: 'salesforce', 
        question: 'Qual é o limite de tempo de CPU (CPU Time) síncrono no Salesforce?', 
        options: ['10.000 ms', '60.000 ms', '5.000 ms', '15.000 ms'], 
        answer: '10.000 ms', 
        explanation: 'O limite rígido é 10 segundos de tempo de processamento de CPU (não tempo total de relógio).' 
    },

    // --- LEVEL 5: MAGO SUPREMO (Multiplicador x4.0 | Erro -10pts) ---
    { 
        level: 5, 
        category: 'stack', 
        question: 'Qual o opcode hexadecimal para a instrução NOP (No Operation) em x86?', 
        options: ['0x90', '0x00', '0xFF', '0xCC'], 
        answer: '0x90', 
        explanation: '0x90 é o padrão para NOP, usado frequentemente para preenchimento (padding) ou timing.' 
    },
    { 
        level: 5, 
        category: 'culture', 
        question: 'Quem é o autor original do manifesto GNU e fundador da Free Software Foundation?', 
        options: ['Richard Stallman', 'Linus Torvalds', 'Ken Thompson', 'Dennis Ritchie'], 
        answer: 'Richard Stallman', 
        explanation: 'Richard Matthew Stallman (RMS) iniciou o movimento software livre em 1983/1984.' 
    },
    { 
        level: 5, 
        category: 'salesforce', 
        question: 'Ao usar "Big Objects", qual a única maneira de query (SOQL) sem performance degradation?', 
        options: ['Pelo Index definido', 'Usando LIKE', 'Full table scan', 'Qualquer campo indexado'], 
        answer: 'Pelo Index definido', 
        explanation: 'Querying Big Objects exige filtrar EXATAMENTE pelos campos que compõem o índice composto, na ordem correta.' 
    }
];

window.QUESTION_BANK = QUESTION_BANK;
window.CATEGORIES = CATEGORIES;
