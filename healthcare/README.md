> **This copy is the hosted demo at meridianinterface.com/demos/healthcare/.**
> Changed from the AI Studio original so it is safe on a public static page:
> no Firebase (it saved to AI Studio's temporary project) and no Google
> sign-in; avatars and fonts self-hosted; the SOS screen says it contacts no
> one; with no server, every AI feature uses the app's built-in sample logic
> and says so (`VITE_AI_SERVER=1` turns the real calls back on for a build
> that runs the Express server, which is not in this folder). Build with
> `DEMO_BASE=/demos/healthcare/ npm run build`; see public/demos/README.txt.

# Doctor-Patient Healthcare Dashboard (CarePulse EHR)

CarePulse is a comprehensive, production-grade healthcare and Electronic Health Record (EHR) platform connecting patients and healthcare providers. It features role-based clinical views, real-time bio-telemetry tracking, AI-powered symptom triaging and clinical documentation via Google Gemini, WebRTC-style telemedicine consultation rooms, emergency SOS dispatching, and bidirectional synchronization with Firebase Firestore and Google Workspace (Docs, Sheets, Drive).

---

## 🌟 Key Features

### 1. Unified Role-Based Portals
- **Patient Portal**: Access personalized health summaries, upcoming appointments, active prescriptions, lab panels, vital history, and secure communications.
- **Doctor & Clinical Admin Portal**: Review patient rosters, inspect real-time telemetry alerts, analyze longitudinal EHR records, write AI-assisted SOAP clinical notes, and manage prescriptions.

### 2. AI-Powered Clinical Intelligence (Google Gemini 2.5 / 3.5)
- **Symptom Triaging Assistant**: Evaluates patient complaints, severity, and duration to provide educational differentials, triage recommendations (Emergency SOS vs. urgent vs. routine clinic visit), and actionable doctor discussion points.
- **Automated SOAP Note Generator**: Translates subjective patient symptoms, objective biometrics, and physical exam findings into structured clinical visit notes (Subjective, Objective, Assessment, Plan) with patient-friendly summaries.
- **AI Clinical Diagnostic Consultant**: Cross-references patient vitals history, lab panels, allergy profiles, and messaging history to alert physicians to potential drug interactions, undetected symptom trends, and recommended laboratory follow-ups.

### 3. Telemedicine & Virtual Consultations
- Embedded virtual examination room with camera and microphone controls.
- Live consultation timer, real-time patient vitals overlay, clinical observations notepad, and seamless transition from symptom checking to appointment scheduling.

### 4. Continuous Bio-Telemetry & Vital Signs
- Real-time logging and trend monitoring for Blood Pressure (Systolic/Diastolic), Heart Rate (BPM), Blood Oxygen (SpO2), Blood Glucose, and Body Temperature.
- Automatic clinical status classification (Optimal, Normal, Borderline, Elevated, Critical) with visual alerts.

### 5. Medical Records, Lab Results & E-Prescriptions
- Longitudinal records covering laboratory tests, diagnostic imaging, and immunization records.
- Export clinical charts and health summaries directly to PDF (via `jspdf`) or Excel spreadsheets (via `xlsx`).
- Electronic prescription management with dosage trackers, refill reminders, and contraindication notifications.

### 6. Emergency SOS Dispatch Protocol
- High-priority emergency trigger with an audible 5-second cancelable countdown.
- Automated simulated GPS coordinate triangulation, emergency contact SMS dispatches, and emergency room telemetry transmission.

### 7. Google Workspace & Cloud Database Sync
- **Firebase Firestore**: Multi-tier data model with automated offline caching, local storage fallback, and robust security rules (`firestore.rules`).
- **Google Workspace Integration**: Export clinical visit records and laboratory tables directly to Google Docs and Google Sheets, indexed in Google Drive via OAuth 2.0.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend**: Node.js, Express, tsx, esbuild
- **AI Services**: Google GenAI SDK (`@google/genai`)
- **Cloud & Auth**: Firebase Firestore, Firebase Authentication, Google Workspace APIs (Drive v3, Docs v1, Sheets v4)
- **Document Generation**: jsPDF, SheetJS (xlsx)
- **Bundler & Build**: Vite 6, TypeScript Compiler (`tsc`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### 1. Clone & Install
```bash
git clone https://github.com/<your-username>/carepulse-ehr.git
cd carepulse-ehr
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory based on `.env.example`:

```env
# Google Gemini API Key for symptom triaging and clinical documentation
GEMINI_API_KEY="your-gemini-api-key"

# Application host URL (defaults to http://localhost:3000 in local development)
APP_URL="http://localhost:3000"
```

### 3. Development Server
Start the Express server with Vite middleware:
```bash
npm run dev
```
The application will be live at `http://localhost:3000`.

### 4. Production Build & Execution
```bash
# Compile client assets with Vite and bundle server with esbuild
npm run build

# Start production server
npm start
```

### 5. Code Quality & Type Checking
```bash
npm run lint
```

---

## 📁 Project Architecture

```
├── .env.example              # Environment configuration template
├── firebase-applet-config.json # Firebase project configuration
├── firebase-blueprint.json   # Firestore database schema blueprint
├── firestore.rules           # Security rules for Firestore collections
├── index.html                # Single-page application entry point
├── metadata.json             # AI Studio applet specifications
├── package.json              # Project scripts and dependencies
├── server.ts                 # Express backend server with Gemini AI endpoints
├── tsconfig.json             # TypeScript compiler settings
├── vite.config.ts            # Vite build configuration
└── src/
    ├── App.tsx               # Primary layout, routing, and cloud sync coordinator
    ├── data.ts               # Core clinical EHR data models and state handlers
    ├── types.ts              # TypeScript domain interfaces
    ├── main.tsx              # React DOM mounting
    ├── index.css             # Tailwind stylesheet
    ├── components/
    │   ├── AppointmentBooking.tsx    # Appointment scheduling with calendar slots
    │   ├── BillingInsurance.tsx      # Invoices, claims, and coverage breakdown
    │   ├── CommunicationsHub.tsx     # Unified notification center & email/SMS logs
    │   ├── DoctorPortal.tsx          # Doctor workspace with patient charts & AI SOAP notes
    │   ├── EmergencySOS.tsx          # Emergency distress sequence & GPS alert
    │   ├── Header.tsx                # Role switcher, navigation tabs, and quick SOS
    │   ├── LiveEmergencyMonitor.tsx  # Clinical alert dispatch dashboard
    │   ├── MedicalRecords.tsx        # Records, lab results, immunizations & exports
    │   ├── PatientOnboarding.tsx     # Intake forms, medical history, and consent
    │   ├── PrescriptionTracker.tsx   # Medication management and refill workflow
    │   ├── SecureMessaging.tsx       # End-to-end clinical messaging interface
    │   ├── SymptomChecker.tsx        # Interactive AI symptom triage tool
    │   ├── TelemedicineRoom.tsx      # Video consultation room with live vitals
    │   └── VitalSignsTracking.tsx    # Longitudinal telemetry graphing & stats
    └── utils/
        ├── firebaseDb.ts             # Firestore connection, read/write & offline fallback
        ├── googleWorkspace.ts        # Google Docs, Sheets, and Drive API integrations
        └── pdfGenerator.ts           # Clinical summary and lab report PDF exports
```

---

## 🔒 Security & HIPAA Compliance Considerations

- **Default-Deny Firestore Rules**: Firestore documents enforce strict ID validation and restricted path patterns.
- **Fail-Safe Offline Persistence**: If network connectivity drops or the Firestore backend is unreachable, the application smoothly degrades to browser-level encrypted local storage without crashing or data loss.
- **Credential Safety**: The Gemini API key remains server-side within `server.ts` behind Express proxy routes (`/api/*`), preventing client-side key leakage.
- **OAuth Token Handling**: Google Workspace access tokens are held in-memory and never written to persistent browser disks.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
