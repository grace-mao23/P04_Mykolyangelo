import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField

from app.graphql.models import Population
from app.graphql.schemas.country import Country


class Population(SQLAlchemyObjectType):
    class Meta:
        model = Population
        interfaces = (graphene.relay.Node, )


class PopulationQuery(graphene.ObjectType):
    node = graphene.relay.Node.Field()

    # begin: Available Queries

    all_populations = SQLAlchemyConnectionField(Population)
    population_by_code = graphene.Field(lambda: Population,
                                        code=graphene.Int())

    # end

    # begin: Population Resolvers

    def resolve_population_by_code(self, info, code):
        return Population.get_query(info).filter_by(country_code=code).first()

    # end
