from app import (db)


class Country(db.Model):
    __tablename__ = 'country'
    id = db.Column(db.Integer, primary_key=True)
    country_code = db.Column(db.String)
    country_name = db.Column(db.String)


class CO2Emission(db.Model):
    __tablename__ = 'co2emission'
    id = db.Column(db.Integer, primary_key=True)
    country_id = db.Column(db.Integer, db.ForeignKey('country.id'))
    country = db.relationship(Country,
                              backref=db.backref('co2emissions',
                                                 uselist=True,
                                                 cascade='delete,all'))
    time = db.Column(db.String)
    amount = db.Column(db.Float)


class MethaneEmission(db.Model):
    __tablename__ = 'methaneemission'
    id = db.Column(db.Integer, primary_key=True)
    country_id = db.Column(db.Integer, db.ForeignKey('country.id'))
    country = db.relationship(Country,
                              backref=db.backref('methaneemissions',
                                                 uselist=True,
                                                 cascade='delete,all'))
    time = db.Column(db.String)
    amount = db.Column(db.Float)


class GreenhouseGasEmission(db.Model):
    __tablename__ = 'greenhousegasemission'
    id = db.Column(db.Integer, primary_key=True)
    country_id = db.Column(db.Integer, db.ForeignKey('country.id'))
    country = db.relationship(Country,
                              backref=db.backref('greenhousegasemissions',
                                                 uselist=True,
                                                 cascade='delete,all'))
    time = db.Column(db.String)
    amount = db.Column(db.Float)
