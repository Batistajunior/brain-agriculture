# frontend/Dockerfile
FROM node:20

WORKDIR /app

# Copia apenas os manifests primeiro (cache para instalar deps)
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia todo o código
COPY . .

# Expõe a porta usada pelo Vite
EXPOSE 5173

# Comando para rodar o frontend
CMD ["npm", "run", "dev"]
