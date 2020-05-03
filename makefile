APP_DATASET := data.csv

VIRT_PYTHON := env/bin/python3
VIRT_PIP := env/bin/pip

all: setup
	@export FLASK_APP=app
ifneq ($(wildcard instance/climate.sqlite),)
	@echo "=========================="
	@echo "||Database already exist||"
	@echo "=========================="
else
	$(VIRT_PYTHON) -m flask init-db $(APP_DATASET)
endif
	FLASK_ENV=development $(VIRT_PYTHON) -m flask run


setup: venv requirements.txt
	$(VIRT_PIP) install -r requirements.txt --quiet
	$(VIRT_PIP) list
	

venv:
ifneq ($(wildcard env),)
	@echo "============================================"
	@echo "||Python virtual environment already exist||"
	@echo "============================================"
else
	python3 -m venv env
endif


clean:
	rm -r env
	rm -r instance
