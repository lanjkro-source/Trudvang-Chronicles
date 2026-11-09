# Priorité des effets hors runes

Décision du 9 novembre 2026 : terminer les autres effets avant de reprendre les runes. Les effets de rune déjà livrés restent disponibles ; les prochains développements ne les étendent pas.

## Objets enchantés, maudits et altérés

Implémentés dans les sources françaises et anglaises : Enchantement d’objet, Malédiction d’objet du vitner, sa version de Sonntag et Altération d’objet. Le tableau français d’Enchantement d’objet augmente les dégâts, la VP et la VI dans sa dernière amélioration ; l’omission de la VP dans le texte JSON a été corrigée dans les deux langues avant régénération. Références : Livre des règles, entrées Enchantement d’objet, Malédiction d’objet et Altération d’objet (références sources 153, 185, 203 ; tableau français d’enchantement contrôlé visuellement dans le PDF, page 155), Player’s Handbook, Enchant Object / Curse Object / Alter Object ; Stormlands, Curses of Sonntag.

Les effets doivent être déposés sur l’objet. Leurs modificateurs restent locaux et les copies déjà résolues ne reçoivent pas une seconde fois les améliorations. Les variantes supplémentaires de Malédiction conservent la durée de base. Les budgets distinguent désormais deux objets portés par le même acteur au lieu de réserver deux fois son UUID d’acteur.

L’utilisation d’un objet enchanté ou maudit apparaît parmi les choix conditionnels habituels de toutes les fenêtres de test. Pour une attaque ou parade dont l’arme est connue, le modificateur de cette arme est automatiquement sélectionné et verrouillé, sans importer ceux d’autres armes. Dans les tests où l’objet est inconnu, le joueur indique explicitement son utilisation. Le résultat et le calcul final citent les objets et effets sélectionnés. La validation vérifie encore l’inventaire et l’état des effets pour ne pas appliquer un bonus retiré depuis l’ouverture du dialogue.

L’augmentation temporaire de VI ne devient jamais une modification intrinsèque lors des coups suivants. La VP dérivée de la VI n’est pas comptée deux fois ; la malédiction d’une armure diminue séparément sa VP sans réduire sa VI. Les objets génériques sans champ de VI reçoivent leur modificateur d’utilisation, sans inventer une intégrité ou une protection qu’ils ne modélisent pas encore.

Altération propose séparément apparence, autre propriété physique, renforcement et combinaison apparence/renforcement. La combinaison exige son amélioration ; ramollir un objet n’augmente pas automatiquement ses VP ou sa VI. L’apparence, la propriété choisie et les limites de taille restent textuelles, sans remplacer arbitrairement le nom ou l’image de l’objet. Pour les lancements anciens ayant déjà réservé une cible d’objet sous l’UUID du porteur, utiliser un nouveau lancement pour bénéficier de l’identité d’objet ; aucune migration des anciennes cartes n’est exécutée.

## Vérification représentative dans Foundry

Sur une arme sans autre effet : appliquer Enchantement d’objet, puis attaquer ou parer. Vérifier le modificateur d’utilisation automatiquement présent, le bonus de dégâts et la VI augmentée. Laisser expirer l’effet : les bonus doivent disparaître. Faire ensuite un test de compétence générique : l’objet doit être proposé comme choix explicite, sans bonus imposé à toutes les actions. Ce contrôle vérifie l’intégration native des effets d’objet et la nouvelle couche commune d’interface ; il ne demande pas de tester chaque sort.

## Travail restant

Le décompte des modèles d’effet ne prouve pas la couverture complète. Les attaques instantanées déjà proposées dans les cartes ne doivent pas recevoir artificiellement un effet permanent. Restent à traiter/vérifier, dans cet ordre pratique :

1. Qualité et Rouille, objets et armes invoqués, objets préparés comme potions et sceaux.
2. Effets à résistance renouvelable, maladies, peur et protections conditionnelles manquantes ; conséquences exactes de réussite et d’échec.
3. Zones fixes et contacts (eau bouillante, flammes, parois), gestion d’entrée/sortie et événements de dégâts ; ne pas les remplacer par des auras mobiles.
4. Dissipation, libérations et soins particuliers, retours à la vie, autres procédures instantanées ; distinguer automatisation et décisions du MJ.
5. Relecture des effets déjà implémentés : paramètres, cibles supplémentaires de base, protections spécifiques et auras/lumières oubliées.
6. Conséquences des tables d’échecs magiques, également comprises dans le chantier des effets.

Les runes viennent après cette liste.
