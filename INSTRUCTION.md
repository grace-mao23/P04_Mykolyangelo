# Instructions

## 1. Clone the repo

```bash
git clone https://github.com/grace-mao23/P04_Mykolyangelo.git
```

## 2. Create a Python virtual environment

```bash
python3 -m venv env
source env/bin/activate
```

## 3. Install all required packages

```bash
pip install -r requirements.txt
```

## 4. Set Flask app location

Linux and Macs
---
```bash
export FLASK_APP=app
```

Windows
---
```bash
set FLASK_APP=app
```

## 5. Migrate CSV to a SQLite database

```bash
flask init-db {Replace with the name of the CSV file}
```

5. Run the app with Flask CLI in development mode

Linux and Macs
---
```bash
FLASK_ENV=development flask run
```

Windows
---
```windows
set FLASK_ENV=development
flask run
```
