# =============================================================
#  Dockerfile  –  Backend Flask (Python 3.12)
# =============================================================

FROM python:3.12-slim

# Evita arquivos .pyc e deixa logs aparecerem em tempo real
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Copia e instala dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do código
COPY . .

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]