# Relatório Semanal

Este repositório foi criado para organizar e acompanhar relatórios semanais de atividades, progresso e pendências.

## Estrutura

- `templates/relatorio-semanal.md` — modelo base para novos relatórios
- `relatorios/` — pasta para armazenar os relatórios por semana
- `supabase-schema.sql` — tabela e políticas para sincronizar o painel
- `.gitignore` — arquivos e pastas que não devem entrar no controle do Git

## Como usar

1. Abra o arquivo de template.
2. Copie o conteúdo para um novo arquivo em `relatorios/`.
3. Atualize as informações da semana.
4. Revise metas, entregas, riscos e próximos passos.

## Exemplo de cabeçalho

- Semana:
- Período:
- Responsável:
- Status:

## Checklist

- [ ] Objetivos da semana
- [ ] Tarefas concluídas
- [ ] Pendências
- [ ] Riscos
- [ ] Próximos passos

## Supabase

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. Abra o SQL Editor e execute o conteúdo de `supabase-schema.sql`.
3. Em Project Settings → API, copie a Project URL e a chave `anon`.
4. Cole os valores em `SUPABASE_URL` e `SUPABASE_ANON_KEY` no `index.html`.

Enquanto esses valores estiverem como placeholder, o painel continua usando o armazenamento local. Depois da configuração, os cards e as atividades serão carregados e salvos na tabela `dashboard_state`.
