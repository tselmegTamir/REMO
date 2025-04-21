// products.ts

// Interface for a single packaging part in the product
export interface PackagingPart {
    name: string; // Name of the part (e.g., "main body", "cap", "label")
    img: string; // Cloud Storage path to part image (e.g., "@/assets/images/mainBody.jpg")
    material: string; // Material type (e.g., "Plastic", "Paper")
    weight: number; // Weight in grams (e.g., 15, 5, 1)
    instruction: string; // Recycling instructions (e.g., "Rinse before recycling")
    recyclable: boolean;
  }
  
  // Interface for a product document in the products collection
export interface Product {
    id?: string;
    name: string; // Product name (e.g., "Coca-Cola")
    img: string; // Cloud Storage path to product image (e.g., "@/assets/images/coke.jpg")
    responsibleCompanyId: string; // Reference to responsibleCompanies (e.g., "sQrULO9VbhkdEld1pZCP")
    responsibleCompanyName: string; // Denormalized company name (e.g., "MCS")
    responsibleCompanyLogo: string; // Denormalized company logo path (e.g., "@/assets/images/mcs.png")
    productCategory: string; // Category (e.g., "Drinks")
    productType: string; // Type (e.g., "Beverage")
    imgCatType: string; // Cloud Storage path to category image (e.g., "@/assets/images/drinksCat.jpg")
    packagingParts: PackagingPart[]; // Array of packaging parts
    views: number; // Number of times viewed (e.g., 10)
    createdAt: string; // ISO timestamp (e.g., "2025-04-16T10:00:00Z")
    updatedAt: string; // ISO timestamp (e.g., "2025-04-16T10:00:00Z")
    createdBy: string; // UID of owner who submitted (e.g., "uid123")
}