from csv import reader
from sys import maxsize, stdout

from app import db
from app.graphql.models import (
    JSONCache,
    Country,
    CO2Emission,
    CO2EmissionPerCapita,
    MethaneEmission,
    GreenhouseGasEmission,
    PopulationGrowth,
    Population,
    AccessToElectricity,
    ElectricConsumption,
)

switcher = {
    "CO2 emissions (kt)": CO2Emission,
    "CO2 emissions (metric tons per capita)": CO2EmissionPerCapita,
    "Methane emissions (kt of CO2 equivalent)": MethaneEmission,
    "Total greenhouse gas emissions (kt of CO2 equivalent)":
    GreenhouseGasEmission,
    "Population growth (annual %)": PopulationGrowth,
    "Population, total": Population,
    "Access to electricity (% of population)": AccessToElectricity,
    "Electric power consumption (kWh per capita)": ElectricConsumption,
}


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


def migrate(filepath, iso, countries_topojson):
    db.drop_all()
    db.create_all()

    db.session.add(JSONCache(data_name="topojson", data=countries_topojson))

    csv_file = {}

    with open(filepath, mode='r', encoding='utf-8-sig') as f:
        csv_file = Processor(f)

    for row in csv_file:
        row = dict(zip(csv_file.headers(), row))

        current_code = ""

        # TODO: Please optimize this
        for code in iso:
            if code["alpha-3"] == row["Country Code"]:
                current_code = code["country-code"]
                country = Country(
                    country_code=code["country-code"],
                    country_name=row["Country Name"],
                )
                db.session.add(country)
                break

        # TODO: Please optimize this
        country = Country.query.filter_by(country_code=current_code).first()

        for year in range(csv_file.initial_year(), csv_file.final_year()):
            try:
                assert float(row[str(year)])
                model_object = switcher[row["Series Name"]](
                    country_id=country.id,
                    country=country,
                    year=year,
                    amount=float(row[str(year)]),
                )
                db.session.add(model_object)
            except:
                pass

        db.session.commit()
