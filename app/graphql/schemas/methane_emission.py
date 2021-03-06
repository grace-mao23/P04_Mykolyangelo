import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType

from app.graphql.models import MethaneEmission as MethaneEmissionModel
from app.graphql.schemas.country import Country


class MethaneEmission(SQLAlchemyObjectType):
    class Meta:
        model = MethaneEmissionModel


class MethaneEmissionQuery(graphene.ObjectType):
    # begin: Available Queries

    all_methane_emissions = graphene.List(MethaneEmission)

    methane_emission_by_code = graphene.List(lambda: MethaneEmission,
                                             code=graphene.Int())
    all_methane_emission_by_year = graphene.List(lambda: MethaneEmission,
                                                 year=graphene.Int())

    # end

    # begin: MethaneEmission Resolvers

    def resolve_all_methane_emissions(self, info):
        return MethaneEmission.get_query(info).all()

    def resolve_methane_emission_by_code(self, info, code):
        country = Country.get_query(info).filter_by(country_code=code).first()
        return MethaneEmission.get_query(info).filter_by(country=country)

    def resolve_all_methane_emission_by_year(self, info, year):
        return MethaneEmission.get_query(info).filter_by(year=year).all()

    # end
