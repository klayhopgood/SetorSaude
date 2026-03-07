import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  specialists,
  specialistSchedules,
  services,
  serviceSchedules,
  siteSettings,
} from "../shared/schema";

// ═══════════════════════════════════════════════════════════
// SPECIALIST DATA (from Sheet2 + Sheet1)
// ═══════════════════════════════════════════════════════════

const specialistData = [
  {
    name: "Dr. Guilherme Oliveira",
    specialtyEn: "Hair Medicine",
    specialtyPt: "Medicina Capilar",
    imageUrl: "https://live.staticflickr.com/65535/54322744406_8c0212fb88_q.jpg",
    bioEn: "Guilherme de Oliveira, a graduate in Medicine, works as a general practitioner and also has training and proven experience in hair medicine and transplants. His main focus is to provide the best healthcare for the physical and psychological well-being of the patient",
    bioPt: "Guilherme de Oliveira, graduado em Medicina, exerce funções de clínica geral e também formação e experiência comprovada na medicina e transplante capilar. O seu principal foco é prestar os melhores cuidados de saúde para o bem estar físico e psicológico do utente",
    sortOrder: 1,
    schedules: [
      { dateType: "specific", dateValue: "2026-03-07", availableText: "9:00-13:00" },
    ],
  },
  {
    name: "Sarah Wyld",
    specialtyEn: "Podiatry",
    specialtyPt: "Podologia",
    imageUrl: "https://live.staticflickr.com/65535/54323161520_973be52e39_q.jpg",
    bioEn: `Sarah Wyld is a British Podiatrist, graduating in Podiatric Medicine in 1990 from Cardiff University. She has had over thirty years professional experience in the UK National Health Service, fifteen of those as a surgery lead practitioner.
She remains a member of the Royal College of Podiatry and has Accreditation with the Health Care Professions Council (HCPC) in the UK. She has been practising in Portugal for the last two years and provides footcare treatments for:

• Nail and skin pathologies
• Foot wound care and prevention
• Diabetic foot care and monitoring
• High risk foot management
• Nail surgery under local anaesthesia
• Musculoskeletal conditions and orthotics / insoles`,
    bioPt: `Sarah Wyld é uma podologista britânica, graduada em Podologia em 1990 pela Universidade de Cardiff. Tem mais de trinta anos de experiência profissional no Serviço Nacional de Saúde do Reino Unido, quinze dos quais como médica líder de cirurgia.
Continua a ser membro do Royal College of Podiatry e tem acreditação junto do Health Care Professions Council (HCPC) no Reino Unido. Exerce a sua atividade em Portugal há dois anos e presta cuidados com os pés para:

• Patologias das unhas e da pele
• Cuidados e prevenção de feridas nos pés
• Cuidados e monitorização do pé diabético
• Gestão de pés de alto risco
• Cirurgia ungueal sob anestesia local
• Condições músculo-esqueléticas e órteses/palmilhas`,
    sortOrder: 2,
    schedules: [
      { dateType: "specific", dateValue: "2026-03-10", availableText: "10:00-12:00" },
    ],
  },
  {
    name: "Teresa Ranieri",
    specialtyEn: "Trauma Therapy",
    specialtyPt: "Terapia do Trauma",
    imageUrl: "https://live.staticflickr.com/65535/54322744426_41c53c884b_q.jpg",
    bioEn: `Certified Mindfulness Teacher and TRE (Tension & Trauma Releasing Exercises) provider with over a decade of experience in the mental health field.
With a Master's degree from Bangor University and a certification in TRE, she focuses on helping individuals release deep tension, restore balance, and reconnect with their inner resilience.
Through mindfulness practices and trauma-informed techniques, she empowers people to heal beyond their symptoms and embrace lasting well-being.`,
    bioPt: `Professora certificada de Mindfulness e fornecedora de TRE (Exercícios de Libertação de Tensão e Trauma) com mais de uma década de experiência na área da saúde mental.
Com um mestrado pela Universidade de Bangor e uma certificação em TRE, foca-se em ajudar as pessoas a libertar tensões profundas, restaurar o equilíbrio e reconectar-se com a sua resiliência interior.
Através de práticas de mindfulness e técnicas informadas pelo trauma, ela capacita as pessoas a curar-se para além dos seus sintomas e a abraçar um bem-estar duradouro.`,
    sortOrder: 3,
    schedules: [
      { dateType: "specific", dateValue: "2026-03-07", availableText: "9:00-13:00" },
    ],
  },
  {
    name: "Dr. Victoria Dahl",
    specialtyEn: "General Medicine",
    specialtyPt: "Clínica Geral",
    imageUrl: "https://live.staticflickr.com/65535/54350346485_097f4c0f35_z.jpg",
    bioEn: `Dr. Victoria Dahl is a Norwegian physician who has been working in the Portuguese healthcare system since 2017.

As a general practitioner, she treats adults and children in both illness and preventive care, makes prescriptions, and issues medical statements and certificates, including those for driver's licenses.

In addition to general practice, Dr. Victoria is also trained as a clinical hypnotherapist, integrating mental health and body-mind approaches in the treatment of chronic illnesses. She is open to non-conventional medicine methods, offering a comprehensive, patient-centered approach.`,
    bioPt: `Dra. Victoria Dahl, médica norueguesa a trabalhar no sistema de saúde português desde 2017.

Como clínica geral atende adultos e crianças em situação de doença e prevenção, faz prescrições e emite declarações e certificados médicos, incluindo para carta de condução.

Para além da clínica geral, Drª Victoria tem formação como hipnoterapeuta clínica, integrando saúde mental e abordagens corpo-mente no tratamento de doenças crónicas. Está aberta a métodos de medicina não convencional, proporcionando uma abordagem completa e centrada no paciente.`,
    sortOrder: 4,
    schedules: [
      { dateType: "specific", dateValue: "2026-03-05", availableText: "18:00-19:00" },
      { dateType: "specific", dateValue: "2026-03-06", availableText: "09:30-11:30" },
      { dateType: "specific", dateValue: "2026-03-09", availableText: "13:00-15:00" },
    ],
  },
  {
    name: "Dr. João Pinho",
    specialtyEn: "Pediatrics",
    specialtyPt: "Pediatria",
    imageUrl: "https://live.staticflickr.com/65535/54350379335_7d13dc4f3d_z.jpg",
    bioEn: `Dr. João Paulo Pinho, pediatrician, holds a degree in Medicine from the Faculdade de Medicina de Cádis (Spain) with a specialization in Pediatrics from the Centro Hospitalar Universitário do Algarve, Faro.

His main areas of expertise are:

• General Pediatrics consultations

• Prenatal Pediatrics consultations

He has a special interest in respiratory diseases and Neonatology.

Fluent in Portuguese, English, and Spanish.

Professional experience:

• Pediatric Hospital Assistant (Neonatology Unit) at the Centro Hospitalar Universitário do Algarve, Faro from 2011 to 2012.

• Pediatric Hospital Assistant at the Centro Hospitalar Universitário do Algarve, Portimão from 2012 to 2013.

• Clinical Fellow at the Neonatology Unit of St. Mary's Hospital, London, from March to September 2014.

• Senior Clinical Fellow at the Pediatric Department of Frimley Park Hospital, Surrey – England, from September 2014 to September 2015.

• Senior Clinical Fellow at the Pediatric and Neonatology Department, West Middlesex University Hospital, London, from September 2015 to April 2016.

• General Pediatrician at the Pediatric Department of the Centro hospitalar Universitário do Algarve (Portimão Unit) since April 2016 to present.`,
    bioPt: `Dr. João Paulo Pinho, pediatra, Licenciado em Medicina, pela Faculdade de Medicina de Cádis (Espanha) com Especialidade de Pediatria, no Centro Hospitalar Universitário do Algarve, Faro.

As suas principais áreas de atuação são:

• Consultas de Pediatria geral

• Consulta Pré-Natal de Pediatria

Tem especial Interesse em doenças respiratórias e Neonatologia.

Fluente em Português, Inglês e Espanhol.

Percurso profissional:

• Assistente Hospitalar de Pediatria (Unidade de Neonatologia), Centro Hospitalar Universitário do Algarve, Faro 2011 a 2012.

• Assistente Hospitalar de Pediatria, Centro Hospitalar Universitário do Algarve, Portimão 2012 a 2013.

• Clinical Fellow na Unidade de Neonatologia do St Mary Hospital, Londres, Março a Setembro de 2014.

• Senior Clinical Fellow no Departamento de Pediatria em Frimley Park Hospital, Surrey – Inglaterra, Setembro de 2014 a Setembro de 2015.

• Senior Clinical Fellow no Departamento de Pediatria e Neonatologia, Westmiddlesex Univesity Hospital, Londres, setembro de 2015 a Abril de 2016.

• Pediatra Geral no Departamento de Pediatria do Centro hospitalar Universitário do Algarve (Unidade de Portimão), desde Abril 2016 até a atualidade.`,
    sortOrder: 5,
    schedules: [
      { dateType: "specific", dateValue: "2026-03-27", availableText: "14:30-17:30" },
    ],
  },
  {
    name: "Sara Encarnação",
    specialtyEn: "Psychology",
    specialtyPt: "Psicologia",
    imageUrl: "https://live.staticflickr.com/65535/54349169477_e1d0aca0b8_z.jpg",
    bioEn: `Sara Vieira da Encarnação, Master in Clinical Psychology from the Instituto Universitário de Ciências Psicológicas, Sociais e da Vida (ISPA), Full Member of the Order of Portuguese Psychologists (OPP).

Over the years, she has worked with the elderly in both institutional and community settings, as well as with children and families in situations of social vulnerability. She was part of the CLDS-4G Vila do Bispo program - Local Social Development Contracts - from 2021 to 2023. She is also a member of the Child and Youth Protection Commission of Vila do Bispo (CPCJ). She has experience in volunteering and the Community Food Aid Program.`,
    bioPt: `Sara Vieira da Encarnação, Mestre em Psicologia Clínica pelo Instituto Universitário de Ciências Psicológicas, Sociais e da Vida (ISPA), Membro Efetivo da Ordem dos Psicólogos Portugueses (OPP).

Ao longo dos anos tem trabalhado com idosos, em contexto de instituição e comunitário, e com crianças e famílias em situação de vulnerabilidade social. Integrou o Programa CLDS-4G Vila do Bispo - Contratos Locais de Desenvolvimento Social - entre 2021 e 2023. É membro integrante da Comissão de Proteção de Crianças e Jovens de Vila do Bispo (CPCJ). Tem experiência na área do voluntariado e Programa Comunitário de Ajuda Alimentar.`,
    sortOrder: 6,
    schedules: [
      { dateType: "weekdays", dateValue: null, availableText: "16:30-18:30" },
    ],
  },
  {
    name: "Ana Esteves",
    specialtyEn: "Nutrition",
    specialtyPt: "Nutrição",
    imageUrl: "https://live.staticflickr.com/65535/54350265169_b2c0a552d4_z.jpg",
    bioEn: `Ana Esteves, nutritionist, Master in Clinical Nutrition from the Faculdade de Medicina of the UL. Guest lecturer at the E. Superior da Cruz Vermelha Portuguesa and certified trainer. Member of the Order of Nutritionists 2021N.

She specializes in Clinical Nutrition, focusing on gastrointestinal and cardiovascular diseases, weight management, diabetes, kidney diseases, preconception, pregnancy, and postpartum.

Her goal, by working alongside you, is to help improve your physical and mental health, maintain a healthy relationship with food, and improve your habits and overall quality of life.`,
    bioPt: `Ana Esteves, nutricionista, Mestre em nutrição clínica pela Faculdade de Medicina da UL.
Professora convidada na E. Superior da Cruz Vermelha Portuguesa e formadora certificada. Membro da ordem dos nutricionista 2021N.

É especializada em Nutrição Clínica, com foco em patologias gastrointestinais, cardiovasculares, gestão de peso, diabetes, doenças renais, pré-concepção, gravidez e pós-parto.

Pretende, trabalhando em equipa consigo, ajudar a melhorar a sua saúde física e mental, mantendo uma boa relação com a alimentação, melhorando os seus hábitos e a sua qualidade de vida.`,
    sortOrder: 7,
    schedules: [
      { dateType: "specific", dateValue: "2026-03-05", availableText: "9:00-19:00" },
    ],
  },
  {
    name: "Catarina Francisco",
    specialtyEn: "Osteopathy",
    specialtyPt: "Osteopatia",
    imageUrl: "https://live.staticflickr.com/65535/54350283823_8ec556e7ce_z.jpg",
    bioEn: `Catarina Francisco, graduated in Osteopathy in 2022 from Instituto Piaget (Silves), and holds a postgraduate degree in Pediatric Osteopathy from ESSATLA.

She has a special interest in the fields of pediatrics, women's health, and visceral osteopathy.`,
    bioPt: `Catarina Francisco, Licenciada em Osteopatia desde 2022 pelo Instituto Piaget (Silves), e Pós-Graduada pela ESSATLA em Osteopatia Infantil.

Tem especial interesse nas áreas de pediatria, saúde da mulher e visceral.`,
    sortOrder: 8,
    schedules: [
      { dateType: "specific", dateValue: "2026-03-11", availableText: "10:00-18:00" },
    ],
  },
  {
    name: "Catarina Furtado",
    specialtyEn: "Traditional Chinese Medicine",
    specialtyPt: "Medicina Tradicional Chinesa",
    imageUrl: "https://live.staticflickr.com/65535/54350265179_44681dbddd_z.jpg",
    bioEn: `Catarina Furtado studied Traditional Chinese Medicine at ESMTC.

The course lasted 5 years, and she gained skills in the main areas of Chinese Medicine: Acupuncture, Herbal Medicine, Tui Na Massage, Dietetics, and Chi Kung. She also learned other techniques such as moxibustion, cupping, Reflexology, auriculotherapy, and Gua Sha…

She is focused on healing people holistically, using techniques that allow them to have a good quality of life. She likes people to take control of their lives and bodies, and to that end, she aims to pass on the necessary knowledge so that patients can become autonomous in certain parts of their treatments, learn to better manage their lives, and change behaviors that cause imbalances.`,
    bioPt: `Catarina Furtado, estudou Medicina Tradicional Chinesa na ESMTC.

O curso durou 5 anos e ganhou competências nas principais áreas da Medicina Chinesa: a Acupuntura, Fitoterapia, Massagen Tui Na, Dietética e Chi kung. Também aprendeu outras técnicas tais como a moxa, ventosas, Reflexologia, aurículoterapia, Gua Sha…

É focada em curar as pessoas de forma holística, utilizando técnicas que lhes permitam ter uma boa qualidade de vida. Gosta que as pessoas assumam o controlo sobre a sua vida e o seu corpo e para isso também tem como objectivo passar os conhecimentos necessários para que os pacientes se tornem autónomos em determinadas partes dos tratamentos, aprendam a gerir melhor as suas vidas e a alterar os comportamentos que lhes causam desequilíbrios.`,
    sortOrder: 9,
    schedules: [
      { dateType: "specific", dateValue: "2026-03-06", availableText: "10:00-19:00" },
    ],
  },
  {
    name: "Magda Rouxinol",
    specialtyEn: "Speech Therapy",
    specialtyPt: "Terapia da Fala",
    imageUrl: "https://live.staticflickr.com/65535/54350059856_e2d990539d_z.jpg",
    bioEn: `Magda Rouxinol is a speech therapist with professional experience since 2008!

She works with babies, children, and adults.

Her areas of intervention are:
• Myofunctional Therapy
• Oral Ties
• Speech Sound Articulation
• Oral and Written Language
• Voice`,
    bioPt: `Magda Rouxinol é Terapeuta da Fala, com experiência profissional desde 2008!

Trabalha com bebés, crianças e adultos!

As suas áreas de Intervenção são:
• Terapia Miofuncional
• Freios Orais
• Articulação dos Sons da Fala
• Linguagem Oral e Escrita
• Voz`,
    sortOrder: 10,
    schedules: [
      { dateType: "specific", dateValue: "2026-03-10", availableText: "10:00-13:00" },
      { dateType: "specific", dateValue: "2026-03-06", availableText: "10:00-13:00" },
    ],
  },
  {
    name: "Eva Neto",
    specialtyEn: "Nursing Services",
    specialtyPt: "Serviços de Enfermagem",
    imageUrl: "https://live.staticflickr.com/65535/54350059886_879db6f8a5_z.jpg",
    bioEn: `Eva Neto is a Specialist Nurse in Medical-Surgical Nursing and a Postgraduate in Health Management and Administration.

With a career that includes responsible positions in healthcare units, she has demonstrated a constant commitment to the quality of care provided.

Since 2018, she has been working at the Aljezur Health Center in the Community Care Unit, where she has stood out for implementing best infection control practices and promoting health within the community.

Until 2018, her professional path was hospital-based, having worked in the fields of surgery, internal medicine, and emergency services.

She is recognized for her ability to work in multidisciplinary teams and for her capacity to facilitate significant changes in healthcare delivery.

In addition to her clinical responsibilities, Eva is actively involved in promoting awareness campaigns and health screenings, demonstrating her dedication to empowering patients and health education. With a patient-centered approach, she continuously strives for the improvement of healthcare services.`,
    bioPt: `Eva Neto é Enfermeira Especialista em Enfermagem Médico - Cirúrgica e Pós - Graduada em Gestão e Administração em Saúde.

Com uma trajetória que inclui cargos de responsabilidade em unidades de cuidados de saúde, tem demonstrado um compromisso constante com a qualidade dos cuidados prestados.

Desde 2018, que exerce funções no Centro de Saúde de Aljezur na Unidade de Cuidados na Comunidade, onde se destacou pela implementação de boas práticas de controlo de infeções e pela promoção da saúde junto da comunidade.

Até 2018, o seu percurso profissional decorreu a nível hospitalar tendo desempenhado funções nos serviços de cirurgia, medicina interna e urgência.

É reconhecida pela sua habilidade em trabalhar em equipa multidisciplinar e pela capacidade de facilitar mudanças significativas nos cuidados de saúde.

Além das suas responsabilidades clínicas, Eva é ativa na promoção de campanhas de sensibilização e rastreios de saúde, demonstrando sua dedicação ao empoderamento dos utentes e à educação em saúde. Com uma abordagem centrada no utente, busca constantemente a melhoria contínua dos serviços de saúde.`,
    sortOrder: 11,
    schedules: [
      { dateType: "weekdays", dateValue: null, availableText: "16:00-18:00" },
      { dateType: "specific", dateValue: "2026-03-07", availableText: "09:00-13:00" },
    ],
  },
  {
    name: "Lucila Vieyra",
    specialtyEn: "Naturopathy",
    specialtyPt: "Naturopatia",
    imageUrl: "https://live.staticflickr.com/65535/54350468180_3c0d1bf0d5_z.jpg",
    bioEn: `Naturopath and Ayurvedic therapist, with a deep passion for natural therapies and holistic well-being. Through my knowledge of naturopathy, I work to promote overall health using natural and personalized methods for each individual. Additionally, as an Ayurvedic therapist, I integrate this ancient medicine to balance the body and mind.
I am currently training as a coach, which will allow me to support you even more effectively in your personal transformation process, helping you achieve your health and wellness goals in a conscious and sustainable way. My approach is always to help you recover and maintain your body's natural balance, guiding you towards a healthier and more harmonious lifestyle`,
    bioPt: `Naturopata e terapeuta ayurvédica, com uma profunda paixão por terapias naturais e bem-estar holístico. Através do seu conhecimento em naturopatia, trabalha para promover a saúde geral utilizando métodos naturais e personalizados para cada indivíduo. Além disso, como terapeuta ayurvédica, integra esta medicina antiga para equilibrar o corpo e a mente.
Atualmente, está em formação como coach, o que permitirá apoiá-lo ainda mais eficazmente no seu processo de transformação pessoal, ajudando-o a alcançar os seus objectivos de saúde e bem-estar de uma forma consciente e sustentável. A sua abordagem é sempre ajudar a recuperar e manter o equilíbrio natural do seu corpo, orientando-o para um estilo de vida mais saudável e harmonioso.`,
    sortOrder: 12,
    schedules: [
      { dateType: "specific", dateValue: "2026-03-09", availableText: "09:00-14:00" },
    ],
  },
  {
    name: "Ana Assis",
    specialtyEn: "Psychomotricity",
    specialtyPt: "Psicomotricidade",
    imageUrl: "https://live.staticflickr.com/65535/54350265164_46e03e0438_z.jpg",
    bioEn: `Ana Assis, trained in Psychomotor Rehabilitation at the University of Évora and currently pursuing a master's degree in Psychomotricity.

Her professional experience has focused on working with children and the elderly, with a passion for creating therapeutic strategies through body-mind therapy that promote the individual's overall harmonious development.

Her main area of expertise is in Neurodevelopmental Disorders (Autism Spectrum Disorder, Attention Deficit Hyperactivity Disorder, Learning Disabilities, among others) and Dementia.

Psychomotricity is a body-based therapy that covers intervention in the motor, cognitive, and socio-emotional domains within an educational, re-educational, and/or therapeutic context. It addresses various psychomotor factors such as tonicity, balance, laterality, body awareness, spatial-temporal structuring, and both gross and fine motor skills.`,
    bioPt: `Ana Assis, formada em Reabilitação Psicomotora pela Universidade de Évora e mestranda em Psicomotricidade.

A sua experiência profissional tem-se centrado na intervenção com crianças e idosos, com paixão pela criação de estratégias terapêuticas por entre a terapia corpo-mente, que impulsionem o desenvolvimento harmonioso global do indivíduo.

A sua principal área de atuação foca-se em Perturbações de Neurodesenvolvimento (Perturbação do Espetro do Autismo, Perturbação de Défice de Atenção e Hiperatividade, Perturbação da Aprendizagem, Dificuldade entre outras) e Demências.

A Psicomotricidade é uma terapia de mediação corporal que abrange uma intervenção nos domínios motor, cognitivo e socio-emocional num contexto educacional, reeducativo e/ou terapêutico. Atua em diversos fatores psicomotores como: tonicidade, equilíbrio, lateralidade, noção de corpo, estruturação espácio-temporal, praxia global e fina.`,
    sortOrder: 13,
    schedules: [
      { dateType: "specific", dateValue: "2026-03-07", availableText: "10:00-13:00" },
    ],
  },
  {
    name: "Isabel Francisco",
    specialtyEn: "Hypnotherapy",
    specialtyPt: "Hipnoterapia",
    imageUrl: "https://live.staticflickr.com/65535/54759642867_816722efeb_b.jpg",
    bioEn: `Isabel Francisco, Master in Clinical Psychology from the University Institute of Psychological, Social and Life Sciences (ISPA), is a full member of the Portuguese Psychologists' Association (OPP), with training in Therapeutic Hypnosis and Past Life Therapy from the Portuguese Institute of Hypnosis (IPH).
In her Hypnotherapy practice, she uses techniques and protocols tailored to each individual's needs. She works with inductions and relaxation techniques; ego-strengthening hypnosis; access to the Higher Self; communication with Guides; and regressions and progressions using specific scripts.
Within regressive techniques, she performs: Age Regression (e.g., for inner child healing); and Regression to Past Lives, the Womb, and the Between Lives space.
She works in areas such as: anxiety disorders; depression; sleep disorders; eating disorders; sexual dysfunctions; personality disorders; somatization and psychosomatic illnesses; pain management and control; addictions and compulsions (smoking, binge eating, intragastric balloon); personal and professional performance.`,
    bioPt: `Isabel Francisco, Mestre em Psicologia Clínica pelo Instituto Universitário de Ciências Psicológicas, Sociais e da Vida (ISPA), membro efetivo da ordem dos Psicólogos Portugueses (OPP) com formação em Hipnose Terapêutica e Terapia de Vidas Passadas pelo Instituto Português de Hipnose (IPH).
Na sua prática de Hipnoterapia, utiliza técnicas e protocolos adaptados às necessidades de cada pessoa. Recorre a induções e técnicas de relaxamento; hipnose de fortalecimento do Eu; acesso ao Eu superior; comunicação com Guias; e regressões e progressões através de guiões específicos.
Dentro das técnicas regressivas, realiza: Regressão de Idade (ex.: para cura da criança interior); e Regressão a Vidas Passadas, ao ventre materno e ao espaço entre vidas.
Intervém em áreas como: perturbações de ansiedade; depressão; perturbações do sono; perturbações alimentares; disfunções sexuais; perturbações de personalidade; somatizações e doenças psicossomáticas; gestão e controlo da dor; vícios e compulsões (tabagismo; compulsão alimentar, balão intragástrico); desempenho pessoal e profissional.`,
    sortOrder: 14,
    schedules: [
      { dateType: "weekdays", dateValue: null, availableText: "17:00-19:00" },
    ],
  },
  {
    name: "Mauro Gatto",
    specialtyEn: "Therapeutic Massage",
    specialtyPt: "Massagem Terapêutica",
    imageUrl: "https://live.staticflickr.com/65535/54350059861_fcb5f3bfe2_z.jpg",
    bioEn: `Mauro combines relaxing massage with osteopathic, joint mobilisation & alignment techniques that stimulate the body's natural ability to heal.

Mauro offers a completely tailored experience, designed to meet your unique needs, be it relaxation or targeted pain relief.`,
    bioPt: `Mauro combina técnicas de massagem de relaxamento com osteopatia, mobilização de articulações e técnicas de alinhamento que estimulam a habilidade natural do corpo de se curar.

O Mauro oferece uma experiência completamente personalizada, com o objectivo de ir ao encontro das suas necessidades, sejam elas relaxamento ou alívio da dor.`,
    sortOrder: 15,
    schedules: [
      { dateType: "weekdays", dateValue: null, availableText: "10:00-19:00" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// SERVICE DATA (from Sheet4 + Sheet3)
// ═══════════════════════════════════════════════════════════

const serviceData = [
  {
    providerName: "Parafarmácia",
    serviceEn: "Parapharmacy",
    servicePt: "Parafarmácia",
    imageUrl: "https://live.staticflickr.com/65535/54366608281_ef99301961_b.jpg",
    bioEn: "Establishment for the sale of over-the-counter medicines, health products, dietary supplements, baby care products, cosmetics, and others.",
    bioPt: "Local de venda de medicamentos não sujeitos a receita médica, produtos de saúde, suplementos alimentares, puericultura, produtos de cosmética e outros.",
    sortOrder: 1,
    schedules: [
      { dateType: "weekdays", dateValue: null, availabilityText: "09:00-19:00" },
      { dateType: "specific", dateValue: "2026-03-07", availabilityText: "09:00-13:00" },
    ],
  },
  {
    providerName: "Valormed",
    serviceEn: "Valormed",
    servicePt: "Valormed",
    imageUrl: "https://live.staticflickr.com/65535/54365793092_10e893ea7c_m.jpg",
    bioEn: "Drop off expired and unused packaging and medications at our pharmacy, and Valormed will take care of the rest.",
    bioPt: "Entregue as embalagens e os medicamentos fora de uso e de prazo na nossa parafarmácia que a Valormed trata do resto",
    sortOrder: 2,
    schedules: [
      { dateType: "weekdays", dateValue: null, availabilityText: "09:00-19:00" },
      { dateType: "specific", dateValue: "2026-03-07", availabilityText: "09:00-13:00" },
    ],
  },
  {
    providerName: "Medição da Tensão Arterial",
    serviceEn: "Blood Pressure Measurement",
    servicePt: "Medição da Tensão Arterial",
    imageUrl: "https://live.staticflickr.com/65535/54365808117_8d2c149346_z.jpg",
    bioEn: "Blood pressure measurement service for monitoring your cardiovascular health.",
    bioPt: "Serviço de medição de tensão arterial para monitoramento da sua saúde cardiovascular",
    sortOrder: 3,
    schedules: [
      { dateType: "weekdays", dateValue: null, availabilityText: "09:00-19:00" },
      { dateType: "specific", dateValue: "2026-03-07", availabilityText: "09:00-13:00" },
    ],
  },
  {
    providerName: "Medição da Glicémia",
    serviceEn: "Blood Glucose Measurement",
    servicePt: "Medição da Glicémia",
    imageUrl: "https://live.staticflickr.com/65535/54366905364_77cacdc6b6_z.jpg",
    bioEn: "Blood glucose measurement service for monitoring blood sugar levels, helping with health management and disease prevention.",
    bioPt: "Serviço de medição de glicémia para monitoramento dos níveis de açúcar no sangue, ajudando no controle da saúde e prevenção de doenças.",
    sortOrder: 4,
    schedules: [
      { dateType: "weekdays", dateValue: null, availabilityText: "09:00-19:00" },
      { dateType: "specific", dateValue: "2026-03-07", availabilityText: "09:00-13:00" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// DEFAULT SETTINGS
// ═══════════════════════════════════════════════════════════

const defaultSettings = [
  {
    key: "emergency_banner",
    valueEn:
      "🧑‍⚕️General Practitioner available on Monday's, Tuesday's and Friday's. Book on +351 914 030 944",
    valuePt:
      "🧑‍⚕️Consulta do Dia disponível Segunda-Feira, Terça-Feira e Sexta-Feira. Ligue para +351 914 030 944",
  },
  {
    key: "about",
    valueEn:
      "Setor Saúde is a modern parapharmacy and clinic located in the heart of Aljezur, Algarve. Our state-of-the-art facility features 5 specialist rooms for medical consultations and wellness services, alongside a fully-stocked parapharmacy. We bring together the best healthcare professionals in the Algarve region to provide comprehensive care to our community and visitors alike.",
    valuePt:
      "Setor Saúde é uma parafarmácia e clínica moderna localizada no coração de Aljezur, Algarve. As nossas instalações modernas contam com 5 salas de especialistas para consultas médicas e serviços de bem-estar, juntamente com uma parafarmácia totalmente equipada. Reunimos os melhores profissionais de saúde da região do Algarve para oferecer cuidados completos à nossa comunidade e visitantes.",
  },
  {
    key: "weekday_hours",
    valueEn: "Monday - Friday: 9:00 - 19:00",
    valuePt: "Segunda - Sexta: 9:00 - 19:00",
  },
  {
    key: "saturday_hours",
    valueEn: "Saturday: 9:00 - 13:00",
    valuePt: "Sábado: 9:00 - 13:00",
  },
];

// ═══════════════════════════════════════════════════════════
// SEED FUNCTION
// ═══════════════════════════════════════════════════════════

async function seed() {
  console.log("🌱 Starting database seed...\n");

  // ── Settings ─────────────────────────────────────────
  console.log("📋 Seeding settings...");
  for (const setting of defaultSettings) {
    await db
      .insert(siteSettings)
      .values(setting)
      .onConflictDoNothing({ target: siteSettings.key });
  }
  console.log(`   ✅ ${defaultSettings.length} settings seeded\n`);

  // ── Specialists ──────────────────────────────────────
  console.log("👨‍⚕️ Seeding specialists...");
  for (const spec of specialistData) {
    const { schedules, ...specialistFields } = spec;

    // Insert specialist
    const [inserted] = await db
      .insert(specialists)
      .values(specialistFields)
      .returning();

    console.log(`   ✅ ${inserted.name} (${spec.specialtyEn})`);

    // Insert their schedules
    for (const schedule of schedules) {
      await db.insert(specialistSchedules).values({
        specialistId: inserted.id,
        dateType: schedule.dateType,
        dateValue: schedule.dateValue,
        availableText: schedule.availableText,
      });
    }
    console.log(`      📅 ${schedules.length} schedule(s) added`);
  }
  console.log(`   ✅ ${specialistData.length} specialists seeded\n`);

  // ── Services ─────────────────────────────────────────
  console.log("🏥 Seeding services...");
  for (const svc of serviceData) {
    const { schedules, ...serviceFields } = svc;

    // Insert service
    const [inserted] = await db
      .insert(services)
      .values(serviceFields)
      .returning();

    console.log(`   ✅ ${inserted.providerName} (${svc.serviceEn})`);

    // Insert their schedules
    for (const schedule of schedules) {
      await db.insert(serviceSchedules).values({
        serviceId: inserted.id,
        dateType: schedule.dateType,
        dateValue: schedule.dateValue,
        availabilityText: schedule.availabilityText,
      });
    }
    console.log(`      📅 ${schedules.length} schedule(s) added`);
  }
  console.log(`   ✅ ${serviceData.length} services seeded\n`);

  console.log("🎉 Seed complete! All data imported successfully.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
