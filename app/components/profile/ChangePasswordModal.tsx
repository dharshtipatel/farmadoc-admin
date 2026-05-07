"use client";

import { useState } from "react";

const EyeIcon = () => (
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
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
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
    <path d="m3 3 18 18" />
    <path d="M10.58 10.58a2 2 0 1 0 2.83 2.83" />
    <path d="M9.88 5.09A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a21.76 21.76 0 0 1-5.17 6.08" />
    <path d="M6.61 6.61A21.75 21.75 0 0 0 1 12s4 7 11 7a10.94 10.94 0 0 0 4.12-.82" />
  </svg>
);

export default function ChangePasswordModal({
  open,
  currentPassword,
  newPassword,
  confirmPassword,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onClose,
}: {
  open: boolean;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onClose: () => void;
}) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4"
      onClick={onClose}
    >
      <div
        className="w-[648px] max-w-full rounded-md bg-white shadow-[0_20px_40px_rgba(15,23,42,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-[#E8EAED] px-5 py-4">
          <h3 className="text-[14px] font-semibold text-[#21272A]">Change Password</h3>
          <p className="mt-1 text-[10px] text-[#6B6F72]">
            Change your password to keep your account secure. Make sure it&apos;s strong and unique.
          </p>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div>
            <label className="mb-1.5 block text-[10px] font-medium text-[#21272A]">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(event) => onCurrentPasswordChange(event.target.value)}
                className="h-9 w-full rounded-md border border-[#9CB3D9] bg-white px-3 pr-9 text-[10px] text-[#21272A] outline-none focus:border-[#1E3862]"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8AAAC]"
              >
                {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-medium text-[#21272A]">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(event) => onNewPasswordChange(event.target.value)}
                className="h-9 w-full rounded-md border border-[#9CB3D9] bg-white px-3 pr-9 text-[10px] text-[#21272A] outline-none focus:border-[#1E3862]"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8AAAC]"
              >
                {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-medium text-[#21272A]">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => onConfirmPasswordChange(event.target.value)}
                className="h-9 w-full rounded-md border border-[#9CB3D9] bg-white px-3 pr-9 text-[10px] text-[#21272A] outline-none focus:border-[#1E3862]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8AAAC]"
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 px-5 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-[#F7F7F7] text-[14px] px-8 py-2 font-medium text-[#21272A] transition-colors hover:text-[#1E3862]"
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-md bg-[#1E3862] px-8 py-2 text-[14px] font-medium text-white transition-colors hover:bg-[#162b4b]"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
