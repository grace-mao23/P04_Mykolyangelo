from csv import (reader)
from sys import (maxsize, stdout)

from app import (db)
from app.graphql.models import (Country, CO2Emission, MethaneEmission,
                                GreenhouseGasEmission)


class Processor():
    def __init__(self, filestream):
        csv_reader = reader(filestream)
        self.__headers = next(csv_reader, None)
        self.__inner = list(csv_reader)
        self.__index = len(self.__inner)
        self.__initial_year = maxsize
        self.__final_year = -maxsize - 1
        for header in self.__headers:
            try:
                if int(float(header)) < self.__initial_year:
                    self.__initial_year = int(float(header))
                if int(float(header)) > self.__final_year:
                    self.__final_year = int(float(header))
            except:
                pass

    def headers(self):
        return self.__headers

    def initial_year(self):
        return self.__initial_year

    def final_year(self):
        return self.__final_year

    def __iter__(self):
        return self

    def __next__(self):
        if self.__index == 0:
            raise StopIteration
        self.__index -= 1
        return self.__inner[self.__index]


def migrate(filepath):
    db.drop_all()
    db.create_all()

    csv_file = {}

    with open(filepath) as f:
        csv_file = Processor(f)

    for row in csv_file:
        row = dict(zip(csv_file.headers(), row))

        country = Country(country_code=row['Country Code'],
                          country_name=row['Country Name'])

        db.session.add(country)

        for year in range(csv_file.initial_year(), csv_file.final_year()):
            try:
                num_year = float(row[str(year)])
                for model in [CO2Emission, MethaneEmission,
                              GreenhouseGasEmission]:
                    model_object = model(country=country,
                                         time=str(year),
                                         amount=row[str(year)])
                    db.session.add(model_object)
            except:
                pass

        db.session.commit()
