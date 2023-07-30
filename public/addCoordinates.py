import numpy as np
import pandas as pd
import requests

def get_gps_coordinates(api_key, place):
    base_url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "address": place,
        "key": api_key,
    }

    response = requests.get(base_url, params=params)
    data = response.json()

    if data["status"] == "OK" and data.get("results"):
        location = data["results"][0]["geometry"]["location"]
        latitude = location["lat"]
        longitude = location["lng"]
        return latitude, longitude
    else:
        return None



api_key = 'YOUR_API_KEY'

df = pd.read_csv('public/Shinkansen_stations_inJapan.csv')

# for each line of the df, add coordinates
for index, row in df.iterrows():
    place = row['Station_Name']
    prefecture = row['Prefecture']
    place = 'Shinkansen,' + place + ', ' + prefecture + ', Japan'
    print(place)

    coordinates = get_gps_coordinates(api_key, place)
    if coordinates:
        latitude, longitude = coordinates
        df.at[index, 'Latitude'] = latitude
        df.at[index, 'Longitude'] = longitude
    else:
        print("No coordinates found for", place)

print(df.head())

df.to_csv('public/Shinkansen_stations_inJapan_with_coordinates.csv', index=False)

