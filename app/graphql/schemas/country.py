import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType

from app.graphql.models import Country


class Country(SQLAlchemyObjectType):
    class Meta:
        model = Country
        interfaces = (graphene.relay.Node, )


class CountryQuery(graphene.ObjectType):
    # begin: Available Queries

    all_countries = graphene.List(Country)
    country_by_code = graphene.Field(lambda: Country, code=graphene.Int())

    # end

    # begin: Country Resolvers

    def resolve_all_countries(self, info):
        return Country.get_query(info).all()

    def resolve_country_by_code(self, info, code):
        return Country.get_query(info).filter_by(country_code=code).first()

    # end
