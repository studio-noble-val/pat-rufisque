.. Authors :
.. mviewer team

.. _configtpl:

Configurer - Templates
=========================


Personnalisation de la fiche d'information

Pour les couches de type vecteur et WMS, il est possible de définir un template afin de formater côté client, la fiche d'information des entités sélectionnées.
Le moteur de template (logic less) utilisé est Mustache : https://github.com/janl/mustache.js

Ce qu'il faut savoir de Mustache
--------------------------------

- On fait référence à la valeur d'un champ de cette façon : ``{{champ}}``.
- Il est possible de gérer une absence de valeur ou une valeur false de cette façon :

.. code-block:: xml
       :linenos:

        {{#champ2}}
            Ce texte s'affiche si champ2 contient une valeur ou est différent de false.
        {{/champ2}}

La finalité du template est ici de fabriquer un contenu formaté HTML. L'ajout des balises <style> permet de personnaliser l'affichage du champ via du CSS. Exemple ci-dessous sur le formatage du texte et d'un bouton pour clic.

Pour aller plus loin sur la personnalisation, consulter les différentes documentation sur HTML et CSS.

Nous avons la possibilité d'injecter du code via la balise <script>.


Exemple de template structuré
--------------------------------

.. code-block:: xml
       :emphasize-lines: 1,13,15,47
       :linenos:


        {{#features}}
            <li id="{{feature_ol_uid}}" class="item">
                Exemple de formatage
                <h3 class="title-feature">{{nom}}</h3>
                <img src="{{image}}" class="img-responsive" style="margin-top:5%;" /><br/>
                <p class="text-feature">
                     <b> Surface : </b> {{surface}} ha <br/>
                </p>
                <a href="{{url}}" target="_blank" title="Lien site internet" class="but-link">
                     <span class="fa fa-globe" aria-hidden="true"></span> <b>Site Web</b>
                </a>
            </li>
        {{/features}}

        <style>
            .title-feature {
                color: #BA88A4;
                font-family:"Trebuchet MS";
                font-size:20px;
                margin-bottom:3%;
                line-height:1;
            }
            .text-feature{
                font-family:"Trebuchet MS";
                color:#555;
                font-size:13px;
                margin-top:2%;
                margin-bottom:2%;
            }
            .but-link, .but-link:focus, .but-link:hover{
                display:inline-block;
                padding:0.5em 1em;
                margin:0 0.3em 0.3em 0;
                border-radius:0.3em;
                box-sizing: border-box;
                text-decoration:none;
                font-family:'Trebuchet MS';
                font-weight:300;
                color:#FFFFFF;
                background-color:#BA88A4;
                text-align:center;
                transition: all 0.2s;
            }
            .but-link:hover{
                background-color:#b0006b;
            }
        </style>

Les éléments suivants en rouge sont obligatoires.

**Explications du template mustache** : 

- ``{{#features}}{{/features}}`` est une boucle effectuée sur chaque entité présente dans la couche sélectionnée.
- {{surface}} affiche le contenu du champ surface.
- ``<li id="{{feature_ol_uid}}" class="item"></li>`` est une entrée de liste html utilisée par le mviewer. S'il y a plusieurs entrées de liste car plusieurs entités sélectionnées, le mviewer présentera les réponses sous la forme d'un carousel.
- Pour synchroniser le carousel et la sous-sélection sur la carte lors d'un clic, l'injection de la ``feature_ol_uid`` est requise dans l' ``id`` de la balise.
- Puisque une ``feature id`` n'est pas obligatoire comme attribut pour une feature l' ``ol_uid`` interne d'OpenLayers est utilisée à ce propos.
- <style> permet d'injecter du code CSS / HTML de personnalisation des styles utilisés dans le template.
- <script> permet d'injecter du code JavaScript.


Résultat de l'exemple ci-dessus
****************************

.. image:: ../_images/dev/config_tpl/exemple_template.png
              :width: 400
              :alt: Exemple de template
              :align: center


Itérer sur un champ de type json
--------------------------------

Prérequis : disposer d'un champ - exemple ``monchampjson`` - dont le contenu est une liste de valeurs ou d'objets sous la forme ``["item1","item2"]`` ou de la forme ``[{"nom": "item1", "code": 1}, {"nom": "item2", "code": 2}]``,
configurer le layer dans le config.xml avec le paramètre ``jsonfields="monchampjson"``.

Exemple 1 pour *monchampjson* = ``["item1","item2"]``

.. code-block:: xml
       :linenos:

        {{#monchampjson}}
            Cette ligne s'affiche autant de fois qu'il y a d'éléments dans la liste.
            <li>{{.}}</li>
        {{/monchampjson}}

Exemple 2 pour *monchampjson* = ``[{"nom": "item1", "code": 1}, {"nom": "item2", "code": 2}]``

.. code-block:: xml
       :linenos:

        {{#monchampjson}}
            Cette ligne s'affiche autant de fois qu'il y a d'éléments dans la liste.
            <li>{{nom}} - {{code}}</li>
        {{/monchampjson}}

Exemple 3 pour afficher un tableau comme dans ici https://kartenn.region-bretagne.fr/kartoviz/?config=demo/jsonfields.xml

.. code-block:: xml
       :linenos:

        <table>
            <thead>
                <tr><th>NOM</th><th>CODE</th></tr>
            </thead>
            <tbody>
                {{#communes}}
                    <tr><td>{{nom}}</td><td>{{code_insee}}</td></tr>
                {{/communes}}
            </tbody>
        </table>

Résultat du template ci dessus
****************************

.. image:: ../_images/dev/config_tpl/exemple_template_table.png
              :width: 400
              :alt: Exemple de template
              :align: center


Itérer sur les champs disponibles
****************************

En plus d'afficher la valeur d'un champ comme expliqué précédemment, il est aussi possible de lire et parcourir l'ensemble des champs disponibles avec ``{{#fields_kv}}...{{/fields_kv}}``.

Pour chaque champ listé, on peut accéder :

- au nom du champ via ``{{key}}``
- à la valeur via ``{{value}}``

Par exemple, ce code :

.. code-block:: xml
       :linenos:

       {{#features}}
         <li id="{{feature_ol_uid}}" class="item" style="width:238px;">
             <ul>
               {{#fields_kv}}
                 <li>{{key}} : {{value}}</li>
               {{/fields_kv}}
             </ul>
         </li>
       {{/features}}

affichera la liste des champs avec leur nom suivi de leur valeur sans avoir à connaître les noms des champs à l'avance.

Dans le même ordre d'idée, un autre "champ virtuel", ``{{serialized}}``, permet de récupérer l'ensemble des champs sous forme sérialisée, prête à être passée en paramètre dans une URL. Par exemple, dans une iframe:

.. code-block:: xml
       :linenos:

       <iframe class="iframe_bottom"src="apps/myapp/presentation/en/pages/mylayer_charts.html?data={{serialized}}"></iframe>

Vous pourrez ensuite le désérialiser de façon standard. Par exemple, en javascript dans le fichier mylayer_charts.html (cf. exemple ci-dessus) :
::

    <script>
      var url = new URL(location.href);
      var data = url.searchParams.get("data");

      if(data) {
        var obj = JSON.parse(data)
        keys = Object.keys(obj);
        for ( i=0 ; i<keys.length ; i++ ) {
          key=keys[i];
          console.log(key + ': '+obj[key]);
        }
        ...
      }
    </script>

Les champs ``{{#fields_kv}}`` et ``{{serialized}}`` sont tous les deux virtuels : ils sont créés grâce à une fonctionnalité de Mustache permettant de `définir des champs comme des fonctions <https://github.com/janl/mustache.js#functions>`_.
S'ils ne sont pas utilisés, ils ne consomment pas de ressource.
Ils ont été `ajoutés aux champs simples <https://github.com/mviewer/mviewer/pull/206/files>`_ afin de faciliter certains flux de traitement des données.

Exemples de scripts de reformatage de champs
--------------------------------

Reformatage d'un champ date
****************************

::

	{{#features}}
	<li id="{{feature_ol_uid}}" class="inventaire item" style="width:100%;">

		<!-- ici la div qui contiendra la date à afficher -->
		<!-- elle doit avoir un ID unique lié à la feature (champ id ou id openLayers peu importe tant que c'est unique)-->
		<div id="date-area-{{feature_ol_uid}}"></div>
		<!-- le script de formatage -->
		<script>
			let date = "{{date_field}}";
			let id = "{{feature_ol_uid}}";
			let divWithDate = document.getElementById("date-area-" + id);
			// format de la date de la donnée d'entrée

			// voir ici pour les correspondances du code que vous devez modifier / adapter selon le format d'entrée :
			// https://momentjs.com/

			let inDate = "YYYY-MM-DDT";
			let outDate = "DD/MM/YYYY";

			// on transforme
			let dateFormated = moment(date, inDate).format(outDate);
			// on met le nouveau format à afficher dans la div
			divWithDate.innerHTML = dateFormated;
		</script>
	</li>
	{{/features}}

Arrondi d'un champ nombre
****************************

::

	<li id="{{feature_ol_uid}}" class="inventaire item" style="width:100%;">
		<div id="number"></div>
		<script>
			var maDiv = document.getElementById("number");

			// Récupérer la valeur textuelle de la div en utilisant innerText ou textContent
			var valeurTextuelle = maDiv.innerText; // ou maDiv.textContent

			var pourcentageArrondi = parseInt(valeurTextuelle, 10); // 10 indique la base décimale

			maDiv.innerText = pourcentageArrondi +"%"
		</script>
	</li>

Appel depuis le XML
--------------------------------

Le template sera enregistré avec l'extension .mst. Pour l'appeler dans la configuration mviewer au niveau de la layer, il faut le bon format ``infoformat="application/vnd.ogc.gml"`` et ajouter un appel au mst via une balise template au sein du layer ``<template url=""/>``.
