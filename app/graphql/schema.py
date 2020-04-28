import graphene
from graphene_sqlalchemy import (SQLAlchemyObjectType,
                                 SQLAlchemyConnectionField)

from app.graphql.models import (Country)


class Country(SQLAlchemyObjectType):
    class Meta:
        model = Country
        interfaces = (graphene.relay.Node, )


class Query(graphene.ObjectType):
    countries = graphene.List(Country)
    country_by_code = graphene.Field(
        lambda: Country, country_code=graphene.String())

    def resolve_countries(self, info):
        return Country.get_query(info).all()

    def resolve_country_by_code(self, info, country_code):
        return Country.get_query(info).filter_by(country_code=country_code).first()


schema = graphene.Schema(query=Query)
