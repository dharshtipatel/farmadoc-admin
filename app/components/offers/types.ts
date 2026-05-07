export type OfferStatus = "Active" | "Inactive" | "Scheduled" | "Expired";
export type OfferActionType = "activate" | "inactivate" | "remove" | "renew";

export type Offer = {
  id: string;
  name: string;
  type: string;
  appliedOn: string;
  discount: string;
  validFrom: string;
  validTo: string;
  usage: number;
  status: OfferStatus;
  art: "summer" | "winter" | "spring";
};
