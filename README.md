# vtc-API
API pour site de réservation de VTC
service qui valide ou non des requêtes de promocode.

# VERSIONS 1 fonctionnalite promocode, create, read coupons et tests unitaires ok 
 vtc-API: v1.0

# Commencer
Les instructions suivantes permettent d'obtenir une copie du projet et de l'exécuter sur une machine locale 

# Prérequis
Avoir d'installer :
- un éditeur de code (ex visual studio code)
- MongoDB
- Node JS 

# Installation et environnement 

1. Creer un dossier en locale

2. Cloner le projet en cliquant sur :
   - le bouton code en vert
   - copier le lien du projet 
   - et dans le terminale saisir :  git clone + lien du projet

3. Ouvrir le projet via l'éditeur de code et saisir npm install dans le terminal pour charger toutes les dépendances 

4. Aller dans le dossier Config du projet et crée un fichier .env dans lequel on va retrouver : 
   - le PORT sur lequel va tourner l'api 
   - le client_URL (url du frontend ou *)
   - myDbUrl le lien permettant la connexion a mongo atlas 
   - l' Api_KEYs
   - WeatherUrl

5. Ouvrir le terminale de l'éditeur de code et saisir : 
   - npm run start pour exécuter le programme 
   ## Test Postman 
   - url pour creer un code promo en base de données : http://127.0.0.1:4000/api/promo/promoCode
   - url pour lire le coupon promo : http://127.0.0.1:4000/api/promo/askReduction


# Tests unitaires 

Pour exécuter les tests unitaires, aller dans le terminale de l'éditeur et taper 
- npm run test ou npm run test:watch