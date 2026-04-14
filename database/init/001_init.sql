-- =============================================================
--  001_init.sql  –  Inicialização do banco de dados
--  Criado para MySQL 8.0
-- =============================================================
CREATE DATABASE IF NOT EXISTS petcare_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE petcare_db;

--  1. Usuario
CREATE TABLE IF NOT EXISTS Usuario (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NULL,
  cpf VARCHAR(14) NOT NULL,
  cidade VARCHAR(100) NULL,
  estado CHAR(2) NULL,
  data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ativo TINYINT(1) NOT NULL DEFAULT 1,

  PRIMARY KEY (id),
  CONSTRAINT uq_usuario_email UNIQUE (email),
  CONSTRAINT uq_usuario_cpf   UNIQUE (cpf)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--  2. Empresa_Ong
CREATE TABLE IF NOT EXISTS Empresa_Ong (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NULL,
  cnpj VARCHAR(18) NOT NULL,
  tipo ENUM('ong', 'canil') NOT NULL,
  codigo_registro VARCHAR(50)       NULL,
  cidade VARCHAR(100) NULL,
  estado CHAR(2) NULL,
  data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ativo TINYINT(1) NOT NULL DEFAULT 1,

  PRIMARY KEY (id),
  CONSTRAINT uq_empresa_email UNIQUE (email),
  CONSTRAINT uq_empresa_cnpj  UNIQUE (cnpj)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--  3. Denuncia
CREATE TABLE IF NOT EXISTS Denuncia (
  id INT NOT NULL AUTO_INCREMENT,
  id_usuario INT NULL,
  descricao TEXT NOT NULL,
  tipo ENUM('abandono', 'agressão', 'negligência', 'outro') NOT NULL,
  status ENUM('aberta', 'em_analise', 'resolvida', 'arquivada') NOT NULL DEFAULT 'aberta',
  anonima TINYINT(1) NOT NULL DEFAULT 0,
  latitude DECIMAL(10,8) NULL,
  longitude DECIMAL(11,8) NULL,
  data_ocorrencia DATETIME NULL,
  data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  CONSTRAINT fk_denuncia_usuario FOREIGN KEY(id_usuario) REFERENCES Usuario(id) ON DELETE SET NULL ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--  4. Doacao
CREATE TABLE IF NOT EXISTS Doacao (
  id INT NOT NULL AUTO_INCREMENT,
  id_usuario INT NULL,
  id_empresa_ong INT NULL,
  valor DECIMAL(10,2)  NOT NULL,
  status ENUM('pendente', 'confirmada', 'cancelada') NOT NULL DEFAULT 'pendente',
  data_doacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  CONSTRAINT fk_doacao_usuario FOREIGN KEY(id_usuario) REFERENCES Usuario(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_doacao_empresa FOREIGN KEY(id_empresa_ong) REFERENCES Empresa_Ong (id) ON DELETE SET NULL ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--  5. Denuncia_Midia
CREATE TABLE IF NOT EXISTS Denuncia_Midia (
  id INT NOT NULL AUTO_INCREMENT,
  id_denuncia INT NOT NULL,
  tipo ENUM('foto', 'video') NOT NULL,
  url VARCHAR(255) NOT NULL,
  data_upload DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  CONSTRAINT fk_midia_denuncia FOREIGN KEY(id_denuncia) REFERENCES Denuncia(id) ON DELETE CASCADE ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--  6. Notificacao
CREATE TABLE IF NOT EXISTS Notificacao (
  id INT NOT NULL AUTO_INCREMENT,
  id_usuario INT NULL,
  id_denuncia INT NULL,
  mensagem TEXT NOT NULL,
  lida TINYINT(1) NOT NULL DEFAULT 0,
  data_envio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  CONSTRAINT fk_notif_usuario FOREIGN KEY (id_usuario)  REFERENCES Usuario  (id)ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_notif_denuncia FOREIGN KEY (id_denuncia) REFERENCES Denuncia (id)ON DELETE SET NULL ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;