
/*DROP TABLE IF EXISTS units_master;
DROP TABLE IF EXISTS system_users;
DROP TABLE IF EXISTS current_user;
DROP TABLE IF EXISTS audits;
DROP TABLE IF EXISTS indicator_data;
DROP TABLE IF EXISTS indicator_data_entry;
DROP TABLE IF EXISTS incident_data;
DROP TABLE IF EXISTS pending_actions;
DROP TABLE IF EXISTS mapped_org_nodes;
DROP TABLE IF EXISTS indicator_records;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS save_record;*/


CREATE TABLE IF NOT EXISTS units_master(
    pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
    units TEXT,
    tag varchar(50)
);
 
CREATE TABLE IF NOT EXISTS system_users(
    pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
    system_user_id varchar(50),
    system_user_name varchar(250),
    is_active INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS current_user(
    pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id varchar(50) ,
    user_name varchar(250) NOT NULL UNIQUE,
    user_obj TEXT
);

CREATE TABLE IF NOT EXISTS audits(
    pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id varchar(50),
    _id varchar(50),
    audits_data TEXT,
    FOREIGN KEY (user_id) REFERENCES current_user (user_id) 
			ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS actions(
    pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id varchar(50),
    _id varchar(50),
    action_data TEXT,
    FOREIGN KEY (user_id) REFERENCES current_user (user_id) 
			ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS indicators(
    pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id varchar(50),
    _id varchar(50),
    audits_data TEXT,
    FOREIGN KEY (user_id) REFERENCES current_user (user_id) 
			ON DELETE CASCADE ON UPDATE NO ACTION
);
CREATE TABLE IF NOT EXISTS incidents(
    pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id varchar(50),
    _id varchar(50),
    audits_data TEXT,
    FOREIGN KEY (user_id) REFERENCES current_user (user_id) 
			ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS indicator_data(
    pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id varchar(50),
    indicator_data TEXT,
    FOREIGN KEY (user_id) REFERENCES current_user (user_id) 
			ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS indicator_data_entry(
    pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
    _id varchar(50) NOT NULL UNIQUE,
    tag varchar(50),
    indicators TEXT
);

CREATE TABLE IF NOT EXISTS incident_data(
    pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
    _id varchar(50),
    tag varchar(50),
    incident_data TEXT
);

CREATE TABLE IF NOT EXISTS pending_actions(
    pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
    indicator_id varchar(50) NOT NULL UNIQUE,
    actions TEXT
);

CREATE TABLE IF NOT EXISTS mapped_org_nodes(
    pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
    indicator_id varchar(50) NOT NULL UNIQUE,
    org_nodes TEXT,
    tag varchar(50)
);

CREATE TABLE IF NOT EXISTS indicator_records(
    pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
    indicator_id varchar(50) NOT NULL UNIQUE,
    indicator TEXT,
    indicator_records TEXT,
    indicator_records_count INTEGER
);

CREATE TABLE IF NOT EXISTS comments(
    pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_id varchar(50),
    comments TEXT
);

CREATE TABLE IF NOT EXISTS projects(
    pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
    projects TEXT
);
CREATE TABLE IF NOT EXISTS save_record_data(
    pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
    _id varchar(50),
    indicator_record TEXT,
    tag varchar(50)
);

CREATE TABLE IF NOT EXISTS update_record(
    pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
    _id varchar(50),
    indicator_record TEXT,
    tag varchar(50),
    indicator_id TEXT
);
CREATE TABLE IF NOT EXISTS delete_record(
    pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
    _id varchar(50),
    record_id TEXT
);

CREATE TABLE IF NOT EXISTS activities(
    pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id varchar(50),
    activities TEXT
);

