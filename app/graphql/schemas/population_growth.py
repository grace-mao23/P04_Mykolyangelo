import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType

from app.graphql.models import PopulationGrowth
from app.graphql.schemas.country import Country


class PopulationGrowth(SQLAlchemyObjectType):
    class Meta:
        model = PopulationGrowth


class PopulationGrowthQuery(graphene.ObjectType):
    # begin: Available Queries

    population_growth_by_code = graphene.List(
        lambda: PopulationGrowth, code=graphene.Int()
    )

    # end

    # begin: PopulationGrowth Resolvers

    def resolve_population_growth_by_code(self, info, code):
        country = Country.get_query(info).filter_by(country_code=code).first()
        return PopulationGrowth.get_query(info).filter_by(country=country)

    # end
