import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType

from app.graphql.models import CO2EmissionPerCapita
from app.graphql.schemas.country import Country


class CO2EmissionPerCapita(SQLAlchemyObjectType):
    class Meta:
        model = CO2EmissionPerCapita


class CO2EmissionPerCapitaQuery(graphene.ObjectType):
    # begin: Available Queries

    co2_emission_per_capita_by_code = graphene.List(
        lambda: CO2EmissionPerCapita, code=graphene.Int())

    all_co2_emission_per_capita_by_code = graphene.Field(
        lambda: CO2EmissionPerCapita, year=graphene.Int())

    # end

    # begin: CO2EmissionPerCapita Resolvers

    def resolve_co2_emission_per_capita_by_code(self, info, code):
        country = Country.get_query(info).filter_by(country_code=code).first()
        return CO2EmissionPerCapita.get_query(info).filter_by(country=country)

    def resolve_all_co2_emission_per_capita_by_code(self, info, year):
        return CO2EmissionPerCapita.get_query(info).filter_by(year=year).all()

    # end
