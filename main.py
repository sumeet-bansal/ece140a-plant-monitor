# lab4/lab4.py

import os
from flask import Flask, render_template, g, request, redirect
from sqlite3 import dbapi2 as sqlite3

import json
from itertools import zip_longest as izip

##### APP SETUP #####
app = Flask(__name__)

##### DB SETUP #####

# Setup the database credentials
app.config.update(dict(
	DATABASE=os.path.join(app.root_path, 'data.db'),
	DEBUG=True,
	SECRET_KEY=b'65636531343061',
	USERNAME='admin',
	PASSWORD='ece140a'
))

# Connect to the DB
def connect_db():
	"""Connects to the specific database."""
	rv = sqlite3.connect(app.config['DATABASE'])
	rv.row_factory = sqlite3.Row
	return rv

# Wrap the helper function so we only open the DB once
def get_db():
	"""Opens a new database connection if there is none yet for the
	current application context.
	"""
	if not hasattr(g, 'sqlite_db'):
		g.sqlite_db = connect_db()
	return g.sqlite_db

# Create the database (we do this via command line!!!)
def init_db():
	"""Initializes the database."""
	db = get_db()
	with app.open_resource('schema.sql', mode='r') as f:
		db.cursor().executescript(f.read())
	data = json.load(open('data.json'))

	for i, temp_f in enumerate(data['temp']):
		temp_c = 5*(temp_f-32)/9
		db.execute('INSERT INTO temperature(id, temp_f, temp_c) VALUES(%d, %f, %f)' % (i, temp_f, temp_c))

	for i, humidity in enumerate(data['humidity']):
		db.execute('INSERT INTO humidity(id, value) VALUES(%d, %f)' % (i, humidity))

	r = range(1, len(data['audio'])+1)
	for i, noise, env, gate in izip(r, data['audio'], data['envelope'], data['gate']):
		db.execute('INSERT INTO sound(id, noise, envelope, gate) VALUES (%d, %d, %d, %d)' % (i, noise, env, gate))
	db.commit()

# Command to create the database via command line
# You call it from command line: flask initdb
@app.cli.command('initdb')
def initdb_command():
	"""Creates the database tables."""
	init_db()
	print('Initialized the database.')

# Close the database when the request ends
@app.teardown_appcontext
def close_db(error):
	"""Closes the database again at the end of the request."""
	if hasattr(g, 'sqlite_db'):
		g.sqlite_db.close()

##### ROUTES #####
def query():
	db = get_db()
	data = {}
	temp = [row['temp_f'] for row in db.execute('SELECT * FROM temperature').fetchall()]
	data['temp'] = temp
	humd = [row['value'] for row in db.execute('SELECT * FROM humidity').fetchall()]
	data['humidity'] = humd
	data['noise'] = []
	data['envelope'] = []
	data['gate'] = []
	for row in db.execute('SELECT * FROM sound').fetchall():
		data['noise'].append(row['noise'])
		data['envelope'].append(row['envelope'])
		data['gate'].append(row['gate'])
	return data

def tablenames():
	db = get_db()
	tables = db.execute('SELECT name from sqlite_master WHERE type=\'table\'').fetchall()
	tables = [row['name'].lower() for row in tables]
	return tables

@app.route('/')
def index():
	return render_template('layout.html', tables=tablenames(), data=query())

@app.route('/details/<sensor>')
def details(sensor):
	db = get_db()
	cur = db.execute('SELECT * FROM %s' % sensor).fetchall()
	templateName = 'layout%s.html' % (sensor[0].upper())
	return render_template(templateName, entries=cur, tables=tablenames())

@app.route('/api/<sensor>', methods=['GET'])
def api(sensor):
	count = request.args.get('count')
	db = get_db()
	cur = db.execute('SELECT * FROM %s ORDER BY id DESC LIMIT %s' % (sensor, count)).fetchall()
	return cur

@app.route('/ins/temperature', methods=['POST'])
def insertT():
	db=get_db()
	f = float(request.form['temp_f'])
	c = float(request.form['temp_c'])
	cur = db.execute('INSERT INTO temperature(temp_f,temp_c) VALUES (%f, %f);' % (f,c))
	db.commit()
	return redirect('/details/temperature')

@app.route('/ins/humidity', methods=['POST'])
def insertH():
	db=get_db()
	v = float(request.form['value'])
	cur = db.execute('INSERT INTO  Humidity(value) VALUES  (%f);' % (v))
	db.commit()
	return redirect('/details/humidity')

@app.route('/ins/sound', methods=['POST'])
def insertS():
	db=get_db()
	n = float(request.form['noise'])
	e = float(request.form['envelope'])
	g = float(request.form['gate'])
	cur = db.execute('INSERT INTO Sound(noise, envelope, gate) VALUES (%f, %f, %f);' % (n,e,g))
	db.commit()
	return redirect('/details/sound')

@app.route('/ins/<sensor>', methods=['POST'])
def insert():
	db = get_db()
	cols = list([field for field in request.form])
	vals = list([float(request.form[field]) for field in request.form])
	sql = 'INSERT INTO %s%s VALUES%s' % (sensor, cols, vals)
	db.execute(sql)
	db.commit()
	return redirect('/details/%s' % sensor)
