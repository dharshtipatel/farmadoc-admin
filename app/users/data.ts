export type UserStatus = "Active" | "Suspended";

export interface User {
  id: number;
  initials: string;
  bgColor: string;
  name: string;
  email: string;
  phone: string;
  joinedOn: string;
  orders: number;
  totalSpent: number;
  status: UserStatus;
}

export const INITIAL_USERS: User[] = [
  { id: 1, initials: "MS", bgColor: "#6366F1", name: "Mahavir Singh", email: "example@email.com", phone: "+39 123 4567890", joinedOn: "24-04-2026", orders: 24, totalSpent: 240.35, status: "Active" },
  { id: 2, initials: "AH", bgColor: "#F59E0B", name: "Ajay Hegde", email: "ajay.hegde@email.com", phone: "+39 123 4567891", joinedOn: "25-04-2026", orders: 25, totalSpent: 150.00, status: "Suspended" },
  { id: 3, initials: "RK", bgColor: "#10B981", name: "Riya Kapoor", email: "riya.kapoor@email.com", phone: "+39 123 4567892", joinedOn: "26-04-2026", orders: 26, totalSpent: 320.75, status: "Active" },
  { id: 4, initials: "SD", bgColor: "#3B82F6", name: "Sanjay Desai", email: "sanjay.desai@email.com", phone: "+39 123 4567893", joinedOn: "27-04-2026", orders: 27, totalSpent: 198.60, status: "Suspended" },
  { id: 5, initials: "PT", bgColor: "#8B5CF6", name: "Priya Tiwari", email: "priya.tiwari@email.com", phone: "+39 123 4567894", joinedOn: "28-04-2026", orders: 28, totalSpent: 410.20, status: "Active" },
  { id: 6, initials: "VK", bgColor: "#EC4899", name: "Vikram Kumar", email: "vikram.kumar@email.com", phone: "+39 123 4567895", joinedOn: "29-04-2026", orders: 29, totalSpent: 275.50, status: "Suspended" },
  { id: 7, initials: "NS", bgColor: "#14B8A6", name: "Nisha Singh", email: "nisha.singh@email.com", phone: "+39 123 4567896", joinedOn: "30-04-2026", orders: 30, totalSpent: 89.99, status: "Active" },
  { id: 8, initials: "AR", bgColor: "#F97316", name: "Anil Rao", email: "anil.rao@email.com", phone: "+39 123 4567897", joinedOn: "01-05-2026", orders: 31, totalSpent: 512.30, status: "Active" },
  { id: 9, initials: "DK", bgColor: "#6366F1", name: "Deepak Khanna", email: "deepak.khanna@email.com", phone: "+39 123 4567898", joinedOn: "02-05-2026", orders: 32, totalSpent: 600.00, status: "Active" },
  { id: 10, initials: "TG", bgColor: "#10B981", name: "Tanya Gupta", email: "tanya.gupta@email.com", phone: "+39 123 4567899", joinedOn: "03-05-2026", orders: 33, totalSpent: 230.45, status: "Active" },
  { id: 11, initials: "RM", bgColor: "#EF4444", name: "Rohit Mehta", email: "rohit.mehta@email.com", phone: "+39 123 4567900", joinedOn: "04-05-2026", orders: 34, totalSpent: 399.99, status: "Active" },
  { id: 12, initials: "QS", bgColor: "#8B5CF6", name: "Quinn Singh", email: "quinn.singh@email.com", phone: "+39 123 4567901", joinedOn: "05-05-2026", orders: 35, totalSpent: 120.00, status: "Active" },
  { id: 13, initials: "MS", bgColor: "#6366F1", name: "Mahavir Singh", email: "example@email.com", phone: "+39 123 4567890", joinedOn: "24-04-2026", orders: 24, totalSpent: 240.35, status: "Active" },
  { id: 14, initials: "AH", bgColor: "#F59E0B", name: "Ajay Hegde", email: "ajay.hegde@email.com", phone: "+39 123 4567891", joinedOn: "25-04-2026", orders: 25, totalSpent: 150.00, status: "Suspended" },
  { id: 15, initials: "RK", bgColor: "#10B981", name: "Riya Kapoor", email: "riya.kapoor@email.com", phone: "+39 123 4567892", joinedOn: "26-04-2026", orders: 26, totalSpent: 320.75, status: "Active" },
  { id: 16, initials: "SD", bgColor: "#3B82F6", name: "Sanjay Desai", email: "sanjay.desai@email.com", phone: "+39 123 4567893", joinedOn: "27-04-2026", orders: 27, totalSpent: 198.60, status: "Suspended" },
  { id: 17, initials: "PT", bgColor: "#8B5CF6", name: "Priya Tiwari", email: "priya.tiwari@email.com", phone: "+39 123 4567894", joinedOn: "28-04-2026", orders: 28, totalSpent: 410.20, status: "Active" },
  { id: 18, initials: "VK", bgColor: "#EC4899", name: "Vikram Kumar", email: "vikram.kumar@email.com", phone: "+39 123 4567895", joinedOn: "29-04-2026", orders: 29, totalSpent: 275.50, status: "Suspended" },
  { id: 19, initials: "NS", bgColor: "#14B8A6", name: "Nisha Singh", email: "nisha.singh@email.com", phone: "+39 123 4567896", joinedOn: "30-04-2026", orders: 30, totalSpent: 89.99, status: "Active" },
  { id: 20, initials: "AR", bgColor: "#F97316", name: "Anil Rao", email: "anil.rao@email.com", phone: "+39 123 4567897", joinedOn: "01-05-2026", orders: 31, totalSpent: 512.30, status: "Active" },
  { id: 21, initials: "DK", bgColor: "#6366F1", name: "Deepak Khanna", email: "deepak.khanna@email.com", phone: "+39 123 4567898", joinedOn: "02-05-2026", orders: 32, totalSpent: 600.00, status: "Active" },
  { id: 22, initials: "TG", bgColor: "#10B981", name: "Tanya Gupta", email: "tanya.gupta@email.com", phone: "+39 123 4567899", joinedOn: "03-05-2026", orders: 33, totalSpent: 230.45, status: "Active" },
  { id: 23, initials: "RM", bgColor: "#EF4444", name: "Rohit Mehta", email: "rohit.mehta@email.com", phone: "+39 123 4567900", joinedOn: "04-05-2026", orders: 34, totalSpent: 399.99, status: "Active" },
  { id: 24, initials: "QS", bgColor: "#8B5CF6", name: "Quinn Singh", email: "quinn.singh@email.com", phone: "+39 123 4567901", joinedOn: "05-05-2026", orders: 35, totalSpent: 120.00, status: "Active" },
];
