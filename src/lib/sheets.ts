import * as XLSX from "xlsx";

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

// Cache the workbook to avoid re-fetching for each sheet
let workbookCache: XLSX.WorkBook | null = null;

async function getWorkbook(): Promise<XLSX.WorkBook> {
  if (workbookCache) return workbookCache;

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=xlsx`;
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  workbookCache = XLSX.read(arrayBuffer, { type: "array" });
  return workbookCache;
}

function getCellHyperlink(
  sheet: XLSX.WorkSheet,
  cellAddress: string,
): string | null {
  const cell = sheet[cellAddress];
  if (!cell) return null;

  // Check for hyperlink in cell
  if (cell.l?.Target) {
    return cell.l.Target;
  }

  // Return cell value if it looks like a URL
  const value = cell.v?.toString() || "";
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return null;
}

export async function fetchWishlist(sheetName: string): Promise<WishItem[]> {
  if (SHEET_ID === "YOUR_GOOGLE_SHEET_ID") {
    return getSampleData(sheetName);
  }

  try {
    const workbook = await getWorkbook();
    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
      console.error(`Sheet "${sheetName}" not found`);
      return [];
    }

    const range = XLSX.utils.decode_range(sheet["!ref"] || "A1");
    const items: WishItem[] = [];

    // Start from row 2 (skip header)
    for (let row = 1; row <= range.e.r; row++) {
      const itemCell = sheet[XLSX.utils.encode_cell({ r: row, c: 0 })];
      const item = itemCell?.v?.toString().trim() || "";

      if (!item) continue; // Skip empty rows

      const descCell = sheet[XLSX.utils.encode_cell({ r: row, c: 1 })];
      const priorityCell = sheet[XLSX.utils.encode_cell({ r: row, c: 3 })];
      const claimedCell = sheet[XLSX.utils.encode_cell({ r: row, c: 4 })];

      // Get hyperlink from link column (column C, index 2)
      const linkAddress = XLSX.utils.encode_cell({ r: row, c: 2 });
      const link = getCellHyperlink(sheet, linkAddress) || "";

      items.push({
        item,
        description: descCell?.v?.toString().trim() || "",
        link,
        priority: priorityCell?.v?.toString().trim() || "medium",
        claimed: claimedCell?.v?.toString().toLowerCase().trim() === "yes",
      });
    }

    return items;
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
