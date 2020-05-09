import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType

from app.graphql.models import JSONCache as JSONCacheModel


class JSONCache(SQLAlchemyObjectType):
    class Meta:
        model = JSONCacheModel


class JSONCacheQuery(graphene.ObjectType):
    # begin: Available Queries

    data_by_name = graphene.Field(lambda: JSONCache,
                                  data_name=graphene.String())

    # end

    # begin: JSONCache Resolvers

    def resolve_data_by_name(self, info, data_name):
        return JSONCache.get_query(info).filter_by(data_name=data_name).first()

    # end
