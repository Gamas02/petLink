import os 

# BANCO DE DADOS
DB_HOST = os.getenv("DB_HOST", "mysql")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# FLASK
SECRET_KEY = os.getenv("SECRET_KEY")
FLASK_DEBUG = os.getenv("FLASK_DEBUG")