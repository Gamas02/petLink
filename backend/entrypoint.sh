#!/bin/sh
set -e

echo "[ENTRYPOINT] Aguardando MySQL ficar pronto..."
python wait_for_db

echo "[ENTRYPOINT] Iniciando Flask..."
python app.py