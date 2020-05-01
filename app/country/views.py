from flask import (Blueprint, request, jsonify)

bp = Blueprint('country', __name__, url_prefix='/country')

@bp.route('/<string:name>')
def country(name):
    return f'Hello {name}'
