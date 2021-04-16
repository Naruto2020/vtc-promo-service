# Consignes du Test technique

## Contexte

L'idée est de faire un service qui valide ou non des requêtes de promocode.

Tu fais partie d'une entreprise de réservation de VTC type Uber et tu souhaites encourager tes clients à réserver lorsqu'il fait beau.

1.  L'équipe marketing peut ajouter des "promocodes" en base dont la **structure sera détaillée en dessous**.

2.  Les clients peuvent appeler l'API sur une autre route avec des **arguments pour demander une réduction**.

## Spécifications

Pour cela, il faut réaliser une API REST en Node.js.

Afin de simplifier le test, il n'est demandé ici que de faire le coeur de l'algorithme et pas l'API.

Voici un exemple de promocode en base, il valide une demande de
réduction de 20% si :

- l'âge du client est soit

  - de 40 ans

  - entre 15 et 35 ans (pour encourager la jeunesse)

- la date de la demande de réduction est

  - après le 1er janvier 2019 inclus

  - avant le 30 juin 2020 inclus

- le météo

  - claire (pas de pluie)

  - suffisamment douce, plus de 15°C

Ce qui nous donne en JSON :

```json
{
  "name": "WeatherCode",
  "avantage": { "percent": 20 },
  "restrictions": {
    "@or": [
      {
        "@age": {
          "eq": 40
        }
      },
      {
        "@age": {
          "lt": 30,
          "gt": 15
        }
      }
    ],
    "@date": {
      "after": "2019-01-01",
      "before": "2020-06-30"
    },
    "@meteo": {
      "is": "clear",
      "temp": {
        "gt": "15" // Celsius here.
      }
    }
  }
}
```

Il s'agit d'un exemple, il peut exister des promocodes de bien d'autres formes, voici un autre exemple de promocode :

```json
{
  "_id": "...",
  "name": "WeatherCodeBis",
  "avantage": { "percent": 30 },
  "restrictions": {
    "@or": [
      {
        "@age": {
          "eq": 40
        }
      },
      {
        "@date": {
          "after": "2020-01-01",
          "before": "2029-01-01"
        }
      },
      {
        "@date": {
          "after": "2099-01-01"
        }
      }
    ],
    "@age": {
      "lt": 30,
      "gt": 15
    }
  }
}
```

Qui se lit en : "Pour que le code soit valide, il faut que "l'âge soit compris entre 15 et 30" ET ("l'âge égale 40" OU "la date est comprise entre 2020 et 2029" OU "la date est après 2099")
Il doit aussi pouvoir être validé ou non en fonction des paramètres qu'on va envoyer au service.

Pour qu'une demande de réduction soit acceptée, toutes les règles du promocode demandé doivent être validées (c'est à dire celles dans l'attribut **restrictions**). Dans le promocode ci dessus il s'agirait donc de @date, @meteo et @or. On peut voir ici que certaines règles peuvent en inclure d'autres (comme @or, @and ...) et cela peut aller jusqu'à une profondeur arbitraire.

Pour demander une réduction, on doit fournir le nom du promocode souhaité, notre âge et la ville où l'on se trouve. Exemple :

// DEMANDE DE RÉDUCTION :

```json
{
  "promocode_name": "WeatherCode",
  "arguments": {
    "age": 25,
    "meteo": { "town": "Lyon" }
  }
}
```

// RÉPONSE si météo claire à l'heure actuelle

```json
{
  "promocode_name": "WeatherCode",
  "status": "accepted",
  "avantage": { "percent": 20 }
}
```

// RÉPONSE si météo pluvieuse à l'heure actuelle

```json
{
  "promocode_name": "WeatherCode",
  "status": "denied",
  "reasons": {
    "meteo": "isNotClear"
  }
}
```

_Pour la structure des données, le format est donné en exemple mais n'hésite pas à faire une autre proposition si tu la juges plus pertinente. Les spécifications sont minimales, pour laisser au candidat la liberté de rajouter les choses qu'il trouve nécessaires ou utiles aux routes comme les erreurs, le format des réponses, règles supplémentaires etc..._

_Tu peux aussi changer les clés des rules : lt, bt, before, after etc... si tu le souhaites dans quelque chose qui est plus pratique pour toi_

## Consignes

Pour orienter le dévelopement, 3 tests d'intégration sont déjà écrits. Un maximum de ces tests doit réussir. Il est entièrement possible de modifier les tests et d'en rajouter. Tout peut être modifié dans le code fourni :)

## Exécution des tests

```sh
npm install
```

puis

```sh
npm run test
#ou
npm run test:watch
```


## Aides

Pour la météo, possibilité d'utiliser openWeatherMap avec l'API key suivante :

https://openweathermap.org/ (doc sur le site, API KEY: d0562f476913da692a065c608d0539f6 (60 calls/min))

Pense bien à l'architecture des dossiers/fichiers. Respecte les bonnes pratiques.

**⚠️ Pour l'algo n'oublie pas que la profondeur des restrictions est arbitraire et sans limite.**

Bon courage :)
