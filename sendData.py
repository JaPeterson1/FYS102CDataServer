import requests

url = 'https://localhost:3000/dataInput'
obj = {'solarPower': '30', 'windPower': '30', 'windSpeed': '45', 'solarIntensity': '80'}

x = requests.post(url, json=obj)
print(x.text)