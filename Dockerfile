# Estágio 1: Build (Construção)
# Usamos uma imagem Node.js para compilar a aplicação Angular
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de definição de pacotes
COPY package.json package-lock.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o resto do código-fonte da aplicação
COPY . .

# Executa o build de produção do Angular.
# O nome 'grc-frontend' vem do seu arquivo angular.json
RUN npm run build -- --configuration production

# Estágio 2: Serve (Servidor de Produção)
# Usamos uma imagem leve do Nginx para servir os arquivos estáticos
FROM nginx:alpine

# Copia os arquivos compilados do estágio 'builder' para o diretório padrão do Nginx
COPY --from=builder /app/dist/votacao-frontend/browser/ /usr/share/nginx/html

# Copia o arquivo de configuração customizado do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80, que é a porta padrão do Nginx
EXPOSE 80