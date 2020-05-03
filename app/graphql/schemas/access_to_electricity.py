import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType

from app.graphql.models import AccessToElectricity
from app.graphql.schemas.country import Country


class AccessToElectricity(SQLAlchemyObjectType):
    class Meta:
        model = AccessToElectricity


class AccessToElectricityQuery(graphene.ObjectType):
    # begin: Available Queries

    access_to_electricity_by_code = graphene.List(
        lambda: AccessToElectricity, code=graphene.Int()
    )

    # end

    # begin: AccessToElectricity Resolvers

    def resolve_access_to_electricity_by_code(self, info, code):
        country = Country.get_query(info).filter_by(country_code=code).first()
        return AccessToElectricity.get_query(info).filter_by(country=country)

    # end
