import mysql.connector

from config import DB_NAME, DB_PASSWORD, DB_PORT, DB_USER, DB_HOST

def conectar():
    conexao = mysql.connector.connect(
        host = DB_HOST,
        port = DB_PORT,
        user = DB_USER,
        password = DB_PASSWORD,
        database = DB_NAME,
    )
    return conexao