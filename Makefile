all:  requirements.txt
	python3 -m venv env
	. env/bin/activate; pip install -r requirements.txt
	touch env/bin/activate
	flask init-db prelim.csv
	FLASK_ENV=development flask run
