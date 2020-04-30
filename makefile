nix:  requirements.txt
	python3 -m venv env
	. env/bin/activate; pip install -r requirements.txt
	touch env/bin/activate
	export FLASK_APP=app
	env/bin/python3 -m flask init-db prelim.csv
	FLASK_ENV=development env/bin/python3 -m flask run