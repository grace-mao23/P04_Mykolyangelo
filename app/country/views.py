import json

from flask import Blueprint, render_template, redirect, url_for, g

from app import db
from app.graphql.models import (Country, JSONCache)
from app.graphql.schema import schema

bp = Blueprint("country", __name__, url_prefix="", template_folder="templates")

CO2_EMISSION_QUERY = """
{
  allCo2Emissions {
    country {
      countryName
    }
    year
    amount
  }
}
"""


# TODO: Refactor. THIS IS UGLY.
def format_climate_change_query(country_code):
    codes = tuple([country_code for i in range(3)])
    return ("""
        {
          co2EmissionByCode(code:%d) {
            country {
              countryName
            }
            year
            amount
          }
          methaneEmissionByCode(code:%d) {
            country {
              countryName
            }
            year
            amount
          }
          greenhouseGasEmissionByCode(code:%d) {
            country {
              countryName
            }
            year
            amount
          }
        }
        """ % codes)


@bp.route("/")
def index():
    return render_template("index.html")


@bp.route("/country/<int:country_code>")
def country(country_code):
    country = Country.query.filter_by(country_code=country_code).first()
    if country is None:
        return redirect(url_for("index"))
    result = schema.execute(format_climate_change_query(country_code))
    return render_template("country.html",
                           country=country,
                           data=json.dumps(result.data))


@bp.route("/worldstats")
def worldstats():
    result = schema.execute(CO2_EMISSION_QUERY).data['allCo2Emissions']
    print(result)
    return render_template("world.html", data=list(result))
