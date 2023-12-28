# Kanau
[![forthebadge](https://forthebadge.com/images/badges/powered-by-coffee.svg)](https://forthebadge.com) [![License](https://img.shields.io/badge/license-JMdict-green)](https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project) [![License](https://img.shields.io/badge/license-Tatoeba-green)](https://tatoeba.org/eng/about) 
<p align="center">
    <img src="https://user-images.githubusercontent.com/55874439/112708392-bda40080-8eec-11eb-9a11-e6c412980db5.png"/>
</p>

Kanau is an educational web app to aid knowledge retention for Japanese learners through the presentation of flashcards. The review interval of these flashcards are calculated based on how well a user remembers them. It also contains a self-hosted Japanese Dictionary, complete with sample sentences and an easy add-to-card feature. Click [here](https://github.com/DLSU-CCAPDEV/2021T2-G41/blob/main/%5BRevised%5D%20S14%20Group%2041%20MP%20Specifications.pdf) for the full specification of the project. 

## Heroku Deployed Application
- [Kanau](https://kanau.herokuapp.com)

## Setting Up the Server Locally
### Prerequisites
- [Node.js](https://nodejs.org/en/)
- [Git](https://git-scm.com/) (optional)

### Installation

1. Clone the project either by directly downloading the repository [here](https://github.com/DLSU-CCAPDEV/2021T2-G41/archive/refs/heads/main.zip), or using the command below. <br>(Note: git should be installed in your system for you to be able to use this command). 
```
git clone https://github.com/DLSU-CCAPDEV/2021T2-G41
```
2. Open Command Prompt.
    
3. Navigate to the project folder - the folder containing the contents of the cloned or downloaded repository.
    
4. Run the command `npm install` to initialize and install all necessary modules used in the project.
 
5. To run the server locally, a `.env` file is required. It was not included in the repository since it contains sensitive information. Please ask the owners for the `.env` file. Once acquired, place the `.env` file in the root directory of the project.
    
### Running the Application
    
1. Open Command Prompt.
    
2. Navigate to the project folder - the folder containing the contents of the cloned or downloaded repository.
    
3. Run the command `node app.js`. If the app is working properly, your Command Prompt should display the following statement:
```
Server is running!
``` 
4. Open a web browser and type the following URL:
```
http://localhost:3000/
```     
### Dummy Accounts

| Email | Password |
| ----------- | ----------- |
| markadriii@gmail.com | vTx2QQAz |
| gab@gmail.com | T6yGQPsj |
| mitch@gmail.com | gU7SFDv4 |
| ashlee_19@gmail.com | yP5Mq61Q |
| astherielle@gmail.com | cvIyU23B |
    
## Dependancies

- [Node Language Detect](https://www.npmjs.com/package/languagedetect)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [connect-mongo](https://www.npmjs.com/package/connect-mongo)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [ejs](https://www.npmjs.com/package/ejs)
- [express](https://www.npmjs.com/package/express)
- [express-session](https://www.npmjs.com/package/express-session)
- [express-validator](https://www.npmjs.com/package/express-validator)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [serve-favicon](https://www.npmjs.com/package/serve-favicon)
- [validator](https://www.npmjs.com/package/validator)

## Built with

- [Bulma](https://bulma.io/)
- [Bootstrap](https://getbootstrap.com/)
- [Canva](https://www.canva.com/)
- [Free Frontend: CSS Buttons](https://freefrontend.com/css-button-hover-effects/)
- [Google Fonts](https://fonts.google.com/)
- [jQuery](https://www.npmjs.com/package/jquery)

## Authors

- [Escobar, Mark Adrian](https://github.com/markadriii)
- [Marquez, Gabriel](https://github.com/GabbyNEW)

    
    
    
    
    
    
