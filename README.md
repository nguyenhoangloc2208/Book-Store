# Hoang Loc Book Store

## Description
Hoàng Lộc Book Store is a small project I worked on during a web development course. The idea of this project is to simulate an online book store similar to Vietnam Book Store.

I created a simple website with basic features such as login, viewing books, and searching. I also managed to implement the feature of adding books to the shopping cart. Although it's just a small project, it helped me understand more about how to build a website from start to finish.

## Build With
* [![React][React.js]][React-url]
* [![Django][Django.py]][Django-url]
## Set up
The first thing to do is to clone the repository:
```bash
$ git clone https://github.com/nguyenhoangloc2208/Book-Store.git
```
## Installation
### Backend
```bash
$ cd backend
```
Create a virtual environment to install dependencies in and activate it:
```bash
$ python3.8 -m venv env

# On Windows
.\env\Scripts\activate
```
Then install the dependencies:
```bash
(env)$ pip install -r requirements.txt
```
Once pip has finished downloading the dependencies:
```bash
(env)$ python manage makemigrations

(env)$ python manage migrate

(env)$ python manage.py runserver
```

And navigate to http://127.0.0.1:8000/.

http://127.0.0.1:8000/admin to access admin site

In order to test the purchase flows, fill in the account details in core/settings to match your SANDBOX developer credentials.

### FrontEnd
```bash
cd frontend
```
Install the package
```bash
npm install
```
Running the app
```bash
# development
$ npm start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Walkthrough
Before you interact with the application, remember to change the values of the variables in the .env
### Support
#### How to use Stripe CLI
Stripe CLI is a powerful tool for developing and debugging Stripe payment integrations in your web applications. Below is a basic guide to get started with using Stripe CLI.
##### Installation
First, you need to install Stripe CLI on your computer. You can do this by visiting the [official Stripe CLI website](https://stripe.com/docs/stripe-cli) and following the installation instructions.
##### Usage
After installation, you can open Stripe CLI by opening a terminal or command prompt and running the following command:
```bash
stripe login
```
After login, comeback Stripe CLI and running the following command:
```bash
- stripe listen --forward-to 127.0.0.1:8000/api/user/payments/stripe/webhook/
```

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Django.py]: https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white
[Django-url]: https://www.djangoproject.com/
