# Indoor Player Web

Painel administrativo React para gerenciar dispositivos, biblioteca de mídias, playlists, agendamentos e usuários do Indoor Player.

## Requisitos

- Node.js 22+
- API Indoor Player disponível

## Configuração

Copie `.env.example` para `.env`:

```env
VITE_BASE_URL_API=http://localhost:3000
VITE_BASE_URL_API_FILES=http://localhost:3000/files/indoor-player-api
```

Em outro dispositivo da rede, troque `localhost` pelo IP do servidor. As URLs são incorporadas no build; gere o build novamente sempre que elas mudarem.

## Execução

```sh
npm install

# desenvolvimento
npm run dev -- --host 0.0.0.0

# produção
npm run build
npm run preview -- --host 0.0.0.0
```

O build é gerado em `dist/` e pode ser publicado por Nginx, Apache, CDN ou outro servidor de arquivos estáticos com fallback para `index.html`.

## Qualidade

```sh
npm run validate
```

Esse comando executa TypeScript, ESLint, 15 testes Vitest e o build de produção.

## Funcionalidades operacionais

- layout responsivo para desktop, tablet e celular;
- navegação recolhível e controle por perfil;
- indicador de disponibilidade da API;
- sessão expirada com retorno seguro ao login;
- biblioteca com pastas, upload e validação de arquivos;
- edição de duração e áudio dos vídeos da playlist;
- prévia de reprodução e estado real “TV com áudio/TV sem áudio”;
- carregamento sob demanda das telas para reduzir o JavaScript inicial.

## Estrutura

```text
src/
├── app/            páginas e regras de cada módulo
├── components/     layout, feedback e componentes de interface
├── contexts/       sessão e recursos globais
├── hooks/          integrações reutilizáveis
├── lib/            ambiente, URLs e erros da API
├── routes/         rotas públicas e protegidas
└── services/       cliente HTTP
```
