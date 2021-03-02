const main = () => {
  const suggestions = {
    location: [
      'Maison abandonnée',
      'Sas de décompression',
      "Porte d'embarquement",
      'Ambulance',
      "Magasin d'antiquités",
      'Fusée',
      'Apple Store',
      "Salle de jeux d'arcade",
      'Camp de base arctique',
      "Studio d'artiste",
      'Grenier',
      'Garçonnière',
      'Balcon',
      'Piscine à boules',
      'Banque',
      'Coffre-fort',
      'Sous-sol',
      'Repaire de superhéros',
      'Plage',
      'Chambre',
      'Rack à vélos',
      'Magasin de vélos',
      'Salle de billard',
      "Sanctuaire d'oiseaux",
      'Quai',
      'Jardin botanique',
      'Allée de bowling',
      'Ring de boxe',
      'Brasserie',
      'Magasin en gros',
      'Bus',
      'Arrêt de bus',
      'Boucherie',
      'Café',
      'Terrain de camping',
      'Confiserie',
      "Exposition d'automobiles",
      'Grotte',
      'Laboratoire CERN',
      "Cabine d'essayage",
      'Laboratoire de chimie',
      "Club d'échecs",
      'Salle de classe',
      'Cabine de pilotage',
      'Chambre froide',
      'Salle de tribunal',
      'Microbrasserie',
      'Salle de danse',
      'Ruelle sombre',
      'Dépanneur',
      'Dortoir',
      'Cabinet de médecin',
      'Allée de garage',
      'Pub irlandais',
      "Conseil d'administration",
      'Bunker',
      'Restaurant 5 étoiles',
      'Studio de mode',
      'Marché aux puces',
      'Fleuriste',
      'Camion-restaurant',
      'Magasin de jeux vidéo',
      'Garage',
      'Terrain de golf',
      'Serre de culture',
      'Salon de coiffure',
      'Grange',
      "Casiers d'école",
      'Calèche',
      'Stand de hot dog',
      'Jacuzzi',
      "Hall d'hôtel",
      "Toit d'une maison",
      'Centrale électrique',
      'Cabane de pêche',
      'Cellule de prison',
      'Bijouterie',
      'Chenil',
      'Table des enfants',
      'Cuisine',
      'Toilettes de femmes',
      "Cabinet d'avocat",
      'Bibliothèque',
      'Canot de sauvetage',
      'Limousine',
      "Magasin d'alcool",
      'Grotte',
      'Appartement à Manhattan',
      'Toilettes pour hommes',
      'Tente militaire',
      'Minivan',
      'Monastère',
      'Morgue',
      'Plateau de tournage',
      'Camion de déménagement',
      'Salle de musée',
      "Entrepôt d'un musée",
      'Observatoire',
      "Salle d'opération",
      'Bureau Oval',
      'Appartement-terrasse',
      'Photomaton',
      'Cour de récréation',
      'Salle de poker',
      'Jet privé',
      'Salle de projection',
      'Piscine publique',
      'Sables mouvants',
      'Studio de radio',
      "Studio d'enregistrement",
      'Ferme sur les toits',
      'Barque',
      'Saloon',
      'Sauna',
      'Plage isolée',
      'Donjon SM',
      'Conteneur',
      'Magasin de chaussures',
      'Bar de rencontres',
      'Skate Park',
      'Chalet de ski',
      'Squat',
      'Étable',
      'Loges de star',
      'Espace de stockage',
      'Wagon de métro',
      'Atelier clandestin',
      'Chez le tailleur',
      'Salon de thé',
      'Salle des professeurs',
      'Court de tennis',
      'Terrasse',
      'Salle du Trône',
      'Châlet',
      'Chambre de torture',
      'Caravane',
      'Vernissage',
      'Boutique vintage',
      'Carré VIP',
      "Salle d'attente",
      'Garde-robe',
      'Salle de musculation',
      'Bateau de rafting',
      'Cave à vins',
      'Atelier',
      'Tranchée',
      'Salle de yoga',
      'Sous un pont',
      'Temple',
      'Gare',
      'Dojo',
      'Château-fort',
      'Manoir',
      "Chambre d'hôtel",
      'Vaisseau spatial',
      "Salle d'urgence",
      'Mairie',
      "Kiosque d'information",
    ],
    relationship: [
      'Pilote de vaisseau/Intelligence artificielle',
      "Passagers d'un avion",
      'Ambassadeur/Roi',
      'Archiviste/Chercheur',
      "Trafiquant d'arme/Parent",
      'Astronaute/Chef de mission',
      'Astronome/Météorologiste',
      'Auteur/Éditeur',
      'Bébé/Animal',
      'Babysitter/Nouveau parent',
      'Barman/Client régulier',
      'Barman/Serveur',
      'Ours/Ourson',
      'Forgeron/Cavalier',
      'Marié/Organisateur de mariage',
      'Chauffeur de bus/Client régulier',
      'Caissier/Client',
      'Naufragé/Noix de coco',
      "Chef/Maître d'hôtel",
      'Coach/Arbitre',
      "Chef d'orchestre/1er violon",
      'Cuisinier/Sous-Chef',
      'Cycliste/Conducteur',
      'Dentiste/Patient',
      'Dictateur/Général',
      'Docteur/Assassin',
      'Chef chat/Chef chien',
      'Ambulancier/Policier',
      'Entrepreneur/Banquier',
      'Cadre/Assistant',
      'Fermier/Épouvantail',
      'Capitaine de bateau/Second',
      'Contremaître/Architecte',
      'Garde forestier/Campeur',
      'Chef mafieux/Homme de main',
      'Famille d’accueil/Ado',
      'Jardinier/Garçon de piscine',
      'Coiffeur/Client régulier',
      'Clochard/Vendeur de rue',
      'Otage/Cambrioleur',
      'Cavalier/Vétérinaire',
      'Journaliste/Informateur',
      'Enfant/Parent',
      'Paysagiste/Propriétaire de maison',
      'Chauffeur/Conjoint trophée',
      'Bûcheron/Garde forestier',
      'Maire/Concierge',
      'Sage-femme/Femme enceinte',
      'Millionnaire/Vendeur de bateaux',
      'Conservateur de musée/Politicien',
      'Jeunes mariés',
      'Infirmière/Convalescent',
      'Optométriste/Patient',
      'Parent/Grand-parent',
      'Fêtard/Policier',
      'Personne/Son futur soi',
      "Toiletteur/Propriétaire d'animal",
      'Pharmacien/Client',
      'Photographe/Sujet',
      'Préparateur physique/Acteur',
      'Physicien/Mathématicien',
      'Accordeur de piano/Designer',
      'Pilote/Tour de contrôle',
      'Lanceur/Receveur',
      'Facteur/Livreur UPS',
      'Prince(sse)/Palefrenier',
      'Directeur/Enseignant',
      'Producteur/Artiste',
      'Professeur/Surdoué',
      'Programmeur/Étudiant',
      'Collectionneurs de livres',
      'Explorateurs rivaux',
      'Robot/Son inventeur',
      'Marin/Gardien de phare',
      'Chauffeur de bus/Dernier écolier',
      'Scénariste/Acteur',
      'Sculpteur/Modèle',
      'Vigile/Concierge',
      'Sénateur/Lobbyistes',
      'Vendeur de Skateboard/Ado',
      'Célébrité/Plombier',
      'Conjoint/Décorateur',
      'Conjoint/Beau-parent',
      'Espion(ne)/Entraîneur',
      'Délinquant/Policier en civil',
      'Étudiant/Parent riche',
      'Cascadeur/Réalisateur',
      'Criminel/Garde de prison',
      'Tailleur/Cordonnier',
      'Tatoueur/Perceur',
      'Chauffeur de taxi/Passager',
      "Propriétaire d'équipe/Superstar",
      'Ado/Grand-parent',
      'Adolescent/Parent',
      'Adolescent/Mentor',
      'Operateur téléphonique/Client',
      'Contrôleur de billets/Voyageur',
      'Bourreau/Bouffon',
      'Voyageur/Traducteur',
      'Deux Juges',
      'Deux designers de chaussures',
      'Représentant syndical/PDG',
      'Vampire/Loup-garou',
      'Horloger/Apprenti',
      'Bûcheron/Campeur',
      'Technicien rayons X/Docteur',
      'Beaux-frères ou soeurs',
      'Psy/Ex-patient',
      'Amoureux transis',
      'Touriste/Guide',
      'Adulte/Ami imaginaire',
      'Auteur connu/Admirateur',
    ],
    word: [
      'Abandonné',
      'Académie',
      'Accent',
      'Accepté',
      'Acteur',
      'Dépendance',
      'Aventure',
      'Agent',
      'Aéroport',
      'Aliéné',
      'Seul',
      'Émerveillé',
      'Amusé',
      'Colère',
      'Anonyme',
      'Hymne',
      'Antiquités',
      'Apathie',
      'Architecte',
      'Dispute',
      'Aristocrate',
      'Armure',
      'Armée',
      'Arrivée',
      'Flèche',
      'Artiste',
      'Honteux',
      'Cendres',
      'Astrologie',
      'Atome',
      'Attaque',
      'Auditorium',
      'Répugnance',
      'Bar',
      'Barman',
      'Base-ball',
      'Batman',
      'Chauve-souris',
      'Plage',
      'Haricots',
      'Lit',
      'Entreprise',
      'Bimbo',
      'Biosphère',
      'Naissance',
      'Anniversaire',
      'Amertume',
      'Forgeron',
      'Blond',
      'Sang',
      'Empreinte',
      'Bombe',
      'Botte',
      'Ennuyé',
      'Emprunter',
      'Boston',
      'Boxeur',
      'Caleçon',
      'Salle de repos',
      'Rupture',
      'Mallette',
      'Slip',
      'Tyran',
      'Âne',
      'Cafétéria',
      'Gâteau',
      'Camping',
      'Canyon',
      'Capital',
      'Cartes',
      'Soins',
      'Carrière',
      'Cartographie',
      'Casino',
      'Cimetière',
      'PDG',
      'Président',
      'Chaise',
      'Charité',
      'Fromage',
      'Chimie',
      'Enfants',
      'Chine',
      'Chocolat',
      'Noël',
      'Église',
      'Cercle',
      'Guerre civile',
      'Falaise',
      'Nuages',
      'Club',
      'Cocktail',
      'Code',
      'Café',
      'Collector',
      'Comète',
      'Bandes dessinées',
      'Commerce',
      'Cône',
      'Confession',
      'Confiant',
      'Constitution',
      'Contrat',
      'Cuisinier',
      'Canapé',
      'Pays',
      'Courageux',
      'Tribunal',
      'Cowboy',
      'Vache',
      'Cricket',
      'Critique',
      'Foule',
      'Écraser',
      'Da Vinci',
      'Sombre',
      'Rendez-vous',
      'Débat',
      'Susceptible',
      'Abattu',
      'Démocratie',
      'Dépression',
      'Détective',
      'Détecteur',
      'Détestable',
      'Dévasté',
      'Diamant',
      'Directeur',
      'Désaccord',
      'Disco',
      'Déguisement',
      'Vaisselle',
      'Désillusionné',
      'Consterné',
      'Méprisé',
      'Distant',
      'Nunuche',
      'Diva',
      'Plonger',
      'Divorce',
      'Porte',
      'Dragon',
      'Drogue',
      'Donjon',
      'Poussière',
      'Enthousiaste',
      'Éclipse',
      'Éjecté',
      'Élections',
      'Ascenseur',
      'Éloquence',
      'Embarassé',
      'Vide',
      'Chiffrement',
      'Énergique',
      'Fiancé',
      'Enragé',
      'Urgence',
      'Escalator',
      'Exécution',
      'Bourreau',
      'Exercice',
      'Développer',
      'Expédition',
      'Expérience',
      'Explorer',
      'Juste',
      'Automne',
      'Gloire',
      'Ferme',
      'Combattant',
      'Licencié',
      'Musculation',
      'Marché aux puces',
      'Foie gras',
      'Falsification',
      'Fontaine',
      'Amis',
      'Effrayé',
      'Accompli',
      'Futur',
      'Oies',
      'Génie',
      'Authentique',
      'Géographie',
      'Fantôme',
      'Géant',
      'Abandon',
      'Lunettes',
      'But',
      'Chèvre',
      'Gouvernement',
      'Grammy',
      'Grèce',
      'Garde',
      'Guillotine',
      'Coupable',
      'Pirate',
      'Jambon',
      'Pendaison',
      'Has Been',
      'Chapeau',
      'Hanté',
      'Santé',
      'Coeur',
      'Héros',
      'Hésitant',
      'Dissimuler',
      'Hobby',
      'Itinérant',
      'Hockey',
      'Saint',
      'Accueil',
      'Optimiste',
      'Fer à cheval',
      'Otage',
      'Hostile',
      'Hôtel',
      'Maison',
      'Faim',
      'Ouragan',
      'Mari',
      'Bousculer',
      'Crème glacée',
      'Iceberg',
      'Ignoré',
      'Important',
      'Inadéquat',
      'Infâme',
      'Inférieur',
      'Infiltrer',
      'Furieux',
      'Innocence',
      'Curieux',
      'Précaire',
      'Insignifiant',
      'Inspiré',
      'Intérêt',
      'Internet',
      'Entrevue',
      'Intime',
      'Irrité',
      'Isolé',
      'Japon',
      'Jaloux',
      'Décalage horaire',
      'Jetpack',
      'Emploi',
      'Cavalier',
      'Journalisme',
      'Lutte',
      'Juge',
      'Jugement',
      'Jury',
      'Clé',
      'Cuisine',
      'Chaton',
      'Laser',
      'Lessive',
      'Paresse',
      'Départ',
      'Citron',
      'Laitue',
      'Libéré',
      'Littérature',
      'Prêt',
      'Haine',
      'Médaillon',
      'Logique',
      'Logo',
      'Londres',
      'Amour',
      'Amant',
      'Affectueux',
      'Chanceux',
      'Luxe',
      'Courrier',
      'Centre commercial',
      'Manières',
      "Sirop d'érable",
      'Plans',
      'Marche',
      'Masque',
      'Mathématiques',
      'Matelas',
      'Mediéval',
      'Mental',
      'Immigrant',
      'Lait',
      'Smoothie',
      'Ministre',
      'Monument',
      'Lune',
      'Film',
      'Déplacement',
      'Meurtre',
      'Nature',
      'Négociation',
      'Geek',
      'Journaux',
      'Insensé',
      'Carnet',
      'Serment',
      'Avoine',
      'Jeux Olympiques',
      'Ouvert',
      'Oscar',
      'Hors-la-loi',
      'Lendemain',
      'Envahi',
      'Emballage',
      'Pacte',
      'Peinture',
      'Palais',
      'Boite de Pandore',
      'Papier',
      'Paradoxe',
      'Parent',
      'Morceau',
      'Mot de passe',
      'Patriote',
      'Salaire',
      "Beurre d'arachide",
      'Paysan',
      'Pectoraux',
      'Penalité',
      'Stylo',
      'Pentagone',
      'Point',
      'Perplexe',
      'Physique',
      'Tarte',
      'Planète',
      'Platonique',
      'Joueur',
      'Jouer',
      'Pôle',
      'Politique',
      'Étang',
      'Piscine',
      'Marsouin',
      'Bureau de poste',
      'Pauvreté',
      'Puissant',
      'Impuissant',
      'Grossesse',
      'Préjudice',
      'Présent',
      'Présentation',
      'Président',
      'Fierté',
      'Premier ministre',
      'Prince',
      'Princesse',
      'Prison',
      'Programmation',
      'Propriété',
      'Fierté',
      'Provocant',
      'Provoqué',
      'Psychologie',
      'VTT',
      'Quête',
      'Question',
      'Démission',
      'Radio',
      'Pluie',
      'Rap',
      'Récréation',
      'Arbitre',
      'Réfraction',
      'Reggae',
      'Régime',
      'Archives',
      'Rejeté',
      'Remix',
      'Remords',
      'Répugnant',
      'Irrité',
      'Résident',
      'Respecté',
      'Revanche',
      'Révolté',
      'Révolution',
      'Dégoût',
      'Énigme',
      'Ridicule',
      'Alliance',
      'Rivalité',
      'Rivière',
      'Vedette',
      'Rome',
      'Rorschach',
      'Vendeur',
      'Salon',
      'Samouraï',
      'Sarcastique',
      'Économies',
      'Science-Fiction',
      'Sculpteur',
      'Séduction',
      'Vendu',
      'Sensible',
      'Requin',
      'Shérif',
      'Changeant',
      'Choqué',
      'Petit',
      'Pelle',
      'Épreuve',
      'Douche',
      'Fratrie',
      'Argent',
      'Abdominaux',
      'Sceptique',
      'Sommeil',
      'Sangles',
      'Fumée',
      'Fumer',
      'Savon',
      'Soccer',
      'Rupture de stock',
      'Supersonique',
      'Espace',
      'Vaisseau',
      'Discours',
      'Sphère',
      'Printemps',
      'Espion',
      'Carré',
      'Stade',
      'Taches',
      'Statue',
      'Stérile',
      'Bourse',
      'Orage',
      'Studio',
      'Soustraction',
      'Sucre',
      'Été',
      'Coup de soleil',
      'Coucher de soleil',
      'Chirurgie',
      'Surprise',
      'Méfiant',
      'Épée',
      'Table',
      'Grand',
      'Impôts',
      'Taxonomie',
      'Thé',
      'Adolescent',
      'Télégramme',
      'Tempérament',
      'Apéritif',
      'Soleil',
      'Théâtre',
      'Billets',
      'Chatouilles',
      'Retour en arrière',
      'Fuseau horaire',
      'Pourboire',
      'Titanesque',
      'Tabac',
      'Top secret',
      'Tortue',
      'Serviette',
      'Tracteur',
      'Échanger',
      'Trafic',
      'Piégé',
      'Saccagé',
      'Traumatisme',
      'Trésor',
      'Traitement',
      'Agriculture',
      'Halloween',
      'Trophée',
      'Confiance',
      'Télévision',
      'Jumeaux',
      'Demi-tour',
      'Arbitre',
      'Injuste',
      'Uniforme',
      'Union',
      'Malchance',
      'Déséquilibré ',
      'Majuscule',
      'Courrier recommandé',
      'Aspirateur',
      'Vampire',
      'Vanille',
      'Voûte',
      'Versailles',
      'Jeux vidéo',
      'Méchant',
      'Vintage',
      'Vierge',
      'Vision',
      'Volontaire',
      'Vulnérable',
      'Gaufre',
      'Recherché',
      'Richesse',
      'Armes',
      'Météo',
      'Mariage',
      'Femme',
      'Hiver',
      'Retiré',
      'Spirituel',
      'Coupe du monde',
      'Inquiet',
      'Vain',
      'Première Guerre mondiale',
      'Seconde Guerre mondiale',
      'Nocturne',
      'Somnambule',
      'Funambule',
      'Trapèze',
      'Cirque',
      'Spectacle',
      'Cage',
      'Compartiment',
      'Condiments',
      'Abonnement',
      'Quart',
      'Frange',
      'Cuir',
      'Bottes',
      'Soldes',
      'Slam',
      'Compétition',
      'Poésie',
      'Avancée',
      'Spectaculaire',
      'Admirable',
      'Amiral',
      'Compost',
      'Biologique',
      'Hamster',
      'Fouine',
    ],
  };

  const buttons = document.querySelectorAll('button');

  for (let button of buttons) {
    button.addEventListener('click', getClickEventHandler(suggestions, 19, 30));
  }
};

document.addEventListener('DOMContentLoaded', function () {
  main();
});
