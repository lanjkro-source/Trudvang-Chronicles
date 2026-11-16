# Objets sacrés et runes thuuls

## Références et choix

Livre des règles, sections Artisanat et Qualité, p.281–284 (Thuuldom), p.285–288 (runes) ; Player’s Handbook, Hard/Soft Materials, item quality, Sacred Objects p.225–228 et runes p.229–232. Le tableau de la p.283 française a été vérifié visuellement dans le PDF. Les sources JSON FR/EN sont régénérées vers le catalogue et les compendiums. Sur décision du MJ, Main de Borjorn est de type **persistant**, conserve deux invocations par jour et donne son bonus automatique au prochain test de compétence, puis disparaît même après échec. Elle ne modifie pas les tests de situation ni les comparaisons de traits.

## Parcours et réserves

Avec Forgeage thuul > 0, la fiche PJ/PNJ affiche les capacités souple et dure : Invocation + Artisanat + 2 × Forgeage thuul + 2 × spécialité de matériau. Le cadre Objets sacrés permet de fabriquer un objet, d’ouvrir son inventaire, de voir ses runes et de le détruire après confirmation. Cette dernière action rend l’investissement complet, y compris les points d’activation déjà consommés ; la désacralisation narrative reste au MJ, conformément à la demande.

Le test de fabrication utilise Savoir-faire, Artisanat, la spécialité de matériau choisie, uniquement 2 × le niveau de Forgeage thuul, l’outillage, les états/effets et un modificateur libre. Le choix d’outillage propose l’atelier et les valeurs −3/−5/−7 des paquetages de la section Réparations, comme repères de travail ; l’atelier est supposé approprié, les conditions matérielles et le temps nécessaire restent au MJ. Le personnage peut modifier le résultat au moyen du modificateur situationnel. Seul un succès crée l’objet. Sa qualité correspond au rang du matériau utilisé ; les caractéristiques intrinsèques sont ajustées une seule fois par le résolveur de qualité existant. Le matériel copiable vient exclusivement des objets initiaux du monde visibles aux joueurs : les droits du MJ ne rendent pas une référence cachée accessible à cette liste. Les images et les caractéristiques de la copie sont conservées ; les identifiants d’import et les droits du modèle ne sont pas copiés.

L’onglet Runes accepte des investissements depuis les points libres permanents du créateur, limités par sa capacité par objet. Des points restent affectables avant l’inscription. L’inscription choisit une rune réellement apprise et un rang au plus égal à la tablette connue ; le test emploie Foi + Invocation + Forgeage thuul − rang, et −2 par autre rune déjà inscrite. L’échec bloque cette tentative et les rangs supérieurs sur cet objet sans détruire les runes déjà présentes. Une amélioration conserve les dépenses quotidiennes antérieures. Croc de Yukk exige une arme métallique tranchante, Choc de l’enclume une arme contondante, et Poings d’acier un équipement représentant la paire complète décrite par la rune.

Chaque rune possède son investissement, sa réserve actuelle et son compteur d’invocations. Les utilisations affichées respectent à la fois le plafond quotidien propre à la rune et les points disponibles divisés par le rang. Une invocation confirmée dépense le rang dans sa seule réserve et dans le total actuel de l’objet ; annuler ne dépense rien. Le 1 est une réussite ordinaire, le 20 un échec critique avec le bouton de table divine. Le chat et les applications d’effets conservent le rang réellement inscrit, sans permettre d’en sélectionner un supérieur. Les effets permanents déjà modélisés sont liés à l’objet : Croc de Yukk modifie son arme, les bénéfices équipés suivent l’équipement, et les indications narratives restent descriptives. Ce raccord ne prétend pas automatiser tous les comportements narratifs ou tous les événements de touche de chaque rune.

La réserve libre du thuul est préparée comme total − somme investie dans ses objets : une dépense d’activation ne change jamais cet investissement. Les points temporaires ne servent pas à financer les objets. Une baisse du total sous l’investissement existant est signalée et bloque tout nouvel investissement ; elle ne détruit pas silencieusement des runes. Le repos renouvelle les réserves d’objet et les compteurs d’invocation. Le passage d’une journée du calendrier les renouvelle aussi, de façon idempotente. L’édition manuelle de la réserve libre est verrouillée car elle est désormais dérivée. Un objet sacré reste lié à son créateur ; le transfert ordinaire d’inventaire le refuse pour préserver ce compte. Pour réaffecter ces points, le retirer avec confirmation puis fabriquer l’autre objet.

Les mutations de réserve sont sérialisées sur le MJ actif, ou localement si aucun MJ n’est connecté. Seul un propriétaire du créateur ou le MJ peut les demander. Une fenêtre d’activation devenue périmée ne peut pas dépenser un ancien état de rune. Les mises à jour ne nécessitent aucune migration de monde : les nouveaux champs ont des valeurs initiales et le matériau des anciennes copies d’équipement utilise la même inférence permanente que celui d’un nouvel objet non classé. Aucun accès à l’installation Foundry n’a été effectué.

## Vérification représentative

1. Sur un thuul, vérifier que Forgeage thuul est appris et apprendre une tablette comme Main de Borjorn ou Chaleur des profondeurs. Cliquer sur + dans Objets sacrés, fabriquer un équipement puis ouvrir son onglet Runes.
2. Investir 4 points, inscrire une rune de niveau 1 avec 4 points affectés, puis l’utiliser. Vérifier les points actuels, le compteur quotidien et l’absence de dépense dans la réserve libre. Pour Main de Borjorn, le prochain test de compétence doit afficher le bonus puis retirer son effet ; un test de situation doit le conserver.
3. Passer une nuit : les réserves de rune remontent à l’investissement et leurs compteurs se renouvellent. Retirer l’objet, annuler la confirmation puis recommencer en confirmant : l’objet disparaît et son investissement redevient libre.

## Classement intégral du catalogue

Le classement reste éditable. Le bois, l’os, le métal et la pierre sont durs ; vêtements, fourrure, cuir, soie et tissus sont souples. Pour les boucliers renforcés de fourrure et la fronde à manche, la structure en bois conduit au choix dur. Pour les paquetages, le classement porte sur l’outillage principal ; un MJ peut choisir souple pour le contenant lui-même. Les consommables liquides sont classés selon leur récipient.

| Type | Objet | Artisanat |
|---|---|---|
| Arme | Glaaf (épée courte) | Matériaux durs |
| Arme | Hring seax (couteau à anneau) | Matériaux durs |
| Arme | Klubb (massue) | Matériaux durs |
| Arme | Krum swerd (cimeterre) | Matériaux durs |
| Arme | Lill spjót (lance courte) | Matériaux durs |
| Arme | Nagli klubb (massue à pointes) | Matériaux durs |
| Arme | Seax (dague/couteau) | Matériaux durs |
| Arme | Split axi (hache à une main) | Matériaux durs |
| Arme | Stafur (bâton) | Matériaux durs |
| Arme | Barda faldir (fléau de bataille) | Matériaux durs |
| Arme | Barda hammri (marteau de bataille) | Matériaux durs |
| Arme | Barda klót (chaîne de bataille) | Matériaux durs |
| Arme | Barda makir (masse de bataille) | Matériaux durs |
| Arme | Barda swerd (épée de bataille) | Matériaux durs |
| Arme | Bastjur kedjá (chaîne troll) | Matériaux durs |
| Arme | Barda axi (hache de bataille) | Matériaux durs |
| Arme | Villtur axi (hache courbée) | Matériaux durs |
| Arme | Breid swerd (épée large) | Matériaux durs |
| Arme | Dropi axi (hache pendule) | Matériaux durs |
| Arme | Hakk (bec-de-corbeau) | Matériaux durs |
| Arme | Miekka | Matériaux durs |
| Arme | Staaf spjót (lance de chasse) | Matériaux durs |
| Arme | Stakk swerd (épée d’armes) | Matériaux durs |
| Arme | Stjorn makir (étoile du matin) | Matériaux durs |
| Arme | Breid spjót (lance à lame large) | Matériaux durs |
| Arme | Spjót (lance longue) | Matériaux durs |
| Arme | Tvei faldir (fléau à deux mains) | Matériaux durs |
| Arme | Tvei hakk (pioche à deux mains) | Matériaux durs |
| Arme | Tvei hammri (merlin) | Matériaux durs |
| Arme | Tvei klubb (massue à deux mains) | Matériaux durs |
| Arme | Tvei axi (hache à deux mains) | Matériaux durs |
| Arme | Tvei swerd (épée à deux mains) | Matériaux durs |
| Arme | Krossbogur (arbalète) | Matériaux durs |
| Arme | Veidi bogi (arc de chasse) | Matériaux durs |
| Arme | Lill spjót (lancer) | Matériaux durs |
| Arme | Seax (lancer) | Matériaux durs |
| Arme | Lang bogi (arc long) | Matériaux durs |
| Arme | Miekka (lancer) | Matériaux durs |
| Arme | Slingu (fronde) | Matériaux souples |
| Arme | Split axi (lancer) | Matériaux durs |
| Arme | Staaf spjót (lancer) | Matériaux durs |
| Arme | Stafur slingu (fronde à manche) | Matériaux durs |
| Arme | Tunkur krossbogur (arbalète lourde) | Matériaux durs |
| Arme | Tve bogi (arc composite) | Matériaux durs |
| Arme | Volk krossbogur (arbalète légère) | Matériaux durs |
| Armure | Armure à bandes | Matériaux durs |
| Armure | Cotte de mailles | Matériaux durs |
| Armure | Double cotte de mailles | Matériaux durs |
| Armure | Fourrure/cuir | Matériaux souples |
| Armure | Cuir rigide | Matériaux souples |
| Armure | Cuir renforcé de métal | Matériaux souples |
| Armure | Armure de plate | Matériaux durs |
| Armure | Armure d’écailles | Matériaux durs |
| Armure | Cotte de mailles renforcée d’écailles | Matériaux durs |
| Armure | Vêtement matelassé | Matériaux souples |
| Bouclier | Grand bouclier renforcé de fourrure | Matériaux durs |
| Bouclier | Grand bouclier renforcé de métal | Matériaux durs |
| Bouclier | Grand bouclier en bois | Matériaux durs |
| Bouclier | Bouclier moyen renforcé de fourrure | Matériaux durs |
| Bouclier | Bouclier moyen renforcé de métal | Matériaux durs |
| Bouclier | Bouclier moyen en bois | Matériaux durs |
| Bouclier | Petit bouclier renforcé de fourrure | Matériaux durs |
| Bouclier | Petit bouclier renforcé de métal | Matériaux durs |
| Bouclier | Petit bouclier en bois | Matériaux durs |
| Équipement | Vêtements ordinaires | Matériaux souples |
| Équipement | Vêtements pauvres | Matériaux souples |
| Équipement | Vêtements riches | Matériaux souples |
| Équipement | Vêtements d’esclave | Matériaux souples |
| Équipement | Grand paquetage d’armement | Matériaux durs |
| Équipement | Paquetage d’armement ordinaire | Matériaux durs |
| Équipement | Petit paquetage d’armement | Matériaux durs |
| Équipement | Grand paquetage de cambriolage | Matériaux durs |
| Équipement | Paquetage de cambriolage ordinaire | Matériaux durs |
| Équipement | Petit paquetage de cambriolage | Matériaux durs |
| Équipement | Grand paquetage de campement | Matériaux durs |
| Équipement | Paquetage de campement ordinaire | Matériaux durs |
| Équipement | Petit paquetage de campement | Matériaux durs |
| Équipement | Grand paquetage d’artisanat | Matériaux durs |
| Équipement | Paquetage d’artisanat ordinaire | Matériaux durs |
| Équipement | Petit paquetage d’artisanat | Matériaux durs |
| Équipement | Grand paquetage de pêche | Matériaux durs |
| Équipement | Paquetage de pêche ordinaire | Matériaux durs |
| Équipement | Petit paquetage de pêche | Matériaux durs |
| Équipement | Grand paquetage de soins | Matériaux durs |
| Équipement | Paquetage de soins ordinaire | Matériaux durs |
| Équipement | Petit paquetage de soins | Matériaux durs |
| Équipement | Grand paquetage de chasse | Matériaux durs |
| Équipement | Paquetage de chasse ordinaire | Matériaux durs |
| Équipement | Petit paquetage de chasse | Matériaux durs |
| Équipement | Grand paquetage de musique | Matériaux durs |
| Équipement | Paquetage de musique ordinaire | Matériaux durs |
| Équipement | Petit paquetage de musique | Matériaux durs |
| Équipement | Grand paquetage d’écriture | Matériaux durs |
| Équipement | Paquetage d’écriture ordinaire | Matériaux durs |
| Équipement | Petit paquetage d’écriture | Matériaux durs |
| Équipement | Tenue royale | Matériaux souples |
| Équipement | Cœur de minokks | Matériaux souples |
| Équipement | Cœur régénérant de lindwurm | Matériaux souples |
| Équipement | Fiole de sève fraîche de vidrjotun | Matériaux durs |
| Équipement | Morceau de sève durcie de vidrjotun | Matériaux durs |
| Équipement | Ambre de sève centenaire de vidrjotun | Matériaux durs |
| Équipement | Pierre de savoir | Matériaux durs |
| Équipement | Poussière de fée | Matériaux durs |
| Équipement | Corde tressée en soie d’araignée | Matériaux souples |
| Équipement | Corde d’arc en soie d’araignée | Matériaux souples |
| Équipement | Toile d’araignée | Matériaux souples |
| Équipement | Sang magmatique de jarnwurm | Matériaux durs |
| Équipement | Or abdominal de firdtursir | Matériaux durs |
| Arme | Blodstör | Matériaux durs |
| Arme | Vitner stafur | Matériaux durs |
| Équipement | Statuette votive | Matériaux durs |
