// Saving for the hosted demo: the visitor's own browser, nothing else.
//
// The AI Studio original also wrote every change to a shared Cloud Firestore
// document in AI Studio's temporary Firebase project. On a public page that
// would put every visitor's clicks into one record anyone could overwrite, in
// a database the studio does not own. A practice's real build connects its
// own database here; the export names are kept so nothing else changes.
import { DashboardState } from "../data";

/** No cloud database in the demo, so there is nothing to test. */
export async function testConnection(): Promise<boolean> {
  return false;
}

/** The browser copy is saved by saveState() in data.ts; nothing to add here. */
export async function saveStateToFirestore(_state: DashboardState): Promise<void> {}

/** No cloud copy exists; the app loads from localStorage instead. */
export async function loadStateFromFirestore(): Promise<DashboardState | null> {
  return null;
}
