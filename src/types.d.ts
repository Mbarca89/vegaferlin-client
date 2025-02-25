export interface userData {
    id: string;
    name: string;
    surname: string;
    userName: string;
    password: string;
    role: string;
}

export interface createUserformValues {
    id: string,
    name: string,
    surname: string,
    userName: string,
    password: string,
    repeatPassword: string
    role: string
}

export interface userLogin {
    userName: string;
    password: string;
    remember: boolean;
}

export interface patient {
    id: number
    image: string
    inChargeOf: string
    inChargeOfId: number
    name: string
    surname: string
    docType: string
    doc: number | undefined
    gender: string
    birth: string
    nationality: string
    civilState: string
    country: string
    state: string
    city: string
    address: string
    derivedBy: string
    phone: number | undefined
    email: string
    occupation: string
    studies: string
    workAddress: string
    workingHours: string
    social: string
    socialNumber: number | undefined
    observations: string
}

export interface patientList {
    id: number,
    inChargeOf: string,
    name: string,
    surname: string,
    docType: string,
    doc: number,
    gender: string,
    phone: number
}

export interface healthQuestionnaire {
    healthAlteration: boolean
    healthChange: boolean
    lastMedicalCheck: string
    medicalAttention: boolean
    medicalAttentionReason: string
    medicInformation: string
    majorSurgery: boolean
    majorSurgeryReason: string
    hospitalized: boolean
    hospitalizedReason: string
    height: number | undefined
    weight: number | undefined
    maxBloodPressure: number | undefined
    minBloodPressure: number | undefined
    pulse: number | undefined
    generalObservations: string
    heartAttacks: boolean
    rheumatic: boolean
    chestPain: boolean
    breath: boolean
    ankle: boolean
    pillow: boolean
    pacemaker: boolean
    bloodPressureProblems: boolean
    hearthObservations: string
    epilepsy: boolean
    faints: boolean
    seizures: boolean
    emotionalAlteration: boolean
    alterationsTreatment: boolean
    nervousObservations: string
    cough: boolean
    tuberculosis: boolean
    familyTuberculosis: boolean
    sinusitis: boolean
    asma: boolean
    breathObservations: string
    stomachUlcer: boolean
    hepatitis: boolean
    jaundice: boolean
    liver: boolean
    bloodVomit: boolean
    digestiveObservations: string
    diabetis: boolean
    familyDiabetis: boolean
    urinate: boolean
    thirst: boolean
    hypothyroidism: boolean
    hyperthyroidism: boolean
    endocrineObservations: string
    bloodProblems: boolean
    familyBloodProblems: boolean
    hemophiliac: boolean
    abnormalBlood: boolean
    bloodTransfusion: boolean
    bloodObservation: string
    anestheticsAlergy: boolean
    antibioticsAlergy: boolean
    barbituratesAlergy: boolean
    analgesicsAlergy: boolean
    asthma: boolean
    skin: boolean
    alergyObservations: string
    kidneyProblems: boolean
    syphilis: boolean
    hiv: boolean
    genitourinaryObservations: string
    tumors: boolean
    quimio: boolean
    xrays: boolean
    neoplaciaObservations: string
    alcohol: boolean
    smoker: boolean
    smokeTimes: number | undefined
    habitsObservations: string
    antibiotics: boolean
    anticoagulants: boolean
    bloodMedicines: boolean
    tranquillizers: boolean
    hormones: boolean
    aspirines: boolean
    bisphosphonates: boolean
    otherMeds: string
    midicineObservations: string
    pregnant: boolean
    pregnantPosibilities: boolean
    breastfeeding: boolean
    menstrual: boolean
    hormonalTreatment: boolean
    menstrualDisease: boolean
    otherDiseases: boolean
    otherDiseasesReason: string
    womanObservations: string
    mainDentalProblem: string
    pain: boolean
    dentalAspect: boolean
    eatingProblems: boolean
    headache: boolean
    sinuses: boolean
    previousTreatmentProblems: boolean
    previousTreatmentProblemsReason: string
    dentalObservations: string
}

export interface medicalHistory {
    parents: string
    siblings: string
    children: string
    actualDiseaseHistory: string
    pathologicalHistory: string
    traumaHistory: string
    surgeries: string
    medication: string
    allergies: string
    alcohol: boolean
    tobacco: boolean
    drugs: boolean
    drugsDetail: string
}

export interface labs {
    id: number;
    patientId: number;
    hemogram: string[];
    hemogramObservations: string;
    glycemia: string[];
    glycemiaObservations: string;
    hemoglobin: string[];
    hemoglobinObservations: string;
    uraemia: string[];
    uraemiaObservations: string;
    coagulagram: string[];
    coagulogramObservations: string;
    urine: string[];
    urineObservations: string;
    antitetanus: string[];
    antitetanusObservations: string;
    ctx: string[];
    ctxObservations: string;
}


export interface dentalEvaluation {
    brush: boolean
    brushFrequency: string
    floss: boolean
    flossFrequency: string
    interdentalBrush: boolean
    interdentalBrushFrequency: string
    biotype: string
    smile: string
    verticalLoss: boolean
    jawPosition: boolean
    dispersion: boolean
    wear: boolean
    wearType: string
    internalExam: string
    externalExam: string
}

export interface gallery {
    extraoralFront_thumb: string[]
    extraoralMax_thumb: string[]
    extraoralLeft_thumb: string[]
    extraoralRight_thumb: string[]
    intraoralFront_thumb: string[]
    intraoralBlackBackground_thumb: string[]
    intraoralLeft_thumb: string[]
    intraoralRight_thumb: string[]
    arcTop_thumb: string[]
    arcBottom_thumb: string[]
    oclusal_thumb: string[]
    vestibular_thumb: string[]
    panoramic_thumb: string[]
    xray_thumb: string[]
}

export interface galleryImages {
    original: string
    thumbnail: string
    HD: string
}

export interface DentalPrediction {
    top: Map<string, any>;
    bottom: Map<string, any>;
}

export interface ActivityHistory {
    activity: string
    username: string
    timestamp: date
}

export interface SurgicalProtocol {
    id: number
    date: string
    firstAssistant: string
    secondAssistant: string
    startTime: string
    endTime: string
    preMed: string
    postMed: string
    surgeryType: string
    topMaxillary: boolean
    jaw: boolean
    topMaxillaryInfo: SurgicalInfo
    jawInfo: SurgicalInfo
}

interface SurgicalInfo {
    zone: string
    anaesthesia: string
    incisionFrom: number | undefined
    incisionTo: number | undefined
    disposition: string
    extension: boolean
    compensators: Compensator[]
    implants: Implant[]
    regenerationObjective: string
    elevationMethod: string
    regenerationFrom: number | undefined
    regenerationTo: number | undefined
    membrane: boolean
    materials: Material[]
    sutureMaterial: string
    technique: string
}

interface Compensator {
    location: number | undefined
    localization: string
}

interface Implant {
    location: number | undefined
    brand: string
    connection: string
    platform: string
    length: number | undefined
    diameter: number | undefined
    torque: number | undefined
    stability: boolean
    placement: string
    instrumentalMethod: string
}

interface Material {
    grafting: string
    autologue: string
}

export interface WorkPlan {
    id: number
    startDate: string
    endDate: string
    status: string
    observations: string
    stages: string[]
} 

export interface ToothType {
    D: string;
    V: string;
    M: string;
    L: string;
    O: string;
}

export interface treatment {
    code: string
    description: string
    piece: string
    faces: string
    status: string
}

export interface Odontogram {
    teeth: Map<number, ToothType>;
    treatments: treantment[]
    odontogramDate: string
}

export interface OdontogramVersion {
    id: number
    odontogramDate: string
}

export interface Appointment {
    id: number
    name: string
    phone: string
    title: string
    start:string
    end:string
    messageSent: boolean
}

