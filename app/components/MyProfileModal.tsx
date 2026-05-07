"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const CameraIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

export default function MyProfileModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [fullName, setFullName] = useState("Marco Fiorani");
  const [email, setEmail] = useState("seller@farmadoc.it");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        className="w-full max-w-[420px] rounded-md bg-white px-7 py-6 shadow-[0_20px_40px_rgba(15,23,42,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-[14px] font-semibold text-[#21272A]">My Profile</h2>
        <p className="mt-1 border-b border-[#E8EAED] pb-3 text-[10px] text-[#6B6F72]">
          Manage your personal information and update your account credentials securely.
        </p>

        <div className="mt-5">
          <h3 className="text-[12px] font-semibold text-[#21272A]">Personal Information :</h3>

          <div className="mt-4">
            <p className="text-[10px] text-[#6B6F72]">Profile Photo</p>
            <div className="relative mt-2 h-[56px] w-[56px]">
              <Image
                src="/images/user.jpg"
                alt="Profile"
                width={56}
                height={56}
                className="rounded-full border border-[#D6DADD] object-cover"
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#1E3862] text-white shadow-sm"
              >
                <CameraIcon />
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-[10px] font-medium text-[#21272A]">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="h-8 w-full rounded-[3px] border border-[#9CB3D9] bg-[#F5F8FC] px-3 text-[10px] text-[#21272A] outline-none focus:border-[#1E3862]"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-medium text-[#21272A]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-8 w-full rounded-[3px] border border-[#D6DADD] bg-[#F5F8FC] px-3 text-[10px] text-[#21272A] outline-none focus:border-[#1E3862]"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="rounded-[3px] bg-[#1E3862] px-4 py-1.5 text-[9px] font-medium text-white transition-colors hover:bg-[#162b4b]"
            >
              Update Profile
            </button>
          </div>
        </div>

        <div className="mt-5 border-t border-[#E8EAED] pt-4">
          <h3 className="text-[12px] font-semibold text-[#21272A]">Account Security :</h3>
          <p className="mt-3 text-[10px] font-semibold text-[#21272A]">Change Password</p>
          <p className="mt-1 text-[9px] text-[#6B6F72]">
            Change your password to keep your account secure. Make sure it&apos;s strong and unique.
          </p>

          <button
            type="button"
            className="mt-3 rounded-[3px] bg-[#EFF4FF] px-4 py-1.5 text-[9px] font-medium text-[#1E3862] transition-colors hover:bg-[#DFE9FF]"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
