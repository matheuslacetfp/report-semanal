# Como usar o painel

## Desenvolvimento

O painel agora usa Vite, React e TypeScript.

1. Instale Node.js 20 ou superior.
2. Execute `npm install`.
3. Copie `.env.example` para `.env` e preencha as credenciais públicas do Supabase.
4. Execute `npm run dev`.

Para validar a aplicação, use `npm run build` e `npm test`.

As credenciais não ficam mais no HTML. O arquivo `.env` deve permanecer fora do versionamento.

O painel organiza as atividades da operação de conteúdo em três etapas:

- **A fazer:** tarefas pendentes.
- **Feito:** tarefas concluídas.
- **Em seguida:** tarefas planejadas para o próximo ciclo.

## Criar uma tarefa

1. Clique em **＋ Adicionar tarefa** na coluna desejada.
2. Digite o nome da tarefa.
3. Clique em **Adicionar** ou pressione Enter.

## Editar uma tarefa

1. Passe o mouse sobre a tarefa.
2. Clique em **Editar**.
3. Altere o nome ou escolha outra coluna.
4. Clique em **Salvar** ou pressione Enter.

## Mover uma tarefa

Arraste a tarefa para outra coluna. Também é possível arrastá-la para uma posição específica dentro da mesma coluna.

## Excluir uma tarefa

1. Passe o mouse sobre a tarefa.
2. Clique em **Excluir**.

A tarefa será removida do painel.

## Filtrar tarefas

Use os botões no topo do mapa de entregas para visualizar:

- **Todos:** mostra todas as tarefas.
- **A fazer:** mostra apenas as tarefas pendentes.
- **Feito:** mostra apenas as tarefas concluídas.
- **Em seguida:** mostra apenas as próximas tarefas.

## Acompanhar o progresso

O painel atualiza automaticamente:

- a quantidade total de tarefas;
- o número de tarefas concluídas;
- o percentual geral de progresso;
- as atividades recentes;
- a saúde do fluxo de trabalho.

As alterações são salvas automaticamente. Não é necessário clicar em um botão de salvar.

## Pastas Monitoradas

Na seção **Pastas Monitoradas**, adicione links de acesso rápido informando a URL e, opcionalmente, um nome personalizado. Cada link pode ser aberto, editado, favoritado, categorizado, pesquisado, reordenado ou excluído diretamente no painel. Os links também são salvos automaticamente junto com o restante do estado do dashboard.

O app mantém backups locais, enfileira alterações quando está offline e detecta conflitos de versão no Supabase. Exclusões de tarefas podem ser desfeitas imediatamente.
