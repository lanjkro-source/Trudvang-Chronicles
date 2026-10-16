# Modificateurs d’effets : calcul et affichage

Les chemins `system.effective.*` et `system.modifiers.*` sont des entrées des calculs dérivés. Ils utilisent la phase native `initial` de Foundry, avant ces calculs. La phase est normalisée en mémoire pour les effets déjà présents, sans migration du monde ni réapplication manuelle des changements. Les autres chemins conservent leur phase. Les valeurs préparées par Foundry restent la référence ; le calcul des contributions sert uniquement à les expliquer.

| Chemin | Utilisation et affichage |
| --- | --- |
| `effective.traits.<trait>` | Traits actuels, calculs dérivés et jets ; infobulles des traits et détail des jets qui utilisent le trait. |
| `effective.skills.<skill>` | Compétences PJ et PNJ, connaissances et capacités dérivées ; valeur effective dans la liste, détail dans l’infobulle et le jet. Les compétences du livre initialisent le profil PNJ avant les effets, y compris pour multiplier ou remplacer une valeur. |
| `modifiers.rolls.allActions` | Tous les jets d’action, y compris la macro de situation générique ; ligne par contributeur dans le dialogue et le résultat. |
| `modifiers.rolls.combatActions` | Attaques, parades, capacités, magie, et compétences pendant le combat ; même détail. |
| `modifiers.rolls.movementActions` | Actions avec déplacement, lorsque l’action comporte un jet ; même détail. Ne change pas la distance de déplacement. |
| `modifiers.rolls.attack`, `parry`, `magic` | Jet correspondant, avec chaque contribution distincte. Le bonus magique est séparé de la compétence intrinsèque et ajouté une seule fois au total final. |
| `modifiers.rolls.traits.<trait>`, `skills.<skill>` | Jets qui utilisent ce trait ou cette compétence ; contributions distinctes. Les résistances à deux traits conservent leur méthode de combinaison. |
| `modifiers.rolls.initiative` | Initiative préparée ; détail du dialogue d’initiative et inspection de la statistique. |
| `modifiers.movement` | Distance maximale préparée ; affichage PJ et plafonds numériques des modes PNJ, infobulle et inspection. Les distances imprimées par dépense de PC restent distinctes. |
| `modifiers.protection` | Protection totale et absorption des dégâts ; fiche, infobulle et inspection avec les noms des effets. |
| `modifiers.damage` | Dégâts ; confirmation et résultat détaillent déjà les sources dans le résolveur de dégâts. |
| `modifiers.fearFactor` | Ajustement personnel de la peur reçue ; infobulle et inspection de cette statistique. |
| `modifiers.bodyMax`, `combatMax`, `vitnerMax`, `divinityMax` | Maximum de la réserve correspondante ; calcul avant plafonnement, infobulles des réserves et inspection des PC. |
| `modifiers.bodyValue`, `combatValue`, `vitnerValue`, `divinityValue`, `raudValue`, `fearValue` | Valeur actuelle préparée de la réserve ; infobulles et inspection des PC. Les valeurs enregistrées restent séparées pour préserver les dépenses et retrouver le profil sans effet. |

Chaque contribution affiche le nom de l’effet et sa variation. Les effets désactivés ou supprimés ne contribuent pas ; deux effets qui se compensent restent visibles. Les contributions déjà incorporées au trait ou à la compétence portent la mention « déjà compris dans la valeur de base » et ne sont pas ajoutées une seconde fois. Les opérations addition, soustraction, multiplication, minimum, maximum et remplacement sont expliquées par leur variation effective ; toute différence avec la valeur native préparée est réconciliée sous « autres modificateurs ».

Vérification isolée : tests des phases, des opérations et de chaque contexte de jet ; simulation de la préparation native avant/après effets avec le vrai calcul d’acteur ; rendu du dialogue magique avec plusieurs effets nommés. Aucun accès à une installation Foundry n’est nécessaire pour ces tests.
