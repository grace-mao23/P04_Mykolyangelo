import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType

from app.graphql.models import CO2Emission as CO2EmissionModel
from app.graphql.schemas.country import Country


class CO2Emission(SQLAlchemyObjectType):
    class Meta:
        model = CO2EmissionModel


class CO2EmissionQuery(graphene.ObjectType):
    # begin: Available Queries

    all_co2_emissions = graphene.List(CO2Emission)

    co2_emission_by_code = graphene.List(lambda: CO2Emission,
                                         code=graphene.Int())

    all_co2_emission_by_year = graphene.List(lambda: CO2Emission,
                                             year=graphene.Int())

    # end

    # begin: CO2Emission Resolvers

    def resolve_all_co2_emissions(self, info):
        return CO2Emission.get_query(info).all()

    def resolve_co2_emission_by_code(self, info, code):
        country = Country.get_query(info).filter_by(country_code=code).first()
        return CO2Emission.get_query(info).filter_by(country=country)

    def resolve_all_co2_emission_by_year(self, info, year):
        return CO2Emission.get_query(info).filter_by(year=year).all()

    # end
