export interface Villa {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  imageUrl: string;
  videoUrl?: string;
  amenities: string[];
  featured?: boolean;
  images: string[];
}

export const mockVillas: Villa[] = [
  {
    id: "residence-1",
    title: "Résidence 01",
    subtitle: "Séjour de Grand Confort",
    description: "Profitez d'un séjour exceptionnel dans cette superbe résidence située au quartier Millionnaire Est à Jacqueville. Elle dispose de la climatisation, du Wi-Fi haut débit, d'une télévision HD et d'un chauffe-eau.",
    pricePerNight: 35000,
    capacity: 4,
    bedrooms: 2,
    bathrooms: 2,
    location: "Jacqueville, Quartier Millionnaire Est",
    featured: true,
    amenities: ["Wi-Fi Haut Débit", "Climatisation", "Télévision HD", "Chauffe-eau", "Cuisine équipée", "Canal+"],
    videoUrl: "/residence-1/video_main.mp4",
    imageUrl: "/residence-1/photo_1.jpg?v=20260813",
    images: [
      "/residence-1/photo_1.jpg",
      "/residence-1/photo_2.jpg",
      "/residence-1/photo_3.jpg",
      "/residence-1/photo_4.jpg",
      "/residence-1/photo_5.jpg"
    ]
  },
  {
    id: "residence-2",
    title: "Résidence 02",
    subtitle: "Élégance et Sérénité",
    description: "Une magnifique résidence à 30 000 FCFA/nuit au quartier Millionnaire Est à Jacqueville. Idéale pour vos vacances ou déplacements professionnels avec Wi-Fi haut débit, climatisation et chauffe-eau.",
    pricePerNight: 30000,
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    location: "Jacqueville, Quartier Millionnaire Est",
    featured: true,
    amenities: ["Wi-Fi Haut Débit", "Climatisation", "Télévision HD", "Chauffe-eau", "Cuisine équipée"],
    videoUrl: "/residence-2/video_main.mp4",
    imageUrl: "/residence-2/photo_1.jpg?v=20260813",
    images: [
      "/residence-2/photo_1.jpg",
      "/residence-2/photo_2.jpg",
      "/residence-2/photo_3.jpg",
      "/residence-2/photo_4.jpg"
    ]
  },
  {
    id: "residence-3",
    title: "Résidence 03",
    subtitle: "Charme et Détente",
    description: "Une résidence spacieuse et chaleureuse située au quartier Millionnaire Est à Jacqueville. Profitez du calme absolu avec tout le confort moderne : climatisation, Wi-Fi haut débit, TV HD et chauffe-eau.",
    pricePerNight: 30000,
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    location: "Jacqueville, Quartier Millionnaire Est",
    featured: true,
    amenities: ["Wi-Fi Haut Débit", "Climatisation", "Télévision HD", "Chauffe-eau", "Cuisine équipée"],
    videoUrl: "/residence-3/video_main.mp4",
    imageUrl: "/residence-3/photo_1.jpg?v=20260813",
    images: [
      "/residence-3/photo_1.jpg",
      "/residence-3/photo_2.jpg",
      "/residence-3/photo_3.jpg"
    ]
  },
  {
    id: "residence-4",
    title: "Résidence 04",
    subtitle: "Cocon Moderne & Douillet",
    description: "Découvrez cette élégante résidence moderne à 35 000 FCFA/nuit au quartier Millionnaire Est à Jacqueville. Équipée d'une climatisation performante, d'un Wi-Fi ultra-rapide, d'une TV HD et d'un chauffe-eau.",
    pricePerNight: 35000,
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    location: "Jacqueville, Quartier Millionnaire Est",
    featured: true,
    amenities: ["Wi-Fi Haut Débit", "Climatisation", "Télévision HD", "Chauffe-eau", "Cuisine équipée"],
    videoUrl: "/residence-4/video_main.mp4",
    imageUrl: "/residence-4/photo_1.jpg?v=20260813",
    images: [
      "/residence-4/photo_1.jpg",
      "/residence-4/photo_2.jpg",
      "/residence-4/photo_3.jpg"
    ]
  },
  {
    id: "residence-5",
    title: "Résidence 05",
    subtitle: "Luxe & Grand Confort",
    description: "Résidence d'exception à 35 000 FCFA/nuit au quartier Millionnaire Est à Jacqueville. Idéale pour se ressourcer en toute quiétude avec double climatisation, Wi-Fi haut débit, TV HD et chauffe-eau.",
    pricePerNight: 35000,
    capacity: 4,
    bedrooms: 2,
    bathrooms: 1,
    location: "Jacqueville, Quartier Millionnaire Est",
    featured: true,
    amenities: ["Double Climatisation", "Wi-Fi Haut Débit", "Télévision HD", "Chauffe-eau", "Cuisine équipée", "Canal+"],
    videoUrl: "/residence-5/video_main.mp4",
    imageUrl: "/residence-5/photo_1.jpg?v=20260813",
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
    imageUrl: "/residence-6/photo_1.jpg?v=20260813",
    images: [
      "/residence-6/photo_1.jpg"
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
    imageUrl: "/residence-7/photo_1.jpg?v=20260813",
    images: [
      "/residence-7/photo_1.jpg",
      "/residence-7/photo_2.jpg"
    ]
  }
];

export const initialBookings: any[] = [
  {
    id: "mock-b1",
    villaId: "residence-2",
    clientName: "Jean-Pierre Kouadio",
    clientEmail: "jp.kouadio@email.com",
    clientPhone: "+225 0707070707",
    startDate: "2026-08-15",
    endDate: "2026-08-18",
    totalPrice: 90000,
    advancePaid: 20000,
    status: "confirmed",
    notes: "Accueil 19h",
    createdAt: "2026-08-01T10:00:00.000Z"
  },
  {
    id: "mock-b2",
    villaId: "residence-3",
    clientName: "Marie-Claire Diallo",
    clientEmail: "mc.diallo@email.com",
    clientPhone: "+225 0505050505",
    startDate: "2026-08-20",
    endDate: "2026-08-24",
    totalPrice: 120000,
    advancePaid: 20000,
    status: "pending",
    notes: "Besoin de chaises bébé.",
    createdAt: "2026-08-02T14:30:00.000Z"
  },
  {
    id: "booking-1785934641676",
    villaId: "residence-6",
    clientName: "Océane Omlim",
    clientEmail: "ocean@gmail.com",
    clientPhone: "05 03 60 83 63",
    startDate: "2026-08-14",
    endDate: "2026-08-15",
    totalPrice: 30000,
    advancePaid: 0,
    status: "pending",
    notes: "",
    createdAt: "2026-08-05T12:57:21.676Z"
  },
  {
    id: "booking-1786359875104",
    villaId: "residence-4",
    clientName: "Djazo",
    clientEmail: "yirekouassi@gmail.com",
    clientPhone: "0787201019",
    startDate: "2026-08-11",
    endDate: "2026-08-15",
    totalPrice: 140000,
    advancePaid: 0,
    status: "confirmed",
    notes: "5 jours de réservation",
    createdAt: "2026-08-10T11:04:35.104Z"
  },
  {
    id: "booking-1785961528986",
    villaId: "residence-5",
    clientName: "Melissa Dakouri",
    clientEmail: "drkouamemelissa@gmail.com",
    clientPhone: "0748158109",
    startDate: "2026-08-07",
    endDate: "2026-08-08",
    totalPrice: 35000,
    advancePaid: 0,
    status: "pending",
    notes: "",
    createdAt: "2026-08-05T20:25:28.986Z"
  },
  {
    id: "booking-1785961405620",
    villaId: "residence-3",
    clientName: "Mélissa",
    clientEmail: "drkouamemelissa@gmail.com",
    clientPhone: "0748158109",
    startDate: "2026-08-07",
    endDate: "2026-08-08",
    totalPrice: 30000,
    advancePaid: 0,
    status: "pending",
    notes: "",
    createdAt: "2026-08-05T20:23:25.620Z"
  },
  {
    id: "booking-1785950907943",
    villaId: "residence-7",
    clientName: "Georgina AKA",
    clientEmail: "akageorginamarieesther@gmail.com",
    clientPhone: "+2250101235006",
    startDate: "2026-08-07",
    endDate: "2026-08-09",
    totalPrice: 50000,
    advancePaid: 0,
    status: "confirmed",
    notes: "",
    createdAt: "2026-08-05T17:28:27.943Z"
  },
  {
    id: "booking-1785942234798",
    villaId: "residence-2",
    clientName: "Kouakou Serge",
    clientEmail: "sergeakouakou@gmail.com",
    clientPhone: "0747096797",
    startDate: "2026-08-06",
    endDate: "2026-08-08",
    totalPrice: 60000,
    advancePaid: 0,
    status: "confirmed",
    notes: "",
    createdAt: "2026-08-05T15:03:54.798Z"
  },
  {
    id: "booking-1785940426410",
    villaId: "residence-4",
    clientName: "Mr Aby",
    clientEmail: "jere@gmail.com",
    clientPhone: "07 07 07 89 40",
    startDate: "2026-08-06",
    endDate: "2026-08-09",
    totalPrice: 105000,
    advancePaid: 0,
    status: "confirmed",
    notes: "",
    createdAt: "2026-08-05T14:33:46.410Z"
  }
];
