# Autou - Classificador de E-mails e Documentos

Este projeto é uma aplicação web desenvolvida em Next.js para análise automática de e-mails e documentos (.txt e .pdf). O sistema permite que o usuário envie textos ou arquivos, que são processados por um backend inteligente para identificar palavras-chave, categoria, sentimento, sugestões de resposta e outras informações relevantes.

## Funcionalidades

- Upload de arquivos .txt e .pdf ou inserção de texto manual
- Extração automática de texto de PDFs (processamento feito em uma rota API do próprio Next.js usando a biblioteca [pdf-parse](https://www.npmjs.com/package/pdf-parse))
- Envio do conteúdo extraído para um backend Python para análise
- Exibição de palavras-chave, categoria, sentimento, sugestões e estatísticas
- Histórico de análises realizadas na sessão

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org)
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/)
- [React Query](https://tanstack.com/query/latest)
- [pdf2json](https://www.npmjs.com/package/pdf2json) (processar PDF's)
- [Lucide Icons](https://lucide.dev/) (ícones)
- Backend Python para análise do conteúdo

## Como rodar o projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Elias-mqs/email-analyzer.git
   cd frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn
   # ou
   pnpm install
   ```

3. **Configure as variáveis de ambiente:**
   - Crie um arquivo `.env.local` na raiz do projeto, se necessário, e configure as URLs do backend Python.

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   ```

5. **Acesse a aplicação:**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Estrutura principal

- `src/components`: Componentes React reutilizáveis
- `src/hooks`: Hooks customizados para integração com a API
- `src/app`: Rotas e páginas da aplicação
- `src/lib`: Funções utilitárias
- `src/app/api`: Rotas API do Next.js (incluindo processamento de PDF)

## Observações

- Certifique-se de que o backend Python esteja rodando e acessível na URL configurada.
- O processamento de arquivos PDF é feito em uma rota API do próprio Next.js usando `pdf2json`.
- Para arquivos grandes, o limite de upload é de 5MB.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

Desenvolvido com Next.js.
