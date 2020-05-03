from flask import Blueprint, request, jsonify
from flask_graphql import GraphQLView

from app.graphql.schema import schema

bp = Blueprint("graphql", __name__, url_prefix="/graphql")


bp.add_url_rule(
    "",
    view_func=GraphQLView.as_view(
        "graphql", schema=schema, graphiql=True  # for having the GraphiQL interface
    ),
)
