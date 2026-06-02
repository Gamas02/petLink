from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from db import conectar
from config import SECRET_KEY, FLASK_DEBUG
from datetime import datetime
from werkzeug.utils import secure_filename

# IMPORTAÇÕES
import uuid
import bcrypt
import os

UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {
    "png", "jpg", "jpeg", "gif",
    "mp4", "mov", "avi"
}

def arquivo_permitido(nome_arquivo):
    return "." in nome_arquivo and \
           nome_arquivo.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

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
        cursor.execute(
            "SELECT id, usuario, email, senha_hash, is_admin FROM Usuario WHERE usuario = %s",
            (usuario,)
        )

        resultado = cursor.fetchone()

        if not resultado:
            return jsonify({"message": "Usuário não encontrado"}), 404

        hash_banco = resultado[3].encode('utf-8')

        if bcrypt.checkpw(senha, hash_banco):
            return jsonify({
                "resposta": "ok",
                "id": resultado[0],
                "usuario": resultado[1],
                "email": resultado[2],
                "is_admin": int(resultado[4])
            }), 200
        else:
            return jsonify({"resposta": "Senha incorreta"}), 401

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
            (usuario, senha_hash, email, telefone, cpf, cidade, estado, data_cadastro)
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
    
    # CORRIGIDO: usar 'nome' em vez de 'usuario'
    nome = data.get("nome")  # ← mudado de usuario para nome
    senha = data.get("senha").encode('utf-8')
    email = data.get("email")
    telefone = data.get("telefone")  # ← adicionado
    cnpj = data.get("cnpj")
    tipo = data.get("tipo")
    codigo_registro = data.get("codigo_registro")
    cidade = data.get("cidade")
    estado = data.get("estado")
    endereco = data.get("endereco")  # ← adicionado
    descricao = data.get("descricao")  # ← adicionado
    tags = data.get("tags")  # ← opcional, pode ser salvo depois
    data_cadastro = datetime.now()
    
    # Validação dos campos obrigatórios
    if not nome or not senha or not email or not cnpj or not tipo or not cidade or not estado or not endereco:
        return jsonify({
            "success": False, 
            "message": f"Dados inválidos. Faltando: nome={nome}, email={email}, cnpj={cnpj}, tipo={tipo}, cidade={cidade}, estado={estado}, endereco={endereco}"
        }), 400
    
    conexao = conectar()
    cursor = conexao.cursor()
    senha_hash = bcrypt.hashpw(senha, bcrypt.gensalt())
    
    try:
        cursor.execute("""
            INSERT INTO Empresa_Ong 
            (nome, senha_hash, email, telefone, cnpj, tipo, codigo_registro, cidade, estado, endereco, descricao, data_cadastro)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (nome, senha_hash, email, telefone, cnpj, tipo, codigo_registro, cidade, estado, endereco, descricao, data_cadastro))
        
        conexao.commit()  
        
        return jsonify({
            "success": True,
            "message": "ONG cadastrada com sucesso!",
            "id": cursor.lastrowid
        }), 200
    
    except Exception as e:
        print(f"Erro: {e}")
        conexao.rollback()
        return jsonify({
            "success": False,
            "message": "Erro ao cadastrar ONG",
            "erro": str(e)
        }), 500
        
    finally:
        cursor.close()
        conexao.close()


@app.route("/criar-denuncia", methods=["POST", "OPTIONS"])
def criar_denuncia():
    if request.method == "OPTIONS":
        return make_response("", 204)

    try:
        data = request.get_json()

        id_usuario = data.get("id_usuario")
        descricao = data.get("descricao")
        tipo = data.get("tipo")
        anonima = data.get("anonima", False)

        latitude = data.get("latitude")
        longitude = data.get("longitude")

        local_texto = data.get("local_texto")
        data_ocorrencia = data.get("data_ocorrencia")

        # Validação básica
        tipos_validos = ["abandono", "agressão", "negligência", "outro"]

        if not descricao or not tipo:
            return jsonify({
                "success": False,
                "message": "Descrição e tipo são obrigatórios."
            }), 400

        if tipo not in tipos_validos:
            return jsonify({
                "success": False,
                "message": "Tipo de denúncia inválido."
            }), 400

        # Conexão banco 
        conexao = conectar()
        cursor = conexao.cursor()

        try:
            cursor.execute("""
                INSERT INTO Denuncia (
                    id_usuario,
                    descricao,
                    tipo,
                    anonima,
                    latitude,
                    longitude,
                    local_texto,
                    data_ocorrencia
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                id_usuario,
                descricao,
                tipo,
                int(bool(anonima)),
                latitude,
                longitude,
                local_texto,
                data_ocorrencia
            ))

            conexao.commit()

            denuncia_id = cursor.lastrowid

            return jsonify({
                "success": True,
                "message": "Denúncia criada com sucesso.",
                "protocolo": denuncia_id
            }), 201

        except Exception as e:
            conexao.rollback()

            return jsonify({
                "success": False,
                "message": "Erro ao salvar denúncia.",
                "erro": str(e)
            }), 500

        finally:
            cursor.close()
            conexao.close()

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro na requisição.",
            "erro": str(e)
        }), 500


@app.route("/denuncia/<int:id>", methods=["GET", "OPTIONS"])
def buscar_denuncia(id):
    if request.method == "OPTIONS":
        return make_response("", 204)

    conexao = conectar()
    cursor = conexao.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT
                id,
                id_usuario,
                descricao,
                tipo,
                status,
                anonima,
                latitude,
                longitude,
                local_texto,
                data_ocorrencia,
                data_criacao
            FROM Denuncia
            WHERE id = %s
        """, (id,))

        denuncia = cursor.fetchone()

        if not denuncia:
            return jsonify({
                "success": False,
                "message": "Denúncia não encontrada."
            }), 404

        return jsonify({
            "success": True,
            "denuncia": denuncia
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao buscar denúncia.",
            "erro": str(e)
        }), 500

    finally:
        cursor.close()
        conexao.close()

@app.route("/upload-denuncia-midia", methods=["POST", "OPTIONS"])
def upload_denuncia_midia():
    if request.method == "OPTIONS":
        return make_response("", 204)

    try:
        # ── Dados obrigatórios ─────────────────────────
        id_denuncia = request.form.get("id_denuncia")

        if not id_denuncia:
            return jsonify({
                "success": False,
                "message": "ID da denúncia é obrigatório."
            }), 400

        if "arquivo" not in request.files:
            return jsonify({
                "success": False,
                "message": "Nenhum arquivo enviado."
            }), 400

        arquivo = request.files["arquivo"]

        if arquivo.filename == "":
            return jsonify({
                "success": False,
                "message": "Arquivo inválido."
            }), 400

        if not arquivo_permitido(arquivo.filename):
            return jsonify({
                "success": False,
                "message": "Tipo de arquivo não permitido."
            }), 400

        # ── Define tipo ────────────────────────────────
        extensao = arquivo.filename.rsplit(".", 1)[1].lower()

        tipo = "video" if extensao in ["mp4", "mov", "avi"] else "foto"

        # ── Nome seguro e único ────────────────────────
        nome_original = secure_filename(arquivo.filename)

        nome_final = f"{uuid.uuid4().hex}_{nome_original}"

        caminho_arquivo = os.path.join(UPLOAD_FOLDER, nome_final)

        # ── Salva arquivo ──────────────────────────────
        arquivo.save(caminho_arquivo)

        # ── URL/local salvo ────────────────────────────
        url_arquivo = f"{UPLOAD_FOLDER}/{nome_final}"

        # ── Banco de dados ─────────────────────────────
        conexao = conectar()
        cursor = conexao.cursor()

        try:
            cursor.execute("""
                INSERT INTO Denuncia_Midia (
                    id_denuncia,
                    tipo,
                    url
                )
                VALUES (%s, %s, %s)
            """, (
                id_denuncia,
                tipo,
                url_arquivo
            ))

            conexao.commit()

            return jsonify({
                "success": True,
                "message": "Mídia enviada com sucesso.",
                "midia_id": cursor.lastrowid,
                "tipo": tipo,
                "url": url_arquivo
            }), 201

        except Exception as e:
            conexao.rollback()

            return jsonify({
                "success": False,
                "message": "Erro ao salvar mídia no banco.",
                "erro": str(e)
            }), 500

        finally:
            cursor.close()
            conexao.close()

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro no upload.",
            "erro": str(e)
        }), 500

@app.route("/ongs", methods=["GET", "OPTIONS"])
def listar_ongs():
    if request.method == "OPTIONS":
        return make_response("", 204)

    conexao = conectar()
    cursor = conexao.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT
                id,
                nome,
                email,
                telefone,
                cnpj,
                tipo,
                codigo_registro,
                cidade,
                estado,
                data_cadastro
            FROM Empresa_Ong
            WHERE ativo = 1
            ORDER BY nome ASC
        """)

        ongs = cursor.fetchall()

        return jsonify({
            "success": True,
            "total": len(ongs),
            "ongs": ongs
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao buscar ONGs.",
            "erro": str(e)
        }), 500

    finally:
        cursor.close()
        conexao.close()

@app.route("/ong/<int:id>", methods=["GET", "OPTIONS"])
def buscar_ong(id):
    if request.method == "OPTIONS":
        return make_response("", 204)

    conexao = conectar()
    cursor = conexao.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT
                id,
                nome,
                email,
                telefone,
                cnpj,
                tipo,
                codigo_registro,
                cidade,
                estado,
                data_cadastro
            FROM Empresa_Ong
            WHERE id = %s
            AND ativo = 1
        """, (id,))

        ong = cursor.fetchone()

        if not ong:
            return jsonify({
                "success": False,
                "message": "ONG não encontrada."
            }), 404

        return jsonify({
            "success": True,
            "ong": ong
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao buscar ONG.",
            "erro": str(e)
        }), 500

    finally:
        cursor.close()
        conexao.close()

@app.route("/doacao", methods=["POST", "OPTIONS"])
def criar_doacao():
    if request.method == "OPTIONS":
        return make_response("", 204)

    try:
        data = request.get_json()

        id_usuario = data.get("id_usuario")
        id_empresa_ong = data.get("id_empresa_ong")
        valor = data.get("valor")

        if not id_empresa_ong or not valor:
            return jsonify({
                "success": False,
                "message": "Dados inválidos."
            }), 400

        conexao = conectar()
        cursor = conexao.cursor()

        try:
            cursor.execute("""
                INSERT INTO Doacao (
                    id_usuario,
                    id_empresa_ong,
                    valor
                )
                VALUES (%s, %s, %s)
            """, (
                id_usuario,
                id_empresa_ong,
                valor
            ))

            conexao.commit()

            return jsonify({
                "success": True,
                "message": "Doação registrada.",
                "doacao_id": cursor.lastrowid
            }), 201

        except Exception as e:
            conexao.rollback()

            return jsonify({
                "success": False,
                "message": "Erro ao registrar doação.",
                "erro": str(e)
            }), 500

        finally:
            cursor.close()
            conexao.close()

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro na requisição.",
            "erro": str(e)
        }), 500

@app.route("/doacoes-usuario/<int:id>", methods=["GET", "OPTIONS"])
def listar_doacoes_usuario(id):
    if request.method == "OPTIONS":
        return make_response("", 204)

    conexao = conectar()
    cursor = conexao.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT
                d.id,
                d.valor,
                d.status,
                d.data_doacao,
                e.nome AS ong_nome
            FROM Doacao d
            LEFT JOIN Empresa_Ong e
                ON d.id_empresa_ong = e.id
            WHERE d.id_usuario = %s
            ORDER BY d.data_doacao DESC
        """, (id,))

        doacoes = cursor.fetchall()

        return jsonify({
            "success": True,
            "total": len(doacoes),
            "doacoes": doacoes
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao buscar doações.",
            "erro": str(e)
        }), 500

    finally:
        cursor.close()
        conexao.close()

@app.route("/notificacoes/<int:id_usuario>", methods=["GET", "OPTIONS"])
def listar_notificacoes(id_usuario):
    if request.method == "OPTIONS":
        return make_response("", 204)

    conexao = conectar()
    cursor = conexao.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT
                id,
                mensagem,
                lida,
                data_envio,
                id_denuncia
            FROM Notificacao
            WHERE id_usuario = %s
            ORDER BY data_envio DESC
        """, (id_usuario,))

        notificacoes = cursor.fetchall()

        return jsonify({
            "success": True,
            "total": len(notificacoes),
            "notificacoes": notificacoes
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao buscar notificações.",
            "erro": str(e)
        }), 500

    finally:
        cursor.close()
        conexao.close()

@app.route("/notificacao/lida/<int:id>", methods=["PUT", "OPTIONS"])
def marcar_notificacao_lida(id):
    if request.method == "OPTIONS":
        return make_response("", 204)

    conexao = conectar()
    cursor = conexao.cursor()

    try:
        cursor.execute("""
            UPDATE Notificacao
            SET lida = 1
            WHERE id = %s
        """, (id,))

        conexao.commit()

        return jsonify({
            "success": True,
            "message": "Notificação marcada como lida."
        }), 200

    except Exception as e:
        conexao.rollback()

        return jsonify({
            "success": False,
            "message": "Erro ao atualizar notificação.",
            "erro": str(e)
        }), 500

    finally:
        cursor.close()
        conexao.close()

@app.route("/perfil/<int:id>", methods=["GET", "OPTIONS"])
def buscar_perfil(id):
    if request.method == "OPTIONS":
        return make_response("", 204)

    conexao = conectar()
    cursor = conexao.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT
                id,
                usuario,
                email,
                telefone,
                cpf,
                cidade,
                estado,
                data_cadastro
            FROM Usuario
            WHERE id = %s
        """, (id,))

        usuario = cursor.fetchone()

        if not usuario:
            return jsonify({
                "success": False,
                "message": "Usuário não encontrado."
            }), 404

        return jsonify({
            "success": True,
            "perfil": usuario
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao buscar perfil.",
            "erro": str(e)
        }), 500

    finally:
        cursor.close()
        conexao.close()

@app.route("/perfil/<int:id>", methods=["PUT", "OPTIONS"])
def editar_perfil(id):
    if request.method == "OPTIONS":
        return make_response("", 204)

    try:
        data = request.get_json()

        telefone = data.get("telefone")
        cidade = data.get("cidade")
        estado = data.get("estado")

        conexao = conectar()
        cursor = conexao.cursor()

        try:
            cursor.execute("""
                UPDATE Usuario
                SET
                    telefone = %s,
                    cidade = %s,
                    estado = %s
                WHERE id = %s
            """, (
                telefone,
                cidade,
                estado,
                id
            ))

            conexao.commit()

            return jsonify({
                "success": True,
                "message": "Perfil atualizado."
            }), 200

        except Exception as e:
            conexao.rollback()

            return jsonify({
                "success": False,
                "message": "Erro ao atualizar perfil.",
                "erro": str(e)
            }), 500

        finally:
            cursor.close()
            conexao.close()

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro na requisição.",
            "erro": str(e)
        }), 500

@app.route("/admin/denuncias", methods=["GET", "OPTIONS"])
def admin_listar_denuncias():
    if request.method == "OPTIONS":
        return make_response("", 204)

    conexao = conectar()
    cursor = conexao.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT
                d.id,
                d.tipo,
                d.status,
                d.descricao,
                d.data_criacao,
                u.usuario
            FROM Denuncia d
            LEFT JOIN Usuario u
                ON d.id_usuario = u.id
            ORDER BY d.data_criacao DESC
        """)

        denuncias = cursor.fetchall()

        return jsonify({
            "success": True,
            "total": len(denuncias),
            "denuncias": denuncias
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao buscar denúncias.",
            "erro": str(e)
        }), 500

    finally:
        cursor.close()
        conexao.close()

@app.route("/admin/denuncia-status/<int:id>", methods=["PUT", "OPTIONS"])
def admin_atualizar_status_denuncia(id):
    if request.method == "OPTIONS":
        return make_response("", 204)

    try:
        data = request.get_json()

        status = data.get("status")

        status_validos = [
            "aberta",
            "em_analise",
            "resolvida",
            "arquivada"
        ]

        if status not in status_validos:
            return jsonify({
                "success": False,
                "message": "Status inválido."
            }), 400

        conexao = conectar()
        cursor = conexao.cursor()

        try:
            cursor.execute("""
                UPDATE Denuncia
                SET status = %s
                WHERE id = %s
            """, (
                status,
                id
            ))

            conexao.commit()

            return jsonify({
                "success": True,
                "message": "Status atualizado."
            }), 200

        except Exception as e:
            conexao.rollback()

            return jsonify({
                "success": False,
                "message": "Erro ao atualizar status.",
                "erro": str(e)
            }), 500

        finally:
            cursor.close()
            conexao.close()

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro na requisição.",
            "erro": str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)