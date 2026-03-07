import i18next from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // Navigation
      home: "Home",
      about: "About",
      servicesNav: "Services",
      contactNav: "Contact",
      complaintsBook: "Complaints Book",

      // Hero
      welcome: "Welcome to",
      subtitle: "Your Clinic and Parapharmacy",
      heroTagline: "Healthcare excellence in the heart of the Algarve",
      bookNow: "Call to make an Appointment",
      learnMore: "Learn More",

      // Section titles
      services: "Services",
      schedule: "Specialist Schedule",
      location: "Location",
      contact: "Contact",
      hours: "Opening Hours",
      ourSpecialists: "Specialists",
      ourServices: "Services",

      // Hours
      weekdays: "Monday - Friday: 9:00 - 19:00",
      weekends: "Saturday: 9:00 - 13:00",
      openNow: "Open Now",
      closedNow: "Closed",

      // Facility
      parapharmacy: "Parapharmacy",
      specialists: "Specialist Rooms",
      address: "Localidade Vales, 8670-158 Aljezur",
      specialistRooms: "5 Modern Specialist Rooms",
      featuringRotation:
        "featuring a rotation of the best practitioners of the Algarve",
      specialistsDesc:
        "Our facility features state-of-the-art rooms for pediatrics, physiotherapy, chiropractic care, psychiatry, Chinese medicine, and massage therapy.",
      modern: "Modern Facilities",
      modernDesc:
        "Experience healthcare in our newly built, state-of-the-art facility",

      // Contact / Booking
      scheduleContactInfo:
        "To make a reservation, please call our clinic at:",
      pharmacyEmail: "Parapharmacy",
      clinicEmail: "Clinic",
      license: "License",
      whatsappMessagePrefix: "or message us on",
      whatsappMessageSuffix: "by clicking here",
      whatsappToBook: "WhatsApp",
      callToBook: "+351 914 030 944",

      // Schedule / Filter
      specialistSchedule: "Specialist Schedule",
      specialist: "Specialist",
      specialty: "Specialty",
      date: "Date",
      availability: "Availability",
      listView: "List View",
      calendarView: "Calendar View",
      viewSchedule: "View Schedule",
      noAppointments: "No appointments scheduled",
      filterBySpecialist: "Filter by Specialist",
      filterBySpecialty: "Filter by Specialty",
      allSpecialists: "All Specialists",
      allSpecialties: "All Specialties",
      filterBySpecialtyHeading: "Click to filter by Specialty",
      filterByServiceHeading: "Click to filter by Service",
      activeFilters: "Active filters:",
      clearFilters: "Clear all",

      // Specialties
      pediatrics: "Pediatrics",
      physiotherapy: "Physiotherapy",
      psychiatry: "Psychiatry",
      chineseMedicine: "Chinese Medicine",
      massageTherapy: "Massage Therapy",

      // Details / Bio
      seeMore: "See more",
      seeLess: "See less",
      biography: "Biography",
      aboutSpecialist: "About the Specialist",
      loadingSpecialistDetails: "Loading specialist details...",
      errorLoadingDetails: "Error loading specialist details",

      // Instagram
      seeMoreOnInstagram:
        "See more details on the Practitioners on our Instagram",

      // Misc
      stateOfArt: "State-of-the-art facilities and equipment",
      pharmacyDetails: "Pharmacy Details",
      pharmacyLogo: "Pharmacy Logo",
      "Monday - Friday": "Monday - Friday",
      "Monday to Sunday": "Monday to Sunday",
      "works a week": "works a week",
      "works all week": "works all week",
      "chinese medicine": "Chinese Medicine",
      "massage therapy": "Massage Therapy",

      // About page
      aboutTitle: "About Setor Saúde",
      aboutSubtitle: "Modern healthcare in the heart of Aljezur, Algarve",
      ourStory: "Our Story",
      facilities: "Our Facilities",
      facilitiesDesc:
        "5 state-of-the-art specialist rooms, a modern parapharmacy counter, and a welcoming reception area.",

      // Contact page
      contactTitle: "Contact Us",
      contactSubtitle: "We're here to help",
      phone: "Phone",
      email: "Email",
      addressLabel: "Address",
      findUs: "Find Us",
      getDirections: "Get Directions",
      sendMessage: "Send Message",

      // Footer
      allRightsReserved: "All rights reserved",
      developedBy: "Developed by",
      privacyPolicy: "Privacy Policy",
      termsConditions: "Terms & Conditions",
    },
  },
  pt: {
    translation: {
      // Navigation
      home: "Início",
      about: "Sobre",
      servicesNav: "Serviços",
      contactNav: "Contactos",
      complaintsBook: "Livro de Reclamações",

      // Hero
      welcome: "Bem-vindo ao",
      subtitle: "A sua Clínica e Parafarmácia",
      heroTagline: "Excelência em saúde no coração do Algarve",
      bookNow: "Ligue para marcar consulta",
      learnMore: "Saber Mais",

      // Section titles
      services: "Serviços",
      schedule: "Horário dos Especialistas",
      location: "Localização",
      contact: "Contactos",
      hours: "Horário de Funcionamento",
      ourSpecialists: "Especialistas",
      ourServices: "Serviços",

      // Hours
      weekdays: "Segunda - Sexta: 9:00 - 19:00",
      weekends: "Sábado: 9:00 - 13:00",
      openNow: "Aberto Agora",
      closedNow: "Fechado",

      // Facility
      parapharmacy: "Parafarmácia",
      specialists: "Salas de Especialistas",
      address: "Localidade Vales, 8670-158 Aljezur",
      specialistRooms: "5 Salas Modernas para Especialistas",
      featuringRotation:
        "apresentando uma rotação dos melhores profissionais do Algarve",
      specialistsDesc:
        "Nossa instalação possui salas modernas para pediatria, fisioterapia, quiropraxia, psiquiatria, medicina chinesa e massagem.",
      modern: "Instalações Modernas",
      modernDesc:
        "Experimente cuidados de saúde em nossa instalação nova e moderna",

      // Contact / Booking
      scheduleContactInfo:
        "Para fazer uma reserva, ligue para nossa clínica:",
      pharmacyEmail: "Parafarmácia",
      clinicEmail: "Clínica",
      license: "Licença",
      whatsappMessagePrefix: "ou envie-nos uma mensagem no",
      whatsappMessageSuffix: "clicando aqui",
      whatsappToBook: "WhatsApp",
      callToBook: "+351 914 030 944",

      // Schedule / Filter
      specialistSchedule: "Agenda de Especialistas",
      specialist: "Especialista",
      specialty: "Especialidade",
      date: "Data",
      availability: "Disponibilidade",
      listView: "Vista em Lista",
      calendarView: "Vista em Calendário",
      viewSchedule: "Ver Agenda",
      noAppointments: "Sem consultas agendadas",
      filterBySpecialist: "Filtrar por Especialista",
      filterBySpecialty: "Filtrar por Especialidade",
      allSpecialists: "Todos os Especialistas",
      allSpecialties: "Todas as Especialidades",
      filterBySpecialtyHeading: "Clique para filtrar por Especialidade",
      filterByServiceHeading: "Clique para filtrar por Serviço",
      activeFilters: "Filtros ativos:",
      clearFilters: "Limpar todos",

      // Specialties
      pediatrics: "Pediatria",
      physiotherapy: "Fisioterapia",
      psychiatry: "Psiquiatria",
      chineseMedicine: "Medicina Chinesa",
      massageTherapy: "Massagem Terapêutica",

      // Details / Bio
      seeMore: "Ver mais",
      seeLess: "Ver menos",
      biography: "Biografia",
      aboutSpecialist: "Sobre o Especialista",
      loadingSpecialistDetails: "Carregando detalhes do especialista...",
      errorLoadingDetails: "Erro ao carregar detalhes",

      // Instagram
      seeMoreOnInstagram:
        "Veja mais detalhes sobre os Profissionais em nosso Instagram",

      // Misc
      stateOfArt: "Instalações e equipamentos modernos",
      pharmacyDetails: "Detalhes da Farmácia",
      pharmacyLogo: "Logo da Farmácia",
      "Monday - Friday": "Segunda - Sexta",
      "Monday to Sunday": "Segunda a Domingo",
      "works a week": "trabalha durante a semana",
      "works all week": "trabalha toda a semana",
      "chinese medicine": "Medicina Chinesa",
      "massage therapy": "Massagem Terapêutica",

      // About page
      aboutTitle: "Sobre Setor Saúde",
      aboutSubtitle: "Saúde moderna no coração de Aljezur, Algarve",
      ourStory: "A Nossa História",
      facilities: "As Nossas Instalações",
      facilitiesDesc:
        "5 salas de especialistas modernas, um balcão de parafarmácia moderno e uma área de receção acolhedora.",

      // Contact page
      contactTitle: "Contacte-nos",
      contactSubtitle: "Estamos aqui para ajudar",
      phone: "Telefone",
      email: "Email",
      addressLabel: "Morada",
      findUs: "Encontre-nos",
      getDirections: "Obter Direções",
      sendMessage: "Enviar Mensagem",

      // Footer
      allRightsReserved: "Todos os direitos reservados",
      developedBy: "Desenvolvido por",
      privacyPolicy: "Política de Privacidade",
      termsConditions: "Termos e Condições",
    },
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: "pt",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// Ensure document lang attribute matches the default language
if (typeof document !== "undefined") {
  document.documentElement.lang = i18next.language || "pt";
  i18next.on("languageChanged", (lng) => {
    document.documentElement.lang = lng;
  });
}

export default i18next;
