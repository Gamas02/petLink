from flask import Flask, jsonify, request, url_for, flash
from flask_cors import CORS
from db import conectar
from config import SECRET_KEY, FLASK_DEBUG
import bcrypt
from datetime import datetime

app = Flask(__name__)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = data.get("usuario")
    senha = data.get("senha").encode('utf-8')
    
    if not user or not senha:
        return jsonify({"erro":"Dados inválidos."}), 400
    
    cursor = conectar.cursor()
    
    try:
        cursor.execute("SELECT senha FROM Usuario WHERE name = %s", (user,))
        resultado = cursor.fetchone()
        if not resultado:
            return jsonify({"erro": "Usuario não encontrado"}), 404
        
        hash_banco = resultado[0].encode('utf-8')
        
        if bcrypt.chekpw(senha, hash_banco):
            return jsonify({"resposta":"ok"}), 200
        
        else:
            return jsonify({"resposta":"Senha incorreta"}), 401
        
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    
    finally:
        cursor.close()
        conexao.close()
        
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json
    user = data.get("usuario")
    senha = data.get("senha").encode('utf-8')
    email = data.get("email")
    telefone = data.get("telefone")
    cpf = data.get("cpf")
    cidade = data.get("cidade")
    estado = data.get("estado")
    data_cadastro = datetime.now()
    
    if not user or not senha or not email or not telefone or not cpf or not estado or not data_cadastro:
        return jsonify({"erro":"Dados inválidos."}), 400
    
    cursor = conectar.cursor()
    
    senha_hash = bcrypt.hashpw(senha, bcrypt.gensalt())
    
    try:
        cursor.execute("""
                       INSERT INTO Usuarios 
                       (name, senha_hash, email, telefone, cpf, cidade, estado, data_cadastro)
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""", (user, senha_hash, email, telefone, cpf, cidade, estado, data_cadastro))
        
        conectar.commit()
        
        return jsonify({
            "resposta":"ok",
            "id": cursor.lastrowid
        }), 200
    
    except Exception as e:
        return jsonify({
            "resposta":"erro no servidor",
            "erro": str(e)
        }), 500
    
    finally:
        cursor.close()
        conectar.close()
        