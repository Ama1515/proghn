let textLoaded;

window.onload = function() {
    let fileInput = document.getElementById('fileInput');
    let fileDisplayArea = document.getElementById('fileDisplayArea');
    let container = document.getElementById("container");
    let showContainerBtn = document.getElementById("btn-show-container");
    let segmentationBtn = document.getElementById("segmentation-btn");

    let containerIsOpen = false;

    showContainerBtn.addEventListener('click', function(e) {
        if (containerIsOpen) {
            showContainerBtn.innerText = "Ouvrir l'analyse de fichier";
            container.style.display = "none";
        } else {
            showContainerBtn.innerText = "Fermer l'analyse de fichier";
            container.style.display = "block";
        }
        
        containerIsOpen = !containerIsOpen;
    });

    // On "écoute" si le fichier donné a été modifié.
    // Si on a donné un nouveau fichier, on essaie de le lire.
    fileInput.addEventListener('change', function(e) {
        // Dans le HTML (ligne 22), fileInput est un élément de tag "input" avec un attribut type="file".
        // On peut récupérer les fichiers données avec le champs ".files" au niveau du javascript.
        // On peut potentiellement donner plusieurs fichiers,
        // mais ici on n'en lit qu'un seul, le premier, donc indice 0.
        let file = fileInput.files[0];
        // on utilise cette expression régulière pour vérifier qu'on a bien un fichier texte.
        let textType = new RegExp("text.*");

        if (file.type.match(textType)) { // on vérifie qu'on a bien un fichier texte
            // lecture du fichier. D'abord, on crée un objet qui sait lire un fichier.
            var reader = new FileReader();

            // on dit au lecteur de fichier de placer le résultat de la lecture
            // dans la zone d'affichage du texte.
            reader.onload = function(e) {
                textLoaded = reader.result;
                fileDisplayArea.innerText = textLoaded;
            }

            // on lit concrètement le fichier.
            // Cette lecture lancera automatiquement la fonction "onload" juste au-dessus.
            reader.readAsText(file);    

            document.getElementById("logger").innerHTML = '<span class="infolog">Fichier chargé avec succès</span>';
        } else { // pas un fichier texte : message d'erreur.
            fileDisplayArea.innerText = "";
            document.getElementById("logger").innerHTML = '<span class="errorlog">Type de fichier non supporté !</span>';
        }
    });

    segmentationBtn.addEventListener('click', function(e) {
        lancerTraitement(textLoaded);
    });
}

function lancerTraitement(text) {
    if (text === undefined) {
        alert('Aucun fichier détecter !');
        return;
    }

    // Récupère les délimiteurs depuis l'input
    let delimiters = document.getElementById("delimID").value;

    // On échappe les caractères spéciaux pour RegExp
    let escapedDelimiters = delimiters.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    // Crée une regex dynamique avec tous les délimiteurs
    let regex = new RegExp(`[${escapedDelimiters}]+`, "g");

    // Split le texte
    let tokens = text.split(regex).filter(Boolean); // filtre pour virer les vides

    // Affiche les tokens dans page-analysis
    let output = tokens.map(t => `<span class="token">${t}</span>`).join("</br>");
    document.getElementById("page-analysis").innerHTML = output;
}