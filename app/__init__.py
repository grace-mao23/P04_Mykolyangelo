import os
import click

from csv import (DictReader)
from flask import (Flask, render_template)
from flask.cli import (with_appcontext)
from flask_sqlalchemy import (SQLAlchemy)

db = SQLAlchemy()


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    os.makedirs(app.instance_path, exist_ok=True)

    db_uri = f'sqlite:///{os.path.join(app.instance_path, "climate.sqlite")}'

    app.config.from_mapping(
        SECRET_KEY=os.environ.get("SECRET_KEY", "dev"),
        SQLALCHEMY_DATABASE_URI=db_uri,
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    db.init_app(app)
    app.cli.add_command(init_db_command)

    from app import (graphql, country)

    app.register_blueprint(graphql.bp)
    app.register_blueprint(country.bp)

    @app.route('/')
    def index():
        return render_template('index.html')

    return app


def init_db(filename):
    click.echo("Beginning the migration process. This can take a while.")
    from app.graphql.database import migrate
    migrate(os.path.join(os.path.dirname(__file__), f'static/{filename}'))


@click.command("init-db")
@click.argument("filename")
@with_appcontext
def init_db_command(filename):
    """Clear existing data and create new tables."""
    init_db(filename)
    click.echo("Initialized the database.")
