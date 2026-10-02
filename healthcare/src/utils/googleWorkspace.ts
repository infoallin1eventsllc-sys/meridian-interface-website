// Google Docs, Sheets and Drive export: switched off in the hosted demo.
//
// The original signs the visitor in with Google (through AI Studio's Firebase
// project) and asks for access to their Docs, Sheets and Drive. A portfolio
// demo must never ask a stranger for that. A practice's real build connects
// its own Google project here; the export names are kept so the screen that
// calls them still compiles and explains the feature.

export const WORKSPACE_DEMO_NOTE =
  "Google Docs, Sheets and Drive export is connected when this is built for a practice. This demo never asks you to sign in.";

export interface WorkspaceUser {
  email: string | null;
  displayName?: string | null;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  createdTime: string;
}

/** Reports "not signed in" straight away; there is no session to restore. */
export const initAuth = (
  _onAuthSuccess?: (user: WorkspaceUser, token: string) => void,
  onAuthFailure?: () => void,
) => {
  onAuthFailure?.();
  return () => {};
};

const off = () => Promise.reject(new Error(WORKSPACE_DEMO_NOTE));

export const googleSignIn = (): Promise<{ user: WorkspaceUser; accessToken: string } | null> => off();
export const getAccessToken = async (): Promise<string | null> => null;
export const logoutWorkspace = async () => {};
export const createGoogleDoc = (_title: string, _content: string): Promise<{ documentId: string; alternateLink: string }> => off();
export const createGoogleSheet = (_title: string, _headers: string[], _rows: unknown[][]): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => off();
export const listWorkspaceFiles = async (): Promise<DriveFile[]> => [];
