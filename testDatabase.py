import requests
import random

url = 'http://localhost:3000/dataInput'

i = 0;
while(i<100):
    obj = {'solarPower': str(random.randrange(70, 120, 1)), 'windPower': str(random.randrange(70, 120, 1)), 'windSpeed': str(random.randrange(0, 20, 1)), 'solarIntensity': str(random.randrange(240, 380, 1))}
    x = requests.post(url, json=obj)
    print(x.text)
    i+=1