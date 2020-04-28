from csv import (DictReader)

from app import (db)
from app.graphql.models import (Country, CO2Emission, MethaneEmission,
                                GreenhouseGasEmission)


def migrate(filepath):
    field_names = 'Series Name,Series Code,Country Name,Country Code,1960 ,1961 ,1962 ,1963 ,1964 ,1965 ,1966 ,1967 ,1968 ,1969 ,1970 ,1971 ,1972 ,1973 ,1974 ,1975 ,1976 ,1977 ,1978 ,1979 ,1980 ,1981 ,1982 ,1983 ,1984 ,1985 ,1986 ,1987 ,1988 ,1989 ,1990 ,1991 ,1992 ,1993 ,1994 ,1995 ,1996 ,1997 ,1998 ,1999 ,2000 ,2001 ,2002 ,2003 ,2004 ,2005 ,2006 ,2007 ,2008 ,2009 ,2010 ,2011 ,2012 ,2013 ,2014 ,2015 ,2016 ,2017 ,2018 ,2019 '.split(
        ',')

    for (index, name) in enumerate(field_names):
        field_names[index] = name.strip()

    field_names = tuple(field_names)

    start_year = 1960
    end_year = 2019

    db.drop_all()
    db.create_all()

    with open(filepath) as f:
        reader = DictReader(f, field_names)
        next(reader, None)
        for row in reader:
            row = dict(row)
            country = Country(country_code=row['Country Code'],
                              country_name=row['Country Name'])
            db.session.add(country)
            db.session.commit()
            for year in range(start_year, end_year):
                if row[str(year)] != '..' and row[str(year)] != '':
                    db.session.add(
                        CO2Emission(country=country,
                                    time=str(year),
                                    amount=row[str(year)]))
                    db.session.commit()
