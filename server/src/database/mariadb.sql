CREATE DATABASE clinica_cardiologia;

USE clinica_cardiologia;

CREATE TABLE usuarios(
    id int primary key auto_increment,
    nome varchar(200) NOT NULL,
    email varchar(200) NOT NULL,
    senha varchar(200),
    cpf char(11),
    endereco varchar(200),
    telefone varchar(100)
);

CREATE TABLE usuarios_tipos(
    id int primary key auto_increment,
    tipo int NOT NULL,
    usuario_id int NOT NULL,

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- senha Senha.123
INSERT INTO usuarios
(nome, email, senha, cpf, endereco, telefone)
VALUES ('Administrador', 'admin@ifrs.edu.br', '$2b$12$fkCox86SvdMTzA7c6XDWLuIEBeq7fPa2ST3Uql8iY5sFkgD/9erXi', null, null, null);

INSERT INTO usuarios_tipos
(tipo, usuario_id)
VALUES (1, 1);

CREATE TABLE recuperacao_senhas(
    id int primary key auto_increment,
    token varchar(200) NOT NULL,
    data_expiracao datetime NOT NULL,
    usuario_id int NOT NULL,

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE medicos(
    id int primary key auto_increment,
    crm varchar(200) NOT NULL,
    usuario_id int NOT NULL,

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE funcionarios(
    id int primary key auto_increment,
    funcao varchar(200) NOT NULL,
    usuario_id int NOT NULL,

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE pacientes(
    id int primary key auto_increment,
    data_nascimento date NOT NULL,
    usuario_id int NOT NULL,

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE consultas(
    id int primary key auto_increment,
    codigo int NOT NULL,
    data_hora_atendimento datetime NOT NULL,
    paciente_id int NOT NULL,
    medico_id int NOT NULL,
    descricao_sintomas varchar(200) NOT NULL,
    temperatura int NOT NULL,
    peso int NOT NULL,
    diagnostico_e_tratamento_sugerido text NOT NULL,
    status_pagamento int NOT NULL,

    FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    FOREIGN KEY (medico_id) REFERENCES medicos(id)
);
