from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from db import conectar
from config import SECRET_KEY, FLASK_DEBUG
from datetime import datetime
import bcrypt
import os

UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")

app = Flask(__name__)
CORS(app, origins="*", allow_headers=["Content-Type"], methods=["GET", "POST", "OPTIONS"])

@app.route('/login', methods=['POST', 'OPTIONS'])
def login_user():
    if request.method == 'OPTIONS':
        return make_response('', 204)

    data = request.get_json()
    usuario = data.get("usuario")
    senha = data.get("senha").encode('utf-8')
    
    if not usuario or not senha:
        return jsonify({"erro": "Dados inválidos."}), 400
    
    conexao = conectar()
    cursor = conexao.cursor()
    
    try:
        cursor.execute("SELECT id, name, email, senha_hash FROM Usuario WHERE name = %s", (usuario,))
        resultado = cursor.fetchone()

        if not resultado:
            return jsonify({"message": "Usuário não encontrado"}), 404
        
        hash_banco = resultado[3].encode('utf-8')
        
        if bcrypt.checkpw(senha, hash_banco):
            return jsonify({
                "id": resultado[0],
                "usuario": resultado[1],
                "email": resultado[2],
            }), 200
        else:
            return jsonify({"message": "Senha incorreta"}), 401
        
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    
    finally:
        cursor.close()
        conexao.close()


@app.route('/register-user', methods=['POST', 'OPTIONS'])
def register_user():
    if request.method == 'OPTIONS':
        return make_response('', 204)

    data = request.get_json()
    usuario = data.get("usuario")
    senha = data.get("senha").encode('utf-8')
    email = data.get("email")
    telefone = data.get("telefone")
    cpf = data.get("cpf")
    cidade = data.get("cidade")
    estado = data.get("estado")
    data_cadastro = datetime.now()
    
    if not usuario or not senha or not email or not telefone or not cpf or not estado:
        return jsonify({"erro": "Dados inválidos."}), 400
    
    conexao = conectar()
    cursor = conexao.cursor()
    senha_hash = bcrypt.hashpw(senha, bcrypt.gensalt())
    
    try:
        cursor.execute("""
            INSERT INTO Usuario 
            (name, senha_hash, email, telefone, cpf, cidade, estado, data_cadastro)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""", 
            (usuario, senha_hash, email, telefone, cpf, cidade, estado, data_cadastro))
        
        conexao.commit()  # ← corrigido: era conectar.commit()
        
        return jsonify({
            "resposta": "ok",
            "id": cursor.lastrowid
        }), 200
    
    except Exception as e:
        return jsonify({
            "resposta": "erro no servidor",
            "erro": str(e)
        }), 500
    
    finally:
        cursor.close()
        conexao.close()


@app.route("/register-ong", methods=["POST", "OPTIONS"])
def register_ong():
    if request.method == 'OPTIONS':
        return make_response('', 204)

    data = request.get_json()
    usuario = data.get("usuario")
    senha = data.get("senha").encode('utf-8')
    email = data.get("email")
    cnpj = data.get("cnpj")
    tipo = data.get("tipo")
    codigo_registro = data.get("codigo_registro")
    cidade = data.get("cidade")
    estado = data.get("estado")
    data_cadastro = datetime.now()
    
    if not usuario or not senha or not email or not cnpj or not tipo or not codigo_registro or not cidade or not estado:
        return jsonify({"erro": "Dados inválidos."}), 400
    
    conexao = conectar()
    cursor = conexao.cursor()
    senha_hash = bcrypt.hashpw(senha, bcrypt.gensalt())
    
    try:
        cursor.execute("""
            INSERT INTO Empresa_Ong
            (nome, senha_hash, email, cnpj, tipo, codigo_registro, cidade, estado, data_cadastro)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (usuario, senha_hash, email, cnpj, tipo, codigo_registro, cidade, estado, data_cadastro))
        
        conexao.commit()  # ← corrigido: era conectar.commit()
        
        return jsonify({
            "resposta": "ok",
            "id": cursor.lastrowid
        }), 200
    
    except Exception as e:
        return jsonify({
            "resposta": "erro no servidor",
            "erro": str(e)
        }), 500
        
    finally:
        cursor.close()
        conexao.close()


@app.route("/criar-denuncia", methods=["POST", "OPTIONS"])
def criar_denuncias():
    if request.method == 'OPTIONS':
        return make_response('', 204)
    data = request.get_json()
    return jsonify({"resposta": "ok"}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)