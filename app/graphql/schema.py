import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType

from app.graphql.schemas import (
    CountryQuery, CO2EmissionQuery, MethaneEmissionQuery,
    GreenhouseGasEmissionQuery, CO2EmissionPerCapitaQuery, PopulationQuery,
    PopulationGrowthQuery, AccessToElectricityQuery, ElectricConsumptionQuery,
    JSONCacheQuery)


class Query(
        CountryQuery,
        CO2EmissionQuery,
        MethaneEmissionQuery,
        GreenhouseGasEmissionQuery,
        CO2EmissionPerCapitaQuery,
        PopulationQuery,
        PopulationGrowthQuery,
        AccessToElectricityQuery,
        ElectricConsumptionQuery,
        JSONCacheQuery,
        graphene.ObjectType,
):
    """Collection of Query Classes"""


schema = graphene.Schema(query=Query)
