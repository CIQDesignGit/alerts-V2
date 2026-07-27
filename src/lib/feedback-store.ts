/** Where in the app feedback was collected */
export type FeedbackSurface = "sku-rca" | "ally-insight" | "taxonomy-rca";

export type FeedbackVote = "up" | "down";

export type FeedbackEntry = {
  id: string;
  surface: FeedbackSurface;
  /** Stable id for the content being rated (issueKey, taxonomy node id, ASIN) */
  contextKey: string;
  /** Human-readable label stored with the entry */
  contextLabel?: string;
  vote: FeedbackVote;
  chips: string[];
  note?: string;
  createdAt: string;
};

const STORAGE_KEY = "alerts-v2-feedback";

function readAll(): FeedbackEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FeedbackEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(entries: FeedbackEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

/** Persist one feedback submission and return the stored entry. */
export function collectFeedback(
  entry: Omit<FeedbackEntry, "id" | "createdAt">,
): FeedbackEntry {
  const full: FeedbackEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  writeAll([full, ...readAll()]);

  if (process.env.NODE_ENV === "development") {
    console.info("[feedback collected]", full);
  }

  return full;
}

/** Read all collected feedback (newest first). */
export function getFeedbackEntries(): FeedbackEntry[] {
  return readAll();
}

/** Clear stored feedback — useful for prototype resets. */
export function clearFeedbackEntries() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
