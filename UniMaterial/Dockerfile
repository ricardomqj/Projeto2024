FROM node:22.1.0-alpine

# Definir o diretório de trabalho
WORKDIR /usr/src/app

# Copiar todo o código-fonte para o diretório de trabalho
COPY . .

# Instalar dependências
RUN npm install

RUN npm install mongoose

RUN npm install axios

# Expor a porta
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]