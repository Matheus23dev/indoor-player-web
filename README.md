# Indoor Player Web

Painel administrativo do Indoor Player para gestão de dispositivos, mídias, playlists, barras fixas, agendamentos, usuários e auditoria.

## Tecnologias

- Node.js 22.13+
- React 19
- TypeScript 6
- Vite 8
- React Router 7
- Tailwind CSS 4
- Axios
- Vitest e Testing Library
- Storybook

## Início rápido

```powershell
Copy-Item .env.example .env
npm ci
npm run dev -- --host 0.0.0.0
```

O servidor de desenvolvimento usa a porta escolhida pelo Vite e precisa alcançar a API configurada.

## Ambiente

```env
VITE_BASE_URL_API=http://localhost:3000
VITE_BASE_URL_API_FILES=http://localhost:3000/files/indoor-player-api
```

`VITE_BASE_URL_API_FILES` é opcional e deriva da URL da API quando ausente. As duas variáveis são incorporadas ao build; qualquer mudança exige novo `npm run build`.

## Scripts

```powershell
npm run dev          # desenvolvimento
npm run typecheck    # valida tipos
npm run lint         # ESLint
npm run test         # testes Vitest
npm run build        # gera dist/
npm run storybook    # catálogo visual em http://localhost:6006
npm run build-storybook # gera storybook-static/
npm run validate     # formato, tipos, lint, testes e build
npm run format:check # confere Prettier
```

## Módulos

| Rota                  | Módulo                          | Perfis                       |
| --------------------- | ------------------------------- | ---------------------------- |
| `/home/dashboard`     | Visão geral da operação         | Todos                        |
| `/home/devices`       | Players, vínculo, prévia e logs | Todos; logs restritos na API |
| `/home/medias`        | Biblioteca, pastas e upload     | Todos                        |
| `/home/playlists`     | Playlists e orientação          | Todos                        |
| `/home/playlists/:id` | Itens, duração, áudio e barras  | Todos                        |
| `/home/overlay-bars`  | Barras reutilizáveis            | Todos                        |
| `/home/schedules`     | Grade de exibição               | Todos                        |
| `/home/users`         | Acessos e permissões            | OWNER, ADMIN                 |
| `/home/audit-logs`    | Auditoria geral                 | OWNER, ADMIN                 |
| `/home/help`          | Manual e apresentação guiada    | Todos                        |

Após login, o usuário é enviado ao dashboard. Rotas desconhecidas usam a página 404 da aplicação.

No primeiro acesso, uma apresentação guiada percorre as telas permitidas ao perfil, abre os modais de criação sem salvar informações, destaca os controles e explica o fluxo com setas. A composição de playlist possui dados exclusivamente ilustrativos para que contas vazias também visualizem duração, áudio, ordenação e barras. A conclusão é registrada por usuário no navegador. O tour pode ser iniciado novamente pela opção **Ajuda** do menu.

## Build e publicação

```powershell
npm ci
npm run validate
```

Publique o diretório `dist/` em um servidor estático com HTTPS e fallback de qualquer rota da SPA para `index.html`.

## Estrutura

```text
src/
├── app/          páginas, componentes e regras por módulo
├── components/   UI, layout, feedback e proteção de rotas
├── contexts/     autenticação e recursos globais
├── hooks/        integrações reutilizáveis
├── lib/          ambiente, URLs e tratamento de erros
├── routes/       árvore de rotas públicas e privadas
├── services/     cliente HTTP compartilhado
└── test/         configuração dos testes
```

## Catálogo visual

O Storybook documenta os fundamentos visuais, a estrutura das páginas e os principais componentes
dos módulos de dispositivos, mídias, playlists, agendamentos, barras fixas e usuários. Os exemplos
usam dados demonstrativos e funcionam sem conexão com a API.

```powershell
npm run storybook
```

Acesse `http://localhost:6006`. Para gerar uma versão estática publicável, execute
`npm run build-storybook`; o resultado será criado em `storybook-static/`.

## Documentação

- [Arquitetura do frontend](docs/ARQUITETURA_FRONTEND.md)
- [Documentação geral da solução](https://github.com/Matheus23dev/IndoorPlayer-app/tree/develop/docs)
- [Referência da API](https://github.com/Matheus23dev/indoor-player-api/blob/develop/docs/REFERENCIA_API.md)
