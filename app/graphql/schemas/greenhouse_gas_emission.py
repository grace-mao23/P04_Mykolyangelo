import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType

from app.graphql.models import GreenhouseGasEmission
from app.graphql.schemas.country import Country


class GreenhouseGasEmission(SQLAlchemyObjectType):
    class Meta:
        model = GreenhouseGasEmission


class GreenhouseGasEmissionQuery(graphene.ObjectType):
    # begin: Available Queries

    greenhouse_gas_emission_by_code = graphene.List(
        lambda: GreenhouseGasEmission, code=graphene.Int()
    )
    all_greenhouse_gas_emission_by_year = graphene.List(
        lambda: GreenhouseGasEmission, year=graphene.Int()
    )

    # end

    # begin: GreenhouseGasEmission Resolvers

    def resolve_greenhouse_gas_emission_by_code(self, info, code):
        country = Country.get_query(info).filter_by(country_code=code).first()
        return GreenhouseGasEmission.get_query(info).filter_by(country=country)

    def resolve_all_greenhouse_gas_emission_by_year(self, info, year):
        return GreenhouseGasEmission.get_query(info).filter_by(year=year).all()

    # end
