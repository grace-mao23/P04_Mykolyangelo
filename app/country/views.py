import json

from flask import Blueprint, render_template, redirect, url_for, g

from app import db
from app.graphql.models import (Country, JSONCache)
from app.graphql.schema import schema

bp = Blueprint("country", __name__, url_prefix="", template_folder="templates")


COUNTRY_QUERY = """
{
  allCountries {
    countryName
    countryCode
  }
}
"""




def format_climate_change_query(country_code):
    codes = tuple([country_code for i in range(3)])
    return (
        """
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
        """
        % codes
    )


@bp.route("/")
def index():
    result = schema.execute(COUNTRY_QUERY)
    countries_topojson = JSONCache.query.all()[0].data
    return render_template("index.html", data=list(result.data["allCountries"]), countries_topojson=countries_topojson)


@bp.route("/country/<int:country_code>")
def country(country_code):
    # CO2_QUERY = '''
    # {
    #   co2EmissionByCode(code: %d) {
    #     year
    #     amount
    #   }
    # }
    # ''' % country_code
    # info = schema.execute(CO2_QUERY)
    # print(info.data[0])
    country = Country.query.filter_by(country_code=country_code).first()
    if country is None:
        return redirect(url_for("index"))
    result = schema.execute(format_climate_change_query(country_code))
    # print(json.loads(json.dumps((result.data)))["co2EmissionByCode"])
    return render_template(
        "country.html", country=country, data=json.dumps(result.data), info=json.loads(json.dumps((result.data)))["co2EmissionByCode"]
    )
