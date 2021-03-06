import os
import click
import json

from csv import DictReader
from flask import Flask, render_template, g
from flask.cli import with_appcontext
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def create_app(test_config=None):
    app = Flask(__name__,
                instance_relative_config=True,
                static_folder="static")

    os.makedirs(app.instance_path, exist_ok=True)

    db_uri = f'sqlite:///{os.path.join(app.instance_path, "climate.sqlite")}'

    app.config.from_mapping(
        SECRET_KEY=os.environ.get("SECRET_KEY", "dev"),
        SQLALCHEMY_DATABASE_URI=db_uri,
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    db.init_app(app)
    app.cli.add_command(init_db_command)

    from app import graphql, country

    app.register_blueprint(graphql.bp)
    app.register_blueprint(country.bp)

    return app


def init_db(filename):
    from app.graphql.database import migrate

    iso = {}
    countries_topojson = {}

    with open(os.path.join(os.path.dirname(__file__),
                           'static/data/countries-50m.json'),
              mode="r") as f:
        countries_topojson = json.load(f)

    with open(os.path.join(os.path.dirname(__file__), "static/data/iso-codes.json"),
              mode="r") as f:
        iso = json.load(f)

    migrate(os.path.join(os.path.dirname(__file__), f"static/data/{filename}"), iso,
            countries_topojson)


@click.command("init-db")
@click.argument("filename")
@with_appcontext
def init_db_command(filename):
    click.echo("Beginning the migration process. This can take a while.")
    init_db(filename)
    click.echo("Initialized the database.")
