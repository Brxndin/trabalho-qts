CREATE DATABASE clinica_cardiologia;

USE clinica_cardiologia;

CREATE TABLE usuarios(
    id int primary key auto_increment,
    nome varchar(200) NOT NULL,
    email varchar(200) NOT NULL,
    tipo int NOT NULL,
    senha varchar(200) NOT NULL
);

-- seeder para usuário adm inicial
INSERT INTO usuarios
(nome, email, tipo, senha)
VALUES ('Administrador', 'admin@ifrs.edu.br', 1, '123456');
