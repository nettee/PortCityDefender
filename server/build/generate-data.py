#!/usr/bin/env python3

import json
import random

i = 625395

def print_info(obj):
    print('''{{"id": "info-{}", "publisher": "{}", "text": "This is interesting.", "images": [], "urgent": false}}'''.format(i, obj['id']))
    global i
    i += 1


users_file = open('primer-dataset/users.json', 'r')
for line in users_file:
    line = line.rstrip('\n')
    obj = json.loads(line)
    r = random.random()
    if r < 0.6:
        print_info(obj)
