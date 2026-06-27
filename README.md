# Kaamelott — flashcards lore

Site statique autonome pour GitHub Pages.

## Structure

- `index.html` : structure de la page et chargement des fichiers.
- `styles.css` : styles responsive.
- `app.js` : filtres, mélange, navigation, retournement des cartes.
- `data/questions-*.js` : un fichier par catégorie de questions.

## Modifier une carte

Chaque carte est un objet JavaScript avec ces champs :

```js
{
  "id": 1,
  "category": "Personnages",
  "difficulty": "Facile",
  "question": "...",
  "answer": "...",
  "explanation": "Quelques phrases de contexte vérifié.",
  "source": "...",
  "url": "..."
}
```

Pour ajouter une question, ajoutez un objet dans le fichier `data/questions-...js` correspondant à sa catégorie, en conservant le format existant. Le compteur total se met à jour automatiquement dans l’interface.

## Catégories incluses

- Personnages : 53 cartes
- Relations & familles : 47 cartes
- Intrigues par Livre : 60 cartes
- Lieux & royaumes : 43 cartes
- Pouvoir & politique : 47 cartes
- Quêtes, objets & mythologie : 45 cartes
- Répliques & gags : 50 cartes
- Épisodes & situations : 55 cartes
- Complétez la réplique : 30 cartes
- Qui dit ? : 50 cartes

## Hébergement GitHub Pages

Déposez le contenu de ce dossier à la racine du dépôt, puis activez GitHub Pages sur la branche souhaitée. Aucune dépendance externe n’est requise.
