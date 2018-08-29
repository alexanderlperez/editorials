create table Users (
	id INT,
	editor INT,
	first_name VARCHAR(50),
	last_name VARCHAR(50),
	email VARCHAR(50),
	username VARCHAR(50),
	password VARCHAR(65)
);

insert into users (id, editor, first_name, last_name, email, username, password) values (0, 1, 'Alex', 'Perez', 'alexanderlperez@gmail.com', 'admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918');
insert into users (id, editor, first_name, last_name, email, username, password) values (1, 0, 'Marco', 'Tabini', 'mt@noom.com', '', '');
insert into users (id, editor, first_name, last_name, email, username, password) values (2, 0, 'Rob', 'Rabang', 'rob@noom.com', '', '');
