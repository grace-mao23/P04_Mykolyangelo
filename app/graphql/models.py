from sqlalchemy.ext.declarative import declared_attr

from app import db


class Country(db.Model):
    __tablename__ = "country"
    id = db.Column(db.Integer, primary_key=True)
    country_code = db.Column(db.Integer)
    country_name = db.Column(db.String)


class CountryOutput(object):
    id = db.Column(db.Integer, primary_key=True)

    @declared_attr
    def country_id(cls):
        return db.Column(db.ForeignKey(Country.id), nullable=False)

    @declared_attr
    def country(cls):
        return db.relationship(
            Country,
            backref=db.backref(cls.__tablename__, uselist=True, cascade="delete,all"),
        )

    year = db.Column(db.Integer)
    amount = db.Column(db.Float)


class CO2Emission(CountryOutput, db.Model):
    __tablename__ = "co2_emission"


class CO2EmissionPerCapita(CountryOutput, db.Model):
    __tablename__ = "co2_emission_per_capita"


class MethaneEmission(CountryOutput, db.Model):
    __tablename__ = "methane_emission"


class GreenhouseGasEmission(CountryOutput, db.Model):
    __tablename__ = "greenhouse_gas_emission"


class PopulationGrowth(CountryOutput, db.Model):
    __tablename__ = "population_growth"


class Population(CountryOutput, db.Model):
    __tablename__ = "population"


class AccessToElectricity(CountryOutput, db.Model):
    __tablename__ = "access_to_electricity"


class ElectricConsumption(CountryOutput, db.Model):
    __tablename__ = "electric_consumption"
