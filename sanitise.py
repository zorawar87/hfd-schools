#!/usr/bin/python3

import json

raw = json.load(open('data.json'))

formatted = {}
formatted['schools'] = []

for i in range(len(raw['data'])):
    formatted['schools'].append({
        'name': raw["data"][i][8],
        'coord': [
                    float(raw["data"][i][11][1]),
                    float(raw["data"][i][11][2])
                ],
        'pincode': raw["data"][i][12],
        'tel': raw["data"][i][13],
        'since': raw["data"][i][28]
    })

with open('data.js', 'w') as of:
    of.write('var hfddat = ')
    json.dump(formatted, of)
