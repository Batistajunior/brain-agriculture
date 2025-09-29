FROM python:3.12-slim

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia as dependências
COPY requirements.txt .

# Instala dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código da aplicação
COPY ./app ./app

# Define a porta usada no Heroku
ENV PORT=8000

# Comando final
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
