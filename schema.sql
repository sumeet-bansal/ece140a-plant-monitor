CREATE TABLE temperature (
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
	temp_f   integer NOT NULL,
	temp_c   integer NOT NULL
);

CREATE TABLE Humidity (
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
	value   integer NOT NULL
);

CREATE TABLE Sound (
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
	noise   integer NOT NULL,
	envelope   integer NOT NULL,
	gate   integer NOT NULL
);
