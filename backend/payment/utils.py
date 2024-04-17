import requests, base64
from django.conf import settings
    
def paypal_token():

    url = "https://api.sandbox.paypal.com/v1/oauth2/token"
    data = {
                "client_id":settings.PAYPAL_CLIENT_ID,
                "client_secret":settings.PAYPAL_SECRET,
                "grant_type":"client_credentials"
            }
    headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic {0}".format(base64.b64encode((settings.PAYPAL_CLIENT_ID + ":" + settings.PAYPAL_SECRET).encode()).decode())
            }

    token = requests.post(url, data, headers=headers)
    return token.json()['access_token']

