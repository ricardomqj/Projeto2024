# Usar a imagem base do Node.js
FROM node:22.1.0-alpine

# Definir o diretório de trabalho
WORKDIR /usr/src/app

# Copiar todo o código-fonte para o diretório de trabalho
COPY . .

# Instalar dependências
RUN npm install

# Expor a porta
EXPOSE 3001

# Comando para iniciar o servidor
CMD ["npm", "start"]
