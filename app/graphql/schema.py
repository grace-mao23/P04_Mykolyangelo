import graphene
from graphene_sqlalchemy import (SQLAlchemyObjectType)

from app.graphql.models import (
    Country, CO2Emission, MethaneEmission, GreenhouseGasEmission)


class Country(SQLAlchemyObjectType):
    class Meta:
        model = Country
        interfaces = (graphene.relay.Node, )


class CO2Emission(SQLAlchemyObjectType):
    class Meta:
        model = CO2Emission
        interfaces = (graphene.relay.Node, )


class MethaneEmission(SQLAlchemyObjectType):
    class Meta:
        model = MethaneEmission
        interfaces = (graphene.relay.Node, )


class GreenhouseGasEmission(SQLAlchemyObjectType):
    class Meta:
        model = GreenhouseGasEmission
        interfaces = (graphene.relay.Node, )


class Query(graphene.ObjectType):
    countries = graphene.List(Country)
    country_by_code = graphene.Field(
        lambda: Country, country_code=graphene.String())

    co2emission_by_code = graphene.Field(
        lambda: CO2Emission, country_code=graphene.String(), time=graphene.String()
    )
    all_co2emission_by_time = graphene.List(
        lambda: CO2Emission, time=graphene.String()
    )

    methaneemission_by_code = graphene.Field(
        lambda: MethaneEmission, country_code=graphene.String(), time=graphene.String()
    )
    all_methaneemission_by_time = graphene.List(
        lambda: MethaneEmission, time=graphene.String()
    )

    greenhousegasemission_by_code = graphene.Field(
        lambda: GreenhouseGasEmission, country_code=graphene.String(), time=graphene.String()
    )
    all_greenhousegasemission_by_time = graphene.List(
        lambda: GreenhouseGasEmission, time=graphene.String()
    )

    def resolve_countries(self, info):
        return Country.get_query(info).all()

    def resolve_country_by_code(self, info, country_code):
        return Country.get_query(info).filter_by(country_code=country_code).first()

    def resolve_co2emission_by_code(self, info, country_code, time):
        country = Country.get_query(info).filter_by(
            country_code=country_code).first()
        return CO2Emission.get_query(info).filter_by(country=country, time=time).first()

    def resolve_all_co2emission_by_time(self, info, time):
        return CO2Emission.get_query(info).filter_by(time=time).all()

    def resolve_methaneemission_by_code(self, info, country_code, time):
        country = Country.get_query(info).filter_by(
            country_code=country_code).first()
        return MethaneEmission.get_query(info).filter_by(country=country, time=time).first()

    def resolve_all_methaneemission_by_time(self, info, time):
        return MethaneEmission.get_query(info).filter_by(time=time).all()

    def resolve_greenhousegasemission_by_code(self, info, country_code, time):
        country = Country.get_query(info).filter_by(
            country_code=country_code).first()
        return GreenhouseGasEmission.get_query(info).filter_by(country=country, time=time).first()

    def resolve_all_greenhousegasemission_by_time(self, info, time):
        return GreenhouseGasEmission.get_query(info).filter_by(time=time).all()


schema = graphene.Schema(query=Query)
