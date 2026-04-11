# ─────────────────────────────────────────
#  Chatbot — Rasa 3.x
# ─────────────────────────────────────────
FROM python:3.10-slim

WORKDIR /app

# Dependências do sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Instala o Rasa
RUN pip install --no-cache-dir rasa==3.6.20

# Copia os arquivos do projeto
COPY . .

EXPOSE 5005

# Inicia o servidor com o modelo já treinado
CMD ["rasa", "run", "--enable-api", "--cors", "*", "--host", "0.0.0.0", "--port", "5005"]