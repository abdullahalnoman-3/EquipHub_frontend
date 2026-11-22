// User and Auth Types
export type UserRole = "Customer" | "Owner" | "Admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  requestedRole?: string;
  ownerStatus?: "None" | "Pending" | "Approved" | "Rejected";
  ownerAppliedAt?: string;
  avatar?: string;
  photoURL?: string;
  phone?: string;
  address?: string;
  status?: string;
  createdAt?: string;
}

// Equipment Types
export type EquipmentCategory =
  | "Heavy Machinery"
  | "Power Tools"
  | "Farming Equipment"
  | "Audio/Visual & Event Tech"
  | "Construction & Hand Tools"
  | "Outdoor & Adventure Gear";

export interface Equipment {
  _id: string;
  name: string;
  category: EquipmentCategory;
  description: string;
  rentalPricePerDay: number;
  location: string;
  imageUrl: string;
  ownerId: string | User;
  isAvailable: boolean;
  approvalStatus: "pending" | "approved" | "rejected";
  createdAt?: string;
  averageRating?: number;
  totalReviews?: number;
}

// Booking Types
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed";

export interface Booking {
  _id: string;
  equipmentId: string | Equipment;
  customerId: string | User;
  startDate: string;
  endDate: string;
  totalCost: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt?: string;
}

// API Response generic type
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
