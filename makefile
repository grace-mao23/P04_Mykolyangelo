APP_DATASET := prelim.csv

VIRT_PYTHON := env/bin/python3
VIRT_PIP := env/bin/pip

WIN_PYTHON := env\bin\python3
WIN_PIP := env\bin\pip

OSFLAG :=
ifeq ($(OS),Windows_NT)
	OSFLAG = WIN32
else
	OSFLAG = LINUX
endif

all: setup
	@echo "\nInitializing application database"
	@echo "================================="
ifeq ($(OSFLAG),Windows_NT)
	@$env:FLASK_APP=app
	@$env:FLASK_ENV=development
	$(WIN_PYTHON) -m flask init-db $(APP_DATASET)
	@echo "\nRunning Flask server in development mode"
	@echo "========================================"
	$(WIN_PYTHON) -m flask run
else
	@export FLASK_APP=app
	@export FLASK_ENV=development
	$(VIRT_PYTHON) -m flask init-db $(APP_DATASET)
	@echo "\nRunning Flask server in development mode"
	@echo "========================================"
	$(VIRT_PYTHON) -m flask run
endif

setup: venv requirements.txt
	@echo "\nInstalling packages from requirements.txt..."
	@echo "============================================"
ifeq ($(OSFLAG),Windows_NT)
	$(WIN_PIP) install -r requirements.txt --quiet
	@echo "\nThe following packages are installed:"
	@echo "====================================="
	$(WIN_PIP) list
else
	$(VIRT_PIP) install -r requirements.txt --quiet
	@echo "\nThe following packages are installed:"
	@echo "====================================="
	$(VIRT_PIP) list
endif
	

venv:
	@echo "Setting up Python virtual environment"
	@echo "====================================="
	python3 -m venv env

clean:
	rm -r env
	rm -r instance