// Google Sheets configuration
const SHEET_ID = "1OAibq3yhlwZrIQnAyszGLfj173Zqxa_3yAUM0TcWVW4";
export const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`;

export interface WishItem {
  item: string;
  description: string;
  link: string;
  priority: string;
  claimed: boolean;
}

export interface FamilyMember {
  name: string;
  sheetName: string;
}

export const familyMembers: FamilyMember[] = [
  { name: "Amy", sheetName: "Amy" },
  { name: "Thomas", sheetName: "Thomas" },
  { name: "Baby", sheetName: "Baby" },
];

export async function fetchWishlist(sheetName: string): Promise<WishItem[]> {
  if (SHEET_ID === "YOUR_GOOGLE_SHEET_ID") {
    // Return sample data if sheet is not configured
    return getSampleData(sheetName);
  }

  try {
    // Google Sheets JSON export URL
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
    const response = await fetch(url);
    const text = await response.text();

    // Parse Google's JSON response (it's wrapped in a function call)
    const jsonString = text.match(
      /google\.visualization\.Query\.setResponse\(([\s\S]*)\);/,
    )?.[1];
    if (!jsonString) {
      console.error("Failed to parse Google Sheets response");
      return [];
    }

    const data = JSON.parse(jsonString);
    const rows = data.table.rows;

    // Skip header row, parse data
    return rows
      .slice(1)
      .map((row: { c: Array<{ v: string } | null> }) => ({
        item: row.c[0]?.v || "",
        description: row.c[1]?.v || "",
        link: row.c[2]?.v || "",
        priority: row.c[3]?.v || "medium",
        claimed: (row.c[4]?.v || "").toString().toLowerCase() === "yes",
      }))
      .filter((item: WishItem) => item.item); // Filter out empty rows
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return [];
  }
}

function getSampleData(sheetName: string): WishItem[] {
  const sampleData: Record<string, WishItem[]> = {
    Amy: [
      {
        item: "Ny roman",
        description: "Enhver god bog",
        link: "",
        priority: "medium",
        claimed: false,
      },
      {
        item: "Yoga måtte",
        description: "Lilla eller grøn",
        link: "https://example.com",
        priority: "high",
        claimed: true,
      },
    ],
    Thomas: [
      {
        item: "Mekanisk tastatur",
        description: "Med Cherry MX switches",
        link: "",
        priority: "high",
        claimed: false,
      },
      {
        item: "Kaffebønner",
        description: "Specialty roast",
        link: "",
        priority: "low",
        claimed: false,
      },
    ],
    Baby: [
      {
        item: "LEGO Duplo",
        description: "Alle sæt er gode",
        link: "",
        priority: "high",
        claimed: false,
      },
      {
        item: "Billedbøger",
        description: "Med dyr",
        link: "",
        priority: "medium",
        claimed: true,
      },
    ],
  };

  return sampleData[sheetName] || [];
}
