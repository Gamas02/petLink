-- ============================================================
--  002_chatbot_denuncia.sql
--  Adiciona coluna local_texto à tabela Denuncia
--  (campo livre coletado pelo chatbot Rasa)
-- ============================================================
USE petcare_db;

ALTER TABLE Denuncia
    ADD COLUMN IF NOT EXISTS local_texto VARCHAR(255) NULL
        COMMENT 'Endereço/descrição de local coletado pelo chatbot'
    AFTER longitude;
