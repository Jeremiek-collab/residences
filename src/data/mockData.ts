export interface Villa {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  pricePerNight: number; // in FCFA
  capacity: number; // Max travelers
  bedrooms: number;
  bathrooms: number;
  location: string;
  featured: boolean;
  amenities: string[];
  videoUrl: string;
  imageUrl: string; // Stock visual backup
  images: string[]; // Gallery images list
}

export const mockVillas: Villa[] = [
  {
    id: "residence-2",
    title: "Résidence 02",
    subtitle: "Prestige et Horizon Infini",
    description: "Située à Jacqueville au quartier Millionnaire Est, cette agréable chambre vous accueille dans un cadre calme et reposant. Parfaite pour se détendre à deux le temps d'un week-end, elle bénéficie d'une climatisation, d'une télévision HD, d'un chauffe-eau, d'une connexion Wi-Fi haut débit et d'un confort absolu.",
    pricePerNight: 30000,
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    location: "Jacqueville, Quartier Millionnaire Est",
    featured: true,
    amenities: ["Wi-Fi Haut Débit", "Climatisation", "Télévision HD", "Chauffe-eau", "Cuisine équipée"],
    videoUrl: "/résidence 2/l_objet_pour_faire_les_flammes.mp4",
    imageUrl: "/résidence 2/chambre_2.jpg",
    images: [
      "/résidence 2/chambre_2.jpg",
      "/résidence 2/salon_2.jpg",
      "/résidence 2/photo_2026-07-30 22.45.11.jpeg"
    ]
  },
  {
    id: "residence-3",
    title: "Résidence 03",
    subtitle: "Calme, Luxe et Volupté",
    description: "Offrez-vous une escapade romantique dans cette charmante résidence climatisée située au quartier Millionnaire Est à Jacqueville. Elle dispose de tout le confort moderne avec Wi-Fi haut débit, télévision HD, chauffe-eau et une salle d'eau privative.",
    pricePerNight: 30000,
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    location: "Jacqueville, Quartier Millionnaire Est",
    featured: true,
    amenities: ["Wi-Fi Haut Débit", "Climatisation", "Télévision HD", "Chauffe-eau", "Cuisine équipée"],
    videoUrl: "/résidence 3/2026-07-31 19.25.32.mp4",
    imageUrl: "/résidence 3/WhatsApp Image 2026-07-27 at 22.04.28.jpeg",
    images: [
      "/résidence 3/WhatsApp Image 2026-07-27 at 22.04.28.jpeg",
      "/résidence 3/5999023192082680835_121.jpg",
      "/résidence 3/5994683552831835326_121.jpg",
      "/résidence 3/WhatsApp Image 2026-07-27 at 22.04.27 (2).jpeg"
    ]
  },
  {
    id: "residence-4",
    title: "Résidence 04",
    subtitle: "Confort Supérieur & Double Climatisation",
    description: "Située au quartier Millionnaire Est à Jacqueville, cette superbe résidence est entièrement doublement climatisée pour une fraîcheur optimale. Équipée du Wi-Fi haut débit, d'une télévision HD, d'un chauffe-eau et d'une cuisine équipée, elle offre un cadre parfait pour vos séjours.",
    pricePerNight: 35000,
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    location: "Jacqueville, Quartier Millionnaire Est",
    featured: true,
    amenities: ["Double Climatisation", "Wi-Fi Haut Débit", "Télévision HD", "Chauffe-eau", "Cuisine équipée"],
    videoUrl: "/résidence 4/2026-08-01 23.06.39.mp4",
    imageUrl: "/résidence 4/WhatsApp Image 2026-07-27 at 22.03.24.jpeg",
    images: [
      "/résidence 4/WhatsApp Image 2026-07-27 at 22.03.24.jpeg",
      "/résidence 4/5999023192082680856_121.jpg",
      "/résidence 4/5999023192082680859_121.jpg",
      "/résidence 4/5999023192082680862_121.jpg",
      "/résidence 4/5999023192082680869_121.jpg"
    ]
  },
  {
    id: "residence-5",
    title: "Résidence 05",
    subtitle: "Le Prestige & Double Climatisation",
    description: "Bénéficiant d'un cadre d'exception au quartier Millionnaire Est à Jacqueville, cette résidence de standing est équipée d'une double climatisation. Elle met à votre disposition une télévision HD, un chauffe-eau, du Wi-Fi haut débit et une cuisine moderne.",
    pricePerNight: 35000,
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    location: "Jacqueville, Quartier Millionnaire Est",
    featured: true,
    amenities: ["Double Climatisation", "Wi-Fi Haut Débit", "Télévision HD", "Chauffe-eau", "Cuisine équipée", "Canal+"],
    videoUrl: "/résidence 5/2026-08-01 23.38.22.mp4",
    imageUrl: "/résidence 5/5999023192082680852_121.jpg",
    images: [
      "/résidence 5/5999023192082680852_121.jpg",
      "/résidence 5/5999023192082680853_121.jpg",
      "/résidence 5/5999023192082680857_121.jpg"
    ]
  },
  {
    id: "residence-6",
    title: "Résidence 06",
    subtitle: "Cadre Paisible et Modernité",
    description: "Située au quartier Millionnaire Est à Jacqueville, cette résidence moderne et lumineuse offre tout le confort nécessaire pour un séjour reposant. Elle comprend le Wi-Fi haut débit, la climatisation, une télévision HD et un chauffe-eau.",
    pricePerNight: 30000,
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    location: "Jacqueville, Quartier Millionnaire Est",
    featured: false,
    amenities: ["Wi-Fi Haut Débit", "Climatisation", "Télévision HD", "Chauffe-eau", "Cuisine moderne"],
    videoUrl: "/résidence 6/2026-08-01 23.55.30.mp4",
    imageUrl: "/résidence 6/WhatsApp Image 2026-07-27 at 22.04.29 22.51.03.jpeg",
    images: [
      "/résidence 6/WhatsApp Image 2026-07-27 at 22.04.29 22.51.03.jpeg"
    ]
  },
  {
    id: "residence-7",
    title: "Résidence 07",
    subtitle: "Retraite Intime & Élégante",
    description: "Une charmante résidence tout confort à 25 000 FCFA/nuit, située au quartier Millionnaire Est à Jacqueville. Équipée d'une climatisation, d'une connexion Wi-Fi stable, d'une télévision HD et d'un chauffe-eau, c'est l'adresse idéale pour le calme et la sérénité.",
    pricePerNight: 25000,
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    location: "Jacqueville, Quartier Millionnaire Est",
    featured: false,
    amenities: ["Wi-Fi Haut Débit", "Climatisation", "Télévision HD", "Chauffe-eau", "Cuisine équipée"],
    videoUrl: "/résidence 7/2026-08-02 19.02.36.mp4",
    imageUrl: "/résidence 7/5999023192082680842_121.jpg",
    images: [
      "/résidence 7/5999023192082680842_121.jpg",
      "/résidence 7/5999023192082680841_121-2.jpg"
    ]
  }
];
