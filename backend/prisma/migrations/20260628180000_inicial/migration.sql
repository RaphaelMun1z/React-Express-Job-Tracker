CREATE TABLE `usuarios` (
  `id` VARCHAR(36) NOT NULL,
  `nome` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `senha_hash` VARCHAR(255) NOT NULL,
  `perfil` ENUM('ADMIN', 'USUARIO') NOT NULL DEFAULT 'USUARIO',
  `ativo` BOOLEAN NOT NULL DEFAULT true,
  `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `atualizado_em` DATETIME(3) NOT NULL,
  UNIQUE INDEX `usuarios_email_key` (`email`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `candidaturas` (
  `id` VARCHAR(64) NOT NULL,
  `empresa` VARCHAR(80) NOT NULL,
  `cargo` VARCHAR(100) NOT NULL,
  `status` VARCHAR(40) NOT NULL,
  `prioridade` VARCHAR(20) NOT NULL,
  `localizacao` VARCHAR(100) NOT NULL DEFAULT '',
  `uf` CHAR(2) NOT NULL DEFAULT '',
  `tecnologias` JSON NOT NULL,
  `modelo_trabalho` VARCHAR(30) NOT NULL DEFAULT '',
  `tipo_contratacao` VARCHAR(30) NOT NULL DEFAULT '',
  `origem` VARCHAR(50) NOT NULL DEFAULT '',
  `link` TEXT NOT NULL,
  `descricao` TEXT NOT NULL,
  `salario` VARCHAR(80) NOT NULL DEFAULT '',
  `beneficios` VARCHAR(180) NOT NULL DEFAULT '',
  `data_candidatura` DATE NOT NULL,
  `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `atualizado_em` DATETIME(3) NOT NULL,
  `historico` JSON NOT NULL,
  `usuario_id` VARCHAR(36) NOT NULL,
  INDEX `candidaturas_usuario_id_idx` (`usuario_id`),
  INDEX `candidaturas_status_idx` (`status`),
  INDEX `candidaturas_prioridade_idx` (`prioridade`),
  INDEX `candidaturas_data_candidatura_idx` (`data_candidatura`),
  INDEX `candidaturas_empresa_idx` (`empresa`),
  PRIMARY KEY (`id`),
  CONSTRAINT `candidaturas_usuario_id_fkey`
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
