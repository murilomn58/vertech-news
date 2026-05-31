import { getDb } from "./firebase";

export interface SponsoredTool {
  id: string;
  name: string;
  url: string;
  logo?: string;
  description: string;
  category: string;
  activeFrom: string;
  activeUntil: string;
  reportToken?: string;
}

// In-memory cache (5 minutes)
let cachedSponsors: SponsoredTool[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

export async function getActiveSponsors(): Promise<SponsoredTool[]> {
  const now = Date.now();

  if (cachedSponsors && now - cacheTime < CACHE_TTL) {
    return cachedSponsors;
  }

  try {
    const db = getDb();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const snap = await db
      .collection("sponsored_tools")
      .where("activeFrom", "<=", today)
      .where("activeUntil", ">=", today)
      .get();

    cachedSponsors = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as SponsoredTool[];

    cacheTime = now;
    return cachedSponsors;
  } catch {
    return cachedSponsors || [];
  }
}
