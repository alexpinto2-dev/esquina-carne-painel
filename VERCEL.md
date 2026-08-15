# Deploy na Vercel

## Diagnóstico do build

O projeto utiliza React/Vite no frontend e Express + tRPC no backend. O build gera os arquivos do painel em `dist/public` e a aplicação compilada em `dist/index.js`. A entrada raiz `index.ts` exporta a aplicação Express para que a Vercel possa tratá-la como uma função Node serverless.

O script `postbuild` copia `dist/public` para `public`, pois a Vercel serve arquivos estáticos pela pasta `public`. O servidor Express não deve depender de um processo persistente ou de uma porta aberta na Vercel; ele é inicializado por requisição pela plataforma.

## Configuração recomendada

Use o repositório conectado ao projeto com **Build Command** `pnpm build`. Não defina um comando de start persistente na Vercel. O projeto já contém a entrada `index.ts` reconhecida pela Vercel e o `postbuild` necessário para os assets.

As variáveis do banco e do backend precisam ser cadastradas na Vercel para os ambientes Preview e Production, especialmente `DATABASE_URL`, `JWT_SECRET`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`, `VITE_APP_ID`, `OWNER_OPEN_ID`, `OWNER_NAME`, `BUILT_IN_FORGE_API_URL` e `BUILT_IN_FORGE_API_KEY`. Sem `DATABASE_URL`, a página pode abrir, mas a manutenção e a sincronização dos preços não funcionarão.

## Diferença em relação ao Manus

A hospedagem integrada do Manus já injeta as variáveis do projeto, executa o servidor Express e publica o checkpoint automaticamente. Na Vercel, o código é executado como função serverless, as variáveis precisam ser cadastradas manualmente e o deploy deve ser disparado pelo GitHub ou pela Vercel CLI. O domínio integrado publicado pelo Manus continua sendo a opção mais simples para este projeto; a Vercel é uma alternativa externa que exige essa configuração adicional.

## Avisos de analytics

O script de analytics opcional foi removido do `client/index.html`, portanto as variáveis `%VITE_ANALYTICS_ENDPOINT%` e `%VITE_ANALYTICS_WEBSITE_ID%` não são necessárias para o build.

## Scripts de instalação do pnpm

O arquivo `pnpm-workspace.yaml` autoriza somente `esbuild` e `@tailwindcss/oxide` em `onlyBuiltDependencies`. Isso evita o aviso de scripts bloqueados sem liberar scripts arbitrários. O lockfile foi regenerado com a configuração atual; o deploy deve usar `pnpm install --frozen-lockfile` e depois `pnpm build`.

## Entrada explícita da Vercel

O domínio `painel-esquina.vercel.app` estava exibindo o código-fonte compilado do servidor porque a detecção automática escolheu `server/_core/index.ts` como entrada. Para eliminar essa ambiguidade, o projeto agora possui `api/index.ts`, que exporta a aplicação Express, e `vercel.json`, que encaminha as rotas públicas e `/api/*` para essa função. Não configure `dist` como Output Directory manualmente; deixe o build gerar `public` e use a função `api/index.ts` como runtime.
