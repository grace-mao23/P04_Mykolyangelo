import json

from flask import Blueprint, render_template, redirect, url_for

from app import db
from app.graphql.models import Country
from app.graphql.schema import schema

bp = Blueprint("country", __name__, url_prefix="/country", template_folder="templates")


@bp.route("/<int:country_code>")
def country(country_code):
    country = Country.query.filter_by(country_code=country_code).first()
    if country is None:
        return redirect(url_for("index"))
    query = """
    query {
      co2EmissionByCode(code:56) {
        country {
          countryName
        }
        year
        amount
      }
    }
    """
    result = schema.execute(query, context_value={'session': db})
    return render_template("country.html", country=country, data=json.dumps(result.data))
