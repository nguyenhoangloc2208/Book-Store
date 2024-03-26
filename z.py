data_old = [
    {
    "name": "Loc", 
    "age": 24, 
    "email": "hl@gmail.com"
    },
    {
    "name": "Mang", 
    "age": 23, 
    "email": "mang@gmail.com"
    }
]

data_new = [
    {
        "full_name": "Khanh",
        "years_old": 30,
        "contact": "khanh@gmail.com"
    },
    {
        "full_name": "Nam",
        "years_old": 28,
        "contact": "nam@gmail.com"
    }
]


def old_to_new(old_data):
    e = []
    for customer in old_data:
        new_data = {
            "full_name": customer["name"],
            "years_old": customer["age"],
            "contact": customer["email"]
        }
        e.append(new_data)
    return e + data_new

data_new = old_to_new(data_old)

for data in data_new:
    print(data)