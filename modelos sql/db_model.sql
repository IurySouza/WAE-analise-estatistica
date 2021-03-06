CREATE TABLE bc_patients (
	id SERIAL,
	table_name VARCHAR(100),
    insertion_date DATE,
    register_number: INTEGER,
    pesticide_exposure: BOOLEAN,
    estrogen_receptors: BOOLEAN,
    progesterone_receptors: BOOLEAN,
    her2: BOOLEAN,
    ki67: BOOLEAN,
    molecular_subtype_tumor_id: INTEGER,
    molecular_subtype_tumor: VARCHAR(100),
    tumor_size: BOOLEAN,
    histological_grade: BOOLEAN,
    lymphnodal_metastasis: BOOLEAN,
    risk_stratification: VARCHAR(100),
    age_diagnosis: INTEGER,
    early_onset: BOOLEAN,
    menopause_at_diagnosis: BOOLEAN,
    weight: NUMERIC,
    height: NUMERIC,
    bmi: NUMERIC,
    trophic_adipose_status: VARCHAR(100),
	CONSTRAINT pk_bc_patient PRIMARY KEY(id);
);

CREATE TABLE users(
    id SERIAL,
    name: VARCHAR(100),
    email: VARCHAR(100),
    password: VARCHAR(100),
    CONSTRAINT pk_user PRIMARY KEY(id);
);

UPDATE "BCPatients" SET risk_stratification = 'Intermediate' WHERE risk_stratification LIKE 'Intermediate%';