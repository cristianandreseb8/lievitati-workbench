import { useState, useRef, useEffect, useCallback } from "react";
import NotesPanel from "./NotesPanel.jsx";
import PdfOptionsModal from "./PdfOptionsModal.jsx";
import supabase from "./supabase.js";

const A="#D4732A", AL="#F5EDE4", GR="#4A8C60";
const BD="#EDE6DC", MU="#9E8E80", DK="#2C2420", MI="#6E5E54";
const BG="#F7F3EE", W="#fff";

const TR = {
  es: {
    nav:{ recipes:"📋 Recetas", control:"⚖ Control", library:"📦 Ingredientes" },
    sub:{ ingredients:"Ingredientes", method:"Método", indicators:"Indicadores", comparison:"Comparativa", myRecipes:"Mis recetas" },
    navShort:{ home:"Inicio", recipes:"Recetas", active:"Activa", control:"Control", library:"Lib.", config:"Config" },
    edit:"✎ Editar", save:"✓ Guardar",
    recipeLabel:"Receta:", addNew:"+ nueva",
    scale:"Escalar por piezas", total:"Total", factor:"Factor",
    baked:"horneado", loss:"merma",
    process:"Proceso", addStage:"+ etapa", newStage:"Etapa", newStep:"Paso", newStepDetail:"Descripción.", newInd:"Nuevo", newIndDesc:"Descripción",
    ingredientCol:"Ingrediente", baseCol:"Base", flourCol:"% Harina",
    addIngredient:"+ Ingrediente", fromLibrary:"📦 Biblioteca",
    dragRows:"⠿ Arrastra filas para reordenar",
    addStep:"+ Paso",
    baking:"Cocción", intTemp:"T° interior", conservation:"Conservación",
    allRecipes:"Aplican a todas las recetas",
    addCustom:"+ custom", addIngRow:"+ ingrediente",
    libRef:"Base global de coeficientes · referencia para todas las recetas",
    search:"Buscar…", addItem:"+ Añadir", addToRecipe:"→ receta",
    nameCol:"Nombre",
    sugarTag:"azúcares", composition:"Composición (% del ingrediente)",
    technicalNotes:"Notas técnicas",
    totalSugars:"Total azúcares", sweetness:"Edulcorante",
    fermentableLabel:"Fermentable", osmoticLabel:"Índice osmótico",
    ferm:"ferm.", noFerm:"no ferm.",
    dragCards:"⠿ Arrastra cards para reordenar",
    newRecipe:"Nueva receta", active:"activa ›",
    pdfThis:"Esta receta", pdfAll:"Todas las recetas", pdfComp:"Comparativa",
    pdfOptsTitle:"Opciones de PDF", pdfSectionsLabel:"Secciones a incluir", generatePdf:"Generar PDF", always:"siempre",
    pdfSec:{ header:"Encabezado y parámetros", score:"Puntuación / score", indicators:"Indicadores técnicos", scaleBanner:"Tabla de escalado", ingredients:"Tabla de ingredientes", method:"Método / pasos", process:"Línea de proceso", notes:"Notas de la receta" },
    excellent:"Excelente", good:"Buena", fair:"Regular", unbal:"Desbal.", unbalanced:"Desbalanceada",
    addToLib:"Añadir a biblioteca", newIngName:"Nuevo ingrediente", saveToLib:"¿Guardar en biblioteca?", yes:"Sí", no:"No",
    searchIngredient:"Buscar ingrediente…", orAddNew:"+ Añadir nuevo",
    catLabel:"Categoría", rolLabel:"Rol", mainComp:"Composición principal", detailComp:"Composición detallada",
    noResults:"Sin resultados", addBtn:"+ Añadir",
    cats:{ Harina:"Harina", Azucar:"Azúcar", Liquido:"Líquido", Huevo:"Huevo", Levain:"Levain", Grasa:"Grasa", Sal:"Sal", Aroma:"Aroma", Otro:"Otro" },
    roles:{ farine:"Harina base", sucre:"Azúcar", eau:"Líquido", jaunes:"Yemas/Huevo", beurre:"Grasa/Mantequilla", levain:"Levadura/Masa madre", autre:"Otro" },
    ccols:{ agua:"Agua%", grasa:"Grasa%", azucar:"Azúcar%", sal:"Sal%" },
    nutrients:{
      proteina:"Proteína", almidones:"Almidones", fibra:"Fibra", ceniza:"Ceniza", PL:"P/L",
      sacarosa:"Sacarosa", fructosa:"Fructosa", glucosa:"Glucosa", poder_osm:"P.Osmótico", poder_dul:"P.Dulzor",
      sat:"Saturadas", mono:"Monoinsat.", poli:"Poliinsat.",
      lecitina:"Lecitina", yema_pct:"% Yema",
      materia_g:"M.Grasa", lactosa:"Lactosa",
      yodo:"Yodo", na_pct:"Na%",
    },
    builtIn:{ cu:"Azúcar/Harina", hu:"Hidratación", grasa:"Grasa/Harina", lm:"Levain/Harina", huevo:"Yemas/Harina", sal:"Sal/Harina" },
    builtInShort:{ cu:"Cu", hu:"Hu", grasa:"Grasa%", lm:"LM%", huevo:"Huevo%", sal:"Sal%" },
    ingNames:{
      l1:"Harina de fuerza", l2:"Harina 00", l3:"Azúcar blanquilla", l4:"Miel", l5:"Agua",
      l6:"Leche entera", l7:"Yemas de huevo", l8:"Huevos enteros", l9:"Levain / Masa madre",
      l10:"Mantequilla 82%", l11:"Mantequilla anhidra 99.9%", l12:"Sal fina",
      l13:"Levadura de cerveza", l14:"Pasta aromática naranja", l15:"Crema fresca 35%",
      l16:"Pasta de almendras 50%", l17:"Chocolate negro 70%", l18:"Naranja/Cítrico confitado", l19:"Azúcar invertido",
    },
    calcFromSugars:"* calculado desde los sub-azúcares",
    roleCol:"Rol", compositionSection:"Composición detallada ·",
    indOk:"✓ OK", indOut:"⚠ fuera", indOutShort:"fuera", pza:"pza", baseScaled:"base → escalado",
    globalAdj:"Ajustes globales", deleteRecipe:"Eliminar", showBase:"Base", hideBase:"Ocultar base",
    loading:"Cargando recetas…",
    notes:"Notas", globalNotes:"Notas globales", undoTitle:"Deshacer último cambio",
    tagline:"Tu taller de panadería y pastelería",
    viewRecipes:"Ver recetas", activeRecipe:"Receta activa", controlTab:"Control",
    noFavorites:"Sin favoritos todavía", markFavorites:"Marca recetas con ★ para verlas aquí", exploreRecipes:"Explorar recetas",
    myFavorites:"Mis favoritos",
    noRecipes:"No se encontraron recetas", trySearch:"Prueba con otro término de búsqueda",
    addPhoto:"Añadir foto", editBy:"Editar por:",
    show:"Mostrar:", allRecipes2:"Todas", recipe:"Receta", score:"Score", weight:"Peso", price:"Precio", time:"Tiempo",
    statRecipes:"Recetas", statFavs:"Favoritos", statCats:"Categorías",
    sortName:"Nombre A-Z", sortScore:"Score", sortPrice:"Precio", sortTime:"Tiempo",
    searchRecipe:"Buscar receta…", addNewRecipe:"+ Nueva",
    newRecipeTitle:"Nueva receta", newRecipeSubtitle:"Completa los datos básicos para comenzar",
    fieldName:"Nombre *", fieldSubtitle:"Subtítulo", fieldCategory:"Categoría", fieldTag:"Tag",
    fieldWeight:"Peso pieza (g)", fieldLoss:"Merma (%)", fieldPrice:"Precio (€)", fieldTime:"Tiempo elaboración",
    fieldBaking:"Cocción", fieldConservation:"Conservación",
    phTitle:"Ej. Brioche Fine au Beurre", phSubtitle:"Ej. Receta tradicional italiana", phTag:"Ej. Boulangerie", phTime:"Ej. 4h 30min", phBaking:"Ej. 180°C / 25 min", phConservation:"Ej. 3 días a temperatura ambiente",
    cancel:"Cancelar", creating:"Guardando…", createRecipe:"Crear receta",
    appManage:"Gestiona el estado completo de la aplicación: recetas, indicadores y biblioteca de ingredientes.",
    resetTitle:"Restaurar a estado original", resetDesc:"Borra todas las recetas, indicadores y cambios realizados. Vuelve al estado de fábrica de la aplicación. Esta acción no se puede deshacer.",
    savedStates:"Estados guardados", saveBtn:"Guardar",
    resetConfirmTitle:"Restaurar estado original",
    restoreDefault:"Restaurar default",
    saveState:"+ Guardar estado actual", noSavedStates:"No hay estados guardados",
    loadState:"Cargar", loadingState:"Cargando…",
    yesRestore:"Sí, restaurar", restoring:"Restaurando…",
    confirmResetText:"Se borrarán <strong>todas las recetas</strong>, indicadores personalizados y la biblioteca de ingredientes. La aplicación volverá exactamente a como estaba cuando se instaló.<br/><br/><strong>Esta acción no se puede deshacer.</strong>",
    recipesWord:"recetas",
    activeIndicators:"Indicadores activos",
    quantityPerRecipe:"Cantidad por receta (g masa total)", totalIngredients:"Total ingredientes",
    range:"rango", duplicateRecipe:"Duplicar receta",
    miseNoFav:"Marca recetas con ★ para calcular la mise en place",
    miseTotal:"Total", color:"color",
    expandDetail:"expande · composición detallada",
    miseRoles:{ farine:"Harinas", levain:"Levain", eau:"Líquidos", sucre:"Azúcares", beurre:"Grasas", jaunes:"Huevos", autre:"Otros" },
    searchPlaceholder:"Buscar receta, categoría, tag…",
    stateNamePlaceholder:"Nombre del estado…",
    translateBtn:"Traducir contenido", translating:"Traduciendo…", translateDone:"¡Traducido!", translateErr:"Error al traducir",
  },
  en: {
    nav:{ recipes:"📋 Recipes", control:"⚖ Dashboard", library:"📦 Ingredients" },
    sub:{ ingredients:"Ingredients", method:"Method", indicators:"Indicators", comparison:"Comparison", myRecipes:"My recipes" },
    navShort:{ home:"Home", recipes:"Recipes", active:"Active", control:"Control", library:"Lib.", config:"Config" },
    edit:"✎ Edit", save:"✓ Save",
    recipeLabel:"Recipe:", addNew:"+ new",
    scale:"Scale by pieces", total:"Total", factor:"Factor",
    baked:"baked", loss:"loss",
    process:"Process", addStage:"+ stage", newStage:"Stage", newStep:"Step", newStepDetail:"Description.", newInd:"New", newIndDesc:"Description",
    ingredientCol:"Ingredient", baseCol:"Base", flourCol:"% Flour",
    addIngredient:"+ Ingredient", fromLibrary:"📦 Library",
    dragRows:"⠿ Drag rows to reorder",
    addStep:"+ Step",
    baking:"Baking", intTemp:"Int. temp.", conservation:"Conservation",
    allRecipes:"Apply to all recipes",
    addCustom:"+ custom", addIngRow:"+ ingredient",
    libRef:"Global ingredient reference for all recipes",
    search:"Search…", addItem:"+ Add", addToRecipe:"→ recipe",
    nameCol:"Name",
    sugarTag:"sugars", composition:"Composition (% of ingredient)",
    technicalNotes:"Technical notes",
    totalSugars:"Total sugars", sweetness:"Sweetness",
    fermentableLabel:"Fermentable", osmoticLabel:"Osmotic index",
    ferm:"ferm.", noFerm:"non-ferm.",
    dragCards:"⠿ Drag cards to reorder",
    newRecipe:"New recipe", active:"active ›",
    pdfThis:"This recipe", pdfAll:"All recipes", pdfComp:"Comparison",
    pdfOptsTitle:"PDF Options", pdfSectionsLabel:"Sections to include", generatePdf:"Generate PDF", always:"always",
    pdfSec:{ header:"Header & parameters", score:"Score", indicators:"Technical indicators", scaleBanner:"Scaling table", ingredients:"Ingredients table", method:"Method / steps", process:"Process line", notes:"Recipe notes" },
    excellent:"Excellent", good:"Good", fair:"Fair", unbal:"Unbal.", unbalanced:"Unbalanced",
    addToLib:"Add to library", newIngName:"New ingredient", saveToLib:"Save to library?", yes:"Yes", no:"No",
    searchIngredient:"Search ingredient…", orAddNew:"+ Add new",
    catLabel:"Category", rolLabel:"Role", mainComp:"Main composition", detailComp:"Detailed composition",
    noResults:"No results", addBtn:"+ Add",
    cats:{ Harina:"Flour", Azucar:"Sugar", Liquido:"Liquid", Huevo:"Egg", Levain:"Levain", Grasa:"Fat", Sal:"Salt", Aroma:"Aroma", Otro:"Other" },
    roles:{ farine:"Flour base", sucre:"Sugar", eau:"Liquid", jaunes:"Yolks/Egg", beurre:"Fat/Butter", levain:"Yeast/Sourdough", autre:"Other" },
    ccols:{ agua:"Water%", grasa:"Fat%", azucar:"Sugar%", sal:"Salt%" },
    nutrients:{
      proteina:"Protein", almidones:"Starches", fibra:"Fiber", ceniza:"Ash", PL:"P/L",
      sacarosa:"Sucrose", fructosa:"Fructose", glucosa:"Glucose", poder_osm:"Osm.Power", poder_dul:"Sweetness",
      sat:"Saturated", mono:"Monounsat.", poli:"Polyunsat.",
      lecitina:"Lecithin", yema_pct:"Yolk %",
      materia_g:"Fat matter", lactosa:"Lactose",
      yodo:"Iodine", na_pct:"Na%",
    },
    builtIn:{ cu:"Sugar/Flour", hu:"Hydration", grasa:"Fat/Flour", lm:"Levain/Flour", huevo:"Yolks/Flour", sal:"Salt/Flour" },
    builtInShort:{ cu:"Cu", hu:"Hu", grasa:"Fat%", lm:"LM%", huevo:"Egg%", sal:"Salt%" },
    ingNames:{
      l1:"Bread flour", l2:"Flour 00", l3:"Caster sugar", l4:"Honey", l5:"Water",
      l6:"Whole milk", l7:"Egg yolks", l8:"Whole eggs", l9:"Levain / Sourdough",
      l10:"Butter 82%", l11:"Anhydrous butter 99.9%", l12:"Fine salt",
      l13:"Fresh yeast", l14:"Orange aromatic paste", l15:"Heavy cream 35%",
      l16:"Almond paste 50%", l17:"Dark chocolate 70%", l18:"Candied orange/citrus", l19:"Invert sugar",
    },
    calcFromSugars:"* calculated from sub-sugars",
    roleCol:"Role", compositionSection:"Detailed composition ·",
    indOk:"✓ OK", indOut:"⚠ out", indOutShort:"out", pza:"pcs", baseScaled:"base → scaled",
    globalAdj:"Global adjustments", deleteRecipe:"Delete", showBase:"Base", hideBase:"Hide base",
    loading:"Loading recipes…",
    notes:"Notes", globalNotes:"Global notes", undoTitle:"Undo last change",
    tagline:"Your bakery & pastry workshop",
    viewRecipes:"View recipes", activeRecipe:"Active recipe", controlTab:"Control",
    noFavorites:"No favorites yet", markFavorites:"Star recipes with ★ to see them here", exploreRecipes:"Explore recipes",
    myFavorites:"My favorites",
    noRecipes:"No recipes found", trySearch:"Try a different search term",
    addPhoto:"Add photo", editBy:"Edit by:",
    show:"Show:", allRecipes2:"All", recipe:"Recipe", score:"Score", weight:"Weight", price:"Price", time:"Time",
    statRecipes:"Recipes", statFavs:"Favorites", statCats:"Categories",
    sortName:"Name A-Z", sortScore:"Score", sortPrice:"Price", sortTime:"Time",
    searchRecipe:"Search recipe…", addNewRecipe:"+ New",
    newRecipeTitle:"New recipe", newRecipeSubtitle:"Fill in the basic details to get started",
    fieldName:"Name *", fieldSubtitle:"Subtitle", fieldCategory:"Category", fieldTag:"Tag",
    fieldWeight:"Piece weight (g)", fieldLoss:"Loss (%)", fieldPrice:"Price (€)", fieldTime:"Prep time",
    fieldBaking:"Baking", fieldConservation:"Conservation",
    phTitle:"E.g. Brioche Fine au Beurre", phSubtitle:"E.g. Traditional Italian recipe", phTag:"E.g. Boulangerie", phTime:"E.g. 4h 30min", phBaking:"E.g. 180°C / 25 min", phConservation:"E.g. 3 days at room temperature",
    cancel:"Cancel", creating:"Saving…", createRecipe:"Create recipe",
    appManage:"Manage the complete application state: recipes, indicators and ingredient library.",
    resetTitle:"Restore to original state", resetDesc:"Deletes all recipes, indicators and changes made. Returns to the factory state of the application. This action cannot be undone.",
    savedStates:"Saved states", saveBtn:"Save",
    resetConfirmTitle:"Restore original state",
    restoreDefault:"Restore default",
    saveState:"+ Save current state", noSavedStates:"No saved states",
    loadState:"Load", loadingState:"Loading…",
    yesRestore:"Yes, restore", restoring:"Restoring…",
    confirmResetText:"<strong>All recipes</strong>, custom indicators and the ingredient library will be deleted. The application will return to exactly how it was when first installed.<br/><br/><strong>This action cannot be undone.</strong>",
    recipesWord:"recipes",
    activeIndicators:"Active indicators",
    quantityPerRecipe:"Quantity per recipe (g total dough)", totalIngredients:"Total ingredients",
    range:"range", duplicateRecipe:"Duplicate recipe",
    miseNoFav:"Star recipes with ★ to calculate mise en place",
    miseTotal:"Total", color:"color",
    expandDetail:"expand · detailed composition",
    miseRoles:{ farine:"Flours", levain:"Levain", eau:"Liquids", sucre:"Sugars", beurre:"Fats", jaunes:"Eggs", autre:"Others" },
    searchPlaceholder:"Search recipe, category, tag…",
    stateNamePlaceholder:"State name…",
    translateBtn:"Translate content", translating:"Translating…", translateDone:"Translated!", translateErr:"Translation error",
  },
  fr: {
    nav:{ recipes:"📋 Recettes", control:"⚖ Tableau de bord", library:"📦 Ingrédients" },
    sub:{ ingredients:"Ingrédients", method:"Méthode", indicators:"Indicateurs", comparison:"Comparaison", myRecipes:"Mes recettes" },
    navShort:{ home:"Accueil", recipes:"Recettes", active:"Active", control:"Contrôle", library:"Bibl.", config:"Config" },
    edit:"✎ Modifier", save:"✓ Enregistrer",
    recipeLabel:"Recette:", addNew:"+ nouvelle",
    scale:"Mettre à l'échelle par pièce", total:"Total", factor:"Facteur",
    baked:"cuit", loss:"perte",
    process:"Processus", addStage:"+ étape", newStage:"Étape", newStep:"Étape", newStepDetail:"Description.", newInd:"Nouveau", newIndDesc:"Description",
    ingredientCol:"Ingrédient", baseCol:"Base", flourCol:"% Farine",
    addIngredient:"+ Ingrédient", fromLibrary:"📦 Bibliothèque",
    dragRows:"⠿ Glisser les lignes pour réorganiser",
    addStep:"+ Étape",
    baking:"Cuisson", intTemp:"T° intérieure", conservation:"Conservation",
    allRecipes:"S'appliquent à toutes les recettes",
    addCustom:"+ personnalisé", addIngRow:"+ ingrédient",
    libRef:"Base de coefficients globale · référence pour toutes les recettes",
    search:"Rechercher…", addItem:"+ Ajouter", addToRecipe:"→ recette",
    nameCol:"Nom",
    sugarTag:"sucres", composition:"Composition (% de l'ingrédient)",
    technicalNotes:"Notes techniques",
    totalSugars:"Total sucres", sweetness:"Sucrant",
    fermentableLabel:"Fermentable", osmoticLabel:"Indice osmotique",
    ferm:"ferm.", noFerm:"non ferm.",
    dragCards:"⠿ Glisser les cartes pour réorganiser",
    newRecipe:"Nouvelle recette", active:"active ›",
    pdfThis:"Cette recette", pdfAll:"Toutes les recettes", pdfComp:"Comparaison",
    pdfOptsTitle:"Options PDF", pdfSectionsLabel:"Sections à inclure", generatePdf:"Générer PDF", always:"toujours",
    pdfSec:{ header:"En-tête & paramètres", score:"Score", indicators:"Indicateurs techniques", scaleBanner:"Tableau de mise à l'échelle", ingredients:"Tableau des ingrédients", method:"Méthode / étapes", process:"Ligne de processus", notes:"Notes de la recette" },
    excellent:"Excellent", good:"Bon", fair:"Passable", unbal:"Déséq.", unbalanced:"Déséquilibré",
    addToLib:"Ajouter à la bibliothèque", newIngName:"Nouvel ingrédient", saveToLib:"Sauvegarder dans la bibliothèque ?", yes:"Oui", no:"Non",
    searchIngredient:"Rechercher un ingrédient…", orAddNew:"+ Ajouter nouveau",
    catLabel:"Catégorie", rolLabel:"Rôle", mainComp:"Composition principale", detailComp:"Composition détaillée",
    noResults:"Aucun résultat", addBtn:"+ Ajouter",
    cats:{ Harina:"Farine", Azucar:"Sucre", Liquido:"Liquide", Huevo:"Œuf", Levain:"Levain", Grasa:"Matière grasse", Sal:"Sel", Aroma:"Arôme", Otro:"Autre" },
    roles:{ farine:"Base farine", sucre:"Sucre", eau:"Liquide", jaunes:"Jaunes/Œuf", beurre:"Graisse/Beurre", levain:"Levure/Levain", autre:"Autre" },
    ccols:{ agua:"Eau%", grasa:"Graisse%", azucar:"Sucre%", sal:"Sel%" },
    nutrients:{
      proteina:"Protéine", almidones:"Amidons", fibra:"Fibres", ceniza:"Cendres", PL:"P/L",
      sacarosa:"Saccharose", fructosa:"Fructose", glucosa:"Glucose", poder_osm:"P.Osmotique", poder_dul:"P.Sucrant",
      sat:"Saturées", mono:"Monoinsaturées", poli:"Polyinsaturées",
      lecitina:"Lécithine", yema_pct:"% Jaune",
      materia_g:"M.Grasse", lactosa:"Lactose",
      yodo:"Iode", na_pct:"Na%",
    },
    builtIn:{ cu:"Sucre/Farine", hu:"Hydratation", grasa:"Graisse/Farine", lm:"Levain/Farine", huevo:"Jaunes/Farine", sal:"Sel/Farine" },
    builtInShort:{ cu:"Cu", hu:"Hu", grasa:"Graisse%", lm:"LM%", huevo:"Œuf%", sal:"Sel%" },
    ingNames:{
      l1:"Farine de force", l2:"Farine 00", l3:"Sucre semoule", l4:"Miel", l5:"Eau",
      l6:"Lait entier", l7:"Jaunes d'œufs", l8:"Œufs entiers", l9:"Levain / Masse mère",
      l10:"Beurre 82%", l11:"Beurre anhydre 99,9%", l12:"Sel fin",
      l13:"Levure fraîche", l14:"Pâte aromatique orange", l15:"Crème fraîche 35%",
      l16:"Pâte d'amandes 50%", l17:"Chocolat noir 70%", l18:"Orange/Agrumes confits", l19:"Sucre inverti",
    },
    calcFromSugars:"* calculé depuis les sous-sucres",
    roleCol:"Rôle", compositionSection:"Composition détaillée ·",
    indOk:"✓ OK", indOut:"⚠ hors", indOutShort:"hors", pza:"pcs", baseScaled:"base → mis à l'échelle",
    globalAdj:"Ajustements globaux", deleteRecipe:"Supprimer", showBase:"Base", hideBase:"Masquer la base",
    loading:"Chargement des recettes…",
    notes:"Notes", globalNotes:"Notes globales", undoTitle:"Annuler la dernière modification",
    tagline:"Votre atelier boulangerie & pâtisserie",
    viewRecipes:"Voir les recettes", activeRecipe:"Recette active", controlTab:"Contrôle",
    noFavorites:"Pas encore de favoris", markFavorites:"Marquez les recettes avec ★ pour les voir ici", exploreRecipes:"Explorer les recettes",
    myFavorites:"Mes favoris",
    noRecipes:"Aucune recette trouvée", trySearch:"Essayez un autre terme de recherche",
    addPhoto:"Ajouter une photo", editBy:"Modifier par :",
    show:"Afficher :", allRecipes2:"Toutes", recipe:"Recette", score:"Score", weight:"Poids", price:"Prix", time:"Temps",
    statRecipes:"Recettes", statFavs:"Favoris", statCats:"Catégories",
    sortName:"Nom A-Z", sortScore:"Score", sortPrice:"Prix", sortTime:"Temps",
    searchRecipe:"Rechercher une recette…", addNewRecipe:"+ Nouvelle",
    newRecipeTitle:"Nouvelle recette", newRecipeSubtitle:"Remplissez les informations de base pour commencer",
    fieldName:"Nom *", fieldSubtitle:"Sous-titre", fieldCategory:"Catégorie", fieldTag:"Tag",
    fieldWeight:"Poids pièce (g)", fieldLoss:"Perte (%)", fieldPrice:"Prix (€)", fieldTime:"Temps de préparation",
    fieldBaking:"Cuisson", fieldConservation:"Conservation",
    phTitle:"Ex. Brioche Fine au Beurre", phSubtitle:"Ex. Recette traditionnelle italienne", phTag:"Ex. Boulangerie", phTime:"Ex. 4h 30min", phBaking:"Ex. 180°C / 25 min", phConservation:"Ex. 3 jours à température ambiante",
    cancel:"Annuler", creating:"Enregistrement…", createRecipe:"Créer la recette",
    appManage:"Gérez l'état complet de l'application : recettes, indicateurs et bibliothèque d'ingrédients.",
    resetTitle:"Restaurer l'état d'origine", resetDesc:"Supprime toutes les recettes, indicateurs et modifications. Revient à l'état d'usine. Cette action ne peut pas être annulée.",
    savedStates:"États sauvegardés", saveBtn:"Enregistrer",
    resetConfirmTitle:"Restaurer l'état d'origine",
    restoreDefault:"Restaurer par défaut",
    saveState:"+ Sauvegarder l'état actuel", noSavedStates:"Aucun état sauvegardé",
    loadState:"Charger", loadingState:"Chargement…",
    yesRestore:"Oui, restaurer", restoring:"Restauration…",
    confirmResetText:"<strong>Toutes les recettes</strong>, les indicateurs personnalisés et la bibliothèque d'ingrédients seront supprimés. L'application reviendra exactement à son état initial.<br/><br/><strong>Cette action ne peut pas être annulée.</strong>",
    recipesWord:"recettes",
    activeIndicators:"Indicateurs actifs",
    quantityPerRecipe:"Quantité par recette (g de pâte totale)", totalIngredients:"Total ingrédients",
    range:"plage", duplicateRecipe:"Dupliquer la recette",
    miseNoFav:"Marquez les recettes avec ★ pour calculer la mise en place",
    miseTotal:"Total", color:"couleur",
    expandDetail:"développer · composition détaillée",
    miseRoles:{ farine:"Farines", levain:"Levain", eau:"Liquides", sucre:"Sucres", beurre:"Matières grasses", jaunes:"Œufs", autre:"Autres" },
    searchPlaceholder:"Rechercher recette, catégorie, tag…",
    stateNamePlaceholder:"Nom de l'état…",
    translateBtn:"Traduire le contenu", translating:"Traduction…", translateDone:"Traduit !", translateErr:"Erreur de traduction",
  },
  it: {
    nav:{ recipes:"📋 Ricette", control:"⚖ Pannello", library:"📦 Ingredienti" },
    sub:{ ingredients:"Ingredienti", method:"Metodo", indicators:"Indicatori", comparison:"Comparazione", myRecipes:"Le mie ricette" },
    navShort:{ home:"Home", recipes:"Ricette", active:"Attiva", control:"Controllo", library:"Bibl.", config:"Config" },
    edit:"✎ Modifica", save:"✓ Salva",
    recipeLabel:"Ricetta:", addNew:"+ nuova",
    scale:"Scalare per pezzi", total:"Totale", factor:"Fattore",
    baked:"cotto", loss:"perdita",
    process:"Processo", addStage:"+ fase", newStage:"Fase", newStep:"Passo", newStepDetail:"Descrizione.", newInd:"Nuovo", newIndDesc:"Descrizione",
    ingredientCol:"Ingrediente", baseCol:"Base", flourCol:"% Farina",
    addIngredient:"+ Ingrediente", fromLibrary:"📦 Libreria",
    dragRows:"⠿ Trascina le righe per riordinare",
    addStep:"+ Passo",
    baking:"Cottura", intTemp:"T° interna", conservation:"Conservazione",
    allRecipes:"Si applicano a tutte le ricette",
    addCustom:"+ personalizzato", addIngRow:"+ ingrediente",
    libRef:"Base globale dei coefficienti · riferimento per tutte le ricette",
    search:"Cerca…", addItem:"+ Aggiungi", addToRecipe:"→ ricetta",
    nameCol:"Nome",
    sugarTag:"zuccheri", composition:"Composizione (% dell'ingrediente)",
    technicalNotes:"Note tecniche",
    totalSugars:"Zuccheri totali", sweetness:"Dolcificante",
    fermentableLabel:"Fermentabile", osmoticLabel:"Indice osmotico",
    ferm:"ferm.", noFerm:"non ferm.",
    dragCards:"⠿ Trascina le schede per riordinare",
    newRecipe:"Nuova ricetta", active:"attiva ›",
    pdfThis:"Questa ricetta", pdfAll:"Tutte le ricette", pdfComp:"Comparazione",
    pdfOptsTitle:"Opzioni PDF", pdfSectionsLabel:"Sezioni da includere", generatePdf:"Genera PDF", always:"sempre",
    pdfSec:{ header:"Intestazione e parametri", score:"Punteggio", indicators:"Indicatori tecnici", scaleBanner:"Tabella di scalatura", ingredients:"Tabella ingredienti", method:"Metodo / passi", process:"Linea di processo", notes:"Note della ricetta" },
    excellent:"Eccellente", good:"Buono", fair:"Discreto", unbal:"Sbilanc.", unbalanced:"Sbilanciato",
    addToLib:"Aggiungi alla libreria", newIngName:"Nuovo ingrediente", saveToLib:"Salvare in libreria?", yes:"Sì", no:"No",
    searchIngredient:"Cerca ingrediente…", orAddNew:"+ Aggiungi nuovo",
    catLabel:"Categoria", rolLabel:"Ruolo", mainComp:"Composizione principale", detailComp:"Composizione dettagliata",
    noResults:"Nessun risultato", addBtn:"+ Aggiungi",
    cats:{ Harina:"Farina", Azucar:"Zucchero", Liquido:"Liquido", Huevo:"Uovo", Levain:"Lievito", Grasa:"Grasso", Sal:"Sale", Aroma:"Aroma", Otro:"Altro" },
    roles:{ farine:"Farina base", sucre:"Zucchero", eau:"Liquido", jaunes:"Tuorli/Uovo", beurre:"Grasso/Burro", levain:"Lievito/Pasta madre", autre:"Altro" },
    ccols:{ agua:"Acqua%", grasa:"Grasso%", azucar:"Zucchero%", sal:"Sale%" },
    nutrients:{
      proteina:"Proteina", almidones:"Amido", fibra:"Fibra", ceniza:"Cenere", PL:"P/L",
      sacarosa:"Saccarosio", fructosa:"Fruttosio", glucosa:"Glucosio", poder_osm:"P.Osmotico", poder_dul:"P.Dolcezza",
      sat:"Sature", mono:"Monoinsature", poli:"Polinsature",
      lecitina:"Lecitina", yema_pct:"% Tuorlo",
      materia_g:"M.Grassa", lactosa:"Lattosio",
      yodo:"Iodio", na_pct:"Na%",
    },
    builtIn:{ cu:"Zucchero/Farina", hu:"Idratazione", grasa:"Grasso/Farina", lm:"Lievito/Farina", huevo:"Tuorli/Farina", sal:"Sale/Farina" },
    builtInShort:{ cu:"Cu", hu:"Hu", grasa:"Grasso%", lm:"LM%", huevo:"Uova%", sal:"Sale%" },
    ingNames:{
      l1:"Farina di forza", l2:"Farina 00", l3:"Zucchero semolato", l4:"Miele", l5:"Acqua",
      l6:"Latte intero", l7:"Tuorli d'uovo", l8:"Uova intere", l9:"Lievito naturale / Pasta madre",
      l10:"Burro 82%", l11:"Burro anidro 99,9%", l12:"Sale fino",
      l13:"Lievito di birra", l14:"Pasta aromatica arancia", l15:"Panna fresca 35%",
      l16:"Pasta di mandorle 50%", l17:"Cioccolato fondente 70%", l18:"Arancia/Agrumi canditi", l19:"Zucchero invertito",
    },
    calcFromSugars:"* calcolato dai sotto-zuccheri",
    roleCol:"Ruolo", compositionSection:"Composizione dettagliata ·",
    indOk:"✓ OK", indOut:"⚠ fuori", indOutShort:"fuori", pza:"pz", baseScaled:"base → scalato",
    globalAdj:"Impostazioni globali", deleteRecipe:"Elimina", showBase:"Base", hideBase:"Nascondi base",
    loading:"Caricamento ricette…",
    notes:"Note", globalNotes:"Note globali", undoTitle:"Annulla ultima modifica",
    tagline:"Il tuo laboratorio di panificazione e pasticceria",
    viewRecipes:"Vedi ricette", activeRecipe:"Ricetta attiva", controlTab:"Controllo",
    noFavorites:"Nessun preferito ancora", markFavorites:"Segna le ricette con ★ per vederle qui", exploreRecipes:"Esplora le ricette",
    myFavorites:"I miei preferiti",
    noRecipes:"Nessuna ricetta trovata", trySearch:"Prova con un altro termine di ricerca",
    addPhoto:"Aggiungi foto", editBy:"Modifica per:",
    show:"Mostra:", allRecipes2:"Tutte", recipe:"Ricetta", score:"Score", weight:"Peso", price:"Prezzo", time:"Tempo",
    statRecipes:"Ricette", statFavs:"Preferiti", statCats:"Categorie",
    sortName:"Nome A-Z", sortScore:"Score", sortPrice:"Prezzo", sortTime:"Tempo",
    searchRecipe:"Cerca ricetta…", addNewRecipe:"+ Nuova",
    newRecipeTitle:"Nuova ricetta", newRecipeSubtitle:"Compila i dati di base per iniziare",
    fieldName:"Nome *", fieldSubtitle:"Sottotitolo", fieldCategory:"Categoria", fieldTag:"Tag",
    fieldWeight:"Peso pezzo (g)", fieldLoss:"Perdita (%)", fieldPrice:"Prezzo (€)", fieldTime:"Tempo di elaborazione",
    fieldBaking:"Cottura", fieldConservation:"Conservazione",
    phTitle:"Es. Brioche Fine au Beurre", phSubtitle:"Es. Ricetta tradizionale italiana", phTag:"Es. Boulangerie", phTime:"Es. 4h 30min", phBaking:"Es. 180°C / 25 min", phConservation:"Es. 3 giorni a temperatura ambiente",
    cancel:"Annulla", creating:"Salvataggio…", createRecipe:"Crea ricetta",
    appManage:"Gestisci lo stato completo dell'applicazione: ricette, indicatori e libreria degli ingredienti.",
    resetTitle:"Ripristina allo stato originale", resetDesc:"Elimina tutte le ricette, indicatori e modifiche effettuate. Torna allo stato di fabbrica dell'applicazione. Questa azione non può essere annullata.",
    savedStates:"Stati salvati", saveBtn:"Salva",
    resetConfirmTitle:"Ripristina stato originale",
    restoreDefault:"Ripristina default",
    saveState:"+ Salva stato attuale", noSavedStates:"Nessuno stato salvato",
    loadState:"Carica", loadingState:"Caricamento…",
    yesRestore:"Sì, ripristina", restoring:"Ripristino…",
    confirmResetText:"<strong>Tutte le ricette</strong>, gli indicatori personalizzati e la libreria degli ingredienti verranno eliminati. L'applicazione tornerà esattamente allo stato iniziale.<br/><br/><strong>Questa azione non può essere annullata.</strong>",
    recipesWord:"ricette",
    activeIndicators:"Indicatori attivi",
    quantityPerRecipe:"Quantità per ricetta (g di impasto totale)", totalIngredients:"Ingredienti totali",
    range:"intervallo", duplicateRecipe:"Duplica ricetta",
    miseNoFav:"Segna le ricette con ★ per calcolare la mise en place",
    miseTotal:"Totale", color:"colore",
    expandDetail:"espandi · composizione dettagliata",
    miseRoles:{ farine:"Farine", levain:"Lievito", eau:"Liquidi", sucre:"Zuccheri", beurre:"Grassi", jaunes:"Uova", autre:"Altri" },
    searchPlaceholder:"Cerca ricetta, categoria, tag…",
    stateNamePlaceholder:"Nome dello stato…",
    translateBtn:"Traduci contenuto", translating:"Traduzione…", translateDone:"Tradotto!", translateErr:"Errore di traduzione",
  },
  de: {
    nav:{ recipes:"📋 Rezepte", control:"⚖ Dashboard", library:"📦 Zutaten" },
    sub:{ ingredients:"Zutaten", method:"Methode", indicators:"Indikatoren", comparison:"Vergleich", myRecipes:"Meine Rezepte" },
    navShort:{ home:"Start", recipes:"Rezepte", active:"Aktiv", control:"Steuerg.", library:"Bibl.", config:"Konfig" },
    edit:"✎ Bearbeiten", save:"✓ Speichern",
    recipeLabel:"Rezept:", addNew:"+ neu",
    scale:"Skalieren nach Stücken", total:"Gesamt", factor:"Faktor",
    baked:"gebacken", loss:"Verlust",
    process:"Prozess", addStage:"+ Stufe", newStage:"Stufe", newStep:"Schritt", newStepDetail:"Beschreibung.", newInd:"Neu", newIndDesc:"Beschreibung",
    ingredientCol:"Zutat", baseCol:"Basis", flourCol:"% Mehl",
    addIngredient:"+ Zutat", fromLibrary:"📦 Bibliothek",
    dragRows:"⠿ Zeilen zum Neuordnen ziehen",
    addStep:"+ Schritt",
    baking:"Backen", intTemp:"Innentemp.", conservation:"Konservierung",
    allRecipes:"Gilt für alle Rezepte",
    addCustom:"+ benutzerdefiniert", addIngRow:"+ Zutat",
    libRef:"Globale Koeffizientenbasis · Referenz für alle Rezepte",
    search:"Suchen…", addItem:"+ Hinzufügen", addToRecipe:"→ Rezept",
    nameCol:"Name",
    sugarTag:"Zucker", composition:"Zusammensetzung (% der Zutat)",
    technicalNotes:"Technische Notizen",
    totalSugars:"Gesamtzucker", sweetness:"Süßungsmittel",
    fermentableLabel:"Fermentierbar", osmoticLabel:"Osmotischer Index",
    ferm:"ferm.", noFerm:"nicht ferm.",
    dragCards:"⠿ Karten zum Neuordnen ziehen",
    newRecipe:"Neues Rezept", active:"aktiv ›",
    pdfThis:"Dieses Rezept", pdfAll:"Alle Rezepte", pdfComp:"Vergleich",
    pdfOptsTitle:"PDF-Optionen", pdfSectionsLabel:"Einzuschließende Abschnitte", generatePdf:"PDF erstellen", always:"immer",
    pdfSec:{ header:"Kopfzeile & Parameter", score:"Bewertung", indicators:"Technische Indikatoren", scaleBanner:"Skalierungstabelle", ingredients:"Zutaten-Tabelle", method:"Methode / Schritte", process:"Prozesslinie", notes:"Rezeptnotizen" },
    excellent:"Ausgezeichnet", good:"Gut", fair:"Mäßig", unbal:"Unausg.", unbalanced:"Unausgewogen",
    addToLib:"Zur Bibliothek hinzufügen", newIngName:"Neue Zutat", saveToLib:"In Bibliothek speichern?", yes:"Ja", no:"Nein",
    searchIngredient:"Zutat suchen…", orAddNew:"+ Neu hinzufügen",
    catLabel:"Kategorie", rolLabel:"Rolle", mainComp:"Hauptzusammensetzung", detailComp:"Detaillierte Zusammensetzung",
    noResults:"Keine Ergebnisse", addBtn:"+ Hinzufügen",
    cats:{ Harina:"Mehl", Azucar:"Zucker", Liquido:"Flüssigkeit", Huevo:"Ei", Levain:"Sauerteig", Grasa:"Fett", Sal:"Salz", Aroma:"Aroma", Otro:"Sonstiges" },
    roles:{ farine:"Mehlbasis", sucre:"Zucker", eau:"Flüssigkeit", jaunes:"Eigelb/Ei", beurre:"Fett/Butter", levain:"Hefe/Sauerteig", autre:"Sonstiges" },
    ccols:{ agua:"Wasser%", grasa:"Fett%", azucar:"Zucker%", sal:"Salz%" },
    nutrients:{
      proteina:"Protein", almidones:"Stärke", fibra:"Ballaststoffe", ceniza:"Asche", PL:"P/L",
      sacarosa:"Saccharose", fructosa:"Fruktose", glucosa:"Glukose", poder_osm:"Osm.Kraft", poder_dul:"Süßkraft",
      sat:"Gesättigt", mono:"Einfach unges.", poli:"Mehrfach unges.",
      lecitina:"Lecithin", yema_pct:"Eigelb %",
      materia_g:"Fettanteil", lactosa:"Laktose",
      yodo:"Jod", na_pct:"Na%",
    },
    builtIn:{ cu:"Zucker/Mehl", hu:"Hydratation", grasa:"Fett/Mehl", lm:"Sauerteig/Mehl", huevo:"Eigelb/Mehl", sal:"Salz/Mehl" },
    builtInShort:{ cu:"Cu", hu:"Hu", grasa:"Fett%", lm:"LM%", huevo:"Ei%", sal:"Salz%" },
    ingNames:{
      l1:"Brotmehl (stark)", l2:"Mehl Typ 00", l3:"Kristallzucker", l4:"Honig", l5:"Wasser",
      l6:"Vollmilch", l7:"Eigelb", l8:"Ganzes Ei", l9:"Sauerteig / Levain",
      l10:"Butter 82%", l11:"Wasserfreie Butter 99,9%", l12:"Feines Salz",
      l13:"Frische Hefe", l14:"Orangenaromapaste", l15:"Frische Sahne 35%",
      l16:"Mandelpaste 50%", l17:"Dunkle Schokolade 70%", l18:"Kandierte Orange/Zitrus", l19:"Invertzucker",
    },
    calcFromSugars:"* berechnet aus den Teilzuckern",
    roleCol:"Rolle", compositionSection:"Detaillierte Zusammensetzung ·",
    indOk:"✓ OK", indOut:"⚠ außerhalb", indOutShort:"außerh.", pza:"Stk", baseScaled:"Basis → skaliert",
    globalAdj:"Globale Einstellungen", deleteRecipe:"Löschen", showBase:"Basis", hideBase:"Basis ausblenden",
    loading:"Rezepte werden geladen…",
    notes:"Notizen", globalNotes:"Globale Notizen", undoTitle:"Letzte Änderung rückgängig",
    tagline:"Ihre Bäckerei- und Konditorei-Werkstatt",
    viewRecipes:"Rezepte anzeigen", activeRecipe:"Aktives Rezept", controlTab:"Steuerung",
    noFavorites:"Noch keine Favoriten", markFavorites:"Markieren Sie Rezepte mit ★, um sie hier zu sehen", exploreRecipes:"Rezepte erkunden",
    myFavorites:"Meine Favoriten",
    noRecipes:"Keine Rezepte gefunden", trySearch:"Versuchen Sie einen anderen Suchbegriff",
    addPhoto:"Foto hinzufügen", editBy:"Bearbeiten nach:",
    show:"Anzeigen:", allRecipes2:"Alle", recipe:"Rezept", score:"Score", weight:"Gewicht", price:"Preis", time:"Zeit",
    statRecipes:"Rezepte", statFavs:"Favoriten", statCats:"Kategorien",
    sortName:"Name A-Z", sortScore:"Score", sortPrice:"Preis", sortTime:"Zeit",
    searchRecipe:"Rezept suchen…", addNewRecipe:"+ Neu",
    newRecipeTitle:"Neues Rezept", newRecipeSubtitle:"Füllen Sie die Grunddaten aus, um zu beginnen",
    fieldName:"Name *", fieldSubtitle:"Untertitel", fieldCategory:"Kategorie", fieldTag:"Tag",
    fieldWeight:"Stückgewicht (g)", fieldLoss:"Verlust (%)", fieldPrice:"Preis (€)", fieldTime:"Zubereitungszeit",
    fieldBaking:"Backen", fieldConservation:"Konservierung",
    phTitle:"Z.B. Brioche Fine au Beurre", phSubtitle:"Z.B. Traditionelles italienisches Rezept", phTag:"Z.B. Boulangerie", phTime:"Z.B. 4h 30min", phBaking:"Z.B. 180°C / 25 min", phConservation:"Z.B. 3 Tage bei Raumtemperatur",
    cancel:"Abbrechen", creating:"Speichern…", createRecipe:"Rezept erstellen",
    appManage:"Verwalten Sie den vollständigen Anwendungsstatus: Rezepte, Indikatoren und Zutatenbibliothek.",
    resetTitle:"Auf Originalzustand zurücksetzen", resetDesc:"Löscht alle Rezepte, Indikatoren und vorgenommenen Änderungen. Kehrt zum Werkszustand zurück. Diese Aktion kann nicht rückgängig gemacht werden.",
    savedStates:"Gespeicherte Zustände", saveBtn:"Speichern",
    resetConfirmTitle:"Originalzustand wiederherstellen",
    restoreDefault:"Standard wiederherstellen",
    saveState:"+ Aktuellen Zustand speichern", noSavedStates:"Keine gespeicherten Zustände",
    loadState:"Laden", loadingState:"Laden…",
    yesRestore:"Ja, wiederherstellen", restoring:"Wiederherstellung…",
    confirmResetText:"<strong>Alle Rezepte</strong>, benutzerdefinierte Indikatoren und die Zutatenbibliothek werden gelöscht. Die Anwendung kehrt genau in den Ausgangszustand zurück.<br/><br/><strong>Diese Aktion kann nicht rückgängig gemacht werden.</strong>",
    recipesWord:"Rezepte",
    activeIndicators:"Aktive Indikatoren",
    quantityPerRecipe:"Menge pro Rezept (g Gesamtteig)", totalIngredients:"Zutaten gesamt",
    range:"Bereich", duplicateRecipe:"Rezept duplizieren",
    miseNoFav:"Markieren Sie Rezepte mit ★, um die Mise en Place zu berechnen",
    miseTotal:"Gesamt", color:"Farbe",
    expandDetail:"erweitern · detaillierte Zusammensetzung",
    miseRoles:{ farine:"Mehle", levain:"Sauerteig", eau:"Flüssigkeiten", sucre:"Zucker", beurre:"Fette", jaunes:"Eier", autre:"Sonstiges" },
    searchPlaceholder:"Rezept, Kategorie, Tag suchen…",
    stateNamePlaceholder:"Zustandsname…",
    translateBtn:"Inhalt übersetzen", translating:"Übersetzen…", translateDone:"Übersetzt!", translateErr:"Übersetzungsfehler",
  },
};

const BUILT_IN = {
  cu:    {label:"Cu",     desc:"Azúcar/Harina",  color:"#D4732A", min:0, max:55,  aMin:0, aMax:120, fn:v=>v.f>0?Math.round(v.s/v.f*100):0},
  hu:    {label:"Hu",     desc:"Hidratación",     color:"#4A8C60", min:0, max:200, aMin:0, aMax:200, fn:v=>v.f>0?Math.round(v.h/v.f*100):0},
  grasa: {label:"Grasa%", desc:"Grasa/Harina",    color:"#9B3DBF", min:0, max:65,  aMin:0, aMax:120, fn:v=>v.f>0?Math.round(v.g/v.f*100):0},
  lm:    {label:"LM%",    desc:"Levain/Harina",   color:"#2A6DD4", min:0, max:55,  aMin:0, aMax:100, fn:v=>v.f>0?Math.round(v.lv/v.f*100):0},
  huevo: {label:"Huevo%", desc:"Yemas/Harina",    color:"#C43C3C", min:0, max:60,  aMin:0, aMax:100, fn:v=>v.f>0?Math.round(v.hv/v.f*100):0},
  sal:   {label:"Sal%",   desc:"Sal/Harina",      color:"#4A7A9B", min:0, max:2.5, aMin:0, aMax:10,  fn:v=>v.f>0?Math.round(v.sl/v.f*100):0},
};

function mkInd() {
  const out={};
  Object.entries(BUILT_IN).forEach(([k,v])=>{
    out[k]={label:v.label, desc:v.desc, color:v.color, min:v.min, max:v.max};
  });
  return out;
}

function calcVals(ings) {
  let f=0,s=0,h=0,g=0,sl=0,lv=0,hv=0,total=0,base=0;
  ings.forEach(i=>{
    const b=i.base||0, c=i.coeffs||{};
    total+=b;
    if(i.isBase||i.role==="farine") f+=b;
    if(i.isBase) base+=b;
    if(i.role==="levain") lv+=b;
    if(i.role==="jaunes") hv+=b;
    s+=b*(c.azucar||0); h+=b*(c.agua||0);
    g+=b*(c.grasa||0);  sl+=b*(c.sal||0);
  });
  return {f:f||base,s,h,g,sl,lv,hv,total};
}

function calcScore(ind, vals) {
  const keys=Object.keys(ind);
  if(!keys.length) return 100;
  let sum=0;
  keys.forEach(k=>{
    const bi=BUILT_IN[k]; if(!bi){sum+=1;return;}
    const v=bi.fn(vals),{min,max}=ind[k];
    if(v<min) sum+=Math.max(0,1-(min-v)/(min||1));
    else if(v>max) sum+=Math.max(0,1-(v-max)/(max||1));
    else sum+=1;
  });
  return Math.round(sum/keys.length*100);
}

const CAT_COLORS={"Harina":"#B07A2A","Azucar":"#D4732A","Liquido":"#4A7A9B","Huevo":"#C43C3C","Levain":"#2A6DD4","Grasa":"#9B3DBF","Sal":"#4A8C60","Aroma":"#2A9B8C","Otro":"#9E8E80"};

const DEFAULT_LIBRARY=[
  {id:"l1", name:"Farine de force / Harina fuerza",cat:"Harina", role:"farine",coeffs:{agua:0.14,grasa:0.01,azucar:0,   sal:0   }},
  {id:"l2", name:"Farina 00",                       cat:"Harina", role:"farine",coeffs:{agua:0.14,grasa:0.01,azucar:0,   sal:0   }},
  {id:"l3", name:"Sucre semoule / Zucchero",        cat:"Azucar", role:"sucre", coeffs:{agua:0,   grasa:0,   azucar:1,   sal:0   }},
  {id:"l4", name:"Miel / Miele",                    cat:"Azucar", role:"sucre", coeffs:{agua:0.17,grasa:0,   azucar:0.80,sal:0   }},
  {id:"l5", name:"Eau / Acqua",                     cat:"Liquido",role:"eau",   coeffs:{agua:1,   grasa:0,   azucar:0,   sal:0   }},
  {id:"l6", name:"Latte intero",                    cat:"Liquido",role:"eau",   coeffs:{agua:0.87,grasa:0.04,azucar:0.05,sal:0   }},
  {id:"l7", name:"Jaunes d'oeufs / Tuorli",         cat:"Huevo",  role:"jaunes",coeffs:{agua:0.51,grasa:0.34,azucar:0,   sal:0   }},
  {id:"l8", name:"Uova intere",                     cat:"Huevo",  role:"jaunes",coeffs:{agua:0.74,grasa:0.10,azucar:0,   sal:0   }},
  {id:"l9", name:"Levain / Lievito naturale",       cat:"Levain", role:"levain",coeffs:{agua:0.50,grasa:0,   azucar:0,   sal:0   }},
  {id:"l10",name:"Beurre / Burro 82%",              cat:"Grasa",  role:"beurre",coeffs:{agua:0.16,grasa:0.82,azucar:0,   sal:0   }},
  {id:"l11",name:"Burro liquido anidro 99.9%",      cat:"Grasa",  role:"beurre",coeffs:{agua:0.01,grasa:0.99,azucar:0,   sal:0   }},
  {id:"l12",name:"Sel / Sale fino",                 cat:"Sal",    role:"autre", coeffs:{agua:0,   grasa:0,   azucar:0,   sal:1   }},
  {id:"l13",name:"Lievito di birra",                cat:"Levain", role:"autre", coeffs:{agua:0.70,grasa:0,   azucar:0,   sal:0   }},
  {id:"l14",name:"Pasta aromatica arancia",         cat:"Aroma",  role:"autre", coeffs:{agua:0.20,grasa:0.10,azucar:0.30,sal:0   }},
  {id:"l15",name:"Crème fraîche 35%",               cat:"Grasa",  role:"beurre",coeffs:{agua:0.62,grasa:0.35,azucar:0.03,sal:0   }},
  {id:"l16",name:"Pâte d'amandes 50%",              cat:"Azucar", role:"sucre", coeffs:{agua:0.05,grasa:0.25,azucar:0.50,sal:0   }},
  {id:"l17",name:"Chocolat noir 70%",               cat:"Aroma",  role:"autre", coeffs:{agua:0.01,grasa:0.42,azucar:0.30,sal:0   }},
  {id:"l18",name:"Naranja / Citrus confitada",      cat:"Aroma",  role:"autre", coeffs:{agua:0.20,grasa:0,   azucar:0.55,sal:0   }},
  {id:"l19",name:"Azúcar invertido",                cat:"Azucar", role:"sucre", coeffs:{agua:0.25,grasa:0,   azucar:0.75,sal:0   }}
];;

const ROLES=["farine","sucre","eau","jaunes","beurre","levain","autre"];
const CCOLS=[
  {key:"agua",  label:"Agua%",   col:"#4A7A9B"},
  {key:"grasa", label:"Grasa%",  col:"#9B3DBF"},
  {key:"azucar",label:"Azúcar%", col:"#D4732A"},
  {key:"sal",   label:"Sal%",    col:"#4A8C60"},
];
// Sub-nutrientes por categoría — se muestran al expandir un ingrediente
// Los que tienen coefCoef suman a ese coeficiente principal (0–1 fracción)
const NUTRIENT_GROUPS = {
  Harina:  [
    {key:"proteina",  label:"Proteína",   col:"#B07A2A", unit:"%"},
    {key:"almidones", label:"Almidones",  col:"#C49A3A", unit:"%"},
    {key:"fibra",     label:"Fibra",      col:"#8C6A3A", unit:"%"},
    {key:"ceniza",    label:"Ceniza",     col:"#9E8E80", unit:"%"},
    {key:"PL",        label:"P/L",        col:"#D4732A", unit:""},
  ],
  Azucar:  [
    {key:"sacarosa",  label:"Sacarosa",   col:"#D4732A", unit:"%", coefKey:"azucar"},
    {key:"fructosa",  label:"Fructosa",   col:"#C43C3C", unit:"%", coefKey:"azucar"},
    {key:"glucosa",   label:"Glucosa",    col:"#B07A2A", unit:"%", coefKey:"azucar"},
    {key:"poder_osm", label:"P.Osmótico", col:"#9E8E80", unit:""},
    {key:"poder_dul", label:"P.Dulzor",   col:"#4A8C60", unit:""},
  ],
  Grasa:   [
    {key:"sat",       label:"Saturadas",  col:"#9B3DBF", unit:"%"},
    {key:"mono",      label:"Monoinsat.", col:"#7A3DBF", unit:"%"},
    {key:"poli",      label:"Poliinsat.", col:"#5A3DBF", unit:"%"},
  ],
  Huevo:   [
    {key:"lecitina",  label:"Lecitina",   col:"#C43C3C", unit:"%"},
    {key:"yema_pct",  label:"% Yema",     col:"#D4732A", unit:"%"},
  ],
  Liquido: [
    {key:"materia_g", label:"M.Grasa",    col:"#4A7A9B", unit:"%"},
    {key:"lactosa",   label:"Lactosa",    col:"#4A8C60", unit:"%"},
  ],
  Sal:     [
    {key:"yodo",      label:"Yodo",       col:"#4A8C60", unit:"mg/kg"},
    {key:"na_pct",    label:"Na%",        col:"#4A7A9B", unit:"%"},
  ],
};

// Translation helpers — ingredient id, cat key, role key → localized string
function tIngName(t, id, fallback) { return (t.ingNames && t.ingNames[id]) || fallback; }
function tCat(t, cat) { return (t.cats && t.cats[cat]) || cat; }
function tRole(t, role) { return (t.roles && t.roles[role]) || role; }
function tNutrient(t, key, fallback) { return (t.nutrients && t.nutrients[key]) || fallback; }
function getCCOLS(t) {
  return [
    {key:"agua",  label:t.ccols?.agua  ||"Agua%",   col:"#4A7A9B"},
    {key:"grasa", label:t.ccols?.grasa ||"Grasa%",  col:"#9B3DBF"},
    {key:"azucar",label:t.ccols?.azucar||"Azúcar%", col:"#D4732A"},
    {key:"sal",   label:t.ccols?.sal   ||"Sal%",    col:"#4A8C60"},
  ];
}
function getNutrientGroups(t) {
  const n = k => tNutrient(t, k, k);
  return {
    Harina:  [{key:"proteina",label:n("proteina"),col:"#B07A2A",unit:"%"},{key:"almidones",label:n("almidones"),col:"#C49A3A",unit:"%"},{key:"fibra",label:n("fibra"),col:"#8C6A3A",unit:"%"},{key:"ceniza",label:n("ceniza"),col:"#9E8E80",unit:"%"},{key:"PL",label:n("PL"),col:"#D4732A",unit:""}],
    Azucar:  [{key:"sacarosa",label:n("sacarosa"),col:"#D4732A",unit:"%",coefKey:"azucar"},{key:"fructosa",label:n("fructosa"),col:"#C43C3C",unit:"%",coefKey:"azucar"},{key:"glucosa",label:n("glucosa"),col:"#B07A2A",unit:"%",coefKey:"azucar"},{key:"poder_osm",label:n("poder_osm"),col:"#9E8E80",unit:""},{key:"poder_dul",label:n("poder_dul"),col:"#4A8C60",unit:""}],
    Grasa:   [{key:"sat",label:n("sat"),col:"#9B3DBF",unit:"%"},{key:"mono",label:n("mono"),col:"#7A3DBF",unit:"%"},{key:"poli",label:n("poli"),col:"#5A3DBF",unit:"%"}],
    Huevo:   [{key:"lecitina",label:n("lecitina"),col:"#C43C3C",unit:"%"},{key:"yema_pct",label:n("yema_pct"),col:"#D4732A",unit:"%"}],
    Liquido: [{key:"materia_g",label:n("materia_g"),col:"#4A7A9B",unit:"%"},{key:"lactosa",label:n("lactosa"),col:"#4A8C60",unit:"%"}],
    Sal:     [{key:"yodo",label:n("yodo"),col:"#4A8C60",unit:"mg/kg"},{key:"na_pct",label:n("na_pct"),col:"#4A7A9B",unit:"%"}],
  };
}

const PALETTE=["#D4732A","#4A8C60","#2A6DD4","#9B3DBF","#C43C3C","#4A7A9B","#B07A2A","#2A9B8C"];
const IGE="26px 18px 1fr 70px 70px 44px 40px 40px 40px 40px";
const IGV="1fr 70px 70px 44px 40px 40px 40px 40px";
const LGE="22px 1fr 70px 38px 38px 38px 38px 72px 30px";
const LGV="22px 1fr 70px 38px 38px 38px 38px 72px";

const R1={
  title:"Brioche Fine", subtitle:"au Levain de Panettone",
  tag:"Boulangerie", conservation:"≥ 1 semaine", categoria:"Brioche",
  baking:"170°C · 25–30 min", tempBaking:"88–92°C int.",
  pesoPieza:500, merma:12, tiempoElaboracion:"24–36H", precio:8.50, foto:null,
  process:[
    {id:"p1",label:"Pâte",time:"0H20"},
    {id:"p2",label:"Bloc",time:"12H"},
    {id:"p3",label:"Façonnage",time:"3–4H"},
    {id:"p4",label:"Apprêt",time:"5–6H"},
    {id:"p5",label:"Cuisson",time:"30 min"},
  ],
  ingredients:[
    {id:1, name:"Farine de force",     spec:"W350–400",        base:1000,role:"farine",isLm:false,isBase:true, coeffs:{agua:0.14,grasa:0.01,azucar:0,   sal:0   }},
    {id:2, name:"Sucre semoule",       spec:"golden équitable", base:420, role:"sucre", isLm:false,isBase:false,coeffs:{agua:0,   grasa:0,   azucar:1,   sal:0   }},
    {id:3, name:"Miel",                spec:"",                 base:50,  role:"sucre", isLm:false,isBase:false,coeffs:{agua:0.17,grasa:0,   azucar:0.80,sal:0   }},
    {id:4, name:"Eau",                 spec:"",                 base:450, role:"eau",   isLm:false,isBase:false,coeffs:{agua:1,   grasa:0,   azucar:0,   sal:0   }},
    {id:5, name:"Jaunes d'oeufs",      spec:"",                 base:540, role:"jaunes",isLm:false,isBase:false,coeffs:{agua:0.51,grasa:0.34,azucar:0,   sal:0   }},
    {id:6, name:"Levain de panettone", spec:"activo TR",        base:500, role:"levain",isLm:true, isBase:false,coeffs:{agua:0.50,grasa:0,   azucar:0,   sal:0   }},
    {id:7, name:"Beurre mou",          spec:"82% MG",           base:500, role:"beurre",isLm:false,isBase:false,coeffs:{agua:0.16,grasa:0.82,azucar:0,   sal:0   }},
    {id:8, name:"Sel fin",             spec:"",                 base:15,  role:"autre", isLm:false,isBase:false,coeffs:{agua:0,   grasa:0,   azucar:0,   sal:1   }},
  ],
  steps:[
    {id:1,label:"Autolisis",    time:"30 min",   detail:"Mezclar farine + eau. Reposo cubierto."},
    {id:2,label:"Incorporacion",time:"20 min",   detail:"Sucre + miel + jaunes poco a poco. Ventana de gluten."},
    {id:3,label:"Levain",       time:"5 min",    detail:"Levain en trozos. Amasar hasta integracion."},
    {id:4,label:"Beurrage",     time:"15 min",   detail:"Beurre en cubos, 3 tandas. Sel al final."},
    {id:5,label:"Détente/Bloc", time:"0–12H",    detail:"Plegar y bloquear en frío 4°C."},
    {id:6,label:"Formado",      time:"20 min",   detail:"Porcionar en frío. Tensión. Moldes. 26°C."},
    {id:7,label:"Coccion",      time:"25–30 min",detail:"170°C. T interior 88–92°C."},
  ],
};

const R2={
  title:"Brioche con il Tuppo", subtitle:"Sicilia · Lievito Naturale",
  tag:"Pasticceria", conservation:"2–3 giorni", categoria:"Brioche",
  baking:"180°C · 14 min", tempBaking:"cotto al tatto",
  pesoPieza:100, merma:10, tiempoElaboracion:"16–20H", precio:2.80, foto:null,
  process:[
    {id:"t1",label:"Attivaz.",time:"1H"},
    {id:"t2",label:"Impasto",time:"15 min"},
    {id:"t3",label:"Puntata",time:"2H"},
    {id:"t4",label:"Frigo",time:"12H"},
    {id:"t5",label:"Formatura",time:"20 min"},
    {id:"t6",label:"Apprêt",time:"2H"},
    {id:"t7",label:"Cottura",time:"14 min"},
  ],
  ingredients:[
    {id:11,name:"Farina 00 W330",         spec:"p/l 0.50",    base:922, role:"farine",isLm:false,coeffs:{agua:0.14,grasa:0.01,azucar:0,    sal:0  }},
    {id:12,name:"Latte intero",            spec:"",            base:542, role:"eau",   isLm:false,coeffs:{agua:0.87,grasa:0.04, azucar:0.05, sal:0  }},
    {id:13,name:"Uova intere",             spec:"",            base:163, role:"jaunes",isLm:false,coeffs:{agua:0.74,grasa:0.10, azucar:0,    sal:0  }},
    {id:14,name:"Zucchero",                spec:"",            base:163, role:"sucre", isLm:false,coeffs:{agua:0,   grasa:0,    azucar:1,    sal:0  }},
    {id:15,name:"Lievito naturale",        spec:"2 rinfreschi",base:217, role:"levain",isLm:true, coeffs:{agua:0.50,grasa:0,    azucar:0,    sal:0  }},
    {id:16,name:"Burro 82% MG",            spec:"blocchi",     base:163, role:"beurre",isLm:false,coeffs:{agua:0.16,grasa:0.82, azucar:0,    sal:0  }},
    {id:17,name:"Burro liquido anidro",    spec:"pf 17°C",     base:108, role:"beurre",isLm:false,coeffs:{agua:0.01,grasa:0.99, azucar:0,    sal:0  }},
    {id:18,name:"Lievito di birra",        spec:"",            base:38,  role:"autre", isLm:false,coeffs:{agua:0.70,grasa:0,    azucar:0,    sal:0  }},
    {id:19,name:"Sale fino",               spec:"",            base:22,  role:"autre", isLm:false,coeffs:{agua:0,   grasa:0,    azucar:0,    sal:1  }},
    {id:20,name:"Pasta aromatica arancia", spec:"",            base:163, role:"autre", isLm:false,coeffs:{agua:0.20,grasa:0.10, azucar:0.30, sal:0  }},
  ],
  steps:[
    {id:11,label:"Attivazione",    time:"1H",     detail:"Latte+zucchero+lievito di birra. 28°C fino al raddoppio."},
    {id:12,label:"Impasto",        time:"15 min", detail:"Farina+uova. Sale, burri, pasta arancia. Levain naturale."},
    {id:13,label:"Puntata",        time:"2H",     detail:"Pellicola. TA ~2 ore."},
    {id:14,label:"Maturazione",    time:"12H",    detail:"Frigorifero 12 ore."},
    {id:15,label:"Formatura",      time:"20 min", detail:"100g pezzi. Strozzatura 1/3-2/3. Infilare il tuppo."},
    {id:16,label:"Appretto",       time:"2H",     detail:"Spennellare con uovo. Cella 27°C ~2 ore."},
    {id:17,label:"Cottura",        time:"14 min", detail:"Spennellare, zucchero a velo. 180°C 14 min."},
  ],
};

const R3={title:"Baguette Tradition",subtitle:"T65 · Levain liquide",tag:"Boulangerie",conservation:"Jour même",categoria:"Pan",baking:"250°C · 22 min",tempBaking:"son creux",pesoPieza:350,merma:20,tiempoElaboracion:"18–24H",precio:1.80,foto:null,
  process:[{id:"b1",label:"Autolyse",time:"45 min"},{id:"b2",label:"Levain",time:"30 min"},{id:"b3",label:"Pointage",time:"12H · 4°C"},{id:"b4",label:"Façonnage",time:"20 min"},{id:"b5",label:"Cuisson",time:"24 min"}],
  ingredients:[
    {id:301,name:"Farine T65",spec:"W200–220",base:1000,role:"farine",isLm:false,coeffs:{agua:0.14,grasa:0.01,azucar:0,sal:0}},
    {id:302,name:"Eau",spec:"25°C",base:730,role:"eau",isLm:false,coeffs:{agua:1,grasa:0,azucar:0,sal:0}},
    {id:303,name:"Levain liquide T65",spec:"100% hydratation",base:200,role:"levain",isLm:true,coeffs:{agua:0.50,grasa:0,azucar:0,sal:0}},
    {id:304,name:"Sel fin",spec:"",base:20,role:"autre",isLm:false,coeffs:{agua:0,grasa:0,azucar:0,sal:1}},
  ],
  steps:[{id:301,label:"Autolyse",time:"45 min"},{id:302,label:"Pétrissage",time:"15 min"},{id:303,label:"Rabats",time:"2H"},{id:304,label:"Pointage",time:"12H"},{id:305,label:"Façonnage",time:"20 min"},{id:306,label:"Cuisson",time:"22–24 min"}],
};

const R4={title:"Baguette Campagne",subtitle:"T80 · Levain dur",tag:"Boulangerie",conservation:"2 jours",categoria:"Pan",baking:"240°C · 26 min",tempBaking:"son creux",pesoPieza:350,merma:18,tiempoElaboracion:"20–28H",precio:2.10,foto:null,
  process:[{id:"c1",label:"Autolyse",time:"30 min"},{id:"c2",label:"Pétrissage",time:"15 min"},{id:"c3",label:"Pointage",time:"2H + 12H"},{id:"c4",label:"Façonnage",time:"20 min"},{id:"c5",label:"Cuisson",time:"26 min"}],
  ingredients:[
    {id:401,name:"Farine T80",spec:"W180",base:800,role:"farine",isLm:false,coeffs:{agua:0.14,grasa:0.01,azucar:0,sal:0}},
    {id:402,name:"Farine T110",spec:"semi-complète",base:200,role:"farine",isLm:false,coeffs:{agua:0.14,grasa:0.01,azucar:0,sal:0}},
    {id:403,name:"Eau",spec:"22°C",base:740,role:"eau",isLm:false,coeffs:{agua:1,grasa:0,azucar:0,sal:0}},
    {id:404,name:"Levain dur T80",spec:"65% hydratation",base:250,role:"levain",isLm:true,coeffs:{agua:0.39,grasa:0,azucar:0,sal:0}},
    {id:405,name:"Sel fin",spec:"",base:21,role:"autre",isLm:false,coeffs:{agua:0,grasa:0,azucar:0,sal:1}},
  ],
  steps:[{id:401,label:"Autolyse",time:"30 min"},{id:402,label:"Pétrissage",time:"15 min"},{id:403,label:"Pointage",time:"2H"},{id:404,label:"Blocage",time:"12H"},{id:405,label:"Façonnage",time:"20 min"},{id:406,label:"Cuisson",time:"24–26 min"}],
};

const R6={
  title:"Brioche T45 StB", subtitle:"Sicilia · Lievito Madre + Levadura",
  tag:"Pasticceria", conservation:"2–3 giorni", categoria:"Brioche",
  baking:"180°C · 14 min", tempBaking:"Al tacto (mín. 94°C)",
  pesoPieza:1111, merma:10, tiempoElaboracion:"16–20H", precio:0, foto:null,
  process:[
    {id:"st1",label:"Activacion",time:"1H"},
    {id:"st2",label:"Autolisis",time:"1H"},
    {id:"st3",label:"Amasado",time:"30 min"},
    {id:"st4",label:"Reposo",time:"12H"},
    {id:"st5",label:"Formado",time:"20 min"},
    {id:"st6",label:"Fermento",time:"2H"},
    {id:"st7",label:"Coccion",time:"14 min"},
  ],
  ingredients:[
    {id:601,name:"Harina T45 WF",       spec:"p/l 0.50",      base:922, role:"farine",isLm:false,isBase:true, coeffs:{agua:0.14,grasa:0.01,azucar:0,   sal:0  }},
    {id:602,name:"Leche entera",         spec:"",               base:411, role:"eau",   isLm:false,isBase:false,coeffs:{agua:0.87,grasa:0.04,azucar:0.05,sal:0  }},
    {id:603,name:"Huevo entero",         spec:"",               base:121, role:"jaunes",isLm:false,isBase:false,coeffs:{agua:0.74,grasa:0.10,azucar:0,   sal:0  }},
    {id:604,name:"Lievito naturale",     spec:"2 rinfreschi",   base:166, role:"levain",isLm:true, isBase:false,coeffs:{agua:0.50,grasa:0,   azucar:0,   sal:0  }},
    {id:605,name:"Levadura fresca",      spec:"",               base:29,  role:"autre", isLm:false,isBase:false,coeffs:{agua:0.70,grasa:0,   azucar:0,   sal:0  }},
    {id:606,name:"Miel",                 spec:"",               base:121, role:"sucre", isLm:false,isBase:false,coeffs:{agua:0.17,grasa:0,   azucar:0.80,sal:0  }},
    {id:607,name:"Azucar",               spec:"",               base:163, role:"sucre", isLm:false,isBase:false,coeffs:{agua:0,   grasa:0,   azucar:1,   sal:0  }},
    {id:608,name:"Sal fina",             spec:"",               base:22,  role:"autre", isLm:false,isBase:false,coeffs:{agua:0,   grasa:0,   azucar:0,   sal:1  }},
    {id:609,name:"Mantequilla 82% MG",   spec:"blocchi",        base:208, role:"beurre",isLm:false,isBase:false,coeffs:{agua:0.16,grasa:0.82,azucar:0,   sal:0  }},
  ],
  steps:[
    {id:601,label:"Activacion + Autolisis",time:"1H",     detail:"1:1 levadura:leche en paralelo. Autolisis harina, leche, huevo."},
    {id:602,label:"Amasado — Miel",        time:"—",      detail:"Miel mas leche con levadura."},
    {id:603,label:"Amasado — Azucar",      time:"—",      detail:"Incorporar azucar."},
    {id:604,label:"Amasado — Sal",         time:"—",      detail:"Incorporar sal fina."},
    {id:605,label:"Amasado — Mantequilla", time:"—",      detail:"Mantequilla en 3 tandas (blocchi)."},
    {id:606,label:"Reposo en frio",        time:"12H",    detail:"Reposo 12 horas a 4°C para mejorar sabor y textura. (opcional)"},
    {id:607,label:"Formado",               time:"20 min", detail:"Bollos de 40g."},
    {id:608,label:"Fermentacion",          time:"2H",     detail:"27°C ~2 horas 65–75% humedad."},
    {id:609,label:"Coccion",               time:"14 min", detail:"180°C 14 min."},
  ],
};

const R5={title:"Bâtard Levain Nature",subtitle:"T65 73% · Seigle 27%",tag:"Boulangerie",conservation:"3–4 jours",categoria:"Pan",baking:"240°C · 38 min",tempBaking:"97°C int.",pesoPieza:800,merma:14,tiempoElaboracion:"24–30H",precio:5.50,foto:null,
  process:[{id:"s1",label:"Rafraîchi",time:"8–12H"},{id:"s2",label:"Autolyse",time:"60 min"},{id:"s3",label:"Pétrissage",time:"12 min"},{id:"s4",label:"Pointage",time:"3H"},{id:"s5",label:"Façonnage",time:"15 min"},{id:"s6",label:"Frigo",time:"12H"},{id:"s7",label:"Cuisson",time:"38 min"}],
  ingredients:[
    {id:501,name:"Farine T65",spec:"W220",base:730,role:"farine",isLm:false,coeffs:{agua:0.14,grasa:0.01,azucar:0,sal:0}},
    {id:502,name:"Farine de seigle T130",spec:"seigle complet",base:270,role:"farine",isLm:false,coeffs:{agua:0.14,grasa:0.01,azucar:0.01,sal:0}},
    {id:503,name:"Eau",spec:"26°C",base:780,role:"eau",isLm:false,coeffs:{agua:1,grasa:0,azucar:0,sal:0}},
    {id:504,name:"Levain naturel T65",spec:"100% · 3 rafraîchis",base:220,role:"levain",isLm:true,coeffs:{agua:0.50,grasa:0,azucar:0,sal:0}},
    {id:505,name:"Sel fin",spec:"",base:22,role:"autre",isLm:false,coeffs:{agua:0,grasa:0,azucar:0,sal:1}},
  ],
  steps:[{id:501,label:"Rafraîchi",time:"8–12H"},{id:502,label:"Autolyse",time:"60 min"},{id:503,label:"Pétrissage",time:"12 min"},{id:504,label:"Pointage",time:"3H"},{id:505,label:"Façonnage",time:"15 min"},{id:506,label:"Frigo",time:"12H"},{id:507,label:"Cuisson",time:"35–40 min"}],
};

function Tag({children, bg=AL, fg=A}) {
  return <span style={{padding:"2px 7px",background:bg,color:fg,borderRadius:"4px",fontSize:"10px",fontWeight:"600"}}>{children}</span>;
}

function ScoreRing({score, small=false, labels}) {
  const sz=small?56:100, r=small?22:42, sw=small?5:8;
  const circ=2*Math.PI*r, dash=circ*score/100;
  const col=score>=80?"#4A8C60":score>=50?"#D4732A":"#CC4A2A";
  const lb=labels||{excellent:"Excelente",good:"Buena",fair:"Regular",unbal:"Desbal."};
  const lbl=score>=80?lb.excellent:score>=60?lb.good:score>=40?lb.fair:lb.unbal;
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"2px"}}>
      <svg width={sz} height={sz} viewBox={"0 0 "+sz+" "+sz}>
        <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="#F0EBE4" strokeWidth={sw}/>
        <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={col} strokeWidth={sw}
          strokeDasharray={dash+" "+(circ-dash)} strokeLinecap="round"
          transform={"rotate(-90 "+sz/2+" "+sz/2+")"} style={{transition:"stroke-dasharray 0.6s ease"}}/>
        <text x={sz/2} y={sz/2} textAnchor="middle" dominantBaseline="middle"
          style={{fontSize:small?"10px":"18px",fontWeight:"700",fill:col,fontFamily:"monospace"}}>{score}</text>
      </svg>
      <span style={{fontSize:small?"8px":"11px",fontWeight:"700",color:col}}>{lbl}</span>
    </div>
  );
}

function ConfigSettings({savedConfigs, onSaveSnapshot, onLoadSnapshot, onDeleteSnapshot, onResetToFactory, A, AL, BD, BG, MU, DK, MI, t}) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [naming, setNaming] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const nameRef = useRef(null);
  useEffect(()=>{if(naming&&nameRef.current)nameRef.current.focus();},[naming]);

  async function doReset() {
    setLoading(true);
    await onResetToFactory();
    setLoading(false);
    setConfirmReset(false);
  }

  async function doLoad(snap) {
    setLoadingId(snap.id);
    await onLoadSnapshot(snap);
    setLoadingId(null);
  }

  function saveNew() {
    const n = newName.trim(); if(!n) return;
    onSaveSnapshot(n);
    setNaming(false); setNewName("");
  }

  return (
    <div style={{maxWidth:"560px"}}>
      <div style={{fontSize:"11px",color:MU,marginBottom:"20px"}}>{t&&t.appManage||"Gestiona el estado completo de la aplicación: recetas, indicadores y biblioteca de ingredientes."}</div>

      {/* RESET TO FACTORY */}
      <div style={{background:"#fff",border:"1px solid "+BD,borderRadius:"12px",padding:"18px",marginBottom:"16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"12px"}}>
          <div>
            <div style={{fontSize:"13px",fontWeight:"700",color:DK,marginBottom:"4px"}}>{t&&t.resetTitle||"Restaurar a estado original"}</div>
            <div style={{fontSize:"11px",color:MU,lineHeight:"1.5"}}>{t&&t.resetDesc||"Borra todas las recetas, indicadores y cambios realizados. Vuelve al estado de fábrica de la aplicación. Esta acción no se puede deshacer."}</div>
          </div>
          <button onClick={()=>setConfirmReset(true)}
            style={{flexShrink:0,padding:"7px 14px",background:"#FFF0EB",color:"#CC4A2A",border:"1px solid #F5D0C8",borderRadius:"7px",fontSize:"11px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
            {t&&t.restoreDefault||"Restaurar default"}
          </button>
        </div>
      </div>

      {/* SAVED SNAPSHOTS */}
      <div style={{background:"#fff",border:"1px solid "+BD,borderRadius:"12px",padding:"18px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
          <div style={{fontSize:"13px",fontWeight:"700",color:DK}}>{t&&t.savedStates||"Estados guardados"}</div>
          {naming?(
            <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
              <input ref={nameRef} value={newName} onChange={e=>setNewName(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter")saveNew();if(e.key==="Escape"){setNaming(false);setNewName("");}}}
                placeholder={t&&t.stateNamePlaceholder||"Nombre del estado…"}
                style={{padding:"5px 9px",border:"1px solid "+A,borderRadius:"6px",fontSize:"12px",outline:"none",fontFamily:"inherit",width:"160px"}}/>
              <button onClick={saveNew} style={{padding:"5px 11px",background:A,color:"#fff",border:"none",borderRadius:"6px",fontSize:"11px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit"}}>{t&&t.saveBtn||"Guardar"}</button>
              <button onClick={()=>{setNaming(false);setNewName("");}} style={{padding:"5px 9px",background:BG,border:"1px solid "+BD,color:MU,borderRadius:"6px",fontSize:"11px",cursor:"pointer",fontFamily:"inherit"}}>✕</button>
            </div>
          ):(
            <button onClick={()=>setNaming(true)}
              style={{padding:"6px 12px",background:A,color:"#fff",border:"none",borderRadius:"7px",fontSize:"11px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit"}}>
              {t&&t.saveState||"+ Guardar estado actual"}
            </button>
          )}
        </div>

        {savedConfigs.length===0?(
          <div style={{textAlign:"center",padding:"28px 0",color:MU,fontSize:"12px",fontStyle:"italic",border:"1px dashed "+BD,borderRadius:"8px"}}>
            {t&&t.noSavedStates||"No hay estados guardados"}
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
            {savedConfigs.map(snap=>(
              <div key={snap.id} style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 12px",background:BG,borderRadius:"8px",border:"1px solid "+BD}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:"12px",fontWeight:"700",color:DK,marginBottom:"2px"}}>{snap.name}</div>
                  <div style={{fontSize:"10px",color:MU}}>{snap.recipes?.length||0} {t&&t.recipesWord||"recetas"} · {new Date(snap.createdAt).toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
                </div>
                <button onClick={()=>doLoad(snap)} disabled={loadingId===snap.id}
                  style={{padding:"5px 12px",background:"#fff",color:DK,border:"1px solid "+BD,borderRadius:"6px",fontSize:"11px",fontWeight:"600",cursor:"pointer",fontFamily:"inherit",opacity:loadingId===snap.id?0.5:1}}>
                  {loadingId===snap.id?(t&&t.loadingState||"Cargando…"):(t&&t.loadState||"Cargar")}
                </button>
                <button onClick={()=>onDeleteSnapshot(snap.id)}
                  style={{padding:"5px 9px",background:"#FFF0EB",color:"#CC4A2A",border:"1px solid #F5D0C8",borderRadius:"6px",fontSize:"11px",cursor:"pointer",fontFamily:"inherit"}}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CONFIRM RESET MODAL */}
      {confirmReset&&(
        <div style={{position:"fixed",inset:0,background:"rgba(44,36,32,0.55)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
          <div style={{background:"#fff",borderRadius:"14px",padding:"28px",maxWidth:"360px",width:"100%",boxShadow:"0 8px 40px rgba(0,0,0,0.22)"}}>
            <div style={{fontSize:"16px",fontWeight:"700",color:"#CC4A2A",marginBottom:"10px"}}>{t&&t.resetConfirmTitle||"Restaurar estado original"}</div>
            <div style={{fontSize:"13px",color:DK,lineHeight:"1.6",marginBottom:"22px"}} dangerouslySetInnerHTML={{__html:t&&t.confirmResetText||"<strong>Esta acción no se puede deshacer.</strong>"}}/>
            <div style={{display:"flex",gap:"8px"}}>
              <button onClick={doReset} disabled={loading}
                style={{flex:1,padding:"10px",background:"#CC4A2A",color:"#fff",border:"none",borderRadius:"8px",fontSize:"13px",fontWeight:"700",cursor:loading?"wait":"pointer",fontFamily:"inherit",opacity:loading?0.7:1}}>
                {loading?(t&&t.restoring||"Restaurando…"):(t&&t.yesRestore||"Sí, restaurar")}
              </button>
              <button onClick={()=>setConfirmReset(false)} disabled={loading}
                style={{flex:1,padding:"10px",background:BG,color:DK,border:"1px solid "+BD,borderRadius:"8px",fontSize:"13px",cursor:"pointer",fontFamily:"inherit"}}>
                {t&&t.cancel||"Cancelar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GlobalSliderRow({s, adjustGlobal, editMode, t}) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const step = s.key === "sal" ? 0.1 : 1;

  const commitVal = (v) => {
    const n = parseFloat(v);
    if (!isNaN(n) && n >= s.min && n <= s.max) adjustGlobal(s.key, n);
    setEditing(false);
  };

  const pct = Math.min(100, Math.max(0, ((s.val - s.min) / (s.max - s.min || 1)) * 100));
  const inRange = s.ind ? s.val >= s.ind.min && s.val <= s.ind.max : true;

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"3px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"4px"}}>
          <span style={{fontSize:"10px",fontWeight:"700",color:s.col}}>{s.label}</span>
          {s.ind&&<span style={{fontSize:"8px",color:inRange?"#7EA87A":"#CC4A2A",fontWeight:"600"}}>{inRange?"✓":"⚠"}</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"4px"}}>
          {editMode&&<button onClick={()=>adjustGlobal(s.key,Math.max(s.min,Math.round((s.val-step)*10)/10))}
            style={{width:"20px",height:"20px",borderRadius:"4px",border:"1px solid "+s.col+"44",background:s.col+"15",color:s.col,fontSize:"13px",fontWeight:"700",cursor:"pointer",padding:0,lineHeight:"20px",textAlign:"center"}}>-</button>}
          {editing&&editMode?(
            <input type="text" inputMode="decimal" value={inputVal}
              onChange={e=>setInputVal(e.target.value)}
              onBlur={()=>commitVal(inputVal)}
              onKeyDown={e=>{if(e.key==="Enter")commitVal(inputVal);}}
              autoFocus
              style={{width:"42px",textAlign:"center",padding:"2px",background:BG,border:"1px solid "+s.col+"66",borderRadius:"4px",fontFamily:"monospace",fontSize:"12px",fontWeight:"700",color:s.col,outline:"none"}}/>
          ):(
            <span onClick={()=>{if(editMode){setEditing(true);setInputVal(String(s.val));}}}
              style={{fontSize:"14px",fontWeight:"700",color:inRange?s.col:"#CC4A2A",fontFamily:"monospace",cursor:editMode?"text":"default",minWidth:"36px",textAlign:"center"}}>{s.val}{s.unit||"%"}</span>
          )}
          {editMode&&<button onClick={()=>adjustGlobal(s.key,Math.min(s.max,Math.round((s.val+step)*10)/10))}
            style={{width:"20px",height:"20px",borderRadius:"4px",border:"1px solid "+s.col+"44",background:s.col+"15",color:s.col,fontSize:"13px",fontWeight:"700",cursor:"pointer",padding:0,lineHeight:"20px",textAlign:"center"}}>+</button>}
        </div>
      </div>
      {editMode?(
        <input type="range" min={s.min} max={s.max} step={step} value={s.val}
          onChange={e=>adjustGlobal(s.key,parseFloat(e.target.value))}
          style={{width:"100%",height:"6px",accentColor:s.col,cursor:"pointer",margin:0,padding:0}}/>
      ):(
        <div style={{position:"relative",height:"6px",background:"#F0EBE4",borderRadius:"99px",overflow:"visible",marginBottom:"2px"}}>
          <div style={{height:"100%",width:pct+"%",background:inRange?s.col:"#CC4A2A",borderRadius:"99px",transition:"width 0.4s"}}/>
          {s.ind&&(
            <>
              <div style={{position:"absolute",top:"-2px",bottom:"-2px",left:Math.min(100,Math.max(0,((s.ind.min-s.min)/(s.max-s.min||1))*100))+"%",width:"2px",background:s.col+"88",borderRadius:"1px"}}/>
              <div style={{position:"absolute",top:"-2px",bottom:"-2px",left:Math.min(100,Math.max(0,((s.ind.max-s.min)/(s.max-s.min||1))*100))+"%",width:"2px",background:s.col+"88",borderRadius:"1px"}}/>
            </>
          )}
        </div>
      )}
      <div style={{display:"flex",justifyContent:"space-between",marginTop:"1px"}}>
        <span style={{fontSize:"7px",color:"#C4B4A4"}}>{s.min}{s.unit||"%"}</span>
        {s.ind&&<span style={{fontSize:"7px",color:s.col+"99"}}>{t?.range||"rango"} {s.ind.min}–{s.ind.max}</span>}
        <span style={{fontSize:"7px",color:"#C4B4A4"}}>{s.max}{s.unit||"%"}</span>
      </div>
    </div>
  );
}

function GlobalSlidersPanel({r, adjustGlobal, editMode, globalInd, indVals, t}) {
  const rv = calcVals(r.ingredients);
  const baseTotal = r.ingredients.filter(i => i.isBase).reduce((s, i) => s + (i.base || 0), 0) || rv.f;
  const bi=t&&t.builtIn||{};
  const baseSliders = [
    {key:"agua",  label:bi.hu||"Hidratación", col:"#4A7A9B", val:baseTotal>0?Math.round(rv.h/baseTotal*100):0, min:0, max:200, ind:globalInd?.hu},
    {key:"azucar",label:bi.cu||"Azúcar",      col:"#D4732A", val:baseTotal>0?Math.round(rv.s/baseTotal*100):0, min:0, max:120, ind:globalInd?.cu},
    {key:"grasa", label:bi.grasa||"Grasa",    col:"#9B3DBF", val:baseTotal>0?Math.round(rv.g/baseTotal*100):0, min:0, max:120, ind:globalInd?.grasa},
    {key:"sal",   label:bi.sal||"Sal",        col:"#4A8C60", val:baseTotal>0?Math.round(rv.sl/baseTotal*100):0, min:0, max:10,  ind:globalInd?.sal, unit:"%"},
  ];
  // Add BUILT_IN indicator sliders that are active and have value > 0 but aren't already in base sliders
  const baseMapped={agua:"hu",azucar:"cu",grasa:"grasa",sal:"sal"};
  const baseKeys=new Set(Object.values(baseMapped));
  const extraSliders = globalInd ? Object.entries(globalInd)
    .filter(([k,ind])=>{
      if(baseKeys.has(k)) return false;
      const bi=BUILT_IN[k]; if(!bi) return false;
      const val=bi.fn(rv); return val>0;
    })
    .map(([k,ind])=>{
      const bi=BUILT_IN[k]; const val=bi.fn(rv);
      return {key:k, label:ind.label, col:ind.color, val, min:bi.aMin, max:bi.aMax, ind, isExtra:true};
    }) : [];

  return (
    <div style={{padding:"10px 14px",borderBottom:"1px solid "+BD,background:BG}}>
      <div style={{fontSize:"9px",fontWeight:"700",color:MU,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"8px",display:"flex",alignItems:"center",gap:"6px"}}>
        {t&&t.globalAdj||"Ajustes globales"}
        <span style={{fontSize:"8px",fontWeight:"400",color:"#C4B4A4"}}>(base: {r.ingredients.filter(i=>i.isBase).map(i=>i.name).join(", ")||"—"})</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 16px"}}>
        {baseSliders.map(s=><GlobalSliderRow key={s.key} s={s} adjustGlobal={adjustGlobal} editMode={editMode} t={t}/>)}
      </div>
      {extraSliders.length>0&&(
        <div style={{marginTop:"10px",paddingTop:"8px",borderTop:"1px solid "+BD}}>
          <div style={{fontSize:"8px",fontWeight:"700",color:MU,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"8px"}}>{t&&t.activeIndicators||"Indicadores activos"}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 16px"}}>
            {extraSliders.map(s=><GlobalSliderRow key={s.key} s={s} adjustGlobal={()=>{}} editMode={false} t={t}/>)}
          </div>
        </div>
      )}
    </div>
  );
}

function IndCard({indKey, ind, value, edit, onUpdate, onDelete, tDesc, t}) {
  const bi=BUILT_IN[indKey], ok=value>=ind.min&&value<=ind.max;
  const pct=Math.min(100,Math.max(0,((value-ind.min)/(ind.max-ind.min||1))*100));
  return (
    <div style={{background:"#fff",border:"2px solid "+(ok?"#EDE6DC":"#F5D0C8"),borderRadius:"12px",padding:"14px",position:"relative"}}>
      {edit&&(
        <button onMouseDown={e=>{e.preventDefault();onDelete();}}
          style={{position:"absolute",top:"8px",right:"8px",background:"#FFF0EB",border:"1px solid #F5D0C8",color:"#CC4A2A",width:"20px",height:"20px",borderRadius:"50%",fontSize:"11px",cursor:"pointer",fontWeight:"700",lineHeight:"20px",textAlign:"center",padding:0}}>
          ✕
        </button>
      )}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px",paddingRight:edit?"24px":"0"}}>
        <div>
          {edit?(
            <input value={ind.label} onChange={e=>onUpdate("label",e.target.value)}
              style={{fontSize:"14px",fontWeight:"700",color:ind.color,background:"transparent",border:"none",borderBottom:"1.5px solid #D4732A",outline:"none",fontFamily:"inherit",width:"80px",padding:0}}/>
          ):(
            <div style={{fontSize:"14px",fontWeight:"700",color:ind.color}}>{(bi&&t?.builtInShort?.[indKey])||ind.label}</div>
          )}
          {edit?(
            <input value={ind.desc||""} onChange={e=>onUpdate("desc",e.target.value)}
              style={{fontSize:"10px",color:MU,background:"transparent",border:"none",borderBottom:"1px dashed #D4C4B0",outline:"none",fontFamily:"inherit",width:"160px",padding:0,marginTop:"2px",display:"block"}}/>
          ):(
            <div style={{fontSize:"10px",color:MU,fontStyle:"italic",marginTop:"2px"}}>{tDesc||ind.desc}</div>
          )}
        </div>
        <div style={{fontSize:"22px",fontWeight:"700",color:ok?ind.color:"#CC4A2A",fontFamily:"monospace",lineHeight:1}}>{value}%</div>
      </div>
      {edit?(
        <div style={{display:"flex",alignItems:"center",gap:"8px",marginTop:"6px"}}>
          <span style={{fontSize:"9px",color:ind.color,fontWeight:"700"}}>min</span>
          <input type="text" inputMode="decimal" defaultValue={ind.min} onBlur={e=>{const n=parseFloat(e.target.value);if(!isNaN(n))onUpdate("min",n);}} style={{width:"48px",textAlign:"center",padding:"3px",background:BG,border:"1px solid "+ind.color+"66",borderRadius:"4px",fontFamily:"monospace",fontSize:"11px",fontWeight:"700",color:ind.color,outline:"none"}}/>
          <div style={{flex:1,height:"3px",background:"#F0EBE4",borderRadius:"99px"}}/>
          <input type="text" inputMode="decimal" defaultValue={ind.max} onBlur={e=>{const n=parseFloat(e.target.value);if(!isNaN(n))onUpdate("max",n);}} style={{width:"48px",textAlign:"center",padding:"3px",background:BG,border:"1px solid "+ind.color+"66",borderRadius:"4px",fontFamily:"monospace",fontSize:"11px",fontWeight:"700",color:ind.color,outline:"none"}}/>
          <span style={{fontSize:"9px",color:ind.color,fontWeight:"700"}}>max</span>
        </div>
      ):(
        <div>
          <div style={{height:"7px",background:"#F0EBE4",borderRadius:"99px",overflow:"hidden",marginBottom:"5px"}}>
            <div style={{height:"100%",width:pct+"%",background:ok?ind.color:"#CC4A2A",borderRadius:"99px",transition:"width 0.5s"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:"9px",color:"#C4B4A4"}}>min {ind.min}%</span>
            <span style={{fontSize:"9px",fontWeight:"600",color:ok?"#7EA87A":"#CC4A2A"}}>{ok?(t&&t.indOk?t.indOk:"✓ OK"):(t&&t.indOut?t.indOut:"⚠ fuera")}</span>
            <span style={{fontSize:"9px",color:"#C4B4A4"}}>max {ind.max}%</span>
          </div>
        </div>
      )}
      {edit&&(
        <div style={{display:"flex",gap:"4px",paddingTop:"8px",marginTop:"6px",borderTop:"1px solid #F0EBE4",alignItems:"center"}}>
          <span style={{fontSize:"9px",color:MU}}>{t?.color||"color"}:</span>
          {PALETTE.map(c=>(
            <button key={c} onMouseDown={e=>{e.preventDefault();onUpdate("color",c);}}
              style={{width:"13px",height:"13px",borderRadius:"50%",background:c,cursor:"pointer",padding:0,border:c===ind.color?"2px solid #2C2420":"2px solid transparent"}}/>
          ))}
        </div>
      )}
    </div>
  );
}

function IngPicker({library,onSelect,onAddNew,t,onClose}) {
  const [q,setQ]=useState(""); const ref=useRef(null);
  useEffect(()=>{if(ref.current)ref.current.focus();},[]);
  const CC={"Harina":"#B07A2A","Azucar":"#D4732A","Liquido":"#4A7A9B","Huevo":"#C43C3C","Levain":"#2A6DD4","Grasa":"#9B3DBF","Sal":"#4A8C60","Aroma":"#2A9B8C","Otro":"#9E8E80"};
  const dispName=e=>tIngName(t,e.id,e.name);
  const dispCat=cat=>tCat(t,cat);
  const filtered=library.filter(e=>{
    if(!q) return true;
    const ql=q.toLowerCase();
    return dispName(e).toLowerCase().includes(ql)||dispCat(e.cat).toLowerCase().includes(ql)||e.name.toLowerCase().includes(ql);
  });
  const groups=filtered.reduce((acc,e)=>{(acc[e.cat]=acc[e.cat]||[]).push(e);return acc;},{});
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(44,36,32,0.45)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#fff",borderRadius:"14px",width:"100%",maxWidth:"440px",maxHeight:"80vh",display:"flex",flexDirection:"column",boxShadow:"0 8px 40px rgba(0,0,0,0.18)",overflow:"hidden"}}>
        <div style={{padding:"12px 14px",borderBottom:"1px solid #EDE6DC"}}>
          <input ref={ref} value={q} onChange={e=>setQ(e.target.value)} placeholder={t.searchIngredient}
            style={{width:"100%",padding:"7px 10px",border:"1px solid #EDE6DC",borderRadius:"7px",fontSize:"13px",outline:"none",fontFamily:"inherit",background:BG}}/>
        </div>
        <div style={{overflowY:"auto",flex:1}}>
          {Object.keys(groups).length===0&&<div style={{padding:"18px",textAlign:"center",color:"#9E8E80",fontSize:"12px"}}>{t.noResults||"Sin resultados"}</div>}
          {Object.entries(groups).map(([cat,entries])=>(
            <div key={cat}>
              <div style={{padding:"5px 14px 3px",fontSize:"8px",fontWeight:"700",color:CC[cat]||"#9E8E80",textTransform:"uppercase",letterSpacing:"0.06em",background:"#FAFAF8"}}>{dispCat(cat)}</div>
              {entries.map(e=>(
                <button key={e.id} onClick={()=>onSelect(e)}
                  style={{display:"flex",alignItems:"center",gap:"8px",width:"100%",padding:"8px 14px",background:"none",border:"none",borderBottom:"1px solid #F0EBE4",cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}>
                  <div style={{width:"7px",height:"7px",borderRadius:"50%",background:CC[cat]||"#9E8E80",flexShrink:0}}/>
                  <span style={{fontSize:"12px",color:"#2C2420",flex:1}}>{dispName(e)}</span>
                  <span style={{fontSize:"8px",color:"#9E8E80",fontFamily:"monospace"}}>{tRole(t,e.role)}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
        <div style={{padding:"9px 14px",borderTop:"1px solid #EDE6DC"}}>
          <button onClick={onAddNew} style={{width:"100%",padding:"8px",background:"#F5EDE4",border:"1px dashed #D4732A",borderRadius:"7px",color:"#D4732A",fontSize:"12px",fontWeight:"600",cursor:"pointer",fontFamily:"inherit"}}>{t.orAddNew}</button>
        </div>
      </div>
    </div>
  );
}

const CATS = ["Harina","Azucar","Liquido","Huevo","Levain","Grasa","Sal","Aroma","Otro"];



function NutrientRow({n, value, onChange}) {
  const v = value ?? 0;
  return (
    <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"7px"}}>
      <span style={{fontSize:"10px",fontWeight:"600",color:n.col,width:"72px",flexShrink:0}}>{n.label}</span>
      {n.unit==="%"
        ? <input type="range" min="0" max="100" step="0.1" value={v} onChange={e=>onChange(parseFloat(e.target.value))} style={{flex:1,accentColor:n.col,cursor:"pointer"}}/>
        : <div style={{flex:1}}/>
      }
      <input type="text" inputMode="decimal" value={v===0?"":v}
        onChange={e=>{const n2=parseFloat(e.target.value);onChange(isNaN(n2)?0:Math.max(0,n2));}}
        style={{width:"44px",textAlign:"center",padding:"3px",background:BG,border:"1px solid "+n.col+"44",borderRadius:"4px",fontFamily:"monospace",fontSize:"11px",fontWeight:"700",color:n.col,outline:"none"}}/>
      <span style={{fontSize:"8px",color:"#9E8E80",width:"22px",flexShrink:0}}>{n.unit||""}</span>
    </div>
  );
}

function NewIngModal({t, onConfirm, onCancel}) {
  const CC={"Harina":"#B07A2A","Azucar":"#D4732A","Liquido":"#4A7A9B","Huevo":"#C43C3C","Levain":"#2A6DD4","Grasa":"#9B3DBF","Sal":"#4A8C60","Aroma":"#2A9B8C","Otro":"#9E8E80"};
  const [name,setName]=useState(""); const [cat,setCat]=useState("Otro"); const [role,setRole]=useState("autre");
  const [agua,setAgua]=useState(0); const [grasa,setGrasa]=useState(0); const [azucar,setAzucar]=useState(0); const [sal,setSal]=useState(0);
  const [nutrients,setNutrients]=useState({});
  const [showNutr,setShowNutr]=useState(false);
  const [saveLib,setSaveLib]=useState(true);
  const ref=useRef(null); useEffect(()=>{if(ref.current)ref.current.focus();},[]);

  const NUTRIENT_GROUPS_T = getNutrientGroups(t);
  const catGroups = NUTRIENT_GROUPS_T[cat] || [];

  function handleCat(c) {
    setCat(c);
    setNutrients({});
    setShowNutr(!!(NUTRIENT_GROUPS_T[c]));
  }

  function setNutr(key, val) { setNutrients(n=>({...n,[key]:val})); }

  const derivedAzucar = catGroups.filter(n=>n.coefKey==="azucar").reduce((s,n)=>s+(nutrients[n.key]||0),0);
  const effectiveAzucar = derivedAzucar > 0 ? derivedAzucar : azucar;

  const coeffs={agua:agua/100,grasa:grasa/100,azucar:effectiveAzucar/100,sal:sal/100};

  function confirm(){
    if(!name.trim()){ref.current&&ref.current.focus();return;}
    const ing={id:Date.now(),name:name.trim(),spec:"",base:100,role,isLm:role==="levain",coeffs};
    const lb=saveLib?{id:"u_"+Date.now(),name:name.trim(),cat,role,coeffs,nutrients:Object.keys(nutrients).length?nutrients:undefined}:null;
    onConfirm(ing,lb);
  }

  const ccols=getCCOLS(t);

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(44,36,32,0.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}>
      <div style={{background:"#fff",borderRadius:"14px",width:"100%",maxWidth:"420px",boxShadow:"0 8px 40px rgba(0,0,0,0.2)",overflow:"hidden"}}>
        <div style={{padding:"16px 18px 12px",borderBottom:"1px solid #EDE6DC"}}>
          <div style={{fontSize:"14px",fontWeight:"700",color:"#2C2420",marginBottom:"10px"}}>{t.newIngName}</div>
          <input ref={ref} value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&confirm()} placeholder={t.nameCol+"…"}
            style={{width:"100%",padding:"8px 10px",border:"1px solid #EDE6DC",borderRadius:"8px",fontSize:"13px",outline:"none",fontFamily:"inherit"}}/>
        </div>
        <div style={{padding:"12px 18px",maxHeight:"62vh",overflowY:"auto"}}>
          <div style={{fontSize:"9px",fontWeight:"700",color:"#9E8E80",textTransform:"uppercase",marginBottom:"6px"}}>{t.catLabel||"Categoría"}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:"4px",marginBottom:"12px"}}>
            {CATS.map(c=><button key={c} onClick={()=>handleCat(c)} style={{padding:"3px 9px",background:cat===c?(CC[c]||"#9E8E80"):BG,color:cat===c?"#fff":"#6E5E54",border:"1px solid "+(cat===c?(CC[c]||"#9E8E80"):"#EDE6DC"),borderRadius:"16px",fontSize:"10px",fontWeight:cat===c?"700":"400",cursor:"pointer",fontFamily:"inherit"}}>{tCat(t,c)}</button>)}
          </div>
          <div style={{fontSize:"9px",fontWeight:"700",color:"#9E8E80",textTransform:"uppercase",marginBottom:"6px"}}>{t.rolLabel||"Rol"}</div>
          <select value={role} onChange={e=>setRole(e.target.value)} style={{width:"100%",padding:"7px 9px",border:"1px solid #EDE6DC",borderRadius:"7px",fontSize:"12px",color:"#2C2420",background:BG,fontFamily:"inherit",outline:"none",marginBottom:"12px"}}>
            {ROLES.map(r=><option key={r} value={r}>{tRole(t,r)}</option>)}
          </select>

          <div style={{fontSize:"9px",fontWeight:"700",color:"#9E8E80",textTransform:"uppercase",marginBottom:"8px"}}>{t.mainComp||"Composición principal"}</div>
          {ccols.map(({key,label,col})=>{
            const vals={agua:[agua,setAgua],grasa:[grasa,setGrasa],azucar:[azucar,setAzucar],sal:[sal,setSal]};
            const [v,s]=vals[key];
            const disabled=key==="azucar"&&derivedAzucar>0;
            const display=disabled?effectiveAzucar:v;
            return (
              <div key={key} style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px",opacity:disabled?0.4:1}}>
                <span style={{fontSize:"10px",fontWeight:"600",color:col,width:"56px",flexShrink:0}}>{label}{disabled?" *":""}</span>
                <input type="range" min="0" max="100" value={display} onChange={e=>disabled?null:s(Number(e.target.value))} disabled={!!disabled} style={{flex:1,accentColor:col,cursor:disabled?"default":"pointer"}}/>
                <input type="text" inputMode="decimal" value={display===0?"":display}
                  onChange={e=>{if(disabled)return;const nv=parseFloat(e.target.value);s(isNaN(nv)?0:Math.min(100,Math.max(0,nv)));}}
                  readOnly={!!disabled}
                  style={{width:"40px",textAlign:"center",padding:"3px",background:BG,border:"1px solid "+col+"44",borderRadius:"4px",fontFamily:"monospace",fontSize:"11px",fontWeight:"700",color:col,outline:"none"}}/>
                <span style={{fontSize:"8px",color:"#9E8E80"}}>%</span>
              </div>
            );
          })}
          {derivedAzucar>0&&<div style={{fontSize:"9px",color:"#D4732A",fontStyle:"italic",marginBottom:"8px",marginTop:"-4px"}}>{t.calcFromSugars||"* calculado desde los sub-azúcares"}</div>}

          {catGroups.length>0&&(
            <div style={{marginTop:"4px"}}>
              <button onClick={()=>setShowNutr(s=>!s)}
                style={{display:"flex",alignItems:"center",gap:"5px",background:"none",border:"none",padding:"5px 0",cursor:"pointer",color:CC[cat]||MU,fontSize:"10px",fontWeight:"700",fontFamily:"inherit"}}>
                <span style={{fontSize:"11px",transition:"transform 0.2s",transform:showNutr?"rotate(90deg)":"rotate(0deg)",display:"inline-block"}}>›</span>
                {t.detailComp||"Composición detallada"} ({tCat(t,cat)})
              </button>
              {showNutr&&(
                <div style={{background:BG,borderRadius:"8px",padding:"10px 12px",marginTop:"4px"}}>
                  {catGroups.map(n=>(
                    <NutrientRow key={n.key} n={n} value={nutrients[n.key]??0} onChange={v=>setNutr(n.key,v)}/>
                  ))}
                </div>
              )}
            </div>
          )}

          <label style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",padding:"9px 10px",background:BG,borderRadius:"7px",marginTop:"10px"}}>
            <input type="checkbox" checked={saveLib} onChange={e=>setSaveLib(e.target.checked)} style={{width:"15px",height:"15px",accentColor:"#D4732A",cursor:"pointer"}}/>
            <span style={{fontSize:"11px",color:"#2C2420"}}>{t.addToLib}</span>
          </label>
        </div>
        <div style={{display:"flex",gap:"7px",padding:"12px 18px",borderTop:"1px solid #EDE6DC"}}>
          <button onClick={confirm} style={{flex:1,padding:"9px",background:"#D4732A",color:"#fff",border:"none",borderRadius:"7px",fontSize:"12px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit"}}>{t.addBtn||"+ Añadir"}</button>
          <button onClick={onCancel} style={{padding:"9px 14px",background:BG,color:"#6E5E54",border:"1px solid #EDE6DC",borderRadius:"7px",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>{t.no}</button>
        </div>
      </div>
    </div>
  );
}

function LibIngredientes({library,libSearch,setLibSearch,editMode,addLib,upLib,upLibC,delLib,addFromLib,setMainTab,t,A,BD,BG,GR,MU,DK,MI}) {
  const [expanded,setExpanded]=useState({});
  const toggle=id=>setExpanded(e=>({...e,[id]:!e[id]}));
  const LGE_="22px 1fr 68px 36px 36px 36px 36px 70px 28px";
  const LGV_="22px 1fr 68px 36px 36px 36px 36px 70px";
  const filtered=library.filter(e=>!libSearch||e.name.toLowerCase().includes(libSearch.toLowerCase())||e.cat.toLowerCase().includes(libSearch.toLowerCase()));
  const groups=filtered.reduce((acc,e)=>{(acc[e.cat]=acc[e.cat]||[]).push(e);return acc;},{});
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px",flexWrap:"wrap",gap:"6px"}}>
        <span style={{fontSize:"11px",color:MU}}>{t.libRef}</span>
        <div style={{display:"flex",gap:"5px",alignItems:"center"}}>
          <input value={libSearch} onChange={e=>setLibSearch(e.target.value)} placeholder={t.search}
            style={{padding:"5px 9px",border:"1px solid "+BD,borderRadius:"6px",fontSize:"11px",outline:"none",fontFamily:"inherit",background:"#fff",width:"140px"}}/>
          <button onClick={addLib} style={{padding:"5px 11px",background:A,color:"#fff",border:"none",borderRadius:"6px",fontSize:"11px",fontWeight:"600",cursor:"pointer"}}>{t.addItem}</button>
        </div>
      </div>
      {Object.entries(groups).map(([cat,entries])=>{
        const NUTRIENT_GROUPS_T=getNutrientGroups(t);
        const catGroups=NUTRIENT_GROUPS_T[cat]||[];
        const catCol=CAT_COLORS[cat]||MU;
        const ccols=getCCOLS(t);
        return (
          <div key={cat} style={{marginBottom:"12px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"5px"}}>
              <div style={{width:"8px",height:"8px",borderRadius:"50%",background:catCol,flexShrink:0}}/>
              <span style={{fontSize:"10px",fontWeight:"700",color:catCol,letterSpacing:"0.06em",textTransform:"uppercase"}}>{tCat(t,cat)}</span>
            </div>
            <div style={{background:"#fff",border:"1px solid "+BD,borderRadius:"10px",overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:editMode?LGE_:LGV_,background:BG,borderBottom:"1px solid "+BD,padding:"5px 10px",alignItems:"center",gap:"2px"}}>
                <div/>
                <span style={{fontSize:"8px",fontWeight:"700",color:MU,textTransform:"uppercase",letterSpacing:"0.07em"}}>{t.nameCol}</span>
                <span style={{fontSize:"8px",fontWeight:"700",color:MU,textTransform:"uppercase",textAlign:"center"}}>{t.roleCol||"Rol"}</span>
                {ccols.map(c=><span key={c.key} style={{fontSize:"7px",fontWeight:"700",color:c.col,textTransform:"uppercase",textAlign:"center"}}>{c.label}</span>)}
                <span style={{fontSize:"8px",fontWeight:"700",color:GR,textTransform:"uppercase",textAlign:"center"}}>+</span>
                {editMode&&<span style={{fontSize:"8px",fontWeight:"700",color:MU,textTransform:"uppercase",textAlign:"center"}}>✕</span>}
              </div>
              {entries.map((entry,idx)=>{
                const isLast=idx===entries.length-1;
                const hasNutr=catGroups.length>0;
                const isOpen=expanded[entry.id];
                const nutr=entry.nutrients||{};
                return (
                  <div key={entry.id} style={{borderBottom:!isLast?"1px solid "+BD:"none"}}>
                    <div style={{display:"grid",gridTemplateColumns:editMode?LGE_:LGV_,padding:"6px 10px",alignItems:"center",gap:"2px",background:"#fff"}}>
                      <div style={{textAlign:"center"}}>
                        {hasNutr&&(
                          <button onClick={()=>toggle(entry.id)}
                            style={{background:"none",border:"none",color:catCol,fontSize:"12px",cursor:"pointer",padding:0,lineHeight:1,transform:isOpen?"rotate(90deg)":"rotate(0deg)",display:"inline-block",transition:"transform 0.15s"}}>
                            ›
                          </button>
                        )}
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
                        {editMode
                          ?<input value={entry.name} onChange={e=>upLib(entry.id,"name",e.target.value)} style={{background:"transparent",border:"none",borderBottom:"1px dashed #D4C4B0",outline:"none",fontFamily:"inherit",fontSize:"11px",color:DK,width:"100%",padding:0}}/>
                          :<span style={{fontSize:"11px",color:DK}}>{tIngName(t,entry.id,entry.name)}</span>
                        }
                      </div>
                      <div style={{textAlign:"center"}}>
                        <select value={entry.role} onChange={e=>upLib(entry.id,"role",e.target.value)} style={{fontSize:"9px",color:MI,background:BG,border:"1px solid "+BD,borderRadius:"3px",padding:"2px",cursor:"pointer",width:"100%"}}>
                          {ROLES.map(o=><option key={o} value={o}>{tRole(t,o)}</option>)}
                        </select>
                      </div>
                      {ccols.map(c=>{
                        const cv=entry.coeffs?(entry.coeffs[c.key]||0):0;
                        return (
                          <div key={c.key} style={{textAlign:"center"}}>
                            <input type="number" min="0" max="100" value={Math.round(cv*100)===0?"":Math.round(cv*100)}
                              onChange={e=>{const n=parseFloat(e.target.value);upLibC(entry.id,c.key,isNaN(n)?0:Math.min(1,Math.max(0,n/100)));}}
                              style={{width:"34px",textAlign:"center",padding:"2px",background:BG,border:"1px solid "+c.col+"44",borderRadius:"3px",fontFamily:"monospace",fontSize:"10px",fontWeight:"600",color:cv>0?c.col:MU,outline:"none"}}/>
                          </div>
                        );
                      })}
                      <div style={{textAlign:"center"}}>
                        <button onClick={()=>{addFromLib(entry);setMainTab("recetas");}} style={{padding:"2px 7px",background:"#EAF2EC",color:GR,border:"1px solid "+GR+"33",borderRadius:"4px",fontSize:"9px",fontWeight:"600",cursor:"pointer"}}>{t.addToRecipe}</button>
                      </div>
                      {editMode&&<div style={{textAlign:"center"}}><button onClick={()=>delLib(entry.id)} style={{background:"none",border:"none",color:"#CC4A2A",fontSize:"11px",cursor:"pointer",padding:0}}>✕</button></div>}
                    </div>
                    {isOpen&&hasNutr&&(
                      <div style={{background:BG,padding:"8px 14px 10px",borderTop:"1px solid "+BD}}>
                        <div style={{fontSize:"8px",fontWeight:"700",color:catCol,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"8px"}}>{t.compositionSection||"Composición detallada ·"} {tCat(t,cat)}</div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:"6px 14px"}}>
                          {catGroups.map(n=>{
                            const nv=nutr[n.key]??0;
                            return (
                              <div key={n.key} style={{display:"flex",alignItems:"center",gap:"5px",minWidth:"120px"}}>
                                <span style={{fontSize:"10px",fontWeight:"600",color:n.col,width:"68px",flexShrink:0}}>{n.label}</span>
                                <input type="text" inputMode="decimal" value={nv===0?"":nv}
                                  onChange={e=>{
                                    const val=parseFloat(e.target.value);
                                    const newNutr={...nutr,[n.key]:isNaN(val)?0:Math.max(0,val)};
                                    upLib(entry.id,"nutrients",newNutr);
                                    if(n.coefKey==="azucar"){
                                      const total=catGroups.filter(g=>g.coefKey==="azucar").reduce((s,g)=>s+(newNutr[g.key]||0),0);
                                      upLibC(entry.id,"azucar",Math.min(1,total/100));
                                    }
                                  }}
                                  style={{width:"44px",textAlign:"center",padding:"3px",background:"#fff",border:"1px solid "+n.col+"44",borderRadius:"4px",fontFamily:"monospace",fontSize:"10px",fontWeight:"700",color:nv>0?n.col:MU,outline:"none"}}/>
                                <span style={{fontSize:"8px",color:MU}}>{n.unit}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <div style={{fontSize:"9px",color:MU,fontStyle:"italic",marginTop:"6px",textAlign:"center"}}>› {t.expandDetail||t.detailComp} · → {t.addToRecipe}</div>
    </div>
  );
}

function MiseEnPlace({recipes,miseQty,setMiseQty,A,AL,GR,BD,MU,DK,t}) {
  const favRecs=recipes.map((rec,ri)=>({ri,rec})).filter(({rec})=>rec.favorite);
  if(!favRecs.length) return <div style={{marginTop:"12px",background:"#fff",border:"2px dashed "+BD,borderRadius:"12px",padding:"28px",textAlign:"center",fontSize:"12px",color:MU}}>☆ {t?.miseNoFav||"Marca recetas con ★ para calcular la mise en place"}</div>;
  const mKey=rec=>rec._id||rec.title;
  const totals={};
  favRecs.forEach(({ri,rec})=>{
    const qty=miseQty[mKey(rec)]??rec.pesoPieza??500;
    const bt=rec.ingredients.reduce((a,i)=>a+(i.base||0),0);
    const ratio=bt>0?qty/bt:1;
    rec.ingredients.forEach(ing=>{
      if(!totals[ing.name])totals[ing.name]={name:ing.name,role:ing.role,isLm:ing.isLm,total:0,by:[]};
      const s=(ing.base||0)*ratio;totals[ing.name].total+=s;totals[ing.name].by.push({t:rec.title,q:s});
    });
  });
  const rg={farine:[],levain:[],eau:[],sucre:[],beurre:[],jaunes:[],autre:[]};
  Object.values(totals).forEach(item=>{(rg[item.role]||rg.autre).push(item);});
  const rl=t?.miseRoles||{farine:"Harinas",levain:"Levain",eau:"Líquidos",sucre:"Azúcares",beurre:"Grasas",jaunes:"Huevos",autre:"Otros"};
  const rc={farine:"#B07A2A",levain:"#2A6DD4",eau:"#4A7A9B",sucre:"#D4732A",beurre:"#9B3DBF",jaunes:"#C43C3C",autre:"#9E8E80"};
  const grand=Object.values(totals).reduce((a,i)=>a+i.total,0);
  return (
    <div style={{marginTop:"12px"}}>
      <div style={{background:"#fff",border:"1px solid "+BD,borderRadius:"12px",padding:"12px 14px",marginBottom:"10px"}}>
        <div style={{fontSize:"10px",fontWeight:"700",color:DK,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"8px"}}>{t?.quantityPerRecipe||"Cantidad por receta"}</div>
        <div style={{display:"flex",gap:"7px",flexWrap:"wrap"}}>
          {favRecs.map(({ri,rec})=>(
            <div key={mKey(rec)} style={{display:"flex",alignItems:"center",gap:"5px",background:BG,borderRadius:"7px",padding:"6px 9px"}}>
              <span style={{fontSize:"10px",fontWeight:"600",color:DK,fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic"}}>{rec.title}</span>
              <input type="text" inputMode="decimal" value={miseQty[mKey(rec)]??rec.pesoPieza??500}
                onChange={e=>{const n=parseFloat(e.target.value);if(!isNaN(n)&&n>0)setMiseQty(q=>({...q,[mKey(rec)]:n}));}}
                style={{width:"58px",textAlign:"center",padding:"3px 4px",background:"#fff",border:"1px solid "+A,borderRadius:"5px",fontFamily:"monospace",fontSize:"12px",fontWeight:"700",color:A,outline:"none"}}/>
              <span style={{fontSize:"8px",color:MU}}>g</span>
            </div>
          ))}
        </div>
        <div style={{marginTop:"8px",fontSize:"10px",color:MU}}>{t?.miseTotal||"Total"}: <b style={{color:A,fontFamily:"monospace"}}>{Math.round(favRecs.reduce((a,{ri,rec})=>a+(miseQty[mKey(rec)]??rec.pesoPieza??500),0))}g</b></div>
      </div>
      {Object.entries(rg).map(([role,items])=>{
        if(!items.length)return null;
        const col=rc[role];const rt=items.reduce((a,i)=>a+i.total,0);
        return (
          <div key={role} style={{marginBottom:"8px",background:"#fff",border:"1px solid "+BD,borderRadius:"12px",overflow:"hidden"}}>
            <div style={{padding:"8px 12px",background:col+"10",borderBottom:"1px solid "+BD,display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:"10px",fontWeight:"700",color:col,textTransform:"uppercase"}}>{rl[role]}</span>
              <span style={{fontSize:"11px",fontWeight:"700",color:col,fontFamily:"monospace"}}>{Math.round(rt)}g</span>
            </div>
            {items.sort((a,b)=>b.total-a.total).map((item,idx)=>(
              <div key={item.name} style={{padding:"7px 12px",borderBottom:idx<items.length-1?"1px solid "+BD:"none"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"2px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
                    {item.isLm&&<span style={{padding:"1px 4px",background:"#FFF5EC",color:A,borderRadius:"3px",fontSize:"8px",fontWeight:"700"}}>LM</span>}
                    <span style={{fontSize:"11px",fontWeight:"600",color:DK}}>{item.name}</span>
                  </div>
                  <span style={{fontSize:"13px",fontWeight:"700",color:col,fontFamily:"monospace"}}>{item.total>=1000?(item.total/1000).toFixed(2)+"kg":Math.round(item.total*10)/10+"g"}</span>
                </div>
                <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>
                  {item.by.map((b,bi)=><span key={bi} style={{fontSize:"8px",color:MU,background:BG,padding:"1px 5px",borderRadius:"3px"}}>{b.t}: {Math.round(b.q*10)/10}g</span>)}
                </div>
              </div>
            ))}
          </div>
        );
      })}
      <div style={{background:AL,border:"1px solid #EAD4B8",borderRadius:"12px",padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:"9px",fontWeight:"700",color:A,textTransform:"uppercase"}}>{t?.totalIngredients||"Total ingredientes"}</div><div style={{fontSize:"9px",color:MU,marginTop:"1px"}}>{Object.keys(totals).length} {t?.sub?.ingredients?.toLowerCase()||"ingredientes"} · {favRecs.length} {t?.recipesWord||"recetas"}</div></div>
        <div style={{fontSize:"24px",fontWeight:"700",color:A,fontFamily:"monospace"}}>{grand>=1000?(grand/1000).toFixed(2)+"kg":Math.round(grand)+"g"}</div>
      </div>
    </div>
  );
}

const SEED_RECIPES = [R1,R2,R3,R4,R5,R6];

function toDb(r, sortOrder) {
  return {
    title: r.title,
    subtitle: r.subtitle||"",
    tag: r.tag||"",
    categoria: r.categoria||"",
    conservation: r.conservation||"",
    baking: r.baking||"",
    temp_baking: r.tempBaking||"",
    peso_pieza: r.pesoPieza||0,
    merma: r.merma||0,
    tiempo_elaboracion: r.tiempoElaboracion||"",
    precio: r.precio||0,
    foto: r.foto||null,
    process: r.process||[],
    ingredients: r.ingredients||[],
    steps: r.steps||[],
    is_favorite: r.favorite||false,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };
}

function fromDb(row) {
  return {
    _id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    tag: row.tag,
    categoria: row.categoria,
    conservation: row.conservation,
    baking: row.baking,
    tempBaking: row.temp_baking,
    pesoPieza: row.peso_pieza,
    merma: row.merma,
    tiempoElaboracion: row.tiempo_elaboracion,
    precio: row.precio,
    foto: row.foto,
    process: row.process,
    ingredients: row.ingredients,
    steps: row.steps,
    favorite: row.is_favorite||false,
  };
}

export default function App() {
  const [recipes,    setRecipes]   = useState([]);
  const recipesRef = useRef([]);
  const userEditedRef = useRef(false);
  const [dbLoaded,   setDbLoaded]  = useState(false);
  const [activeIdx,  setActive]    = useState(0);
  const activeIdxRef = useRef(0);
  const [globalInd,  setGlobalInd] = useState(mkInd);
  const [savedConfigs, setSavedConfigs] = useState([]);  // [{id,name,ind,isDefault}]
  const [library,    setLibrary]   = useState(DEFAULT_LIBRARY);
  const [numPiezas,  setNum]       = useState(6);
  const [editMode,   setEdit]      = useState(false);
  const [mounted,    setMounted]   = useState(false);
  const [lang, setLang] = useState("es");
  const t = TR[lang]||TR.es;
  const ccols = getCCOLS(t);

  const [mainTab, setMainTab] = useState("home");
  const [recTab,  setRecTab]  = useState("ingredientes");
  const [ctlTab,  setCtlTab]  = useState("indicadores");
  const [libTab,  setLibTab]  = useState("ingredientes");

  const recLabels  = {ingredientes:t.sub.ingredients, metodo:t.sub.method};
  const ctlLabels  = {indicadores:t.sub.indicators, comparativa:t.sub.comparison};
  const libLabels  = {ingredientes:t.sub.ingredients};

  const [activeStep, setActiveStep] = useState(null);
  const [libSearch,  setLibSearch]  = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [pickerFor,  setPickerFor]  = useState(null);
  const [showNewIng, setShowNewIng] = useState(false);
  const [newIngFor,  setNewIngFor]  = useState(null);
  const [pctMode,    setPctMode]    = useState(false);
  const [showBase,   setShowBase]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [categories, setCategories]= useState(["Brioche","Panettone","Pan","Viennoiserie","Otro"]);
  const [filterCat,  setFilterCat] = useState("all");
  // toggleFav defined after pushUndo below
  const duplicateRecipe = async(ri)=>{
    pushUndo(recipes,globalInd,library);
    const base=recipes[ri];
    const copy={...base,_id:undefined,title:base.title+" (copia)",
      ingredients:base.ingredients.map(i=>({...i,id:Date.now()+(Math.random()*1000|0)})),
      steps:base.steps.map(s=>({...s,id:Date.now()+(Math.random()*1000|0)})),
      process:base.process.map(p=>({...p,id:"p"+Date.now()+(Math.random()*1000|0)}))};
    const sortOrder=recipesRef.current.length;
    let inserted=copy;
    try { const {data}=await supabase.from("recipes").insert(toDb(copy,sortOrder)).select().maybeSingle(); if(data) inserted=fromDb(data); } catch(e){};
    let newIdx=sortOrder;
    setRecipes(rs=>{newIdx=rs.length; return [...rs,inserted];});
    setActive(()=>{activeIdxRef.current=newIdx; return newIdx;});
    setMainTab("activa");
  };
  const [homeView,   setHomeView]  = useState(null);
  const [miseQty,    setMiseQty]   = useState({});
  const [compHidden, setCompHidden]= useState(new Set());

  // Notes, PDF options
  const [showNotes,     setShowNotes]    = useState(false);
  const [notesGlobal,   setNotesGlobal]  = useState(false);
  const [showPdfOpts,   setShowPdfOpts]  = useState(false);
  const [pdfMode,       setPdfMode]      = useState("recipe");

  // Recipe hub: search, view, sort
  const [searchQ,    setSearchQ]    = useState("");
  const [viewMode,   setViewMode]   = useState("grid");
  const [sortBy,     setSortBy]     = useState("name");
  const [sidebarOpen,setSidebarOpen]= useState(false);

  // New recipe modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newForm, setNewForm] = useState({title:"",subtitle:"",categoria:"Brioche",tag:"",pesoPieza:80,merma:12,precio:0,conservation:"",baking:"",tiempoElaboracion:""});
  const [newSaving, setNewSaving] = useState(false);

  // Undo stack — each entry is {recipes, globalInd, library}, max 30 entries
  const [undoStack, setUndoStack] = useState([]);
  const lastUndoPush = useRef(0);
  // Capture full state; throttled to once per 800ms to avoid per-keystroke spam
  const pushUndo = (recipesSnap, globalIndSnap, librarySnap) => {
    const now = Date.now();
    if(now - lastUndoPush.current < 800) return;
    lastUndoPush.current = now;
    setUndoStack(s=>[...s.slice(-29), {
      recipes: recipesSnap,
      globalInd: globalIndSnap,
      library: librarySnap,
    }]);
  };
  const canUndo = undoStack.length > 0;
  const handleUndo = () => {
    if(!canUndo) return;
    const prev = undoStack[undoStack.length-1];
    setUndoStack(s=>s.slice(0,-1));
    // Restore globalInd and library immediately
    setGlobalInd(prev.globalInd);
    setLibrary(prev.library);
    setRecipes(prev.recipes);
    // Best-effort Supabase sync
    try {
      prev.recipes.forEach((rec,i)=>{
        if(rec._id) supabase.from("recipes").update(toDb(rec,i)).eq("id",rec._id);
      });
      const currentIds = new Set(recipes.map(r=>r._id).filter(Boolean));
      prev.recipes.filter(rec=>rec._id&&!currentIds.has(rec._id)).forEach((rec,i)=>{
        supabase.from("recipes").insert(toDb(rec,i));
      });
    } catch(e){}
    setActive(a=>Math.min(a, prev.recipes.length-1));
  };

  // Full app reset to factory defaults
  const resetToFactory = async () => {
    const freshRecipes = SEED_RECIPES.map(r=>({...r,_id:undefined}));
    setRecipes(freshRecipes);
    const freshInd = mkInd();
    setGlobalInd(freshInd);
    setLibrary(DEFAULT_LIBRARY);
    setSavedConfigs([]);
    setUndoStack([]);
    setActive(0);
    setNum(6);
    setEdit(false);
    setMainTab("home");
    try { localStorage.removeItem("lievitati_recipes"); } catch(e){}
    // Best-effort Supabase sync
    try {
      await supabase.from("recipes").delete().neq("id","00000000-0000-0000-0000-000000000000");
      const rows = SEED_RECIPES.map((r,i)=>toDb(r,i));
      const {data:inserted} = await supabase.from("recipes").insert(rows).select();
      if(inserted) setRecipes(inserted.map(fromDb));
      await supabase.from("app_config").upsert({key:"globalInd",value:freshInd,updated_at:new Date().toISOString()},{onConflict:"key"});
      await supabase.from("app_config").upsert({key:"savedConfigs",value:[],updated_at:new Date().toISOString()},{onConflict:"key"});
      await supabase.from("app_config").upsert({key:"numPiezas",value:6,updated_at:new Date().toISOString()},{onConflict:"key"});
      await supabase.from("app_config").upsert({key:"library",value:DEFAULT_LIBRARY,updated_at:new Date().toISOString()},{onConflict:"key"});
    } catch(e){}
    try { localStorage.removeItem("lievitati_library"); } catch(e){}
  };

  // Save current full state as a named snapshot
  const saveSnapshot = (name) => {
    const snap = {
      id:"snap_"+Date.now(),
      name,
      createdAt: new Date().toISOString(),
      recipes: recipes.map(r=>({...r})),
      globalInd: {...globalInd},
      library: [...library],
      numPiezas,
    };
    setSavedConfigs(cs=>[...cs, snap]);
  };

  // Load a snapshot (restores recipes, ind, library, numPiezas)
  const loadSnapshot = async (snap) => {
    setGlobalInd({...snap.globalInd});
    setLibrary([...snap.library]);
    if(typeof snap.numPiezas==="number") setNum(snap.numPiezas);
    const restored = snap.recipes.map(r=>({...r,_id:r._id||undefined}));
    setRecipes(restored);
    setActive(0);
    setUndoStack([]);
    // Best-effort Supabase sync
    try {
      await supabase.from("recipes").delete().neq("id","00000000-0000-0000-0000-000000000000");
      const rows = snap.recipes.map((r,i)=>toDb({...r,_id:undefined},i));
      const {data:inserted} = await supabase.from("recipes").insert(rows).select();
      if(inserted) setRecipes(inserted.map(fromDb));
    } catch(e){}
  };

  const toggleFav = async ri=>{
    pushUndo(recipes,globalInd,library);
    const newFav = !recipes[ri].favorite;
    setRecipes(rs=>rs.map((rec,i)=>i===ri?{...rec,favorite:newFav}:rec));
    const rec = recipes[ri];
    try { if(rec._id) await supabase.from("recipes").update({is_favorite:newFav}).eq("id",rec._id); } catch(e){}
  };

  useEffect(()=>{const t=setTimeout(()=>setMounted(true),50);return()=>clearTimeout(t);},[]);

  // Load: Supabase is the single source of truth on every page load
  useEffect(()=>{
    let cancelled = false;
    (async()=>{
      // Show localStorage instantly while Supabase loads (avoids blank flash)
      let localRecipes = null;
      let localGlobalInd = null;
      let localSavedConfigs = null;
      let localNumPiezas = null;
      let localLibrary = null;
      try {
        const r = localStorage.getItem("lievitati_recipes");
        if(r) localRecipes = JSON.parse(r);
        const g = localStorage.getItem("lievitati_globalInd");
        if(g) localGlobalInd = JSON.parse(g);
        const s = localStorage.getItem("lievitati_savedConfigs");
        if(s) localSavedConfigs = JSON.parse(s);
        const n = localStorage.getItem("lievitati_numPiezas");
        if(n !== null) localNumPiezas = JSON.parse(n);
        const lb = localStorage.getItem("lievitati_library");
        if(lb) localLibrary = JSON.parse(lb);
      } catch(e) {}

      console.log("[load] localRecipes count=", localRecipes?.length, "first _id=", localRecipes?.[0]?._id, "first ing count=", localRecipes?.[0]?.ingredients?.length);

      if(localRecipes && localRecipes.length > 0 && !cancelled) {
        setRecipes(localRecipes);
        if(localGlobalInd && Object.keys(localGlobalInd).length > 0) setGlobalInd(localGlobalInd);
        if(localSavedConfigs && Array.isArray(localSavedConfigs)) setSavedConfigs(localSavedConfigs);
        if(localNumPiezas !== null && typeof localNumPiezas === "number") setNum(localNumPiezas);
        if(localLibrary && Array.isArray(localLibrary) && localLibrary.length > 0) setLibrary(localLibrary);
      }

      // If localStorage has full data with _ids, trust it and skip Supabase fetch
      const localHasIds = localRecipes && localRecipes.length > 0 && localRecipes.every(r => r._id);
      console.log("[load] localHasIds=", localHasIds);

      // Fetch from Supabase only when needed (no local data, or local data missing _ids)
      try {
        const {data,error}=await supabase.from("recipes").select("*").order("sort_order",{ascending:true});
        if(cancelled || userEditedRef.current) return;
        if(!error && data && data.length > 0) {
          // Only replace if local data is missing or incomplete
          if(!localHasIds) {
            const loaded = data.map(fromDb);
            setRecipes(loaded);
            try { localStorage.setItem("lievitati_recipes", JSON.stringify(loaded)); } catch(e){}
          }
        } else if(!error && (!data || data.length===0)) {
          const rows=SEED_RECIPES.map((r,i)=>toDb(r,i));
          const {data:inserted}=await supabase.from("recipes").insert(rows).select();
          if(cancelled || userEditedRef.current) return;
          const loaded = inserted ? inserted.map(fromDb) : SEED_RECIPES;
          setRecipes(loaded);
          try { localStorage.setItem("lievitati_recipes", JSON.stringify(loaded)); } catch(e){}
        } else if(!localRecipes) {
          setRecipes(SEED_RECIPES);
          try { localStorage.setItem("lievitati_recipes", JSON.stringify(SEED_RECIPES)); } catch(e){}
        }
        const {data:cfg}=await supabase.from("app_config").select("value").eq("key","globalInd").maybeSingle();
        if(!cancelled&&cfg&&cfg.value&&Object.keys(cfg.value).length>0){ setGlobalInd(cfg.value); try{localStorage.setItem("lievitati_globalInd",JSON.stringify(cfg.value));}catch(e){} }
        const {data:cfgSaved}=await supabase.from("app_config").select("value").eq("key","savedConfigs").maybeSingle();
        if(!cancelled&&cfgSaved&&Array.isArray(cfgSaved.value)){ setSavedConfigs(cfgSaved.value); try{localStorage.setItem("lievitati_savedConfigs",JSON.stringify(cfgSaved.value));}catch(e){} }
        const {data:cfgNum}=await supabase.from("app_config").select("value").eq("key","numPiezas").maybeSingle();
        if(!cancelled&&cfgNum&&typeof cfgNum.value==="number"&&cfgNum.value>=0){ setNum(cfgNum.value); try{localStorage.setItem("lievitati_numPiezas",JSON.stringify(cfgNum.value));}catch(e){} }
        const {data:cfgLib}=await supabase.from("app_config").select("value").eq("key","library").maybeSingle();
        if(!cancelled&&cfgLib&&Array.isArray(cfgLib.value)&&cfgLib.value.length>0){ setLibrary(cfgLib.value); try{localStorage.setItem("lievitati_library",JSON.stringify(cfgLib.value));}catch(e){} }
      } catch(e) {
        if(!cancelled && !localRecipes) {
          setRecipes(SEED_RECIPES);
          try { localStorage.setItem("lievitati_recipes", JSON.stringify(SEED_RECIPES)); } catch(e2){}
        }
      }
      if(!cancelled) setDbLoaded(true);
    })();
    return () => { cancelled = true; };
  },[]); // eslint-disable-line

  // Auto-save recipes to localStorage (immediate) and Supabase (debounced, best-effort)
  useEffect(()=>{
    if(!dbLoaded) return;
    const snap=[...recipes];
    // Save to localStorage immediately
    try { localStorage.setItem("lievitati_recipes", JSON.stringify(snap)); } catch(e){}
    // Debounce Supabase sync
    const t=setTimeout(async()=>{
      try {
        const updated = [...snap];
        let didAssignIds = false;
        for(let i=0;i<updated.length;i++){
          const rec=updated[i];
          if(rec._id){
            await supabase.from("recipes").update(toDb(rec,i)).eq("id",rec._id);
          } else {
            const {data} = await supabase.from("recipes").insert(toDb(rec,i)).select().maybeSingle();
            if(data){ updated[i]={...rec,_id:data.id}; didAssignIds=true; }
          }
        }
        if(didAssignIds){
          setRecipes(updated);
          try { localStorage.setItem("lievitati_recipes", JSON.stringify(updated)); } catch(e){}
        }
      } catch(e) { /* offline — localStorage already saved */ }
    },300);
    return()=>clearTimeout(t);
  },[recipes,dbLoaded]); // eslint-disable-line

  // Auto-save globalInd
  useEffect(()=>{
    if(!dbLoaded) return;
    const snap=globalInd;
    try { localStorage.setItem("lievitati_globalInd", JSON.stringify(snap)); } catch(e){}
    const t=setTimeout(async()=>{
      try { await supabase.from("app_config").upsert({key:"globalInd",value:snap,updated_at:new Date().toISOString()},{onConflict:"key"}); } catch(e){}
    },1500);
    return()=>clearTimeout(t);
  },[globalInd,dbLoaded]); // eslint-disable-line

  // Auto-save savedConfigs
  useEffect(()=>{
    if(!dbLoaded) return;
    const snap=savedConfigs;
    try { localStorage.setItem("lievitati_savedConfigs", JSON.stringify(snap)); } catch(e){}
    const t=setTimeout(async()=>{
      try { await supabase.from("app_config").upsert({key:"savedConfigs",value:snap,updated_at:new Date().toISOString()},{onConflict:"key"}); } catch(e){}
    },1500);
    return()=>clearTimeout(t);
  },[savedConfigs,dbLoaded]); // eslint-disable-line

  // Auto-save numPiezas
  useEffect(()=>{
    if(!dbLoaded) return;
    const n=numPiezas;
    try { localStorage.setItem("lievitati_numPiezas", JSON.stringify(n)); } catch(e){}
    const t=setTimeout(async()=>{
      try { await supabase.from("app_config").upsert({key:"numPiezas",value:n,updated_at:new Date().toISOString()},{onConflict:"key"}); } catch(e){}
    },1500);
    return()=>clearTimeout(t);
  },[numPiezas,dbLoaded]); // eslint-disable-line

  // Auto-save library
  useEffect(()=>{
    if(!dbLoaded) return;
    const snap=library;
    try { localStorage.setItem("lievitati_library", JSON.stringify(snap)); } catch(e){}
    const t=setTimeout(async()=>{
      try { await supabase.from("app_config").upsert({key:"library",value:snap,updated_at:new Date().toISOString()},{onConflict:"key"}); } catch(e){}
    },1500);
    return()=>clearTimeout(t);
  },[library,dbLoaded]); // eslint-disable-line

  useEffect(()=>{
    const key=r?._id||activeIdx;
    setMiseQty(q=>({...q,[key]:numPiezas*r?.pesoPieza}));
  },[numPiezas,activeIdx]); // eslint-disable-line

  const EMPTY_R = {title:"",subtitle:"",tag:"",categoria:"",conservation:"",baking:"",tempBaking:"",pesoPieza:0,merma:0,tiempoElaboracion:"",precio:0,foto:null,process:[],ingredients:[],steps:[]};
  activeIdxRef.current = activeIdx; // keep ref in sync so event handlers always see latest value
  recipesRef.current = recipes;
  const r    = recipes[activeIdx] || recipes[0] || EMPTY_R;
  const setR = fn => {
    userEditedRef.current = true;
    const idx=activeIdxRef.current;
    const current=recipesRef.current[idx];
    const changed=fn(current);
    pushUndo(recipesRef.current,globalInd,library);
    const nextRecipes=recipesRef.current.map((rec,i)=>i===idx?changed:rec);
    try { localStorage.setItem("lievitati_recipes", JSON.stringify(nextRecipes)); } catch(e){}
    console.log("[setR] _id=",changed?._id,"ing count=",changed?.ingredients?.length);
    if(changed?._id) supabase.from("recipes").update(toDb(changed,idx)).eq("id",changed._id).then(({error,data})=>{
      console.log("[setR supabase update] error=",error,"data=",data);
      if(error)console.error("setR save error",error);
    });
    setRecipes(nextRecipes);
  };
  const setRec = (ri,fn) => {
    userEditedRef.current = true;
    const current=recipesRef.current[ri];
    const changed=fn(current);
    pushUndo(recipesRef.current,globalInd,library);
    const nextRecipes=recipesRef.current.map((rec,i)=>i===ri?changed:rec);
    try { localStorage.setItem("lievitati_recipes", JSON.stringify(nextRecipes)); } catch(e){}
    if(changed?._id) supabase.from("recipes").update(toDb(changed,ri)).eq("id",changed._id).then(({error})=>{if(error)console.error("setRec save error",error);});
    setRecipes(nextRecipes);
  };

  // Scaling
  const baseTotal  = r.ingredients.reduce((a,i)=>a+(i.base||0),0);
  const masaTarget = numPiezas*r.pesoPieza;
  const ratio      = baseTotal>0?masaTarget/baseTotal:1;
  const sc         = v=>v?Math.round(v*ratio):0;
  const pesoCocido = Math.round(r.pesoPieza*(1-r.merma/100));

  const vals    = calcVals(r.ingredients);
  const score   = calcScore(globalInd,vals);
  const indVals = Object.fromEntries(Object.entries(globalInd).map(([k])=>[k,BUILT_IN[k]?BUILT_IN[k].fn(vals):0]));

  // Updaters
  const setF   =(f,v)    => setR(r=>({...r,[f]:v}));
  const upIng  =(id,f,v) => setR(r=>({...r,ingredients:r.ingredients.map(i=>i.id===id?{...i,[f]:v}:i)}));
  const upIngC =(id,c,v) => setR(r=>({...r,ingredients:r.ingredients.map(i=>i.id===id?{...i,coeffs:{...i.coeffs,[c]:v}}:i)}));
  const upStep =(id,f,v) => setR(r=>({...r,steps:r.steps.map(s=>s.id===id?{...s,[f]:v}:s)}));
  const upProc =(id,f,v) => setR(r=>({...r,process:r.process.map(p=>p.id===id?{...p,[f]:v}:p)}));
  const upInd  =(k,f,v)  => { pushUndo(recipes,globalInd,library); setGlobalInd(ind=>({...ind,[k]:{...ind[k],[f]:v}})); };
  const delInd = k => { pushUndo(recipes,globalInd,library); setGlobalInd(ind=>{const n={...ind};delete n[k];return n;}); };
  const addInd = () => { pushUndo(recipes,globalInd,library); const k="c_"+Date.now(); setGlobalInd(ind=>({...ind,[k]:{label:t.newInd||"Nuevo",desc:t.newIndDesc||"Descripción",min:0,max:100,color:"#4A7A9B"}})); };
  const delIng  = id => setR(r=>({...r,ingredients:r.ingredients.filter(i=>i.id!==id)}));
  const delStep = id => setR(r=>({...r,steps:r.steps.filter(s=>s.id!==id)}));
  const delProc = id => setR(r=>({...r,process:r.process.filter(p=>p.id!==id)}));
  const addIng  = () => setR(r=>({...r,ingredients:[...r.ingredients,{id:Date.now(),name:t.newIngName||"Ingrediente",spec:"",base:100,role:"autre",isLm:false,isBase:false,coeffs:{agua:0,grasa:0,azucar:0,sal:0}}]}));

  const [translateState, setTranslateState] = useState(null); // null | "loading" | "done" | "error"
  const translateRecipe = async () => {
    setTranslateState("loading");
    const fields = {
      steps: r.steps.map(s => ({ id: s.id, label: s.label, time: s.time, detail: s.detail })),
      process: r.process.map(p => ({ id: p.id, label: p.label, time: p.time })),
      baking: r.baking || "",
      intTemp: r.intTemp || "",
      conservation: r.conservation || "",
    };
    try {
      const { data, error } = await supabase.functions.invoke("ai-assistant", {
        body: { _path: "/translate", targetLang: lang, fields },
      });
      if (error || data?.error) throw new Error(data?.error || error?.message || "failed");
      const tr = data.translated;
      pushUndo(recipes, globalInd, library);
      setR(rec => ({
        ...rec,
        baking: tr.baking ?? rec.baking,
        intTemp: tr.intTemp ?? rec.intTemp,
        conservation: tr.conservation ?? rec.conservation,
        steps: rec.steps.map(s => { const ts = tr.steps?.find((x) => x.id === s.id); return ts ? { ...s, label: ts.label ?? s.label, detail: ts.detail ?? s.detail } : s; }),
        process: rec.process.map(p => { const tp = tr.process?.find((x) => x.id === p.id); return tp ? { ...p, label: tp.label ?? p.label } : p; }),
      }));
      setTranslateState("done");
      setTimeout(() => setTranslateState(null), 2500);
    } catch {
      setTranslateState("error");
      setTimeout(() => setTranslateState(null), 2500);
    }
  };

  // Auto-translate active recipe content when language changes
  const autoTranslateLang = useRef(null);
  useEffect(() => {
    if (autoTranslateLang.current === null) { autoTranslateLang.current = lang; return; }
    if (autoTranslateLang.current === lang) return;
    autoTranslateLang.current = lang;
    const rec = recipes[activeIdx];
    if (!rec) return;
    const hasContent = (rec.steps&&rec.steps.length>0) || (rec.process&&rec.process.length>0) || rec.baking || rec.conservation;
    if (hasContent) translateRecipe();
  }, [lang]); // eslint-disable-line

  // Global slider: adjust a coefficient group (agua/grasa/azucar/sal) by a target % of flour
  // Base ingredients stay fixed, non-base ingredients scale proportionally
  const adjustGlobal = (coeffKey, targetPct) => {
    setR(rec => {
      const ings = rec.ingredients;
      const baseTotal = ings.filter(i => i.isBase).reduce((s, i) => s + (i.base || 0), 0);
      if (baseTotal === 0) return rec;
      const targetG = baseTotal * targetPct / 100;
      const nonBaseContrib = ings.filter(i => !i.isBase).reduce((s, i) => s + (i.base || 0) * ((i.coeffs || {})[coeffKey] || 0), 0);
      const baseContrib = ings.filter(i => i.isBase).reduce((s, i) => s + (i.base || 0) * ((i.coeffs || {})[coeffKey] || 0), 0);
      const needed = targetG - baseContrib;
      if (nonBaseContrib <= 0) return rec;
      const factor = needed / nonBaseContrib;
      if (factor < 0) return rec;
      const newIngs = ings.map(i => {
        if (i.isBase) return i;
        const c = (i.coeffs || {})[coeffKey] || 0;
        if (c === 0) return i;
        const newBase = Math.max(1, Math.round((i.base || 0) * factor));
        return { ...i, base: newBase };
      });
      return { ...rec, ingredients: newIngs };
    });
  };
  const addStep = () => setR(r=>({...r,steps:[...r.steps,{id:Date.now(),label:t.newStep||"Paso",time:"—",detail:t.newStepDetail||"Descripción."}]}));
  const addProc = () => setR(r=>({...r,process:[...r.process,{id:"p"+Date.now(),label:t.newStage||"Etapa",time:"—"}]}));
  const toggleBI= k => {
    pushUndo(recipes,globalInd,library);
    if(globalInd[k]) { setGlobalInd(ind=>{const n={...ind};delete n[k];return n;}); return; }
    const bi=BUILT_IN[k];
    setGlobalInd(ind=>({...ind,[k]:{label:bi.label,desc:bi.desc,color:bi.color,min:bi.min,max:bi.max}}));
  };
  const upLib  =(id,f,v) => { pushUndo(recipes,globalInd,library); setLibrary(lb=>lb.map(e=>e.id===id?{...e,[f]:v}:e)); };
  const upLibC =(id,c,v) => { pushUndo(recipes,globalInd,library); setLibrary(lb=>lb.map(e=>e.id===id?{...e,coeffs:{...e.coeffs,[c]:v}}:e)); };
  const upLibSugar=(id,k,v)=>{ pushUndo(recipes,globalInd,library); setLibrary(lb=>lb.map(e=>{
    if(e.id!==id) return e;
    const nb={...(e.sugarBreakdown||{}),[k]:v};
    return {...e,sugarBreakdown:nb,coeffs:{...e.coeffs,azucar:Math.min(1,Object.values(nb).reduce((a,x)=>a+x,0)/100)}};
  })); };
  const delLib    = id => { pushUndo(recipes,globalInd,library); setLibrary(lb=>lb.filter(e=>e.id!==id)); };
  const addLib    = () => { pushUndo(recipes,globalInd,library); setLibrary(lb=>[...lb,{id:"u_"+Date.now(),name:"Nuevo ingrediente",cat:"Otro",role:"autre",coeffs:{agua:0,grasa:0,azucar:0,sal:0}}]); };
  const addFromLib= entry => setR(r=>({...r,ingredients:[...r.ingredients,{id:Date.now(),name:entry.name,spec:"",base:100,role:entry.role,isLm:false,coeffs:{...entry.coeffs}}]}));

  // Opens the picker for a specific recipe index (null = active)
  function openPicker(ri) { setPickerFor(ri); setShowPicker(true); }

  function handlePickerSelect(entry) {
    setShowPicker(false);
    const newIng = {id:Date.now(),name:entry.name,spec:"",base:100,role:entry.role,isLm:false,coeffs:{...entry.coeffs}};
    console.log("[handlePickerSelect] pickerFor=",pickerFor,"activeIdx=",activeIdxRef.current,"activeRecipe _id=",recipesRef.current[activeIdxRef.current]?._id);
    if(pickerFor===null) setR(r=>({...r,ingredients:[...r.ingredients,newIng]}));
    else setRec(pickerFor,r=>({...r,ingredients:[...r.ingredients,newIng]}));
  }

  function handlePickerAddNew() {
    setShowPicker(false);
    setNewIngFor(pickerFor);
    setShowNewIng(true);
  }

  function handleNewIngConfirm(ing, libEntry) {
    setShowNewIng(false);
    if(newIngFor===null) setR(r=>({...r,ingredients:[...r.ingredients,ing]}));
    else setRec(newIngFor,r=>({...r,ingredients:[...r.ingredients,ing]}));
    if(libEntry) { pushUndo(recipes,globalInd,library); setLibrary(lb=>[...lb,libEntry]); }
  }

  // Inline drag
  const dragFrom=useRef(null);
  const [dragOver,setDragOver]=useState(null);
  function dProps(key,idx) {
    if(!editMode) return {};
    return {
      draggable:true,
      onDragStart:()=>{dragFrom.current={key,idx};},
      onDragOver: e=>{e.preventDefault();setDragOver({key,idx});},
      onDrop:()=>{
        const from=dragFrom.current;
        if(from&&from.key===key&&from.idx!==idx){
          setR(r=>{const list=[...r[key]];const[m]=list.splice(from.idx,1);list.splice(idx,0,m);return{...r,[key]:list};});
        }
        dragFrom.current=null; setDragOver(null);
      },
      onDragEnd:()=>{dragFrom.current=null;setDragOver(null);},
    };
  }
  function isDg(k,i){return dragFrom.current&&dragFrom.current.key===k&&dragFrom.current.idx===i;}
  function isOv(k,i){return dragOver&&dragOver.key===k&&dragOver.idx===i;}

  // Recipe card drag
  const recDragFrom=useRef(null);
  const [recDragOver,setRecDragOver]=useState(null);
  function rcDProps(ri) {
    if(!editMode) return {};
    return {
      draggable:true,
      onDragStart:()=>{recDragFrom.current=ri;},
      onDragOver: e=>{e.preventDefault();setRecDragOver(ri);},
      onDrop:()=>{
        const from=recDragFrom.current;
        if(from!==null&&from!==ri){
          pushUndo(recipes,globalInd,library);
          setRecipes(rs=>{const list=[...rs];const[m]=list.splice(from,1);list.splice(ri,0,m);return list;});
          if(activeIdx===from) setActive(ri);
          else if(activeIdx===ri) setActive(from);
        }
        recDragFrom.current=null; setRecDragOver(null);
      },
      onDragEnd:()=>{recDragFrom.current=null;setRecDragOver(null);},
    };
  }

  // Photo
  function handlePhoto(e,ri) {
    const file=e.target.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>setRec(ri,r=>({...r,foto:ev.target.result}));
    reader.readAsDataURL(file);
  }

  // PDF
  function buildRecipeHTML(rec, gInd, scalePiezas, scalePeso, sections={}) {
    const sec = k => sections[k] !== false;
    const v=calcVals(rec.ingredients), sc=calcScore(gInd,v);
    const scC=sc>=80?"#4A8C60":sc>=50?"#D4732A":"#CC4A2A";
    const fb=(rec.ingredients.find(i=>i.isBase)||rec.ingredients.find(i=>i.role==="farine")||{base:1}).base;
    const baseT=rec.ingredients.reduce((a,i)=>a+(i.base||0),0);
    const piezas=scalePiezas!=null?scalePiezas:1;
    const pesoP=scalePeso!=null?scalePeso:rec.pesoPieza;
    const masaT=piezas*pesoP;
    const rat=baseT>0&&masaT>0?masaT/baseT:1;
    const showScale=piezas>0&&rat!==1;
    const indRows=Object.entries(gInd).map(([k,ind])=>{
      const bi=BUILT_IN[k]; const val=bi?bi.fn(v):0; const ok=val>=ind.min&&val<=ind.max;
      const p=Math.min(100,Math.max(0,((val-ind.min)/(ind.max-ind.min||1))*100));
      return "<div style='margin-bottom:8px'>"
        +"<div style='display:flex;justify-content:space-between;margin-bottom:3px'>"
        +"<span style='font-size:10px;font-weight:700;color:"+ind.color+"'>"+ind.label+"</span>"
        +"<span style='font-size:14px;font-weight:700;color:"+(ok?ind.color:"#CC4A2A")+";font-family:monospace'>"+val+"%</span></div>"
        +"<div style='height:5px;background:#F0EBE4;border-radius:99px'>"
        +"<div style='height:5px;width:"+p+"%;background:"+(ok?ind.color:"#CC4A2A")+";border-radius:99px'></div></div>"
        +"<div style='display:flex;justify-content:space-between;margin-top:2px;font-size:8px;color:#C4B4A4'>"
        +"<span>min "+ind.min+"%</span><span style='color:"+(ok?"#7EA87A":"#CC4A2A")+";font-weight:700'>"+(ok?t.indOk:t.indOutShort)+"</span><span>max "+ind.max+"%</span>"
        +"</div></div>";
    }).join("");
    const ingRows=rec.ingredients.map(i=>{
      const base=i.base||0;
      const scaled=showScale?Math.round(base*rat):null;
      return "<tr>"
        +"<td style='padding:5px 8px;font-size:11px;color:"+(i.isLm?"#D4732A":"#2C2420")+";font-weight:"+(i.isLm?700:400)+"'>"+i.name+"</td>"
        +(showScale?"<td style='padding:5px 8px;text-align:right;font-family:monospace;font-size:11px;font-weight:700;color:#D4732A'>"+scaled+"g</td>":"")
        +"<td style='padding:5px 8px;text-align:right;font-family:monospace;font-size:10px;color:#9E8E80'>"+Math.round(base/fb*100)+"%</td>"
        +"<td style='padding:5px 8px;font-size:10px;color:#6E5E54;font-style:italic'>"+(i.spec||"")+"</td></tr>";
    }).join("");
    const stepRows=rec.steps.map((s,idx)=>
      "<tr><td style='padding:5px 8px;background:#F5EDE4;color:#D4732A;font-weight:700;text-align:center;font-size:10px'>"+String(idx+1).padStart(2,"0")+"</td>"
      +"<td style='padding:5px 8px;font-size:11px;font-weight:500;color:#2C2420'>"+s.label+"</td>"
      +"<td style='padding:5px 8px;font-size:10px;color:#9E8E80;font-family:monospace'>"+s.time+"</td>"
      +"<td style='padding:5px 8px;font-size:10px;color:#6E5E54'>"+s.detail+"</td></tr>"
    ).join("");
    const locale=({es:"es-ES",en:"en-GB",fr:"fr-FR",it:"it-IT",de:"de-DE"})[lang]||"es-ES";
    const date=new Date().toLocaleDateString(locale,{year:"numeric",month:"long",day:"numeric"});
    const scaleBanner=showScale
      ?"<div style='background:#F5EDE4;border:1px solid #EAD4B8;border-radius:8px;padding:8px 12px;margin-bottom:16px;font-family:sans-serif;display:flex;gap:16px;align-items:center;flex-wrap:wrap'>"
        +"<span style='font-size:9px;font-weight:700;color:#D4732A;text-transform:uppercase;letter-spacing:0.08em'>"+t.factor+"</span>"
        +"<span style='font-size:11px;color:#2C2420;font-weight:600'>"+piezas+" "+t.pza+" × "+pesoP+"g = <strong>"+Math.round(masaT)+"g</strong></span>"
        +"<span style='font-size:10px;color:#9E8E80'>"+t.factor+" ×"+rat.toFixed(2)+"</span>"
        +"</div>"
      :"";
    const scoreBlock=sec("score")
      ?"<div style='text-align:center;font-family:sans-serif'>"
        +"<div style='font-size:36px;font-weight:700;color:"+scC+";font-family:monospace;line-height:1'>"+sc+"</div>"
        +"<div style='font-size:9px;color:"+scC+";font-weight:700;margin-top:2px'>"+(sc>=80?t.excellent:sc>=60?t.good:sc>=40?t.fair:t.unbalanced)+"</div>"
        +"<div style='font-size:9px;color:#9E8E80'>/ 100</div></div>"
      :"";
    const indicatorsBlock=sec("indicators")
      ?"<div><h3 style='font-size:10px;font-weight:700;color:#2C2420;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px;font-family:sans-serif'>"+t.sub.indicators+"</h3>"+indRows+"</div>"
      :"";
    const paramsBlock="<div><h3 style='font-size:10px;font-weight:700;color:#2C2420;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px;font-family:sans-serif'>"+t.baking+"</h3>"
      +"<table style='width:100%;font-family:sans-serif;border-collapse:collapse'>"
      +"<tr><td style='font-size:10px;color:#9E8E80;padding:3px 0'>"+t.baking+"</td><td style='font-size:11px;color:#2C2420;font-weight:600'>"+rec.baking+"</td></tr>"
      +"<tr><td style='font-size:10px;color:#9E8E80;padding:3px 0'>"+t.intTemp+"</td><td style='font-size:11px;color:#2C2420;font-weight:600'>"+rec.tempBaking+"</td></tr>"
      +"<tr><td style='font-size:10px;color:#9E8E80;padding:3px 0'>"+t.loss+"</td><td style='font-size:11px;color:#2C2420;font-weight:600'>"+rec.merma+"%</td></tr>"
      +"<tr><td style='font-size:10px;color:#9E8E80;padding:3px 0'>"+t.fieldWeight+"</td><td style='font-size:11px;color:#2C2420;font-weight:600'>"+rec.pesoPieza+"g</td></tr>"
      +"</table></div>";
    const gridBlock=(indicatorsBlock||paramsBlock)
      ?"<div style='display:grid;grid-template-columns:"+(indicatorsBlock?"1fr 1fr":"1fr")+";gap:24px;margin-bottom:18px'>"+indicatorsBlock+paramsBlock+"</div>"
      :"";
    const ingBlock=sec("ingredients")
      ?"<h3 style='font-size:10px;font-weight:700;color:#2C2420;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 7px;font-family:sans-serif'>"+t.sub.ingredients+(showScale?" ("+t.baseScaled+")":"")+"</h3>"
        +"<table style='width:100%;border-collapse:collapse;margin-bottom:16px;font-family:sans-serif'>"
        +"<thead><tr style='background:#F7F3EE;border-bottom:2px solid #EDE6DC'>"
        +"<th style='text-align:left;padding:6px 8px;font-size:9px;font-weight:700;color:#9E8E80;text-transform:uppercase'>"+t.ingredientCol+"</th>"
        +"<th style='text-align:right;padding:6px 8px;font-size:9px;font-weight:700;color:#9E8E80;text-transform:uppercase'>"+t.baseCol+"</th>"
        +(showScale?"<th style='text-align:right;padding:6px 8px;font-size:9px;font-weight:700;color:#D4732A;text-transform:uppercase'>"+t.scale.split(" ")[0]+"</th>":"")
        +"<th style='text-align:right;padding:6px 8px;font-size:9px;font-weight:700;color:#9E8E80;text-transform:uppercase'>"+t.flourCol+"</th>"
        +"<th style='text-align:left;padding:6px 8px;font-size:9px;font-weight:700;color:#9E8E80;text-transform:uppercase'></th>"
        +"</tr></thead><tbody>"+ingRows+"</tbody>"
        +"<tfoot><tr style='border-top:2px solid #EDE6DC;background:#F7F3EE'>"
        +"<td style='padding:6px 8px;font-size:11px;font-weight:700;color:#2C2420'>"+t.total+"</td>"
        +"<td style='text-align:right;padding:6px 8px;font-family:monospace;font-size:11px;font-weight:700;color:#2C2420'>"+Math.round(calcVals(rec.ingredients).total)+"g</td>"
        +(showScale?"<td style='text-align:right;padding:6px 8px;font-family:monospace;font-size:11px;font-weight:700;color:#D4732A'>"+Math.round(masaT)+"g</td>":"")
        +"<td colspan='2'></td></tr></tfoot></table>"
      :"";
    const methodBlock=sec("method")
      ?"<h3 style='font-size:10px;font-weight:700;color:#2C2420;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 7px;font-family:sans-serif'>"+t.sub.method+"</h3>"
        +"<table style='width:100%;border-collapse:collapse;font-family:sans-serif'><tbody>"+stepRows+"</tbody></table>"
      :"";
    const processBlock=sec("process")&&rec.process?.length
      ?"<div style='margin:14px 0;padding:10px 14px;background:#F7F3EE;border-radius:8px;font-family:sans-serif'>"
        +"<h3 style='font-size:10px;font-weight:700;color:#2C2420;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px'>"+t.process+"</h3>"
        +"<div style='display:flex;gap:6px;flex-wrap:wrap'>"
        +rec.process.map(p=>"<span style='background:#fff;border:1px solid #EDE6DC;border-radius:6px;padding:4px 8px;font-size:10px;color:#2C2420'><strong>"+p.label+"</strong> <span style='color:#9E8E80'>"+p.time+"</span></span>").join("")
        +"</div></div>"
      :"";
    const scaleBannerBlock=sec("scaleBanner")&&showScale
      ?"<div style='background:#F5EDE4;border:1px solid #EAD4B8;border-radius:8px;padding:8px 12px;margin-bottom:16px;font-family:sans-serif;display:flex;gap:16px;align-items:center;flex-wrap:wrap'>"
        +"<span style='font-size:9px;font-weight:700;color:#D4732A;text-transform:uppercase;letter-spacing:0.08em'>"+t.factor+"</span>"
        +"<span style='font-size:11px;color:#2C2420;font-weight:600'>"+piezas+" "+t.pza+" × "+pesoP+"g = <strong>"+Math.round(masaT)+"g</strong></span>"
        +"<span style='font-size:10px;color:#9E8E80'>"+t.factor+" ×"+rat.toFixed(2)+"</span>"
        +"</div>"
      :"";
    return "<div style='padding:32px 40px;max-width:800px;margin:0 auto;font-family:Georgia,serif;page-break-after:always'>"
      +"<div style='display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;padding-bottom:14px;border-bottom:2px solid #D4732A'>"
      +"<div><h1 style='font-style:italic;font-size:26px;font-weight:500;color:#2C2420;margin:0 0 4px'>"+rec.title+"</h1>"
      +"<p style='color:#9E8E80;font-size:12px;margin:0 0 8px;font-family:sans-serif'>"+rec.subtitle+"</p>"
      +"<div style='display:flex;gap:5px;font-family:sans-serif'>"
      +"<span style='background:#F5EDE4;color:#D4732A;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700'>"+rec.tag+"</span>"
      +(rec.tiempoElaboracion?"<span style='background:#EAF2EC;color:#4A8C60;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700'>"+rec.tiempoElaboracion+"</span>":"")
      +(rec.precio!=null?"<span style='background:#F5EDE4;color:#D4732A;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700'>"+Number(rec.precio).toFixed(2)+"/"+t.pza+"</span>":"")
      +"</div></div>"
      +scoreBlock
      +"</div>"
      +scaleBannerBlock
      +gridBlock
      +processBlock
      +ingBlock
      +methodBlock
      +"<div style='margin-top:18px;padding-top:10px;border-top:1px solid #EDE6DC;font-size:9px;color:#C4B4A4;display:flex;justify-content:space-between;font-family:sans-serif'>"
      +"<span>Lievitati Workbench</span><span>"+date+"</span></div></div>";
  }

  function buildComparativaHTML(recs, gInd) {
    const cols=Object.entries(gInd);
    const locale=({es:"es-ES",en:"en-GB",fr:"fr-FR",it:"it-IT",de:"de-DE"})[lang]||"es-ES";
    const date=new Date().toLocaleDateString(locale,{year:"numeric",month:"long",day:"numeric"});
    const indH=cols.map(([k,ind])=>"<th style='text-align:center;padding:6px;font-size:9px;font-weight:700;color:"+ind.color+";text-transform:uppercase'>"+ind.label+"</th>").join("");
    const rows=recs.map((rec,ri)=>{
      const v=calcVals(rec.ingredients), sc=calcScore(gInd,v);
      const scC=sc>=80?"#4A8C60":sc>=50?"#D4732A":"#CC4A2A";
      const cells=cols.map(([k,ind])=>{const bi=BUILT_IN[k];const val=bi?bi.fn(v):0;const ok=val>=ind.min&&val<=ind.max;return"<td style='text-align:center;padding:6px;font-family:monospace;font-size:12px;font-weight:700;color:"+(ok?ind.color:"#CC4A2A")+"'>"+val+"%</td>";}).join("");
      return "<tr style='border-bottom:1px solid #EDE6DC;"+(ri%2===0?"background:#FDFAF7":"background:#fff")+"'>"
        +"<td style='padding:8px 10px;font-style:italic;font-family:Georgia,serif;font-size:12px;font-weight:600;color:#2C2420'>"+rec.title+"</td>"
        +"<td style='padding:8px;text-align:center;font-size:22px;font-weight:700;color:"+scC+";font-family:monospace'>"+sc+"</td>"
        +cells
        +"<td style='padding:8px;text-align:center;font-size:11px;color:#6E5E54;font-family:sans-serif'>"+rec.pesoPieza+"g</td>"
        +"<td style='padding:8px;text-align:center;font-size:11px;font-weight:700;color:#D4732A;font-family:sans-serif'>"+(rec.precio!=null?"€"+Number(rec.precio).toFixed(2):"—")+"</td>"
        +"<td style='padding:8px;text-align:center;font-size:10px;color:#9E8E80;font-family:sans-serif'>"+(rec.tiempoElaboracion||"—")+"</td></tr>";
    }).join("");
    return "<div style='padding:32px 40px;max-width:920px;margin:0 auto;font-family:sans-serif'>"
      +"<h1 style='font-style:italic;font-family:Georgia,serif;font-size:24px;font-weight:500;color:#2C2420;margin:0 0 4px'>"+t.pdfComp+"</h1>"
      +"<p style='color:#9E8E80;font-size:12px;margin:0 0 18px'>"+recs.length+" "+t.recipesWord+" · "+cols.length+" "+t.activeIndicators.toLowerCase()+"</p>"
      +"<table style='width:100%;border-collapse:collapse;margin-bottom:22px'>"
      +"<thead><tr style='background:#F7F3EE;border-bottom:2px solid #D4732A'>"
      +"<th style='text-align:left;padding:8px 10px;font-size:9px;font-weight:700;color:#9E8E80;text-transform:uppercase'>"+t.recipe+"</th>"
      +"<th style='text-align:center;padding:8px;font-size:9px;font-weight:700;color:#9E8E80;text-transform:uppercase'>Score</th>"
      +indH
      +"<th style='text-align:center;padding:8px;font-size:9px;font-weight:700;color:#9E8E80;text-transform:uppercase'>"+t.weight+"</th>"
      +"<th style='text-align:center;padding:8px;font-size:9px;font-weight:700;color:#9E8E80;text-transform:uppercase'>"+t.price+"</th>"
      +"<th style='text-align:center;padding:8px;font-size:9px;font-weight:700;color:#9E8E80;text-transform:uppercase'>"+t.time+"</th>"
      +"</tr></thead><tbody>"+rows+"</tbody></table>"
      +"<div style='padding-top:10px;border-top:1px solid #EDE6DC;font-size:9px;color:#C4B4A4;display:flex;justify-content:space-between'>"
      +"<span>Lievitati Workbench</span><span>"+date+"</span></div></div>";
  }

  function exportPdf(mode, sections={}) {
    const printCSS=`
      *{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
      body{margin:0;background:#fff;font-family:Georgia,serif}
      @media print{@page{margin:14mm 16mm;size:A4}html,body{width:210mm}}
      @media screen{body{padding:20px;background:#F7F3EE}}
    `;
    const wrap=b=>`<!DOCTYPE html><html><head><meta charset='utf-8'><title>Lievitati Workbench</title><style>${printCSS}</style></head><body>${b}<script>window.onload=function(){window.print();}</script></body></html>`;
    const html=mode==="recipe"?wrap(buildRecipeHTML(r,globalInd,numPiezas,r.pesoPieza,sections)):mode==="all"?wrap(recipes.map(rec=>buildRecipeHTML(rec,globalInd,null,null,sections)).join("")):wrap(buildComparativaHTML(recipes,globalInd));
    const blob=new Blob([html],{type:"text/html"});
    const url=URL.createObjectURL(blob);
    const win=window.open(url,"_blank","width=900,height=700,scrollbars=yes,resizable=yes");
    if(!win){
      const a=document.createElement("a");
      a.href=url; a.download=(mode==="recipe"?r.title:mode==="all"?t.pdfAll.replace(/ /g,"_"):t.pdfComp.replace(/ /g,"_"))+".html";
      a.click();
    }
    setTimeout(()=>URL.revokeObjectURL(url),60000);
  }

  // UI helpers
  const chip=(txt,bg=AL,fg=A)=><span style={{padding:"2px 7px",background:bg,color:fg,borderRadius:"4px",fontSize:"10px",fontWeight:"600"}}>{txt}</span>;

  // Filtered + sorted recipes for hub
  const catCol = c => ({"Brioche":"#D4732A","Panettone":"#9B3DBF","Pan":"#4A8C60","Viennoiserie":"#2A6DD4","Otro":"#9E8E80"})[c]||MU;
  const filteredRecipes = recipes.map((rec,i)=>({rec,i})).filter(({rec,i})=>{
    if(filterCat==="fav"&&!recipes[i]?.favorite) return false;
    if(filterCat!=="all"&&filterCat!=="fav"&&rec.categoria!==filterCat) return false;
    if(searchQ){
      const q=searchQ.toLowerCase();
      return rec.title.toLowerCase().includes(q)||rec.subtitle?.toLowerCase().includes(q)||rec.categoria?.toLowerCase().includes(q)||rec.tag?.toLowerCase().includes(q);
    }
    return true;
  }).sort((a,b)=>{
    if(sortBy==="name") return a.rec.title.localeCompare(b.rec.title);
    if(sortBy==="score"){const sa=calcScore(globalInd,calcVals(a.rec.ingredients)),sb=calcScore(globalInd,calcVals(b.rec.ingredients));return sb-sa;}
    if(sortBy==="price") return (a.rec.precio||0)-(b.rec.precio||0);
    if(sortBy==="time") return (a.rec.tiempoElaboracion||"").localeCompare(b.rec.tiempoElaboracion||"");
    return 0;
  });

  const NAV_ITEMS=[
    {k:"home",icon:"🏠",label:t.navShort?.home||"Inicio",short:t.navShort?.home||"Home"},
    {k:"recetas",icon:"📋",label:t.nav.recipes,short:t.navShort?.recipes||"Recetas"},
    {k:"activa",icon:"🥐",label:t.activeRecipe,short:t.navShort?.active||"Activa"},
    {k:"control",icon:"⚖",label:t.nav.control,short:t.navShort?.control||"Control"},
    {k:"biblioteca",icon:"📦",label:t.nav.library,short:t.navShort?.library||"Lib."},
    {k:"config",icon:"⚙",label:"Config",short:t.navShort?.config||"Config"},
  ];

  if(!dbLoaded) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"'DM Sans',system-ui,sans-serif",color:MU,fontSize:"14px"}}>{t.loading||"Cargando recetas…"}</div>;

  return (
    <div style={{minHeight:"100vh",background:BG,fontFamily:"'Segoe UI',system-ui,sans-serif",color:DK}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,500;1,600&family=DM+Sans:wght@400;600;700&display=swap');
        *{box-sizing:border-box}
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}
        input[type=number]{-moz-appearance:textfield}
        .mob-nav{display:none!important}.desk-side{display:flex!important}.main-wrap{margin-left:64px}
      `}</style>

      {/* ── DESKTOP SIDEBAR ── */}
      <div className="desk-side" style={{display:"none",position:"fixed",left:0,top:0,bottom:0,width:"64px",background:"#fff",borderRight:"1px solid "+BD,zIndex:100,flexDirection:"column",alignItems:"center",paddingTop:"12px",gap:"4px"}}>
        <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic",fontSize:"18px",color:A,marginBottom:"12px",lineHeight:1}}>L</div>
        {NAV_ITEMS.map(({k,icon,label,short})=>(
          <button key={k} onClick={()=>setMainTab(k)} title={label}
            style={{width:"44px",height:"44px",borderRadius:"10px",background:mainTab===k?AL:"transparent",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"2px",transition:"background 0.15s"}}>
            <span style={{fontSize:"18px",lineHeight:1}}>{icon}</span>
            <span style={{fontSize:"7px",fontWeight:"700",color:mainTab===k?A:MU,letterSpacing:"0.02em"}}>{short}</span>
          </button>
        ))}
        <div style={{flex:1}}/>
        <button onClick={()=>{setNotesGlobal(true);setShowNotes(true);}} title={t.globalNotes||"Notas globales"}
          style={{width:"44px",height:"44px",borderRadius:"10px",background:"transparent",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"2px"}}>
          <span style={{fontSize:"18px",lineHeight:1}}>📓</span>
          <span style={{fontSize:"7px",fontWeight:"700",color:MU}}>{t.notes}</span>
        </button>
        <div style={{height:"12px"}}/>
      </div>

      {/* ── TOP HEADER ── */}
      <div className="main-wrap" style={{background:"#fff",borderBottom:"1px solid "+BD,padding:"0 14px",display:"flex",alignItems:"center",justifyContent:"space-between",height:"48px",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px",minWidth:0}}>
          <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic",fontSize:"15px",fontWeight:"600",color:DK,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {mainTab==="home"?"Lievitati":mainTab==="activa"?r.title:mainTab==="recetas"?t.nav.recipes:mainTab==="control"?t.nav.control:mainTab==="biblioteca"?t.nav.library:mainTab}
          </div>
          {mainTab==="activa"&&<span style={{fontSize:"10px",color:MU,fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.subtitle}</span>}
        </div>
        <div style={{display:"flex",gap:"5px",alignItems:"center"}}>
          {/* Language */}
          <div style={{position:"relative"}}>
            <button onClick={e=>{const m=e.currentTarget.nextSibling;m.style.display=m.style.display==="block"?"none":"block";}}
              style={{padding:"4px 8px",background:BG,border:"1px solid "+BD,borderRadius:"5px",fontSize:"10px",fontWeight:"600",color:DK,cursor:"pointer",fontFamily:"inherit"}}>
              {lang.toUpperCase()} ▾
            </button>
            <div style={{display:"none",position:"absolute",right:0,top:"calc(100% + 4px)",background:"#fff",border:"1px solid "+BD,borderRadius:"8px",boxShadow:"0 4px 16px rgba(0,0,0,0.10)",overflow:"hidden",zIndex:200}}>
              {[{k:"es",l:"Español"},{k:"en",l:"English"},{k:"fr",l:"Français"},{k:"it",l:"Italiano"},{k:"de",l:"Deutsch"}].map(({k,l})=>(
                <button key={k} onClick={e=>{e.currentTarget.parentNode.style.display="none";setLang(k);}}
                  style={{display:"flex",alignItems:"center",gap:"8px",width:"100%",padding:"8px 14px",background:lang===k?AL+"88":"none",border:"none",borderBottom:"1px solid "+BD,cursor:"pointer",fontSize:"11px",fontWeight:lang===k?"700":"400",color:DK,textAlign:"left",fontFamily:"inherit"}}>
                  <span style={{fontSize:"9px",color:MU,fontFamily:"monospace",width:"18px"}}>{k.toUpperCase()}</span>
                  {l}
                </button>
              ))}
            </div>
          </div>
          {/* PDF */}
          <div style={{position:"relative"}}>
            <button onClick={e=>{const m=e.currentTarget.nextSibling;m.style.display=m.style.display==="block"?"none":"block";}}
              style={{padding:"4px 8px",background:"#fff",color:MI,border:"1px solid "+BD,borderRadius:"5px",fontSize:"10px",fontWeight:"600",cursor:"pointer",fontFamily:"inherit"}}>
              PDF ▾
            </button>
            <div style={{display:"none",position:"absolute",right:0,top:"calc(100% + 4px)",background:"#fff",border:"1px solid "+BD,borderRadius:"8px",boxShadow:"0 4px 16px rgba(0,0,0,0.10)",minWidth:"170px",zIndex:100,overflow:"hidden"}}>
              {[{l:t.pdfThis,m:"recipe"},{l:t.pdfAll,m:"all"},{l:t.pdfComp,m:"comp"}].map(({l,m})=>(
                <button key={m} onClick={e=>{e.currentTarget.parentNode.style.display="none";setPdfMode(m);setShowPdfOpts(true);}}
                  style={{display:"block",width:"100%",padding:"9px 14px",background:"none",border:"none",borderBottom:"1px solid "+BD,cursor:"pointer",fontSize:"11px",fontWeight:"500",color:DK,textAlign:"left",fontFamily:"inherit"}}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          {mainTab==="activa"&&<div style={{padding:"2px 8px",background:score>=80?"#EAF2EC":score>=50?AL:"#FFF0EB",color:score>=80?GR:score>=50?A:"#CC4A2A",borderRadius:"16px",fontSize:"10px",fontWeight:"700",fontFamily:"monospace"}}>{score}</div>}
          {mainTab==="activa"&&(
            <button
              onClick={translateRecipe}
              disabled={translateState==="loading"}
              title={t.translateBtn}
              style={{padding:"4px 9px",background:translateState==="done"?"#EAF2EC":translateState==="error"?"#FFF0EB":"#fff",color:translateState==="done"?GR:translateState==="error"?"#CC4A2A":MI,border:"1px solid "+(translateState==="done"?"#B8DFC4":translateState==="error"?"#F5C2B0":BD),borderRadius:"5px",fontSize:"10px",fontWeight:"600",cursor:translateState==="loading"?"wait":"pointer",fontFamily:"inherit",transition:"all 0.2s",whiteSpace:"nowrap"}}>
              {translateState==="loading"?t.translating:translateState==="done"?t.translateDone:translateState==="error"?t.translateErr:"🌐"}
            </button>
          )}
          {canUndo&&<button onClick={handleUndo} title={t.undoTitle||"Deshacer"} style={{padding:"4px 8px",background:"#fff",color:DK,border:"1px solid "+BD,borderRadius:"5px",fontSize:"11px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:"3px"}}>↩ <span style={{fontSize:"10px",color:MU}}>{undoStack.length}</span></button>}
          <button onClick={()=>setEdit(e=>!e)} style={{padding:"4px 10px",background:editMode?A:"#fff",color:editMode?"#fff":MI,border:"1px solid "+(editMode?A:BD),borderRadius:"5px",fontSize:"11px",fontWeight:"600",cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s"}}>
            {editMode?t.save:t.edit}
          </button>
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <div className="mob-nav" style={{display:"none",position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:"1px solid "+BD,zIndex:100,height:"56px",alignItems:"center",justifyContent:"space-around",padding:"0 2px"}}>
        {NAV_ITEMS.map(({k,icon,short})=>(
          <button key={k} onClick={()=>setMainTab(k)}
            style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"2px",background:"none",border:"none",cursor:"pointer",padding:"4px 0",height:"100%"}}>
            <span style={{fontSize:"16px",lineHeight:1}}>{icon}</span>
            <span style={{fontSize:"7px",fontWeight:mainTab===k?"700":"500",color:mainTab===k?A:MU}}>{short}</span>
          </button>
        ))}
        <button onClick={()=>{setNotesGlobal(true);setShowNotes(true);}}
          style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"2px",background:"none",border:"none",cursor:"pointer",padding:"4px 0",height:"100%"}}>
          <span style={{fontSize:"16px",lineHeight:1}}>📓</span>
          <span style={{fontSize:"7px",fontWeight:"500",color:MU}}>{t.notes}</span>
        </button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="main-wrap" style={{padding:"10px 12px 80px",maxWidth:"960px",margin:"0 auto",opacity:mounted?1:0,transition:"opacity 0.3s",fontFamily:"'DM Sans',system-ui,sans-serif"}}>

                {/* ════════ HOME / LANDING ════════ */}
        {mainTab==="home"&&(
          <div style={{paddingBottom:"8px"}}>
            {/* Hero banner */}
            <div style={{background:"linear-gradient(135deg,#2C2420 0%,#4A3428 100%)",borderRadius:"14px",padding:"28px 24px",marginBottom:"16px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:"-10px",right:"-10px",fontSize:"100px",opacity:0.05,lineHeight:1,pointerEvents:"none"}}>🍞</div>
              <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic",fontSize:"28px",fontWeight:"500",color:"#F5EDE4",marginBottom:"4px"}}>Lievitati Workbench</div>
              <div style={{fontSize:"13px",color:"#B09080",marginBottom:"18px"}}>{t.tagline}</div>
              <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                <button onClick={()=>setMainTab("recetas")} style={{padding:"9px 18px",background:A,color:"#fff",border:"none",borderRadius:"8px",fontSize:"13px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit"}}>{t.viewRecipes}</button>
                <button onClick={()=>setMainTab("activa")} style={{padding:"9px 16px",background:"transparent",color:"#B09080",border:"1px solid #6E5E54",borderRadius:"8px",fontSize:"13px",cursor:"pointer",fontFamily:"inherit"}}>{t.activeRecipe}</button>
                <button onClick={()=>setMainTab("control")} style={{padding:"9px 16px",background:"transparent",color:"#B09080",border:"1px solid #6E5E54",borderRadius:"8px",fontSize:"13px",cursor:"pointer",fontFamily:"inherit"}}>{t.controlTab}</button>
              </div>
            </div>

            {/* Stats */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"6px",marginBottom:"16px"}}>
              {[
                {k:"recetas",l:t.statRecipes,v:recipes.length,col:A},
                {k:"favoritos",l:t.statFavs,v:recipes.filter(r=>r.favorite).length,col:"#F5C518"},
                {k:"categorias",l:t.statCats,v:categories.filter(c=>recipes.some(r=>r.categoria===c)).length,col:GR},
              ].map(s=>(
                <div key={s.k} style={{background:"#fff",border:"1px solid "+BD,borderRadius:"10px",padding:"14px 10px",textAlign:"center"}}>
                  <div style={{fontSize:"24px",fontWeight:"700",color:s.col,fontFamily:"monospace",lineHeight:1}}>{s.v}</div>
                  <div style={{fontSize:"10px",color:MU,marginTop:"4px"}}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Favorites */}
            {recipes.some(r=>r.favorite)?(
              <div>
                <div style={{fontSize:"13px",fontWeight:"700",color:DK,marginBottom:"10px",display:"flex",alignItems:"center",gap:"7px"}}>
                  <span style={{color:"#F5C518"}}>★</span> {t.myFavorites}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"8px",marginBottom:"12px"}}>
                  {recipes.map((rec,ri)=>{
                    if(!recipes[ri]?.favorite) return null;
                    const rv=calcVals(rec.ingredients);
                    const rs=calcScore(globalInd,rv);
                    const col=catCol(rec.categoria);
                    return (
                      <div key={ri} onClick={()=>{setActive(ri);setMainTab("activa");}}
                        style={{background:"#fff",border:"1px solid "+BD,borderRadius:"10px",overflow:"hidden",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
                        {rec.foto&&<div style={{height:"60px",background:"url("+rec.foto+") center/cover"}}/>}
                        <div style={{padding:"10px 12px"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"4px"}}>
                            <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic",fontSize:"13px",fontWeight:"600",color:DK,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1,minWidth:0}}>{rec.title}</div>
                            <button onClick={e=>{e.stopPropagation();toggleFav(ri);}} style={{background:"none",border:"none",fontSize:"14px",color:"#F5C518",cursor:"pointer",padding:"0 2px",flexShrink:0,lineHeight:1}}>★</button>
                          </div>
                          <div style={{fontSize:"10px",color:MU,marginBottom:"6px"}}>{rec.subtitle}</div>
                          <div style={{display:"flex",gap:"4px",flexWrap:"wrap",alignItems:"center",marginBottom:"6px"}}>
                            <span style={{padding:"1px 6px",background:col+"18",color:col,borderRadius:"4px",fontSize:"8px",fontWeight:"700"}}>{rec.categoria}</span>
                            {rec.precio!=null&&<span style={{fontSize:"8px",color:A,fontWeight:"600"}}>€{Number(rec.precio).toFixed(2)}</span>}
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                            <div style={{width:"24px",height:"24px",borderRadius:"50%",border:"2px solid "+(rs>=80?"#4A8C60":rs>=50?A:"#CC4A2A"),display:"flex",alignItems:"center",justifyContent:"center"}}>
                              <span style={{fontSize:"8px",fontWeight:"700",color:rs>=80?"#4A8C60":rs>=50?A:"#CC4A2A",fontFamily:"monospace"}}>{rs}</span>
                            </div>
                            <div style={{flex:1,height:"3px",background:"#F0EBE4",borderRadius:"99px",overflow:"hidden"}}>
                              <div style={{height:"100%",width:rs+"%",background:rs>=80?"#4A8C60":rs>=50?A:"#CC4A2A",borderRadius:"99px"}}/>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <MiseEnPlace recipes={recipes} miseQty={miseQty} setMiseQty={setMiseQty} A={A} AL={AL} GR={GR} BD={BD} MU={MU} DK={DK} t={t}/>
              </div>
            ):(
              <div style={{background:"#fff",border:"2px dashed "+BD,borderRadius:"12px",padding:"40px 20px",textAlign:"center"}}>
                <div style={{fontSize:"36px",marginBottom:"10px"}}>☆</div>
                <div style={{fontSize:"14px",color:DK,fontWeight:"600",marginBottom:"4px"}}>{t.noFavorites}</div>
                <div style={{fontSize:"12px",color:MU,marginBottom:"14px"}}>{t.markFavorites}</div>
                <button onClick={()=>setMainTab("recetas")} style={{padding:"8px 18px",background:A,color:"#fff",border:"none",borderRadius:"8px",fontSize:"13px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit"}}>{t.exploreRecipes}</button>
              </div>
            )}
          </div>
        )}

        {/* ════════ RECETAS (browser) ════════ */}
        {mainTab==="recetas"&&(
          <div style={{paddingBottom:"8px"}}>
            {/* Search bar */}
            <div style={{background:"#fff",border:"1px solid "+BD,borderRadius:"12px",padding:"10px 14px",marginBottom:"10px",display:"flex",gap:"8px",alignItems:"center"}}>
              <span style={{fontSize:"14px",color:MU}}>🔍</span>
              <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder={t.searchPlaceholder||t.search}
                style={{flex:1,border:"none",outline:"none",fontSize:"13px",color:DK,fontFamily:"inherit",background:"transparent"}}/>
              {searchQ&&<button onClick={()=>setSearchQ("")} style={{background:"none",border:"none",color:MU,cursor:"pointer",fontSize:"12px"}}>✕</button>}
            </div>

            {/* Category filter pills */}
            <div style={{display:"flex",gap:"4px",flexWrap:"wrap",marginBottom:"10px",alignItems:"center"}}>
              <button onClick={()=>setFilterCat("all")} style={{padding:"3px 10px",background:filterCat==="all"?"#2C2420":"transparent",color:filterCat==="all"?"#fff":MU,border:"1px solid "+(filterCat==="all"?"#2C2420":BD),borderRadius:"14px",fontSize:"10px",fontWeight:filterCat==="all"?"700":"400",cursor:"pointer",fontFamily:"inherit"}}>
                {t.allRecipes2||"Todas"} ({recipes.length})
              </button>
              {categories.map(cat=>{
                const n=recipes.filter(r=>r.categoria===cat).length; if(!n) return null;
                const col=catCol(cat);
                return <button key={cat} onClick={()=>setFilterCat(filterCat===cat?"all":cat)} style={{padding:"3px 10px",background:filterCat===cat?col:"transparent",color:filterCat===cat?"#fff":col,border:"1px solid "+(filterCat===cat?col:col+"44"),borderRadius:"14px",fontSize:"10px",fontWeight:filterCat===cat?"700":"400",cursor:"pointer",fontFamily:"inherit"}}>{tCat(t,cat)} ({n})</button>;
              })}
              {recipes.some(r=>r.favorite)&&<button onClick={()=>setFilterCat(filterCat==="fav"?"all":"fav")} style={{padding:"3px 10px",background:filterCat==="fav"?"#F5C518":"transparent",color:filterCat==="fav"?"#2C2420":"#F5C518",border:"1px solid "+(filterCat==="fav"?"#F5C518":"#F5C51844"),borderRadius:"14px",fontSize:"10px",fontWeight:filterCat==="fav"?"700":"400",cursor:"pointer",fontFamily:"inherit"}}>★ Fav ({recipes.filter(r=>r.favorite).length})</button>}
            </div>

            {/* Sort + View toggle */}
            <div style={{display:"flex",gap:"6px",alignItems:"center",marginBottom:"10px"}}>
              <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
                style={{padding:"4px 8px",background:"#fff",border:"1px solid "+BD,borderRadius:"6px",fontSize:"10px",color:DK,fontFamily:"inherit",cursor:"pointer",outline:"none"}}>
                <option value="name">{t.sortName}</option>
                <option value="score">{t.sortScore}</option>
                <option value="price">{t.sortPrice}</option>
                <option value="time">{t.sortTime}</option>
              </select>
              <div style={{flex:1}}/>
              <div style={{display:"flex",gap:"2px",background:BG,borderRadius:"6px",padding:"2px"}}>
                <button onClick={()=>setViewMode("grid")} style={{padding:"4px 8px",background:viewMode==="grid"?"#fff":"transparent",border:"none",borderRadius:"4px",fontSize:"12px",cursor:"pointer",color:viewMode==="grid"?DK:MU,boxShadow:viewMode==="grid"?"0 1px 3px rgba(0,0,0,0.08)":"none"}}>▦</button>
                <button onClick={()=>setViewMode("list")} style={{padding:"4px 8px",background:viewMode==="list"?"#fff":"transparent",border:"none",borderRadius:"4px",fontSize:"12px",cursor:"pointer",color:viewMode==="list"?DK:MU,boxShadow:viewMode==="list"?"0 1px 3px rgba(0,0,0,0.08)":"none"}}>☰</button>
              </div>
              <button onClick={()=>{setNewForm({title:"",subtitle:"",categoria:"Brioche",tag:"",pesoPieza:80,merma:12,precio:0,conservation:"",baking:"",tiempoElaboracion:""});setShowNewModal(true);}} style={{padding:"4px 10px",background:A,color:"#fff",border:"none",borderRadius:"6px",fontSize:"10px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit"}}>{t.addNewRecipe||"+ Nueva"}</button>
            </div>

            {/* Recipe grid/list */}
            {filteredRecipes.length===0?(
              <div style={{background:"#fff",border:"2px dashed "+BD,borderRadius:"12px",padding:"40px 20px",textAlign:"center"}}>
                <div style={{fontSize:"28px",marginBottom:"8px"}}>🔍</div>
                <div style={{fontSize:"13px",color:MU}}>{t.noRecipes}</div>
                {searchQ&&<div style={{fontSize:"11px",color:MU,marginTop:"4px"}}>{t.trySearch}</div>}
              </div>
            ):viewMode==="grid"?(
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"8px"}}>
                {filteredRecipes.map(({rec,i:ri})=>{
                  const rv=calcVals(rec.ingredients);
                  const rs=calcScore(globalInd,rv);
                  const col=catCol(rec.categoria);
                  return (
                    <div key={ri} onClick={()=>{setActive(ri);setMainTab("activa");}}
                      style={{background:"#fff",border:"1px solid "+(activeIdx===ri?A:BD),borderRadius:"10px",overflow:"hidden",cursor:"pointer",WebkitTapHighlightColor:"transparent",transition:"border-color 0.15s"}}>
                      {rec.foto&&<div style={{height:"80px",background:"url("+rec.foto+") center/cover"}}/>}
                      <div style={{padding:"10px 12px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"4px"}}>
                          <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic",fontSize:"13px",fontWeight:"600",color:DK,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1,minWidth:0}}>{rec.title}</div>
                          <div style={{display:"flex",gap:"2px",flexShrink:0}}>
                            <button onClick={e=>{e.stopPropagation();duplicateRecipe(ri);}} title={t.duplicateRecipe||"Duplicar"} style={{background:"none",border:"none",fontSize:"12px",color:MU,cursor:"pointer",padding:"0 2px",lineHeight:1,opacity:0.7}} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0.7}>⧉</button>
                            <button onClick={e=>{e.stopPropagation();toggleFav(ri);}} style={{background:"none",border:"none",fontSize:"14px",color:recipes[ri]?.favorite?"#F5C518":"#D4C4B0",cursor:"pointer",padding:"0 2px",lineHeight:1}}>{recipes[ri]?.favorite?"★":"☆"}</button>
                          </div>
                        </div>
                        <div style={{fontSize:"10px",color:MU,marginBottom:"6px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{rec.subtitle}</div>
                        <div style={{display:"flex",gap:"4px",flexWrap:"wrap",alignItems:"center",marginBottom:"6px"}}>
                          <span style={{padding:"1px 6px",background:col+"18",color:col,borderRadius:"4px",fontSize:"8px",fontWeight:"700"}}>{rec.categoria}</span>
                          {rec.tiempoElaboracion&&<span style={{fontSize:"8px",color:MU}}>⏱{rec.tiempoElaboracion}</span>}
                          {rec.precio!=null&&<span style={{fontSize:"8px",color:A,fontWeight:"600"}}>€{Number(rec.precio).toFixed(2)}</span>}
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                          <div style={{width:"24px",height:"24px",borderRadius:"50%",border:"2px solid "+(rs>=80?"#4A8C60":rs>=50?A:"#CC4A2A"),display:"flex",alignItems:"center",justifyContent:"center"}}>
                            <span style={{fontSize:"8px",fontWeight:"700",color:rs>=80?"#4A8C60":rs>=50?A:"#CC4A2A",fontFamily:"monospace"}}>{rs}</span>
                          </div>
                          <div style={{flex:1,height:"3px",background:"#F0EBE4",borderRadius:"99px",overflow:"hidden"}}>
                            <div style={{height:"100%",width:rs+"%",background:rs>=80?"#4A8C60":rs>=50?A:"#CC4A2A",borderRadius:"99px"}}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ):(
              <div style={{background:"#fff",border:"1px solid "+BD,borderRadius:"12px",overflow:"hidden"}}>
                {filteredRecipes.map(({rec,i:ri},idx)=>{
                  const rv=calcVals(rec.ingredients);
                  const rs=calcScore(globalInd,rv);
                  const col=catCol(rec.categoria);
                  return (
                    <div key={ri} onClick={()=>{setActive(ri);setMainTab("activa");}}
                      style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 14px",borderBottom:idx<filteredRecipes.length-1?"1px solid "+BD:"none",cursor:"pointer",WebkitTapHighlightColor:"transparent",background:activeIdx===ri?AL+"44":"#fff"}}>
                      {rec.foto?<img src={rec.foto} alt="" style={{width:"36px",height:"36px",objectFit:"cover",borderRadius:"6px",flexShrink:0}}/>:<span style={{fontSize:"20px",flexShrink:0}}>🥐</span>}
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:"13px",fontWeight:"600",color:DK,fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{rec.title}</div>
                        <div style={{fontSize:"10px",color:MU,display:"flex",gap:"6px",alignItems:"center"}}>
                          <span style={{padding:"0px 5px",background:col+"18",color:col,borderRadius:"3px",fontSize:"8px",fontWeight:"700"}}>{rec.categoria}</span>
                          {rec.tiempoElaboracion&&<span>⏱ {rec.tiempoElaboracion}</span>}
                          {rec.precio!=null&&<span style={{color:A}}>€{Number(rec.precio).toFixed(2)}</span>}
                        </div>
                      </div>
                      <div style={{width:"28px",height:"28px",borderRadius:"50%",border:"2px solid "+(rs>=80?"#4A8C60":rs>=50?A:"#CC4A2A"),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <span style={{fontSize:"9px",fontWeight:"700",color:rs>=80?"#4A8C60":rs>=50?A:"#CC4A2A",fontFamily:"monospace"}}>{rs}</span>
                      </div>
                      <button onClick={e=>{e.stopPropagation();duplicateRecipe(ri);}} title={t.duplicateRecipe||"Duplicar"} style={{background:"none",border:"none",fontSize:"14px",color:MU,cursor:"pointer",padding:"2px",flexShrink:0,lineHeight:1,opacity:0.7}} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0.7}>⧉</button>
                      <button onClick={e=>{e.stopPropagation();toggleFav(ri);}} style={{background:"none",border:"none",fontSize:"16px",color:recipes[ri]?.favorite?"#F5C518":"#D4C4B0",cursor:"pointer",padding:"2px",flexShrink:0,lineHeight:1}}>{recipes[ri]?.favorite?"★":"☆"}</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ════════ RECETA ACTIVA ════════ */}
        {mainTab==="activa"&&(
          <div>
            {/* Recipe quick-switcher */}
            <div style={{marginBottom:"8px",display:"flex",gap:"4px",flexWrap:"wrap",alignItems:"center"}}>
              <div style={{position:"relative",flexShrink:0}}>
                <button onClick={e=>{const m=e.currentTarget.nextSibling;m.style.display=m.style.display==="block"?"none":"block";}}
                  style={{padding:"4px 10px",background:"#fff",border:"1px solid "+BD,borderRadius:"6px",fontSize:"11px",fontWeight:"600",color:DK,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:"4px"}}>
                  {r.title} <span style={{fontSize:"8px",color:MU}}>▾</span>
                </button>
                <div style={{display:"none",position:"absolute",left:0,top:"calc(100% + 4px)",background:"#fff",border:"1px solid "+BD,borderRadius:"8px",boxShadow:"0 4px 16px rgba(0,0,0,0.12)",minWidth:"240px",maxHeight:"360px",overflowY:"auto",zIndex:200}}>
                  <div style={{padding:"8px 10px",borderBottom:"1px solid "+BD,position:"sticky",top:0,background:"#fff",zIndex:1}}>
                    <input id="recipe-quick-search" placeholder={t.searchRecipe||"Buscar receta…"}
                      onInput={e=>{const q=e.target.value.toLowerCase();const btns=e.target.closest("div").querySelectorAll("button[data-rname]");btns.forEach(b=>{b.style.display=b.dataset.rname.toLowerCase().includes(q)?null:"none";});}}
                      style={{width:"100%",border:"1px solid "+BD,borderRadius:"5px",padding:"5px 8px",fontSize:"11px",outline:"none",fontFamily:"inherit",color:DK,background:BG,boxSizing:"border-box"}}/>
                  </div>
                  {categories.filter(cat=>recipes.some(r=>r.categoria===cat)).map(cat=>{
                    const catRecs=recipes.map((r,ri)=>({r,ri})).filter(({r})=>r.categoria===cat);
                    if(!catRecs.length) return null;
                    return (
                      <div key={cat} data-cat={cat}>
                        <div style={{padding:"6px 12px",fontSize:"8px",fontWeight:"700",color:catCol(cat),textTransform:"uppercase",letterSpacing:"0.06em",background:BG}}>{cat}</div>
                        {catRecs.map(({r:rec,ri})=>(
                          <button key={ri} data-rname={rec.title} onClick={e=>{e.currentTarget.closest("[style*='position:absolute']").style.display="none";setActive(ri);}}
                            style={{display:"flex",alignItems:"center",gap:"8px",width:"100%",padding:"8px 12px",background:activeIdx===ri?AL:"none",border:"none",borderBottom:"1px solid "+BD+"66",cursor:"pointer",fontSize:"11px",fontWeight:activeIdx===ri?"700":"400",color:activeIdx===ri?A:DK,textAlign:"left",fontFamily:"inherit"}}>
                            <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{rec.title}</span>
                            {recipes[ri]?.favorite&&<span style={{color:"#F5C518",fontSize:"10px",flexShrink:0}}>★</span>}
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
              <button onClick={()=>{if(activeIdx>0)setActive(activeIdx-1);}} disabled={activeIdx===0} style={{padding:"3px 8px",background:activeIdx===0?BG:"#fff",border:"1px solid "+BD,borderRadius:"4px",fontSize:"11px",cursor:activeIdx===0?"not-allowed":"pointer",color:activeIdx===0?MU:DK}}>←</button>
              <span style={{fontSize:"10px",color:MU,fontFamily:"monospace"}}>{activeIdx+1}/{recipes.length}</span>
              <button onClick={()=>{if(activeIdx<recipes.length-1)setActive(activeIdx+1);}} disabled={activeIdx===recipes.length-1} style={{padding:"3px 8px",background:activeIdx===recipes.length-1?BG:"#fff",border:"1px solid "+BD,borderRadius:"4px",fontSize:"11px",cursor:activeIdx===recipes.length-1?"not-allowed":"pointer",color:activeIdx===recipes.length-1?MU:DK}}>→</button>
              <div style={{flex:1}}/>
              <button onClick={()=>{setNotesGlobal(false);setShowNotes(true);}} style={{padding:"3px 8px",background:BG,border:"1px solid "+BD,borderRadius:"5px",fontSize:"10px",cursor:"pointer",color:MI,fontFamily:"inherit",display:"flex",alignItems:"center",gap:"3px"}}>📝 {t.notes}</button>
              {recipes.length>1&&editMode&&<button onClick={()=>{
                const rec=recipes[activeIdx];
                pushUndo(recipes,globalInd,library);
                try { if(rec._id) supabase.from("recipes").delete().eq("id",rec._id); } catch(e){}
                setRecipes(rs=>rs.filter((_,i)=>i!==activeIdx));
                setActive(i=>Math.max(0,i-1));
              }} style={{padding:"3px 8px",background:"transparent",border:"1px solid #F5D0C8",color:"#CC4A2A",fontSize:"10px",cursor:"pointer",borderRadius:"5px"}}>✕ {t.deleteRecipe||"Eliminar"}</button>}
            </div>

            {/* Header */}
            <div style={{background:"#fff",border:"1px solid "+BD,borderRadius:"12px",padding:"16px",marginBottom:"10px"}}>
              <div style={{display:"flex",gap:"12px",alignItems:"flex-start"}}>
                {/* Photo */}
                <div style={{flexShrink:0}}>
                  {r.foto?(
                    <div style={{position:"relative",width:"76px",height:"76px"}}>
                      <img src={r.foto} alt="" style={{width:"76px",height:"76px",objectFit:"cover",borderRadius:"8px",border:"1px solid "+BD}}/>
                      {editMode&&<button onClick={()=>setF("foto",null)} style={{position:"absolute",top:"-5px",right:"-5px",background:"#FFF0EB",border:"1px solid #F5D0C8",color:"#CC4A2A",width:"17px",height:"17px",borderRadius:"50%",fontSize:"9px",cursor:"pointer",fontWeight:"700",lineHeight:"17px",textAlign:"center",padding:0}}>✕</button>}
                    </div>
                  ):(
                    <label style={{width:"76px",height:"76px",background:BG,border:"1px dashed "+(editMode?A:BD),borderRadius:"8px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:editMode?"pointer":"default",gap:"3px"}}>
                      <span style={{fontSize:"22px"}}>{editMode?"📷":"🥐"}</span>
                      {editMode&&<span style={{fontSize:"8px",color:A,fontWeight:"600"}}>{t.addPhoto||"Añadir foto"}</span>}
                      {editMode&&<input type="file" accept="image/*" style={{display:"none"}} onChange={e=>handlePhoto(e,activeIdx)}/>}
                    </label>
                  )}
                </div>
                {/* Meta */}
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic",fontSize:"clamp(18px,4vw,28px)",fontWeight:"500",color:DK,marginBottom:"3px"}}>
                    {editMode?<input value={r.title} onChange={e=>setF("title",e.target.value)} style={{fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic",fontSize:"clamp(18px,4vw,28px)",fontWeight:"500",background:"transparent",border:"none",borderBottom:"1.5px solid "+A,outline:"none",color:DK,width:"100%",padding:0}}/>:r.title}
                  </div>
                  <div style={{fontSize:"12px",color:MU,marginBottom:"8px"}}>
                    {editMode?<input value={r.subtitle} onChange={e=>setF("subtitle",e.target.value)} style={{fontSize:"12px",color:MU,background:"transparent",border:"none",borderBottom:"1px dashed #D4C4B0",outline:"none",fontFamily:"inherit",width:"200px",padding:0}}/>:r.subtitle}
                  </div>
                  <div style={{display:"flex",gap:"5px",flexWrap:"wrap",alignItems:"center"}}>
                    {chip(r.tag)}
                    <Tag bg="#EAF2EC" fg={GR}>⏱ {editMode?<input value={r.tiempoElaboracion||""} onChange={e=>setF("tiempoElaboracion",e.target.value)} style={{width:"60px",background:"transparent",border:"none",borderBottom:"1px dashed #C4D4C4",outline:"none",fontFamily:"inherit",fontSize:"10px",color:GR,padding:0}}/>:r.tiempoElaboracion||"—"}</Tag>
                    <Tag bg={AL} fg={A}>€ {editMode?<input type="number" value={r.precio==null?"":r.precio} onChange={e=>{const n=parseFloat(e.target.value);setF("precio",isNaN(n)?null:n);}} style={{width:"44px",background:"transparent",border:"none",borderBottom:"1px dashed #D4C4B0",outline:"none",fontFamily:"monospace",fontSize:"10px",color:A,padding:0}}/>:r.precio!=null?r.precio.toFixed(2):"—"}</Tag>
                    <Tag bg="#F0EBE4" fg={MU}>{editMode?<input value={r.conservation} onChange={e=>setF("conservation",e.target.value)} style={{width:"100px",background:"transparent",border:"none",borderBottom:"1px dashed #D4C4B0",outline:"none",fontFamily:"inherit",fontSize:"10px",color:MU,padding:0}}/>:r.conservation}</Tag>
                  </div>
                </div>
                <ScoreRing score={score} small labels={t}/>
                <button onClick={()=>toggleFav(activeIdx)} style={{background:"none",border:"none",fontSize:"22px",cursor:"pointer",color:r.favorite?"#F5C518":"#D4C4B0",padding:"0 2px",lineHeight:1}}>{r.favorite?"★":"☆"}</button>
              </div>
            </div>

            {/* Scaler */}
            <div style={{background:AL,border:"1px solid #EAD4B8",borderRadius:"12px",padding:"12px 14px",marginBottom:"10px"}}>
              <div style={{fontSize:"9px",fontWeight:"700",color:A,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"10px"}}>{t.scale}</div>
              <div style={{display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:"3px"}}>
                  <button onClick={()=>setNum(n=>Math.max(0,n-1))} style={{width:"26px",height:"30px",background:"#fff",border:"1px solid #EAD4B8",color:A,fontSize:"14px",cursor:"pointer",borderRadius:"5px",fontWeight:"700"}}>−</button>
                  <input type="number" min="0" value={numPiezas} onChange={e=>{const n=parseInt(e.target.value,10);setNum(isNaN(n)||n<0?0:n);}} style={{width:"44px",height:"30px",background:"#fff",border:"2px solid "+A,borderRadius:"6px",textAlign:"center",fontSize:"16px",fontWeight:"700",fontFamily:"monospace",color:DK,outline:"none",padding:0}}/>
                  <button onClick={()=>setNum(n=>n+1)} style={{width:"26px",height:"30px",background:"#fff",border:"1px solid #EAD4B8",color:A,fontSize:"14px",cursor:"pointer",borderRadius:"5px",fontWeight:"700"}}>+</button>
                </div>
                <span style={{color:"#D4C4B0",fontSize:"14px"}}>×</span>
                <div style={{position:"relative"}}>
                  <input type="number" value={r.pesoPieza===0?"":r.pesoPieza} onChange={e=>{const n=parseFloat(e.target.value);setF("pesoPieza",isNaN(n)?0:n);}} style={{width:"72px",padding:"5px 20px 5px 7px",background:"#fff",border:"2px solid "+A,color:DK,fontSize:"16px",fontFamily:"monospace",borderRadius:"6px",textAlign:"center",outline:"none",fontWeight:"600"}}/>
                  <span style={{position:"absolute",right:"6px",top:"50%",transform:"translateY(-50%)",fontSize:"9px",color:MU}}>g</span>
                </div>
                <span style={{color:"#D4C4B0",fontSize:"14px"}}>=</span>
                <div style={{background:"#fff",border:"1px solid #EAD4B8",borderRadius:"8px",padding:"6px 12px"}}>
                  <span style={{fontSize:"9px",fontWeight:"700",color:A,textTransform:"uppercase",display:"block"}}>{t.total}</span>
                  <span style={{fontSize:"16px",fontWeight:"700",color:A,fontFamily:"monospace"}}>{Math.round(masaTarget)}g</span>
                </div>
                <div style={{background:BG,border:"1px solid "+BD,borderRadius:"8px",padding:"6px 12px"}}>
                  <span style={{fontSize:"9px",fontWeight:"700",color:MU,textTransform:"uppercase",display:"block"}}>{t.factor}</span>
                  <span style={{fontSize:"16px",fontWeight:"700",color:DK,fontFamily:"monospace"}}>×{ratio.toFixed(2)}</span>
                </div>
                <span style={{fontSize:"10px",color:MU}}>≈{pesoCocido}g {t.baked} ({r.merma}% {t.loss})</span>
              </div>
              <div style={{marginTop:"8px",display:"flex",gap:"4px",flexWrap:"wrap"}}>
                <button onClick={()=>setNum(0)} style={{padding:"2px 7px",background:numPiezas===0?A:"#fff",border:"1px solid "+(numPiezas===0?A:"#EAD4B8"),color:numPiezas===0?"#fff":MI,fontSize:"9px",fontWeight:"600",cursor:"pointer",borderRadius:"4px",transition:"all 0.15s"}}>0</button>
                {[{n:2,p:500},{n:4,p:500},{n:6,p:500},{n:12,p:500},{n:6,p:750},{n:4,p:1000}].map(({n,p})=>{
                  const ac=numPiezas===n&&r.pesoPieza===p;
                  return <button key={n+"x"+p} onClick={()=>{setNum(n);setF("pesoPieza",p);}} style={{padding:"2px 7px",background:ac?A:"#fff",border:"1px solid "+(ac?A:"#EAD4B8"),color:ac?"#fff":MI,fontSize:"9px",fontWeight:"600",cursor:"pointer",borderRadius:"4px",transition:"all 0.15s"}}>{n}×{p}g</button>;
                })}
              </div>
            </div>

            {/* Process */}
            <div style={{background:"#fff",border:"1px solid "+BD,borderRadius:"12px",padding:"12px 14px",marginBottom:"10px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
                <span style={{fontSize:"9px",fontWeight:"700",color:DK,textTransform:"uppercase",letterSpacing:"0.06em"}}>{t.process}</span>
                {editMode&&<button onClick={addProc} style={{background:"none",border:"1px solid "+BD,color:MU,fontSize:"10px",padding:"2px 7px",borderRadius:"4px",cursor:"pointer"}}>{t.addStage}</button>}
              </div>
              <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:"2px"}}>
                {r.process.map((p,i)=>{
                  const dp=dProps("process",i);
                  return (
                    <div key={p.id} style={{display:"flex",alignItems:"center"}}>
                      <div draggable={dp.draggable} onDragStart={dp.onDragStart} onDragOver={dp.onDragOver} onDrop={dp.onDrop} onDragEnd={dp.onDragEnd}
                        style={{textAlign:"center",position:"relative",minWidth:"54px",padding:"3px",borderRadius:"6px",cursor:editMode?"grab":"default",opacity:isDg("process",i)?0.4:1,boxShadow:isOv("process",i)?"0 0 0 2px "+A:"none",transition:"all 0.12s"}}>
                        {editMode&&<button onClick={()=>delProc(p.id)} style={{position:"absolute",top:"-4px",right:"-4px",background:"#FFF0EB",border:"none",color:"#CC4A2A",width:"12px",height:"12px",borderRadius:"50%",fontSize:"7px",cursor:"pointer",fontWeight:"700",lineHeight:"12px",textAlign:"center",padding:0}}>✕</button>}
                        <div style={{background:i===0?A:AL,color:i===0?"#fff":A,borderRadius:"5px",padding:"4px 8px",fontSize:"9px",fontWeight:"600",marginBottom:"2px"}}>
                          {editMode?<input value={p.label} onChange={e=>upProc(p.id,"label",e.target.value)} style={{background:"transparent",border:"none",outline:"none",fontFamily:"inherit",fontSize:"9px",fontWeight:"600",color:i===0?"#fff":A,width:"54px",textAlign:"center",padding:0}}/>:p.label}
                        </div>
                        <div style={{fontSize:"8px",color:MU,fontFamily:"monospace"}}>{p.time}</div>
                      </div>
                      {i<r.process.length-1&&<span style={{color:"#D4C4B0",fontSize:"11px",margin:"0 2px 10px"}}>→</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recipe sub-tabs */}
            <div style={{marginBottom:"8px"}}>
              <div style={{display:"flex",gap:"6px",marginBottom:"2px",overflowX:"auto",paddingBottom:"2px"}}>
              {["ingredientes","metodo"].map(tab=><button key={tab} onClick={()=>setRecTab(tab)} style={{padding:"9px 16px",background:recTab===tab?"#fff":"transparent",border:"1px solid "+(recTab===tab?A:BD),borderBottom:recTab===tab?"2px solid "+A:"2px solid transparent",color:recTab===tab?DK:MU,fontSize:"13px",fontWeight:recTab===tab?"700":"400",cursor:"pointer",borderRadius:"8px 8px 0 0",whiteSpace:"nowrap",fontFamily:"inherit",WebkitTapHighlightColor:"transparent",flexShrink:0}}>{recLabels[tab]}</button>)}
            </div>
            </div>

            {/* INGREDIENTES */}
            {recTab==="ingredientes"&&(
              <div style={{background:"#fff",border:"1px solid "+BD,borderRadius:"12px",overflow:"hidden"}}>
                {/* Global sliders — always visible, editable only in editMode */}
                <GlobalSlidersPanel r={r} adjustGlobal={adjustGlobal} editMode={editMode} globalInd={globalInd} indVals={indVals} t={t}/>

                <div style={{padding:"6px 12px 4px",display:"flex",justifyContent:"flex-end",alignItems:"center",gap:"6px",flexWrap:"wrap"}}>
                  <button onClick={()=>setShowBase(b=>!b)}
                    title={showBase?(t.hideBase||"Ocultar base"):(t.showBase||"Base")}
                    style={{padding:"2px 8px",background:showBase?BG:"transparent",color:showBase?MU:"#C4B4A4",border:"1px solid "+(showBase?BD:"transparent"),borderRadius:"4px",fontSize:"9px",fontWeight:"600",cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>
                    {showBase?"[ "+t.baseCol+" ✕ ]":"[ "+t.baseCol+" ]"}
                  </button>
                  {editMode&&<>
                    <span style={{fontSize:"9px",color:MU}}>{t.editBy||"Editar por:"}</span>
                    {[{l:"g",v:false},{l:"%H",v:true}].map(({l,v})=>(
                      <button key={l} onClick={()=>setPctMode(v)}
                        style={{padding:"2px 8px",background:pctMode===v?A:BG,color:pctMode===v?"#fff":MU,border:"1px solid "+(pctMode===v?A:BD),borderRadius:"4px",fontSize:"10px",fontWeight:"600",cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>
                        {l}
                      </button>
                    ))}
                  </>}
                </div>
                {(()=>{
                  const colE=showBase?"26px 18px 1fr 70px 70px 44px 40px 40px 40px 40px":"26px 18px 1fr 70px 44px 40px 40px 40px 40px";
                  const colV=showBase?"1fr 70px 70px 44px 40px 40px 40px 40px":"1fr 70px 44px 40px 40px 40px 40px";
                  const cols=editMode?colE:colV;
                  return (
                <div style={{display:"grid",gridTemplateColumns:cols,background:BG,borderBottom:"1px solid "+BD,padding:"6px 12px",alignItems:"center",gap:"2px"}}>
                  {editMode&&<div/>}
                  {editMode&&<div/>}
                  <span style={{fontSize:"8px",fontWeight:"700",color:MU,textTransform:"uppercase",letterSpacing:"0.08em"}}>{t.ingredientCol}</span>
                  {showBase&&<span style={{fontSize:"8px",fontWeight:"700",color:MU,textTransform:"uppercase",textAlign:"right"}}>{t.baseCol}</span>}
                  <span style={{fontSize:"8px",fontWeight:"700",color:A,textTransform:"uppercase",textAlign:"right"}}>{numPiezas}×{r.pesoPieza}g</span>
                  <span style={{fontSize:"8px",fontWeight:"700",color:pctMode&&editMode?A:MU,textTransform:"uppercase",textAlign:"right"}}>{t.flourCol}{pctMode&&editMode?" ✎":""}</span>
                  {ccols.map(c=><span key={c.key} style={{fontSize:"7px",fontWeight:"700",color:c.col,textTransform:"uppercase",textAlign:"center"}}>{c.label}</span>)}
                </div>
                  );
                })()}
                {r.ingredients.map((ing,idx)=>{
                  const fb=r.ingredients.find(i=>i.isBase)||r.ingredients.find(i=>i.role==="farine");
                  const fbase=fb?fb.base:1;
                  const pctH=ing.base!=null?Math.round((ing.base/fbase)*100):null;
                  const scaledVal=sc(ing.base);
                  const dp=dProps("ingredients",idx);
                  const maxBase=Math.max(ing.base*3, 2000);
                  return (
                    <div key={ing.id} draggable={dp.draggable} onDragStart={dp.onDragStart} onDragOver={dp.onDragOver} onDrop={dp.onDrop} onDragEnd={dp.onDragEnd}
                      style={{padding:"7px 12px",borderBottom:idx<r.ingredients.length-1?"1px solid "+BD:"none",alignItems:"center",gap:"2px",background:isDg("ingredients",idx)?BG:isOv("ingredients",idx)?"#FFF3EA":ing.isLm?AL:ing.isBase?"#F5F0EB":"#fff",opacity:isDg("ingredients",idx)?0.5:1,cursor:editMode?"grab":"default",boxShadow:isOv("ingredients",idx)?"inset 0 2px 0 "+A:"none",transition:"background 0.1s"}}>
                      {/* Row 1: name, [base], scaled, %H, coeffs */}
                      <div style={{display:"grid",gridTemplateColumns:editMode?(showBase?"26px 18px 1fr 70px 70px 44px 40px 40px 40px 40px":"26px 18px 1fr 70px 44px 40px 40px 40px 40px"):(showBase?"1fr 70px 70px 44px 40px 40px 40px 40px":"1fr 70px 44px 40px 40px 40px 40px"),alignItems:"center",gap:"2px"}}>
                        {editMode&&<span style={{color:"#C4B4A4",fontSize:"12px",cursor:"grab",userSelect:"none",textAlign:"center"}}>⠿</span>}
                        {editMode&&<button onClick={e=>{e.stopPropagation();delIng(ing.id);}} style={{background:"none",border:"none",color:"#CC4A2A",fontSize:"11px",cursor:"pointer",padding:0}}>✕</button>}
                        <div>
                          <div style={{fontSize:"12px",fontWeight:ing.isLm||ing.isBase?"700":"400",color:ing.isLm?A:ing.isBase?"#B07A2A":DK,display:"flex",alignItems:"center",gap:"4px"}}>
                            {editMode?<input value={ing.name} onChange={e=>upIng(ing.id,"name",e.target.value)} style={{background:"transparent",border:"none",borderBottom:"1px dashed #D4C4B0",outline:"none",fontFamily:"inherit",fontSize:"12px",fontWeight:ing.isLm||ing.isBase?"700":"400",color:ing.isLm?A:ing.isBase?"#B07A2A":DK,width:"120px",padding:0}}/>:ing.name}
                            {ing.isLm&&chip("LM","#FFF5EC",A)}
                            {ing.isBase&&chip("BASE","#F5F0EB","#B07A2A")}
                          </div>
                          <div style={{display:"flex",gap:"4px",alignItems:"center"}}>
                            {ing.spec&&<div style={{fontSize:"9px",color:MU}}>{ing.spec}</div>}
                            {editMode&&<button onClick={()=>upIng(ing.id,"isBase",!ing.isBase)} style={{padding:"0px 4px",background:ing.isBase?"#B07A2A":"transparent",border:"1px solid "+(ing.isBase?"#B07A2A":"#D4C4B0"),borderRadius:"3px",fontSize:"7px",fontWeight:"700",color:ing.isBase?"#fff":"#B07A2A",cursor:"pointer",fontFamily:"inherit"}}>{ing.isBase?"BASE":"base"}</button>}
                          </div>
                        </div>
                        {showBase&&<div style={{textAlign:"right",fontSize:"11px",color:MI,fontFamily:"monospace"}}>
                          {editMode?(
                            pctMode?(
                              <input type="number" value={pctH===null||pctH===0?"":pctH}
                                onChange={e=>{
                                  const n=parseFloat(e.target.value);
                                  if(!isNaN(n)&&n>=0){
                                    const fb2=r.ingredients.find(i=>i.isBase)||r.ingredients.find(i=>i.role==="farine");
                                    upIng(ing.id,"base",Math.round(n/100*(fb2?.base||1)));
                                  }
                                }}
                                style={{width:"48px",textAlign:"right",background:"#FFF3EA",border:"1px solid "+A,borderRadius:"4px",padding:"2px 3px",fontFamily:"monospace",fontSize:"11px",color:A,fontWeight:"700",outline:"none"}}/>
                            ):(
                              <input type="number" value={ing.base===0?"":ing.base||""} onChange={e=>{const n=parseFloat(e.target.value);upIng(ing.id,"base",isNaN(n)?0:n);}} style={{width:"48px",textAlign:"right",background:BG,border:"1px solid "+BD,borderRadius:"4px",padding:"2px 3px",fontFamily:"monospace",fontSize:"11px",color:DK,fontWeight:"600",outline:"none"}}/>
                            )
                          ):ing.base+"g"}
                        </div>}
                        <div style={{textAlign:"right",fontSize:"12px",fontWeight:"600",color:ing.isLm?A:DK,fontFamily:"monospace"}}>{scaledVal}g</div>
                        <div style={{textAlign:"right",fontSize:"10px",color:MU,fontFamily:"monospace"}}>{pctH!=null?pctH+"%":"—"}</div>
                        {ccols.map(c=>{
                          const cv=ing.coeffs?(ing.coeffs[c.key]||0):0;
                          const pctC=Math.round(cv*100);
                          return (
                            <div key={c.key} style={{textAlign:"center"}}>
                              {editMode?(
                                <input type="number" min="0" max="100" value={pctC===0?"":pctC}
                                  onChange={e=>{const n=parseFloat(e.target.value);upIngC(ing.id,c.key,isNaN(n)?0:Math.min(1,Math.max(0,n/100)));}}
                                  style={{width:"34px",textAlign:"center",padding:"2px",background:BG,border:"1px solid "+c.col+"44",borderRadius:"3px",fontFamily:"monospace",fontSize:"10px",fontWeight:"600",color:c.col,outline:"none"}}/>
                              ):(
                                <span style={{fontSize:"10px",fontFamily:"monospace",color:pctC>0?c.col:"#D4C4B0",fontWeight:pctC>0?"600":"400"}}>{pctC>0?pctC+"%":"—"}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {/* Row 2: slider knobs (only in edit mode) */}
                      {editMode&&<div style={{marginTop:"4px",display:"flex",alignItems:"center",gap:"6px",flexWrap:"wrap"}}>
                        <span style={{fontSize:"8px",color:ing.isBase?"#B07A2A":MU,fontWeight:"600",width:"20px"}}>{ing.isBase?"🔒":""}</span>
                        <div style={{flex:"1 1 120px",minWidth:"80px",display:"flex",alignItems:"center",gap:"4px"}}>
                          <span style={{fontSize:"7px",color:MU,width:"14px"}}>g</span>
                          <input type="range" min={0} max={maxBase} value={ing.base||0}
                            onChange={e=>upIng(ing.id,"base",parseInt(e.target.value))}
                            style={{flex:1,height:"4px",accentColor:ing.isBase?"#B07A2A":A,cursor:"pointer"}}/>
                          <span style={{fontSize:"8px",color:MU,fontFamily:"monospace",width:"30px",textAlign:"right"}}>{ing.base}g</span>
                        </div>
                        {ccols.map(c=>{
                          const cv=ing.coeffs?(ing.coeffs[c.key]||0):0;
                          const pctC=Math.round(cv*100);
                          return (
                            <div key={c.key} style={{flex:"1 1 80px",minWidth:"60px",display:"flex",alignItems:"center",gap:"3px"}}>
                              <span style={{fontSize:"7px",color:c.col,fontWeight:"700",width:"14px"}}>{c.label.slice(0,-1)}</span>
                              <input type="range" min={0} max={100} value={pctC}
                                onChange={e=>upIngC(ing.id,c.key,parseInt(e.target.value)/100)}
                                style={{flex:1,height:"3px",accentColor:c.col,cursor:"pointer"}}/>
                              <span style={{fontSize:"8px",color:c.col,fontFamily:"monospace",width:"22px",textAlign:"right"}}>{pctC}%</span>
                            </div>
                          );
                        })}
                      </div>}
                    </div>
                  );
                })}
                {editMode&&(
                  <div style={{padding:"7px 12px",borderTop:"1px solid "+BD,display:"flex",gap:"7px"}}>
                    <button onClick={()=>openPicker(null)} style={{background:"none",border:"1px dashed "+BD,color:MU,fontSize:"11px",padding:"4px 0",borderRadius:"5px",cursor:"pointer",flex:1}}>{t.addIngredient}</button>
                    <button onClick={()=>setMainTab("biblioteca")} style={{background:"none",border:"1px solid "+BD,color:MI,fontSize:"11px",padding:"4px 10px",borderRadius:"5px",cursor:"pointer"}}>{t.fromLibrary}</button>
                  </div>
                )}
                {editMode&&<div style={{padding:"4px 12px",fontSize:"9px",color:MU,borderTop:"1px solid "+BD}}>{t.dragRows}</div>}
              </div>
            )}

            {/* MÉTODO */}
            {recTab==="metodo"&&(
              <div style={{background:"#fff",border:"1px solid "+BD,borderRadius:"12px",overflow:"hidden"}}>
                {r.steps.map((step,i)=>{
                  const dp=dProps("steps",i);
                  return (
                    <div key={step.id} draggable={dp.draggable} onDragStart={dp.onDragStart} onDragOver={dp.onDragOver} onDrop={dp.onDrop} onDragEnd={dp.onDragEnd}
                      style={{borderBottom:i<r.steps.length-1?"1px solid "+BD:"none",opacity:isDg("steps",i)?0.4:1,boxShadow:isOv("steps",i)?"inset 0 2px 0 "+A:"none"}}>
                      <div onClick={()=>!editMode&&setActiveStep(activeStep===i?null:i)}
                        style={{display:"flex",alignItems:"center",gap:"8px",padding:"11px 12px",cursor:editMode?"grab":"pointer",background:"#fff",transition:"background 0.1s"}}>
                        {editMode&&<span style={{color:"#C4B4A4",fontSize:"12px",userSelect:"none",touchAction:"none"}}>⠿</span>}
                        {editMode&&<button onClick={e=>{e.stopPropagation();delStep(step.id);}} style={{background:"none",border:"none",color:"#CC4A2A",fontSize:"11px",cursor:"pointer",padding:0}}>✕</button>}
                        <div style={{width:"22px",height:"22px",background:AL,color:A,borderRadius:"5px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",fontWeight:"700",flexShrink:0}}>{String(i+1).padStart(2,"0")}</div>
                        <div style={{flex:1,fontSize:"13px",fontWeight:"500",color:DK}}>
                          {editMode?<input value={step.label} onChange={e=>upStep(step.id,"label",e.target.value)} style={{background:"transparent",border:"none",borderBottom:"1px dashed #D4C4B0",outline:"none",fontFamily:"inherit",fontSize:"13px",fontWeight:"500",color:DK,width:"100%",padding:0}}/>:step.label}
                        </div>
                        <span style={{fontSize:"10px",color:MU,fontFamily:"monospace",flexShrink:0}}>{step.time}</span>
                        {!editMode&&<span style={{color:"#C4B4A4",fontSize:"12px",transform:activeStep===i?"rotate(90deg)":"none",transition:"transform 0.2s"}}>›</span>}
                      </div>
                      <div style={{overflow:"hidden",maxHeight:(!editMode&&activeStep===i)||editMode?"200px":"0",transition:"max-height 0.3s"}}>
                        <div style={{padding:"0 12px 10px 42px",fontSize:"12px",color:MI,lineHeight:1.6}}>
                          {editMode?<textarea value={step.detail} rows={2} onChange={e=>upStep(step.id,"detail",e.target.value)} style={{background:"transparent",border:"none",borderBottom:"1px dashed #D4C4B0",outline:"none",fontFamily:"inherit",fontSize:"12px",color:MI,width:"100%",padding:0,resize:"none"}}/>:step.detail}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {editMode&&<div style={{padding:"7px 12px",borderTop:"1px solid "+BD}}><button onClick={addStep} style={{background:"none",border:"1px dashed "+BD,color:MU,fontSize:"11px",padding:"5px 0",borderRadius:"5px",cursor:"pointer",width:"100%"}}>{t.addStep}</button></div>}
              </div>
            )}

            {/* Footer */}
            <div style={{display:"flex",gap:"7px",marginTop:"10px",flexWrap:"wrap"}}>
              {[{l:t.baking,k:"baking"},{l:t.intTemp,k:"tempBaking"},{l:t.conservation,k:"conservation"}].map(({l,k})=>(
                <div key={k} style={{background:"#fff",border:"1px solid "+BD,borderRadius:"8px",padding:"8px 12px",flex:1,minWidth:"100px"}}>
                  <div style={{fontSize:"8px",fontWeight:"700",color:DK,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"2px"}}>{l}</div>
                  {editMode?<input value={r[k]} onChange={e=>setF(k,e.target.value)} style={{background:"transparent",border:"none",borderBottom:"1px dashed #D4C4B0",outline:"none",fontFamily:"monospace",fontSize:"12px",color:MI,width:"100%",padding:0}}/>:<span style={{fontFamily:"monospace",fontSize:"12px",color:MI}}>{r[k]}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════ CONTROL ════════ */}
        {mainTab==="control"&&(
          <div>
            <div style={{marginBottom:"8px"}}>
              <div style={{display:"flex",gap:"6px",marginBottom:"2px",overflowX:"auto",paddingBottom:"2px"}}>
              {["indicadores","comparativa"].map(tab=><button key={tab} onClick={()=>setCtlTab(tab)} style={{padding:"9px 16px",background:ctlTab===tab?"#fff":"transparent",border:"1px solid "+(ctlTab===tab?A:BD),borderBottom:ctlTab===tab?"2px solid "+A:"2px solid transparent",color:ctlTab===tab?DK:MU,fontSize:"13px",fontWeight:ctlTab===tab?"700":"400",cursor:"pointer",borderRadius:"8px 8px 0 0",whiteSpace:"nowrap",fontFamily:"inherit",WebkitTapHighlightColor:"transparent",flexShrink:0}}>{ctlLabels[tab]}</button>)}
            </div>
            </div>

            {/* INDICADORES */}
            {ctlTab==="indicadores"&&(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px",flexWrap:"wrap",gap:"6px"}}>
                  <span style={{fontSize:"11px",color:MU}}>{t.allRecipes}</span>
                  {editMode&&(
                    <div style={{display:"flex",gap:"4px",flexWrap:"wrap"}}>
                      {Object.entries(BUILT_IN).map(([k,bi])=>{
                        const active=!!globalInd[k];
                        return <button key={k} onClick={()=>toggleBI(k)} style={{padding:"3px 8px",background:active?bi.color:"#fff",border:"1px solid "+(active?bi.color:BD),color:active?"#fff":MU,fontSize:"10px",fontWeight:"600",cursor:"pointer",borderRadius:"4px",transition:"all 0.15s"}}>{active?"✓ ":""}{bi.label}</button>;
                      })}
                      <button onClick={addInd} style={{padding:"3px 8px",background:"none",border:"1px dashed "+BD,color:MU,fontSize:"10px",fontWeight:"600",cursor:"pointer",borderRadius:"4px"}}>{t.addCustom}</button>
                    </div>
                  )}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"10px"}}>
                  {Object.entries(globalInd).map(([k,ind])=>(
                    <IndCard key={k} indKey={k} ind={ind} value={indVals[k]||0} edit={editMode} onUpdate={(f,v)=>upInd(k,f,v)} onDelete={()=>delInd(k)} tDesc={t.builtIn&&t.builtIn[k]} t={t}/>
                  ))}
                </div>
              </div>
            )}

            {/* COMPARATIVA */}
            {ctlTab==="comparativa"&&(
              <div>
                {/* Filter */}
                <div style={{background:"#fff",border:"1px solid "+BD,borderRadius:"10px",padding:"9px 12px",marginBottom:"10px",display:"flex",gap:"6px",flexWrap:"wrap",alignItems:"center"}}>
                  <span style={{fontSize:"9px",fontWeight:"700",color:MU,textTransform:"uppercase"}}>{t.show||"Mostrar:"}</span>
                  <button onClick={()=>setCompHidden(new Set())} style={{padding:"2px 8px",background:compHidden.size===0?"#2C2420":"transparent",color:compHidden.size===0?"#fff":MU,border:"1px solid "+(compHidden.size===0?"#2C2420":BD),borderRadius:"10px",fontSize:"9px",cursor:"pointer",fontFamily:"inherit"}}>{t.allRecipes2||"Todas"} ({recipes.length})</button>
                  {categories.map(cat=>{const n=recipes.filter(r=>r.categoria===cat).length;if(!n)return null;return<button key={cat} onClick={()=>{const s=new Set();recipes.forEach((_,i)=>{if(recipes[i].categoria!==cat)s.add(i);});setCompHidden(s.size===recipes.length?new Set():s);}} style={{padding:"2px 8px",background:"transparent",color:MU,border:"1px solid "+BD,borderRadius:"10px",fontSize:"9px",cursor:"pointer",fontFamily:"inherit"}}>{cat} ({n})</button>;})}
                  <div style={{flex:1}}/>
                  {recipes.map((rec,ri)=>{const on=!compHidden.has(ri);return<label key={ri} style={{display:"flex",alignItems:"center",gap:"3px",cursor:"pointer",padding:"2px 7px",background:on?AL:BG,border:"1px solid "+(on?A:BD),borderRadius:"10px"}}><input type="checkbox" checked={on} onChange={e=>{const s=new Set(compHidden);e.target.checked?s.delete(ri):s.add(ri);setCompHidden(s);}} style={{width:"10px",height:"10px",accentColor:A,cursor:"pointer"}}/><span style={{fontSize:"9px",color:on?A:MU,fontWeight:on?"700":"400"}}>{rec.title}</span></label>;})}
                </div>

                {/* Compact comparison table */}
                {recipes.filter((_,ri)=>!compHidden.has(ri)).length>1&&(
                  <div style={{background:"#fff",border:"1px solid "+BD,borderRadius:"10px",overflow:"hidden",marginBottom:"12px"}}>
                    <div style={{overflowX:"auto"}}>
                      <table style={{width:"100%",borderCollapse:"collapse",fontSize:"11px"}}>
                        <thead>
                          <tr style={{background:BG,borderBottom:"2px solid "+A}}>
                            <th style={{textAlign:"left",padding:"8px 10px",fontSize:"9px",fontWeight:"700",color:MU,textTransform:"uppercase"}}>{t.recipe||"Receta"}</th>
                            <th style={{textAlign:"center",padding:"8px 6px",fontSize:"9px",fontWeight:"700",color:MU}}>{t.score||"Score"}</th>
                            {Object.entries(globalInd).map(([k,ind])=><th key={k} style={{textAlign:"center",padding:"8px 6px",fontSize:"9px",fontWeight:"700",color:ind.color}}>{ind.label}</th>)}
                            <th style={{textAlign:"center",padding:"8px 6px",fontSize:"9px",fontWeight:"700",color:MU}}>{t.weight||"Peso"}</th>
                            <th style={{textAlign:"center",padding:"8px 6px",fontSize:"9px",fontWeight:"700",color:A}}>{t.price||"Precio"}</th>
                            <th style={{textAlign:"center",padding:"8px 6px",fontSize:"9px",fontWeight:"700",color:MU}}>{t.time||"Tiempo"}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recipes.map((rec,ri)=>{
                            if(compHidden.has(ri)) return null;
                            const rv=calcVals(rec.ingredients);
                            const rs=calcScore(globalInd,rv);
                            const rIndVals=Object.fromEntries(Object.entries(globalInd).map(([k])=>[k,BUILT_IN[k]?BUILT_IN[k].fn(rv):0]));
                            const scC=rs>=80?"#4A8C60":rs>=50?A:"#CC4A2A";
                            return (
                              <tr key={ri} onClick={()=>{setActive(ri);}} style={{cursor:"pointer",borderBottom:"1px solid "+BD,background:ri===activeIdx?AL+"44":"transparent"}}>
                                <td style={{padding:"8px 10px",fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic",fontWeight:"600",color:DK}}>{rec.title}</td>
                                <td style={{textAlign:"center",padding:"8px 6px",fontSize:"16px",fontWeight:"700",color:scC,fontFamily:"monospace"}}>{rs}</td>
                                {Object.entries(globalInd).map(([k,ind])=>{
                                  const v=rIndVals[k]||0;const ok=v>=ind.min&&v<=ind.max;
                                  return <td key={k} style={{textAlign:"center",padding:"8px 6px",fontFamily:"monospace",fontWeight:"700",fontSize:"11px",color:ok?ind.color:"#CC4A2A"}}>{v}%</td>;
                                })}
                                <td style={{textAlign:"center",padding:"8px 6px",color:MI}}>{rec.pesoPieza}g</td>
                                <td style={{textAlign:"center",padding:"8px 6px",fontWeight:"700",color:A}}>{rec.precio!=null?"€"+Number(rec.precio).toFixed(2):"—"}</td>
                                <td style={{textAlign:"center",padding:"8px 6px",color:MU,fontSize:"10px"}}>{rec.tiempoElaboracion||"—"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {recipes.map((rec,ri)=>{
                  if(compHidden.has(ri)) return null;
                  const rv=calcVals(rec.ingredients);
                  const rs=calcScore(globalInd,rv);
                  const rIndVals=Object.fromEntries(Object.entries(globalInd).map(([k])=>[k,BUILT_IN[k]?BUILT_IN[k].fn(rv):0]));
                  const fb=(rec.ingredients.find(i=>i.isBase)||rec.ingredients.find(i=>i.role==="farine")||{base:1}).base;
                  return (
                    <div key={ri} style={{background:"#fff",border:"2px solid "+(ri===activeIdx?A:BD),borderRadius:"12px",marginBottom:"12px",overflow:"hidden"}}>
                      <div style={{padding:"12px 14px",borderBottom:"1px solid "+BD,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px",background:ri===activeIdx?AL:"transparent"}}>
                        <div>
                          <div style={{fontSize:"14px",fontWeight:"700",color:DK,fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic"}}>{rec.title}</div>
                          <div style={{fontSize:"10px",color:MU}}>{rec.subtitle}</div>
                        </div>
                        <div style={{display:"flex",gap:"6px",alignItems:"center",flexWrap:"wrap"}}>
                          {[{l:t.fieldWeight||"Peso/pieza",k:"pesoPieza",sfx:"g"},{l:t.fieldLoss||"Merma",k:"merma",sfx:"%"}].map(({l,k,sfx})=>(
                            <div key={k} style={{display:"flex",alignItems:"center",gap:"3px"}}>
                              <span style={{fontSize:"8px",color:MU,textTransform:"uppercase",fontWeight:"600"}}>{l}</span>
                              <input type="number" value={rec[k]===0?"":rec[k]||""} onChange={e=>{const n=parseFloat(e.target.value);setRec(ri,r=>({...r,[k]:isNaN(n)?0:n}));}}
                                style={{width:"50px",padding:"2px 4px",background:"#fff",border:"1px solid "+BD,color:MI,fontSize:"11px",fontFamily:"monospace",borderRadius:"4px",outline:"none",textAlign:"center"}}/>
                              <span style={{fontSize:"8px",color:MU}}>{sfx}</span>
                            </div>
                          ))}
                          <ScoreRing score={rs} small labels={t}/>
                        </div>
                      </div>
                      <div style={{padding:"10px 14px",borderBottom:"1px solid "+BD,display:"flex",gap:"12px",flexWrap:"wrap"}}>
                        {Object.entries(globalInd).map(([k,ind])=>(
                          <div key={k} style={{flex:1,minWidth:"130px"}}>
                              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"3px"}}>
                                <span style={{fontSize:"10px",fontWeight:"700",color:(rIndVals[k]||0)>=ind.min&&(rIndVals[k]||0)<=ind.max?ind.color:"#CC4A2A"}}>{ind.label}</span>
                                <span style={{fontSize:"13px",fontWeight:"700",color:(rIndVals[k]||0)>=ind.min&&(rIndVals[k]||0)<=ind.max?ind.color:"#CC4A2A",fontFamily:"monospace"}}>{rIndVals[k]||0}%</span>
                              </div>
                              <div style={{height:"4px",background:"#F0EBE4",borderRadius:"99px",overflow:"hidden"}}>
                                <div style={{height:"100%",width:Math.min(100,Math.max(0,((rIndVals[k]||0)-ind.min)/(ind.max-ind.min||1)*100))+"%",background:(rIndVals[k]||0)>=ind.min&&(rIndVals[k]||0)<=ind.max?ind.color:"#CC4A2A",borderRadius:"99px"}}/>
                              </div>
                            </div>
                        ))}
                      </div>
                      <div style={{overflowX:"auto"}}>
                        <table style={{width:"100%",borderCollapse:"collapse",fontSize:"11px"}}>
                          <thead>
                            <tr style={{background:BG,borderBottom:"1px solid "+BD}}>
                              {editMode&&<th style={{width:"22px"}}/>}
                              <th style={{textAlign:"left",padding:"5px 10px",color:MU,fontWeight:"600",fontSize:"9px",textTransform:"uppercase"}}>{t.ingredientCol}</th>
                              <th style={{textAlign:"right",padding:"5px 8px",color:MU,fontWeight:"600",fontSize:"9px",textTransform:"uppercase"}}>{t.baseCol}</th>
                              <th style={{textAlign:"right",padding:"5px 8px",color:MU,fontWeight:"600",fontSize:"9px",textTransform:"uppercase"}}>{t.flourCol}</th>
                              {ccols.map(c=><th key={c.key} style={{textAlign:"center",padding:"5px 6px",color:c.col,fontWeight:"700",fontSize:"9px"}}>{c.label}</th>)}
                              <th style={{textAlign:"center",padding:"5px 6px",color:MU,fontWeight:"600",fontSize:"9px"}}>{t.roleCol||"Rol"}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rec.ingredients.map((ing,idx)=>{
                              const pct=ing.base!=null?Math.round((ing.base/fb)*100):null;
                              return (
                                <tr key={ing.id} style={{borderBottom:idx<rec.ingredients.length-1?"1px solid "+BD:"none",background:ing.isLm?AL:"transparent"}}>
                                  {editMode&&<td style={{padding:"4px 5px",textAlign:"center"}}><button onClick={()=>setRec(ri,r=>({...r,ingredients:r.ingredients.filter(i=>i.id!==ing.id)}))} style={{background:"none",border:"none",color:"#CC4A2A",fontSize:"11px",cursor:"pointer",padding:0}}>✕</button></td>}
                                  <td style={{padding:"5px 10px",color:DK,fontSize:"11px"}}>{ing.name}{ing.isLm&&chip(" LM","#FFF5EC",A)}</td>
                                  <td style={{textAlign:"right",padding:"5px 8px",fontFamily:"monospace",color:MI}}>
                                    <input type="number" value={ing.base===0?"":ing.base||""} onChange={e=>{const n=parseFloat(e.target.value);setRec(ri,r=>({...r,ingredients:r.ingredients.map(i=>i.id===ing.id?{...i,base:isNaN(n)?0:n}:i)}));}} style={{width:"52px",textAlign:"right",background:BG,border:"1px solid "+BD,borderRadius:"4px",padding:"2px 3px",fontFamily:"monospace",fontSize:"11px",fontWeight:"600",color:DK,outline:"none"}}/>
                                  </td>
                                  <td style={{textAlign:"right",padding:"5px 8px",fontFamily:"monospace",color:MU,fontSize:"10px"}}>{pct!=null?pct+"%":"—"}</td>
                                  {ccols.map(c=>{
                                    const cv=ing.coeffs?(ing.coeffs[c.key]||0):0;
                                    return (
                                      <td key={c.key} style={{textAlign:"center",padding:"4px 4px"}}>
                                        <input type="number" min="0" max="100" value={Math.round(cv*100)===0?"":Math.round(cv*100)}
                                          onChange={e=>{const n=parseFloat(e.target.value);setRec(ri,r=>({...r,ingredients:r.ingredients.map(i=>i.id===ing.id?{...i,coeffs:{...i.coeffs,[c.key]:isNaN(n)?0:Math.min(1,Math.max(0,n/100))}}:i)}));}}
                                          style={{width:"36px",textAlign:"center",padding:"2px",background:BG,border:"1px solid "+c.col+"33",borderRadius:"3px",fontFamily:"monospace",fontSize:"10px",fontWeight:"600",color:c.col,outline:"none"}}/>
                                      </td>
                                    );
                                  })}
                                  <td style={{padding:"4px 6px",textAlign:"center"}}>
                                    <select value={ing.role} onChange={e=>setRec(ri,r=>({...r,ingredients:r.ingredients.map(i=>i.id===ing.id?{...i,role:e.target.value}:i)}))} style={{fontSize:"9px",color:MI,background:BG,border:"1px solid "+BD,borderRadius:"3px",padding:"1px 2px",cursor:"pointer"}}>
                                      {ROLES.map(o=><option key={o} value={o}>{tRole(t,o)}</option>)}
                                    </select>
                                  </td>
                                </tr>
                              );
                            })}
                            <tr style={{borderTop:"2px solid "+BD,background:BG}}>
                              {editMode&&<td/>}
                              <td style={{padding:"6px 10px",fontWeight:"700",color:DK,fontSize:"10px",textTransform:"uppercase"}}>{t.total}</td>
                              <td style={{textAlign:"right",padding:"6px 8px",fontFamily:"monospace",fontWeight:"700",color:DK,fontSize:"11px"}}>{Math.round(rv.total)}g</td>
                              <td/>{ccols.map(c=><td key={c.key}/>)}<td/>
                            </tr>
                          </tbody>
                        </table>
                        {editMode&&<div style={{padding:"6px 10px",borderTop:"1px solid "+BD}}><button onClick={()=>openPicker(ri)} style={{background:"none",border:"1px dashed "+BD,color:MU,fontSize:"10px",padding:"3px 0",borderRadius:"4px",cursor:"pointer",width:"100%"}}>{t.addIngRow}</button></div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ════════ INGREDIENTES (biblioteca) ════════ */}
        {mainTab==="biblioteca"&&(
          <div>
            <div style={{marginBottom:"8px"}}>
              <div style={{display:"flex",gap:"6px",marginBottom:"2px",overflowX:"auto",paddingBottom:"2px"}}>
              {["ingredientes"].map(tab=><button key={tab} onClick={()=>setLibTab(tab)} style={{padding:"9px 16px",background:libTab===tab?"#fff":"transparent",border:"1px solid "+(libTab===tab?A:BD),borderBottom:libTab===tab?"2px solid "+A:"2px solid transparent",color:libTab===tab?DK:MU,fontSize:"13px",fontWeight:libTab===tab?"700":"400",cursor:"pointer",borderRadius:"8px 8px 0 0",whiteSpace:"nowrap",fontFamily:"inherit",WebkitTapHighlightColor:"transparent",flexShrink:0}}>{libLabels[tab]}</button>)}
            </div>
            </div>

            {/* INGREDIENTES */}
            {libTab==="ingredientes"&&(
              <LibIngredientes
                library={library} libSearch={libSearch} setLibSearch={setLibSearch}
                editMode={editMode} addLib={addLib} upLib={upLib} upLibC={upLibC} delLib={delLib}
                addFromLib={addFromLib} setMainTab={setMainTab}
                t={t} A={A} BD={BD} BG={BG} GR={GR} MU={MU} DK={DK} MI={MI}
              />
            )}
          </div>
        )}

        {mainTab==="config"&&(
          <ConfigSettings
            savedConfigs={savedConfigs}
            onSaveSnapshot={saveSnapshot}
            onLoadSnapshot={loadSnapshot}
            onDeleteSnapshot={id=>setSavedConfigs(cs=>cs.filter(c=>c.id!==id))}
            onResetToFactory={resetToFactory}
            A={A} AL={AL} BD={BD} BG={BG} MU={MU} DK={DK} MI={MI} t={t}
          />
        )}

      </div>

      {showPicker&&(
        <IngPicker library={library} t={t}
          onSelect={handlePickerSelect}
          onAddNew={handlePickerAddNew}
          onClose={()=>setShowPicker(false)}/>
      )}
      {showNewIng&&(
        <NewIngModal t={t}
          onConfirm={handleNewIngConfirm}
          onCancel={()=>setShowNewIng(false)}/>
      )}

      {/* Floating action buttons */}
      <div style={{position:"fixed",bottom:"20px",right:"16px",display:"flex",flexDirection:"column",gap:"10px",zIndex:300}}>
        <button
          onClick={()=>{setNotesGlobal(false);setShowNotes(true);}}
          title={t.notes}
          style={{width:"44px",height:"44px",borderRadius:"50%",background:"#fff",color:MI,border:"1px solid "+BD,fontSize:"17px",cursor:"pointer",boxShadow:"0 2px 10px rgba(0,0,0,0.10)",display:"flex",alignItems:"center",justifyContent:"center",transition:"transform 0.15s"}}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
          📝
        </button>
      </div>

      {/* Notes panel */}
      {showNotes&&(
        <NotesPanel
          recipeIdx={notesGlobal?null:activeIdx}
          recipeTitle={r.title}
          onClose={()=>setShowNotes(false)}/>
      )}

      {/* PDF options modal */}
      {showPdfOpts&&(
        <PdfOptionsModal
          mode={pdfMode}
          recipeName={r.title}
          t={t}
          onConfirm={secs=>{setShowPdfOpts(false);exportPdf(pdfMode,secs);}}
          onCancel={()=>setShowPdfOpts(false)}/>
      )}

      {/* New recipe modal */}
      {showNewModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}
          onClick={e=>{if(e.target===e.currentTarget)setShowNewModal(false);}}>
          <div style={{background:"#fff",borderRadius:"16px",width:"100%",maxWidth:"480px",boxShadow:"0 20px 60px rgba(0,0,0,0.2)",overflow:"hidden"}}>
            {/* Header */}
            <div style={{padding:"20px 24px 16px",borderBottom:"1px solid "+BD,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{fontSize:"16px",fontWeight:"700",color:DK}}>{t.newRecipeTitle}</div>
                <div style={{fontSize:"12px",color:MU,marginTop:"2px"}}>{t.newRecipeSubtitle}</div>
              </div>
              <button onClick={()=>setShowNewModal(false)} style={{background:"none",border:"none",fontSize:"18px",cursor:"pointer",color:MU,lineHeight:1}}>✕</button>
            </div>
            {/* Form */}
            <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:"14px",maxHeight:"65vh",overflowY:"auto"}}>
              {/* Nombre */}
              <div>
                <label style={{fontSize:"11px",fontWeight:"600",color:MU,textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:"5px"}}>{t.fieldName}</label>
                <input
                  autoFocus
                  value={newForm.title}
                  onChange={e=>setNewForm(f=>({...f,title:e.target.value}))}
                  placeholder={t.phTitle}
                  style={{width:"100%",padding:"9px 12px",border:"1.5px solid "+(newForm.title?"#e2e8f0":BD),borderRadius:"8px",fontSize:"14px",fontFamily:"inherit",boxSizing:"border-box",outline:"none",transition:"border 0.15s"}}
                  onFocus={e=>e.target.style.borderColor=A}
                  onBlur={e=>e.target.style.borderColor=newForm.title?"#e2e8f0":BD}
                />
              </div>
              {/* Subtítulo */}
              <div>
                <label style={{fontSize:"11px",fontWeight:"600",color:MU,textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:"5px"}}>{t.fieldSubtitle}</label>
                <input
                  value={newForm.subtitle}
                  onChange={e=>setNewForm(f=>({...f,subtitle:e.target.value}))}
                  placeholder={t.phSubtitle}
                  style={{width:"100%",padding:"9px 12px",border:"1.5px solid "+BD,borderRadius:"8px",fontSize:"14px",fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}
                  onFocus={e=>e.target.style.borderColor=A}
                  onBlur={e=>e.target.style.borderColor=BD}
                />
              </div>
              {/* Categoría + Tag */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
                <div>
                  <label style={{fontSize:"11px",fontWeight:"600",color:MU,textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:"5px"}}>{t.fieldCategory}</label>
                  <select
                    value={newForm.categoria}
                    onChange={e=>setNewForm(f=>({...f,categoria:e.target.value}))}
                    style={{width:"100%",padding:"9px 12px",border:"1.5px solid "+BD,borderRadius:"8px",fontSize:"13px",fontFamily:"inherit",background:"#fff",boxSizing:"border-box",outline:"none",cursor:"pointer"}}
                    onFocus={e=>e.target.style.borderColor=A}
                    onBlur={e=>e.target.style.borderColor=BD}>
                    {categories.map(c=><option key={c} value={c}>{tCat(t,c)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{fontSize:"11px",fontWeight:"600",color:MU,textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:"5px"}}>{t.fieldTag}</label>
                  <input
                    value={newForm.tag}
                    onChange={e=>setNewForm(f=>({...f,tag:e.target.value}))}
                    placeholder={t.phTag}
                    style={{width:"100%",padding:"9px 12px",border:"1.5px solid "+BD,borderRadius:"8px",fontSize:"13px",fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}
                    onFocus={e=>e.target.style.borderColor=A}
                    onBlur={e=>e.target.style.borderColor=BD}
                  />
                </div>
              </div>
              {/* Peso pieza + Merma */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
                <div>
                  <label style={{fontSize:"11px",fontWeight:"600",color:MU,textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:"5px"}}>{t.fieldWeight}</label>
                  <input
                    type="number" min="0"
                    value={newForm.pesoPieza}
                    onChange={e=>setNewForm(f=>({...f,pesoPieza:Number(e.target.value)}))}
                    style={{width:"100%",padding:"9px 12px",border:"1.5px solid "+BD,borderRadius:"8px",fontSize:"13px",fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}
                    onFocus={e=>e.target.style.borderColor=A}
                    onBlur={e=>e.target.style.borderColor=BD}
                  />
                </div>
                <div>
                  <label style={{fontSize:"11px",fontWeight:"600",color:MU,textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:"5px"}}>{t.fieldLoss}</label>
                  <input
                    type="number" min="0" max="100"
                    value={newForm.merma}
                    onChange={e=>setNewForm(f=>({...f,merma:Number(e.target.value)}))}
                    style={{width:"100%",padding:"9px 12px",border:"1.5px solid "+BD,borderRadius:"8px",fontSize:"13px",fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}
                    onFocus={e=>e.target.style.borderColor=A}
                    onBlur={e=>e.target.style.borderColor=BD}
                  />
                </div>
              </div>
              {/* Precio + Tiempo */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
                <div>
                  <label style={{fontSize:"11px",fontWeight:"600",color:MU,textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:"5px"}}>{t.fieldPrice}</label>
                  <input
                    type="number" min="0" step="0.01"
                    value={newForm.precio}
                    onChange={e=>setNewForm(f=>({...f,precio:Number(e.target.value)}))}
                    style={{width:"100%",padding:"9px 12px",border:"1.5px solid "+BD,borderRadius:"8px",fontSize:"13px",fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}
                    onFocus={e=>e.target.style.borderColor=A}
                    onBlur={e=>e.target.style.borderColor=BD}
                  />
                </div>
                <div>
                  <label style={{fontSize:"11px",fontWeight:"600",color:MU,textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:"5px"}}>{t.fieldTime}</label>
                  <input
                    value={newForm.tiempoElaboracion}
                    onChange={e=>setNewForm(f=>({...f,tiempoElaboracion:e.target.value}))}
                    placeholder={t.phTime}
                    style={{width:"100%",padding:"9px 12px",border:"1.5px solid "+BD,borderRadius:"8px",fontSize:"13px",fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}
                    onFocus={e=>e.target.style.borderColor=A}
                    onBlur={e=>e.target.style.borderColor=BD}
                  />
                </div>
              </div>
              {/* Cocción + Conservación */}
              <div>
                <label style={{fontSize:"11px",fontWeight:"600",color:MU,textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:"5px"}}>{t.fieldBaking}</label>
                <input
                  value={newForm.baking}
                  onChange={e=>setNewForm(f=>({...f,baking:e.target.value}))}
                  placeholder={t.phBaking}
                  style={{width:"100%",padding:"9px 12px",border:"1.5px solid "+BD,borderRadius:"8px",fontSize:"13px",fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}
                  onFocus={e=>e.target.style.borderColor=A}
                  onBlur={e=>e.target.style.borderColor=BD}
                />
              </div>
              <div>
                <label style={{fontSize:"11px",fontWeight:"600",color:MU,textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:"5px"}}>{t.fieldConservation}</label>
                <input
                  value={newForm.conservation}
                  onChange={e=>setNewForm(f=>({...f,conservation:e.target.value}))}
                  placeholder={t.phConservation}
                  style={{width:"100%",padding:"9px 12px",border:"1.5px solid "+BD,borderRadius:"8px",fontSize:"13px",fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}
                  onFocus={e=>e.target.style.borderColor=A}
                  onBlur={e=>e.target.style.borderColor=BD}
                />
              </div>
            </div>
            {/* Footer */}
            <div style={{padding:"16px 24px",borderTop:"1px solid "+BD,display:"flex",gap:"8px",justifyContent:"flex-end"}}>
              <button onClick={()=>setShowNewModal(false)} style={{padding:"9px 18px",background:"#f1f5f9",color:DK,border:"none",borderRadius:"8px",fontSize:"13px",fontWeight:"600",cursor:"pointer",fontFamily:"inherit"}}>{t.cancel}</button>
              <button
                disabled={!newForm.title.trim()||newSaving}
                onClick={async()=>{
                  if(!newForm.title.trim()) return;
                  setNewSaving(true);
                  pushUndo(recipes,globalInd,library);
                  const n={...newForm,foto:null,process:[],ingredients:[],steps:[]};
                  const newIdx=recipes.length;
                  let newRec=n;
                  try { const {data}=await supabase.from("recipes").insert(toDb(n,newIdx)).select().maybeSingle(); if(data) newRec=fromDb(data); } catch(e){}
                  setRecipes(rs=>[...rs,newRec]);
                  setActive(newIdx);
                  setMainTab("activa");
                  setEdit(true);
                  setShowNewModal(false);
                  setNewSaving(false);
                }}
                style={{padding:"9px 20px",background:newForm.title.trim()&&!newSaving?A:"#cbd5e1",color:"#fff",border:"none",borderRadius:"8px",fontSize:"13px",fontWeight:"700",cursor:newForm.title.trim()&&!newSaving?"pointer":"not-allowed",fontFamily:"inherit",transition:"background 0.15s"}}>
                {newSaving?(t.creating||"Guardando…"):(t.createRecipe||"Crear receta")}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
