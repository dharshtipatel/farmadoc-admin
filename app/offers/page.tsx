"use client";

import { useMemo, useState } from "react";
import DataTable, { Column } from "../components/DataTable";
import StatsCard from "../components/statscard";
import AddOfferDrawer from "../components/offers/AddOfferDrawer";
import OffersActionModal from "../components/offers/OffersActionModal";
import OfferArtwork from "../components/offers/OfferArtwork";
import OffersRowActions from "../components/offers/OffersRowActions";
import ViewOfferDrawer from "../components/offers/ViewOfferDrawer";
import { OFFERS, OFFER_STATS, OFFER_STATUS_STYLES } from "../components/offers/offersData";
import { Offer, OfferActionType } from "../components/offers/types";
import ExportDropdown from "../components/exportdropdown";

export default function OffersPricingManagementPage() {
  const [offers, setOffers] = useState<Offer[]>(OFFERS);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [modalAction, setModalAction] = useState<OfferActionType | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [viewingOffer, setViewingOffer] = useState<Offer | null>(null);

  const columns: Column<Offer>[] = useMemo(
    () => [
      {
        key: "name",
        label: "Offer Name",
        sortable: true,
        width: "28%",
        render: (_, offer) => (
          <div className="flex items-center gap-2.5">
            <OfferArtwork art={offer.art} />
            <span className="text-[12px] font-semibold text-[#21272A]">{offer.name}</span>
          </div>
        ),
      },
      {
        key: "type",
        label: "Type",
        sortable: true,
        width: "16%",
        render: (value) => <span className="text-[12px] text-[#21272A]">{value}</span>,
      },
      {
        key: "appliedOn",
        label: "Applied On",
        sortable: true,
        width: "12%",
        render: (value) => <span className="text-[12px] font-medium text-[#21272A]">{value}</span>,
      },
      {
        key: "discount",
        label: "Discount",
        sortable: true,
        width: "10%",
        render: (value) => <span className="text-[12px] text-[#21272A]">{value}</span>,
      },
      {
        key: "validFrom",
        label: "Validity",
        sortable: true,
        width: "14%",
        render: (_, offer) => (
          <div className="text-[11px] leading-5 text-[#21272A]">
            <div>{offer.validFrom}</div>
            <div>{offer.validTo}</div>
          </div>
        ),
      },
      {
        key: "usage",
        label: "Usage",
        sortable: true,
        width: "8%",
        render: (value) => <span className="text-[12px] text-[#21272A]">{value}</span>,
      },
      {
        key: "status",
        label: "Status",
        sortable: true,
        width: "12%",
        render: (_, offer) => (
          <div className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${OFFER_STATUS_STYLES[offer.status].dot}`} />
            <span className={`text-[12px] font-medium ${OFFER_STATUS_STYLES[offer.status].text}`}>
              {offer.status}
            </span>
          </div>
        ),
      },
    ],
    []
  );

  const openActionModal = (offer: Offer, action: OfferActionType) => {
    setSelectedOffer(offer);
    setModalAction(action);
    setOpenMenu(null);
  };

  const handleConfirmAction = () => {
    if (!selectedOffer || !modalAction) {
      return;
    }

    if (modalAction === "remove") {
      setOffers((prev) => prev.filter((offer) => offer.id !== selectedOffer.id));
    } else if (modalAction === "renew") {
      setOffers((prev) =>
        prev.map((offer) =>
          offer.id === selectedOffer.id
            ? {
                ...offer,
                status: "Active",
                validFrom: "2027-04-01",
                validTo: "2028-04-01",
              }
            : offer
        )
      );
    } else {
      setOffers((prev) =>
        prev.map((offer) =>
          offer.id === selectedOffer.id
            ? { ...offer, status: modalAction === "activate" ? "Active" : "Inactive" }
            : offer
        )
      );
    }

    setModalAction(null);
    setSelectedOffer(null);
  };

  const handleSaveOffer = (offer: Offer) => {
    setOffers((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === offer.id);

      if (existingIndex >= 0) {
        return prev.map((item) => (item.id === offer.id ? offer : item));
      }

      return [offer, ...prev];
    });

    setEditingOffer(null);
    setDrawerOpen(false);
  };

  return (
    <div className="w-full font-inter">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[18px] font-semibold text-black">Offers &amp; Pricing Management</h1>
          <p className="mt-1 text-[12px] font-medium text-[#6B6F72]">
            Create and manage promotional rules across products, categories, and sellers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingOffer(null);
              setDrawerOpen(true);
            }}
            className="rounded-lg border border-[#1E3862] bg-[#1E3862] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#1a2f52]"
          >
            + Add New Offer
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {OFFER_STATS.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            showChange={false}
          />
        ))}
      </div>

      <DataTable<Offer>
        columns={columns}
        data={offers}
        rowKey={(offer) => offer.id}
        searchFields={["name", "type", "appliedOn", "status"]}
        searchPlaceholder="Search here..."
        showCheckboxes={true}
        headerBackground="#F7F9FC"
        toolbarRight={
          <ExportDropdown />
        }
        renderRowActions={(offer) => (
          <OffersRowActions
            offer={offer}
            open={openMenu === offer.id}
            onToggle={() => setOpenMenu((prev) => (prev === offer.id ? null : offer.id))}
            onView={() => {
              setViewingOffer(offer);
              setOpenMenu(null);
            }}
            onEdit={() => {
              setEditingOffer(offer);
              setDrawerOpen(true);
              setOpenMenu(null);
            }}
            onAction={(action) => openActionModal(offer, action)}
          />
        )}
        customFilter={(offer, query) => {
          const q = query.toLowerCase();
          return (
            offer.name.toLowerCase().includes(q) ||
            offer.type.toLowerCase().includes(q) ||
            offer.appliedOn.toLowerCase().includes(q) ||
            offer.status.toLowerCase().includes(q)
          );
        }}
      />

      <OffersActionModal
        open={modalAction !== null}
        actionType={modalAction}
        target={selectedOffer}
        onClose={() => {
          setModalAction(null);
          setSelectedOffer(null);
        }}
        onConfirm={handleConfirmAction}
      />

      <AddOfferDrawer
        open={drawerOpen}
        mode={editingOffer ? "edit" : "add"}
        initialOffer={editingOffer}
        onClose={() => {
          setDrawerOpen(false);
          setEditingOffer(null);
        }}
        onSubmit={handleSaveOffer}
      />

      <ViewOfferDrawer
        open={viewingOffer !== null}
        offer={viewingOffer}
        onClose={() => setViewingOffer(null)}
      />
    </div>
  );
}
