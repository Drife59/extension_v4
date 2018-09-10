# PROJET CORAIL README EXTENSION

## Lecture de la doc

A consulter dans un viewer de fichier markdown tel que:
http://markdownlivepreview.com/

## Installation et MAJ

### Récupération du code

```
git clone https://github.com/Drife59/corail_extension.git
```

### Update du code

```
git fetch --all
git checkout master 
git merge origin/master 
```

### Installation

Activer l'option développeur dans les extensions chrome.
Charger l'extension non-empactée.


## Transformation en App React

https://veerasundar.com/blog/2018/05/how-to-create-a-chrome-extension-in-react-js/

Create react app and check with "yarn start".

Update manifest.json, remove "icons" section and add the following:

```
{
    "version": "1.0",
    "manifest_version": 2,
    "browser_action": {
        "default_popup": "index.html"
    }
}
```

Remember: default_popup is the entry point for pop-up display. 
Should be equivalent to index.html in React. 


