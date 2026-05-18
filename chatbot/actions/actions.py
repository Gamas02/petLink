"""
actions.py  –  Custom Actions do Chatbot de Denúncias PetLink
Rasa SDK 3.6.x  |  MySQL via mysql-connector-python
"""

import os
import logging
from datetime import datetime
from typing import Any, Dict, List, Optional, Text

import mysql.connector
from rasa_sdk import Action, FormValidationAction, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import AllSlotsReset, SlotSet
from rasa_sdk.types import DomainDict

logger = logging.getLogger(__name__)

# ──────────────────────────────────────────────────────────────
#  Configuração do banco (lê do ambiente — igual ao backend Flask)
# ──────────────────────────────────────────────────────────────
DB_CONFIG = {
    "host":     os.getenv("DB_HOST",     "mysql"),
    "port":     int(os.getenv("DB_PORT", "3306")),
    "user":     os.getenv("DB_USER",     "app_user"),
    "password": os.getenv("DB_PASSWORD", "apppass123"),
    "database": os.getenv("DB_NAME",     "petcare_db"),
}

TIPO_SINONIMOS = {
    "1":          "abandono",
    "2":          "agressão",
    "3":          "negligência",
    "4":          "outro",
    "agressao":   "agressão",
    "negligencia":"negligência",
}

LOCAL_DESCONHECIDO = {"não sei", "nao sei", "não", "nao", "sem endereço", "sem endereco", "-"}
DATA_DESCONHECIDA  = {"não sei", "nao sei", "não", "nao", "sem data", "-"}


def _conectar() -> mysql.connector.MySQLConnection:
    return mysql.connector.connect(**DB_CONFIG)


def _normalizar_tipo(valor: Optional[str]) -> Optional[str]:
    if not valor:
        return None
    v = valor.strip().lower()
    return TIPO_SINONIMOS.get(v, valor.strip())


def _normalizar_local(valor: Optional[str]) -> Optional[str]:
    if not valor:
        return None
    return None if valor.strip().lower() in LOCAL_DESCONHECIDO else valor.strip()


def _normalizar_data(valor: Optional[str]) -> Optional[datetime]:
    if not valor or valor.strip().lower() in DATA_DESCONHECIDA:
        return None
    for fmt in ("%d/%m/%Y %H:%M", "%d/%m/%Y", "%Y-%m-%d %H:%M", "%Y-%m-%d"):
        try:
            return datetime.strptime(valor.strip(), fmt)
        except ValueError:
            continue
    return None  # data em linguagem natural: não tenta parsear


# ══════════════════════════════════════════════════════════════
#  VALIDAÇÃO DO FORMULÁRIO
# ══════════════════════════════════════════════════════════════
class ValidateDenunciaForm(FormValidationAction):
    """Valida cada slot do denuncia_form antes de prosseguir."""

    def name(self) -> Text:
        return "validate_denuncia_form"

    # ----------------------------------------------------------
    #  anonima
    # ----------------------------------------------------------
    def validate_anonima(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        texto = str(slot_value).strip().lower()
        if texto in ("sim", "s", "1", "yes", "y"):
            return {"anonima": "sim"}
        if texto in ("nao", "não", "n", "2", "no"):
            return {"anonima": "nao"}
        dispatcher.utter_message(
            text="⚠️ Por favor, responda apenas *sim* ou *não*."
        )
        return {"anonima": None}

    # ----------------------------------------------------------
    #  tipo_denuncia
    # ----------------------------------------------------------
    def validate_tipo_denuncia(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        tipos_validos = {"abandono", "agressão", "negligência", "outro"}
        normalizado = _normalizar_tipo(str(slot_value))
        if normalizado and normalizado.lower() in tipos_validos:
            return {"tipo_denuncia": normalizado}
        dispatcher.utter_message(
            text=(
                "⚠️ Tipo inválido. Escolha uma das opções:\n"
                "1 - Abandono  |  2 - Agressão  |  3 - Negligência  |  4 - Outro"
            )
        )
        return {"tipo_denuncia": None}

    # ----------------------------------------------------------
    #  descricao
    # ----------------------------------------------------------
    def validate_descricao(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        texto = str(slot_value).strip()
        if len(texto) < 10:
            dispatcher.utter_message(
                text="⚠️ Por favor, forneça uma descrição mais detalhada (mínimo 10 caracteres)."
            )
            return {"descricao": None}
        return {"descricao": texto}

    # ----------------------------------------------------------
    #  local (aceita "não sei")
    # ----------------------------------------------------------
    def validate_local(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        local = _normalizar_local(str(slot_value))
        # None significa "não sabe" – ok, aceito
        return {"local": local if local else "não informado"}

    # ----------------------------------------------------------
    #  data_ocorrencia (aceita "não sei" e datas livres)
    # ----------------------------------------------------------
    def validate_data_ocorrencia(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        valor = str(slot_value).strip()
        if valor.lower() in DATA_DESCONHECIDA:
            return {"data_ocorrencia": "não informada"}
        return {"data_ocorrencia": valor}


# ══════════════════════════════════════════════════════════════
#  ACTION: Mostrar resumo antes da confirmação
# ══════════════════════════════════════════════════════════════
class ActionMostrarResumo(Action):
    def name(self) -> Text:
        return "action_mostrar_resumo"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> List[Dict[Text, Any]]:

        anonima  = tracker.get_slot("anonima")
        tipo     = tracker.get_slot("tipo_denuncia")
        descricao= tracker.get_slot("descricao")
        local    = tracker.get_slot("local") or "Não informado"
        data     = tracker.get_slot("data_ocorrencia") or "Não informada"

        anonima_label = "✅ Sim" if anonima == "sim" else "❌ Não"

        resumo = (
            f"📋 *Resumo da sua denúncia:*\n\n"
            f"🔒 Anônima: {anonima_label}\n"
            f"⚠️ Tipo: {tipo}\n"
            f"📝 Descrição: {descricao}\n"
            f"📍 Local: {local}\n"
            f"📅 Data da ocorrência: {data}\n\n"
            "As informações estão corretas?\n"
            "Responda *sim* para confirmar e registrar a denúncia\n"
            "ou *não* para cancelar."
        )
        dispatcher.utter_message(text=resumo)
        return []


# ══════════════════════════════════════════════════════════════
#  ACTION: Salvar denúncia no MySQL
# ══════════════════════════════════════════════════════════════
class ActionSalvarDenuncia(Action):
    def name(self) -> Text:
        return "action_salvar_denuncia"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> List[Dict[Text, Any]]:

        # Coleta slots
        anonima_slot   = tracker.get_slot("anonima")
        tipo           = tracker.get_slot("tipo_denuncia") or "outro"
        descricao      = tracker.get_slot("descricao") or ""
        local_texto    = tracker.get_slot("local")
        data_slot      = tracker.get_slot("data_ocorrencia")
        id_usuario_str = tracker.get_slot("id_usuario")

        # Normaliza
        anonima    = 1 if anonima_slot == "sim" else 0
        id_usuario = None if anonima or not id_usuario_str else _safe_int(id_usuario_str)
        local_txt  = None if local_texto in ("não informado", None) else local_texto
        data_dt    = _normalizar_data(data_slot) if data_slot not in ("não informada", None) else None

        # ALTERAR ISSO
        # SOMENTE O BACKEND PODE CONECTAR COM O BANCO DE DADOS
        try:
            conn = _conectar()
            cur  = conn.cursor()

            cur.execute(
                """
                INSERT INTO Denuncia
                    (id_usuario, descricao, tipo, status, anonima,
                     local_texto, data_ocorrencia, data_criacao)
                VALUES (%s, %s, %s, 'aberta', %s, %s, %s, NOW())
                """,
                (id_usuario, descricao, tipo, anonima, local_txt, data_dt),
            )
            conn.commit()
            denuncia_id = cur.lastrowid

            # Notificação para usuário identificado
            if id_usuario:
                cur.execute(
                    """
                    INSERT INTO Notificacao (id_usuario, id_denuncia, mensagem)
                    VALUES (%s, %s, %s)
                    """,
                    (
                        id_usuario,
                        denuncia_id,
                        f"Sua denúncia #{denuncia_id} foi registrada com sucesso e está sendo analisada.",
                    ),
                )
                conn.commit()

            cur.close()
            conn.close()

            dispatcher.utter_message(
                text=(
                    f"✅ *Denúncia registrada com sucesso!*\n\n"
                    f"🔖 Número do protocolo: *#{denuncia_id}*\n\n"
                    "Nossa equipe irá analisar sua denúncia em breve.\n"
                    "Obrigado por ajudar a proteger os animais! 🐾\n\n"
                    "Se quiser registrar uma nova denúncia, é só digitar *denunciar*."
                )
            )

            # Limpa os slots para permitir nova denúncia
            return [
                AllSlotsReset(),
                SlotSet("id_usuario", id_usuario_str),  # mantém o id do usuário logado
            ]

        except mysql.connector.Error as err:
            logger.error("Erro MySQL ao salvar denúncia: %s", err)
            dispatcher.utter_message(
                text=(
                    "⚠️ Ocorreu um erro ao salvar sua denúncia. "
                    "Por favor, tente novamente em alguns instantes."
                )
            )
            return []


# ──────────────────────────────────────────────────────────────
#  Utilidades
# ──────────────────────────────────────────────────────────────
def _safe_int(value: Any) -> Optional[int]:
    try:
        return int(value)
    except (TypeError, ValueError):
        return None
