import { Offer, OfferStatus } from "./types";

export const OFFER_STATS = [
  { title: "Total Offers", value: 120, icon: "/images/Orders.svg" },
  { title: "Active Offers", value: 98, icon: "/images/Orders.svg" },
  { title: "Total Usages", value: 4459, icon: "/images/Orders.svg" },
];

export const OFFERS: Offer[] = [
  { id: "offer-1", name: "SUMMER SALE", type: "Flat Discount", appliedOn: "Showrooms", discount: "EUR25.00", validFrom: "2026-04-30", validTo: "2027-04-30", usage: 30, status: "Active", art: "summer" },
  { id: "offer-2", name: "WINTER CLEARANCE", type: "Percentage Discount", appliedOn: "Products", discount: "20%", validFrom: "2026-05-31", validTo: "2027-05-31", usage: 31, status: "Inactive", art: "winter" },
  { id: "offer-3", name: "SPRING FLASH SALE", type: "Cart Value", appliedOn: "Categories", discount: "EUR40.00", validFrom: "2026-06-30", validTo: "2027-06-30", usage: 32, status: "Scheduled", art: "spring" },
  { id: "offer-4", name: "SUMMER SALE", type: "Flat Discount", appliedOn: "Global", discount: "EUR25.00", validFrom: "2026-07-31", validTo: "2027-07-31", usage: 33, status: "Expired", art: "summer" },
  { id: "offer-5", name: "WINTER CLEARANCE", type: "Percentage Discount", appliedOn: "Showrooms", discount: "20%", validFrom: "2026-08-31", validTo: "2027-08-31", usage: 34, status: "Active", art: "winter" },
  { id: "offer-6", name: "SPRING FLASH SALE", type: "Cart Value", appliedOn: "Products", discount: "EUR40.00", validFrom: "2026-09-30", validTo: "2027-09-30", usage: 30, status: "Active", art: "spring" },
  { id: "offer-7", name: "SUMMER SALE", type: "Flat Discount", appliedOn: "Categories", discount: "EUR25.00", validFrom: "2026-10-31", validTo: "2027-10-31", usage: 31, status: "Active", art: "summer" },
  { id: "offer-8", name: "WINTER CLEARANCE", type: "Percentage Discount", appliedOn: "Global", discount: "20%", validFrom: "2026-11-30", validTo: "2027-11-30", usage: 32, status: "Active", art: "winter" },
  { id: "offer-9", name: "SPRING FLASH SALE", type: "Cart Value", appliedOn: "Showrooms", discount: "EUR40.00", validFrom: "2026-12-31", validTo: "2027-12-31", usage: 33, status: "Active", art: "spring" },
  { id: "offer-10", name: "SUMMER SALE", type: "Flat Discount", appliedOn: "Products", discount: "EUR25.00", validFrom: "2027-01-31", validTo: "2028-01-31", usage: 34, status: "Active", art: "summer" },
  { id: "offer-11", name: "WINTER CLEARANCE", type: "Percentage Discount", appliedOn: "Categories", discount: "20%", validFrom: "2027-02-28", validTo: "2028-02-28", usage: 33, status: "Active", art: "winter" },
  { id: "offer-12", name: "SPRING FLASH SALE", type: "Cart Value", appliedOn: "Global", discount: "EUR40.00", validFrom: "2027-03-31", validTo: "2028-03-31", usage: 34, status: "Active", art: "spring" },
];

export const OFFER_STATUS_STYLES: Record<OfferStatus, { dot: string; text: string }> = {
  Active: { dot: "bg-[#24A148]", text: "text-[#24A148]" },
  Inactive: { dot: "bg-[#6B6F72]", text: "text-[#6B6F72]" },
  Scheduled: { dot: "bg-[#1192E8]", text: "text-[#1192E8]" },
  Expired: { dot: "bg-[#DA1E28]", text: "text-[#DA1E28]" },
};
