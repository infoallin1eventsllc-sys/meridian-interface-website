/**
 * Clinical API Service Layer
 * Abstracts backend HTTP communication for clinical intelligence, AI documentation, and emergency dispatch.
 */

export interface SymptomAnalysisRequest {
  symptoms: string[];
  duration: string;
  severity: number;
  additionalNotes?: string;
}

export interface SymptomAnalysisResponse {
  triageLevel: "EMERGENCY" | "URGENT_APPOINTMENT" | "ROUTINE_APPOINTMENT" | "SELF_CARE";
  triageExplanation: string;
  educationalPossibilities: string[];
  questionsForDoctor: string[];
  homeCareTips: string[];
  disclaimer: string;
}

export interface SoapNoteGenerationRequest {
  patientName: string;
  age: string | number;
  gender: string;
  vitals: Record<string, string | number>;
  primaryComplaint: string;
  examFindings?: string;
}

export interface SoapNoteGenerationResponse {
  soapNote: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  patientFriendlySummary?: string;
  recommendedPrescriptions?: Array<{
    medication: string;
    dosage: string;
    frequency: string;
    reason: string;
  }>;
  followUpTimeframe?: string;
}

export interface ClinicalConsultantRequest {
  patientName: string;
  dob: string;
  gender: string;
  allergies: string[];
  conditions: string[];
  vitals: any[];
  labResults: any[];
  messages: Array<{ sender: string; text: string; time: string }>;
  doctorQuery?: string;
}

export interface ClinicalConsultantResponse {
  differentialDiagnoses: Array<{
    condition: string;
    probability: "High" | "Medium" | "Low";
    icd10Code: string;
    reasoning: string;
  }>;
  recommendedLabs: Array<{
    testName: string;
    category: "Metabolic Panel" | "Lipid Panel" | "Blood Work" | "Urinalysis" | "Imaging";
    reasoning: string;
  }>;
  recommendedPrescriptions: Array<{
    medicationName: string;
    dosage: string;
    frequency: string;
    reasoning: string;
  }>;
  interactionWarnings: Array<{
    severity: "High" | "Moderate";
    type: "Allergy Interaction" | "Drug Interaction" | "Clinical Guard";
    message: string;
  }>;
  consultantOpinion: string;
}

export interface EmergencySosRequest {
  patientId: string;
  patientName: string;
  coordinates: { lat: number; lng: number; city: string };
  emergencyContact: { name: string; phone: string; relationship: string };
  conditions: string[];
}

export interface EmergencySosResponse {
  success: boolean;
  dispatchId: string;
  timestamp: string;
  message: string;
  dispatchStatus: string;
}

/**
 * The hosted demo has no server, so no Gemini key. Calls stop here instead of
 * hitting a URL that does not exist, and each screen falls back to its own
 * built-in sample logic. A practice's build with the Express server sets
 * VITE_AI_SERVER=1 and gets the real model.
 */
export const AI_SERVER = import.meta.env.VITE_AI_SERVER === "1";

export class AiOfflineError extends Error {
  constructor() {
    super("This demo is not connected to an AI model, so it shows a built-in sample instead.");
    this.name = "AiOfflineError";
  }
}

class ClinicalApiService {
  private async postJson<T>(endpoint: string, payload: any): Promise<T> {
    if (!AI_SERVER) throw new AiOfflineError();
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: Failed request to ${endpoint}`;
      try {
        const errorData = await response.json();
        if (errorData?.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // Fallback to status text
      }
      throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Evaluates patient symptoms using Gemini clinical triaging
   */
  async analyzeSymptoms(payload: SymptomAnalysisRequest): Promise<SymptomAnalysisResponse> {
    return this.postJson<SymptomAnalysisResponse>("/api/analyze-symptom", payload);
  }

  /**
   * Generates structured SOAP clinical visit documentation using Gemini
   */
  async generateSoapNote(payload: SoapNoteGenerationRequest): Promise<SoapNoteGenerationResponse> {
    return this.postJson<SoapNoteGenerationResponse>("/api/doctor-assistant", payload);
  }

  /**
   * Cross-analyzes patient vitals, lab panels, and doctor-patient messaging for differential diagnoses
   */
  async consultClinicalCase(payload: ClinicalConsultantRequest): Promise<ClinicalConsultantResponse> {
    return this.postJson<ClinicalConsultantResponse>("/api/clinical-consultant", payload);
  }

  /**
   * Dispatches emergency SOS telemetry and generates emergency dispatch verification
   */
  async dispatchSos(payload: EmergencySosRequest): Promise<EmergencySosResponse> {
    return this.postJson<EmergencySosResponse>("/api/dispatch-sos", payload);
  }

  /**
   * Verifies health status of the clinical application backend
   */
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch("/api/health");
    if (!response.ok) {
      throw new Error(`Health check failed with status: ${response.status}`);
    }
    return response.json();
  }
}

export const clinicalApi = new ClinicalApiService();
