"use client";

import { useEffect, useRef, useState } from "react";

type ImportMode = "seller" | "service" | "product";

type PreviewRow = Record<string, string>;

type ImportStep = "upload" | "preview" | "error";

type Props = {
  open: boolean;
  onClose: () => void;
  mode?: ImportMode;
};

const IMPORT_TITLES: Record<ImportMode, string> = {
  seller: "Import Sellers",
  service: "Import Services to Sellers",
  product: "Bulk Import Products",
};

const IMPORT_DESCRIPTIONS: Record<ImportMode, string> = {
  seller: "Upload a file to import sellers using the predefined format below.",
  service: "Assign and configure services for selected sellers using Excel.",
  product: "Upload multiple products for selected sellers using the predefined Excel format.",
};

const SAMPLE_FILES: Record<ImportMode, string> = {
  seller: "/samples/sellers-samples.xlsx",
  service: "/samples/services-samples.xlsx",
  product: "/samples/products-samples.xlsx",
};

const FILE_REQUIREMENTS: Record<ImportMode, Array<{ key: string; label: string; required: boolean }>> = {
  seller: [
    { key: "seller_name", label: "Seller Name", required: true },
    { key: "phone", label: "Phone", required: true },
    { key: "whatsapp_number", label: "Whatsapp Number", required: true },
    { key: "email", label: "Email", required: true },
    { key: "about_seller", label: "About Seller", required: true },
    { key: "seller_logo", label: "Seller Logo", required: false },
    { key: "full_address", label: "Full Address", required: false },
    { key: "latitude", label: "Latitude", required: false },
    { key: "longitude", label: "Longitude", required: false },
    { key: "working_hours", label: "Working Hours", required: false },
    { key: "platform_features", label: "Platform Features", required: false },
    { key: "payment_methods", label: "Payment Methods", required: false },
  ],
  service: [
    { key: "service_name",      label: "Service Name",      required: true },
    { key: "base_price",        label: "Base Price",        required: false },
    { key: "discount_percent",  label: "Discount Percent",  required: false },
    { key: "discount_value",    label: "Discount Value",    required: false },
    { key: "final_price",       label: "Final Price",       required: false },
    { key: "bookable",          label: "Bookable",          required: false },
    { key: "is_active",         label: "Is Active",         required: false },
    ],
  product: [
    { key: "sku",                 label: "SKU",                 required: false },
    { key: "base_price",          label: "Base Price",          required: false },
    { key: "quantity",            label: "Quantity",            required: false },
    { key: "discount_percent",    label: "Discount Percent",    required: false },
    { key: "discount_value",      label: "Discount Value",      required: false },
    { key: "promotional_price",   label: "Promotional Price",   required: false },
    { key: "product_expiry_date", label: "Product Expiry Date", required: false },
    { key: "promotion_end_date",  label: "Promotion End Date",  required: false },
    { key: "bookable",            label: "Bookable",            required: false },
    ],
};

const PREVIEW_COLUMNS: Record<ImportMode, string[]> = {
  seller: ["Seller Name", "Phone", "Whatsapp Number", "Email", "Notes"],
  service: ["Service Name", "Service Code", "Category", "Price", "Duration"],
  product: ["Product Name", "SKU", "Category", "Price", "Stock"],
};

const PREVIEW_ROWS: Record<ImportMode, PreviewRow[]> = {
  seller: [
    { "Seller Name": "Biru Biru Pharmacy", "Phone": "+39 801 234 789", "Whatsapp Number": "+39 123 456 789", "Email": "info@biru.it", "Notes": "Valid" },
    { "Seller Name": "Caline de sur Pharmacy", "Phone": "+39 897 234 987", "Whatsapp Number": "+39 123 456 789", "Email": "support@cline.it", "Notes": "Valid" },
    { "Seller Name": "MedCafe Pharmacy", "Phone": "+39 141 675 881", "Whatsapp Number": "+39 123 456 789", "Email": "info@medcafe.it", "Notes": "Valid" },
  ],
  service: [
    { "Service Name": "Home Delivery", "Service Code": "DEL-01", "Category": "Logistics", "Price": "€12", "Duration": "30 min" },
    { "Service Name": "Prescription Review", "Service Code": "REV-02", "Category": "Consultation", "Price": "€8", "Duration": "15 min" },
    { "Service Name": "Vaccination", "Service Code": "VAC-03", "Category": "Health", "Price": "€20", "Duration": "45 min" },
  ],
  product: [
    { "Product Name": "Vitamin C Tablets", "SKU": "VC-100", "Category": "Supplements", "Price": "€15", "Stock": "120" },
    { "Product Name": "Reusable Mask", "SKU": "MK-210", "Category": "Personal Care", "Price": "€6", "Stock": "340" },
    { "Product Name": "First Aid Kit", "SKU": "FA-330", "Category": "Medical", "Price": "€25", "Stock": "80" },
  ],
};

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
    fill="none" stroke="#6B6F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
    fill="none" stroke="#A8AAAC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/>
    <line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);

export default function ImportSellersModal({ open, onClose, mode = "seller" }: Props) {
  const [importStep, setImportStep] = useState<ImportStep>("upload");
  const [fileName, setFileName]     = useState("");
  const [fileSize, setFileSize]     = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError]   = useState(""); // ── NEW
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleClose = () => {
    setImportStep("upload");
    setFileName("");
    setFileSize("");
    setIsDragging(false);
    setFileError(""); // ── NEW
    onClose();
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validateFile = (file: File): string => {
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    const validExtensions = [".xlsx", ".xls"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validExtensions.includes(ext) || !validTypes.includes(file.type)) {
      return "Invalid file: missing required column - name";
    }
    if (file.size > maxSize) {
      return "Invalid file: size exceeds 5MB limit";
    }
    return "";
  };

  const handleFile = (file: File) => {
    const error = validateFile(file);
    if (error) {
      setFileError(error);
      // Reset input so same file can be re-selected after fixing
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setFileError("");
    setFileName(file.name);
    setFileSize(`${(file.size / 1024).toFixed(0)} KB`);
    setImportStep("preview");
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const title = IMPORT_TITLES[mode];
  const description = IMPORT_DESCRIPTIONS[mode];
  const sampleFile = SAMPLE_FILES[mode];
  const requirements = FILE_REQUIREMENTS[mode];
  const previewColumns = PREVIEW_COLUMNS[mode];
  const previewRows = PREVIEW_ROWS[mode];

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/85" onClick={handleClose} />}

      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-[880px] flex-col border-l border-[#E8EAED] bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between border-b border-[#E8EAED] px-5 py-4 flex-shrink-0">
          <div>
            <h2 className="text-[15px] font-semibold text-[#21272A]">{title}</h2>
            <p className="mt-0.5 text-[11px] text-[#6B6F72]">
              {description}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
          >
            <CloseIcon />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4">

          {/* ══ UPLOAD STEP ══ */}
          {importStep === "upload" && (
            <div className="flex flex-col gap-4">

              {/* Select File row */}
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-medium text-black">Select File to Import</p>
                <span className="text-[12px] text-[#6B6F72]">(File Size: 5MB Max)</span>
              </div>

              {/* Drop zone + error below */}
              <div>
                <div
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 transition-all ${
                    fileError
                      ? "border-[#DA1E28] bg-red-50/30"
                      : isDragging
                      ? "border-[#1192E8] bg-blue-50"
                      : "border-[#D6DADD] hover:border-[#1192E8] hover:bg-blue-50/20"
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"
                    fill="none" stroke={fileError ? "#DA1E28" : "#6366F1"} strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="8" y1="13" x2="16" y2="13"/>
                    <line x1="8" y1="17" x2="16" y2="17"/>
                    <line x1="8" y1="9" x2="10" y2="9"/>
                  </svg>
                  <p className="mt-3 text-center text-[13px] text-[#6B6F72]">
                    Accepted formats: .xlsx, .xls
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </div>

                {/* Error text — right-aligned below drop zone */}
                {fileError && (
                  <p className="mt-1.5 text-right text-[12px] font-medium text-[#DA1E28]">
                    {fileError}
                  </p>
                )}
              </div>

              {/* File Format Requirements card */}
              <div className="border border-[#E8EAED] rounded-xl overflow-hidden">

                {/* Card header */}
                <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-[#E8EAED]">
                  <div>
                    <p className="text-[13px] font-semibold text-[#21272A]">File Format Requirements</p>
                    <p className="text-[11px] text-[#6B6F72] mt-0.5">
                      Your import file should include the following columns:
                    </p>
                  </div>
                  <a
                    href={sampleFile}
                    download
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#1F7246] hover:bg-[#185c38] text-white rounded-lg text-[12px] font-medium transition-colors flex-shrink-0"
                  >
                    <DownloadIcon />
                    Download Sample File
                  </a>
                </div>

                {/* Scrollable columns table */}
                <div className="overflow-x-auto">
                  <table className="border-collapse w-max min-w-full">
                    <thead>
                      <tr className="border-b border-[#E8EAED]">
                        {requirements.map((col) => (
                          <th
                            key={col.key}
                            className="px-4 py-2.5 text-left text-[12px] font-medium text-[#6B6F72] whitespace-nowrap bg-[#F0F6FF]"
                            style={{ minWidth: "140px" }}
                          >
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {requirements.map((col, i) => (
                          <td
                            key={i}
                            className="px-4 py-2.5 text-[12px] whitespace-nowrap"
                            style={{ minWidth: "140px" }}
                          >
                            {col.required
                              ? <span className="text-[#6B6F72]">Required</span>
                              : <span className="text-[#A8AAAC]">Optional</span>
                            }
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* ══ PREVIEW STEP ══ */}
          {importStep === "preview" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-medium text-black">Select File to Import</p>
                <span className="text-[11px] text-[#6B6F72]">File Can: .xlsx, .xls</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-[#E8EAED] bg-[#F8FAFF] px-4 py-2.5">
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-[#21272A]">{fileName}</p>
                  <p className="text-[10px] text-[#6B6F72]">{fileSize}</p>
                </div>
                <button
                  onClick={() => {
                    setImportStep("upload");
                    setFileName("");
                    setFileSize("");
                    setFileError("");
                  }}
                  className="text-[11px] text-[#DA1E28] hover:underline"
                >
                  Remove
                </button>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-[#21272A]">File Preview</p>
                <span className="text-[11px] text-[#6B6F72]">Total Rows: {previewRows.length}</span>
              </div>

              <div className="overflow-hidden rounded-xl border border-[#E8EAED]">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E8EAED] bg-[#F8FAFF]">
                        {previewColumns.map((col) => (
                          <th key={col}
                            className="border-r border-[#E8EAED] px-3 py-2 text-left text-[10px] font-semibold text-[#6B6F72] last:border-r-0 whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, index) => (
                        <tr key={index} className="border-b border-[#F0F2F4] last:border-b-0 hover:bg-gray-50/50">
                          {previewColumns.map((col) => (
                            <td key={col}
                              className="border-r border-[#F0F2F4] px-3 py-2 text-[10px] text-[#21272A] last:border-r-0">
                              {row[col] ?? ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══ ERROR STEP ══ */}
          {importStep === "error" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-medium text-[#21272A]">Select File to Import</p>
                <span className="text-[11px] text-[#6B6F72]">File Can: .xlsx, .xls</span>
              </div>

              <div
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D6DADD] px-4 py-6 transition-all hover:border-[#1192E8] hover:bg-blue-50/20"
                onClick={() => fileRef.current?.click()}
              >
                <UploadIcon />
                <p className="mt-2 text-[11px] text-[#6B6F72]">
                  No file selected, <span className="font-medium text-[#1192E8]">{title}</span>, file...
                </p>
                <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileInput} />
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold text-[#DA1E28]">File has mismatched required column - Error</p>
                <button className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-[#1F7246] px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-[#1a7a38]">
                  <DownloadIcon />
                  Download Sample File
                </button>
              </div>

              <div>
                <p className="mb-2 text-[11px] font-semibold text-[#21272A]">File Format Requirements</p>
                <p className="mb-2 text-[10px] text-[#6B6F72]">Your file should be structured in the following columns:</p>
                <div className="overflow-hidden rounded-xl border border-[#DA1E28]">
                  <div className="grid grid-cols-5 border-b border-[#FECACA] bg-[#FFF1F2]">
                    {["Seller Name", "Phone", "WhatsApp Number", "Email", "Notes"].map((col) => (
                      <div key={col} className="border-r border-[#FECACA] px-3 py-2 text-[10px] font-semibold text-[#DA1E28] last:border-r-0">
                        {col}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-5 bg-[#FFF8F8]">
                    {["Required", "Required", "Required", "Required", "Req"].map((value, index) => (
                      <div key={index} className="min-h-[32px] border-r border-[#FECACA] px-3 py-2 text-[10px] last:border-r-0">
                        <span className="font-medium text-[#DA1E28]">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between border-t border-[#E8EAED] bg-white px-5 py-3 flex-shrink-0">
          {importStep === "preview" ? (
            <>
              <button
                onClick={() => { setImportStep("upload"); setFileName(""); setFileSize(""); setFileError(""); }}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium text-[#6B6F72] transition-colors hover:bg-gray-50 hover:text-[#21272A]"
              >
                <BackIcon /> Back
              </button>
              <button
                onClick={() => { console.log("Confirming import of", previewRows.length, mode); handleClose(); }}
                className="rounded-lg bg-[#1E3862] px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[#16305a]"
              >
                Confirm Import
              </button>
            </>
          ) : importStep === "error" ? (
            <>
              <button
                onClick={() => setImportStep("upload")}
                className="flex items-center gap-1.5 rounded-lg border border-[#D6DADD] px-3 py-2 text-[12px] font-medium text-[#6B6F72] transition-colors hover:bg-gray-50 hover:text-[#21272A]"
              >
                <BackIcon /> Back
              </button>
              <button disabled className="cursor-not-allowed rounded-lg bg-[#D6DADD] px-4 py-2 text-[12px] font-medium text-[#A8AAAC]">
                Confirm Import
              </button>
            </>
          ) : (
            <div className="flex w-full justify-end">
              <button
                onClick={handleClose}
                className="rounded-lg border border-[#D6DADD] px-4 py-2 text-[12px] font-medium text-[#6B6F72] transition-colors hover:bg-gray-50 hover:text-[#21272A]"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

      </div>
    </>
  );
}