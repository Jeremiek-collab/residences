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
    videoUrl: "/residence-2/video_flammes.mp4",
    imageUrl: "/residence-2/chambre_2.jpg",
    images: [
      "/residence-2/chambre_2.jpg",
      "/residence-2/salon_2.jpg",
      "/residence-2/photo_3.jpeg"
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
    videoUrl: "/residence-3/video_main.mp4",
    imageUrl: "/residence-3/photo_1.jpeg",
    images: [
      "/residence-3/photo_1.jpeg",
      "/residence-3/photo_3.jpg",
      "/residence-3/photo_2.jpg",
      "/residence-3/photo_4.jpeg"
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
    videoUrl: "/residence-4/video_main.mp4",
    imageUrl: "/residence-4/photo_1.jpeg",
    images: [
      "/residence-4/photo_1.jpeg",
      "/residence-4/photo_2.jpg",
      "/residence-4/photo_3.jpg",
      "/residence-4/photo_4.jpg",
      "/residence-4/photo_5.jpg"
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
    videoUrl: "/residence-5/video_main.mp4",
    imageUrl: "/residence-5/photo_1.jpg",
    images: [
      "/residence-5/photo_1.jpg",
      "/residence-5/photo_2.jpg",
      "/residence-5/photo_3.jpg"
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
    videoUrl: "/residence-6/video_main.mp4",
    imageUrl: "/residence-6/photo_1.jpeg",
    images: [
      "/residence-6/photo_1.jpeg"
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
    videoUrl: "/residence-7/video_main.mp4",
    imageUrl: "/residence-7/photo_1.jpg",
    images: [
      "/residence-7/photo_1.jpg",
      "/residence-7/photo_2.jpg"
    ]
  }
];
