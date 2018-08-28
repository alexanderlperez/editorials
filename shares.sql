create table Shares (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	created DATE,
	accessed DATE,
	authorId INT,
	userId INT,
    articleId INT,
    uuid STRING
);
