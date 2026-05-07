"use client";

import ChangePasswordModal from "../components/profile/ChangePasswordModal";
import { useEffect, useRef, useState } from "react";

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

export default function ProfilePage() {
  const [fullName, setFullName] = useState("Marco Fiorani");
  const [email, setEmail] = useState("seller@farmadoc.it");
  const [profileImage, setProfileImage] = useState(
    "https://i.pravatar.cc/184?img=12"
  );
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("password123");
  const [newPassword, setNewPassword] = useState("password123");
  const [confirmPassword, setConfirmPassword] = useState("password123");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = passwordModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
      if (profileImage.startsWith("blob:")) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, [passwordModalOpen, profileImage]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (profileImage.startsWith("blob:")) {
      URL.revokeObjectURL(profileImage);
    }

    const objectUrl = URL.createObjectURL(file);
    setProfileImage(objectUrl);
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-8">
      <div className="w-[641px] max-w-full bg-white">
        <h1 className="text-[14px] font-semibold text-[#21272A]">My Profile</h1>
        <p className="mt-1 border-b border-[#E8EAED] pb-4 text-[10px] text-[#6B6F72]">
          Manage your personal information and update your account credentials securely.
        </p>

        <div className="mt-5">
          <h2 className="text-[18px] font-semibold font-inter text-black">Personal Information :</h2>

          <div className="mt-4">
            <p className="text-[14px] font-medium font-inter text-[#6B6F72]">Profile Photo</p>
            <div
              className="relative mt-2 inline-flex items-center justify-center overflow-visible rounded-full border border-dashed border-[#1E3862]"
              style={{ width: "102px", height: "102px", padding: "5px" }}
            >
              <img
                src={profileImage}
                alt="Profile"
                className="h-[92px] w-[92px] rounded-full object-cover"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 z-10 flex h-7 w-7 translate-x-[12%] translate-y-[12%] items-center justify-center rounded-full border-2 border-white bg-[#1E3862] text-white shadow-sm"
              >
                <CameraIcon />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-[14px] font-medium font-inter text-black">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="h-8 w-full rounded-md border border-[#9CB3D9] bg-[#F5F8FC] px-3 text-[10px] text-[#21272A] outline-none focus:border-[#1E3862]"
              />
            </div>

            <div className="mt-2">
              <label className="mb-1 block text-[14px] font-medium font-inter text-black">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-8 w-full rounded-md border border-[#9CB3D9] bg-[#F5F8FC] px-3 text-[10px] text-[#21272A] outline-none focus:border-[#1E3862]"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="rounded-md bg-[#1E3862] px-4 py-1.5 text-[9px] font-medium text-white transition-colors hover:bg-[#162b4b]"
            >
              Update Profile
            </button>
          </div>
        </div>

        <div className="mt-5 pt-2">
          <h2 className="text-[18px] font-semibold font-inter text-black">Account Security :</h2>
          <p className="mt-3 text-[16px] font-semibold text-black font-inter">Change Password</p>
          <p className="mt-1 text-[14px] text-[#6B6F72]">
            Change your password to keep your account secure. Make sure it&apos;s strong and unique.
          </p>

          <button
            type="button"
            onClick={() => setPasswordModalOpen(true)}
            className="mt-3 rounded-md bg-[#EDF2FB] px-4 py-2 text-[14px] font-medium text-[#1E3862] transition-colors hover:bg-[#DFE9FF]"
          >
            Change Password
          </button>
        </div>
      </div>

      <ChangePasswordModal
        open={passwordModalOpen}
        currentPassword={currentPassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        onCurrentPasswordChange={setCurrentPassword}
        onNewPasswordChange={setNewPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onClose={() => setPasswordModalOpen(false)}
      />
    </div>
  );
}
