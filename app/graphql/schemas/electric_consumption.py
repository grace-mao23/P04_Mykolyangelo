import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType

from app.graphql.models import ElectricConsumption
from app.graphql.schemas.country import Country


class ElectricConsumption(SQLAlchemyObjectType):
    class Meta:
        model = ElectricConsumption


class ElectricConsumptionQuery(graphene.ObjectType):
    # begin: Available Queries

    electric_consumption_by_code = graphene.List(lambda: ElectricConsumption,
                                                 code=graphene.Int())

    # end

    # begin: ElectricConsumption Resolvers

    def resolve_electric_consumption_by_code(self, info, code):
        country = Country.get_query(info).filter_by(country_code=code).first()
        return ElectricConsumption.get_query(info).filter_by(country=country)

    # end
