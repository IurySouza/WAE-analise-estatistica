INSERT INTO "Tables" (id_join, table_name, insertion_date, "createdAt", "updatedAt") VALUES (1, 'Dados155pacientes2021', NOW(), NOW(), NOW());

INSERT INTO "Tables" (id_join, table_name, insertion_date, "createdAt", "updatedAt") VALUES (2, 'Tabela teste 1', NOW(), NOW(), NOW());

INSERT INTO "Tables" (id_join, table_name, insertion_date, "createdAt", "updatedAt") VALUES (3, 'Tabela teste 2', NOW(), NOW(), NOW());

CREATE TABLE tabela_pacientes (
	id SERIAL,
	numero INT,
	nome_paciente VARCHAR(1000),
	data_coleta DATE,
	histopatológico VARCHAR(100),
	re_valor INT,
	re_append VARCHAR(100),
	pr_valor INT,
	pr_append VARCHAR(100),
	her VARCHAR(100),
	ki67_valor INT,
	CONSTRAINT fk_tabela_pacientes FOREIGN KEY(id_tabela_generica)
		REFERENCES tabela(id),
	CONSTRAINT pk_tabela_pacientes PRIMARY KEY(id);
);

CREATE TABLE tabela (
	id SERIAL,
	id_join INT,
	nome_tabela VARCHAR(100),
	data_insercao DATE,
	CONSTRAINT pk_tabela PRIMARY KEY(id);
);
