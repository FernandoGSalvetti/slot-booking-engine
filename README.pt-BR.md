# Slot Booking Engine
--- Um motor de agendamento de aulas e livro-razão financeiro, seguro contra concorrência, construído com TypeScript puro e PostgreSQL 16.

## Visão Geral

- Este projeto é uma POC para lidar com o agendamento de professores e prevenir Race Conditions.

## Principais Decisões de Arquitetura

- **Transações ACID e Migrations Atômicas:** Usa migrations em SQL puro envolvidas em transações atômicas (`BEGIN ... COMMIT`) para garantir a integridade do schema sem depender de ORMs pesados.
- **Concorrência e Anti-Double Booking:** Implementa constraints `EXCLUDE USING gist` do PostgreSQL (extensão `btree_gist`) com `tsrange(start_time, end_time)` para impedir matematicamente a sobreposição de horários direto no motor do banco de dados.
- **Relatórios Analíticos:** Utiliza `LEFT JOIN` e `GROUP BY` sobre UUIDs imutáveis para agregar com precisão a contagem de aulas e os valores a pagar, inclusive para professores sem nenhum agendamento.

## Como Usar

- Crie o arquivo .env, consulte o .env-template, para preencher as variáveis de ambiente;
- Abra o Docker Desktop e depois execute os comandos abaixo:
```bash
docker compose up -d
npm install
npm run migrations
npm run seeds
```

## Scripts
1. Execute **npm run get-teachers** para listar todos os professores cadastrados no banco de dados.
2. Execute **npm run slot-book** para agendar uma aula no banco de dados.
3. Execute **npm run get-teachers-billing-report** para obter o relatório com a quantidade de aulas de cada professor e o valor total por hora.
