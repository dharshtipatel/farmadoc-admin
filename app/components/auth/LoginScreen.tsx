"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "forgot-password" | "verification" | "reset-password">("login");
  const [email, setEmail] = useState("example@email.com");
  const [password, setPassword] = useState("password");
  const [rememberMe, setRememberMe] = useState(true);
  const [verificationCode, setVerificationCode] = useState(["8", "5", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("password123");
  const [confirmPassword, setConfirmPassword] = useState("password123");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateVerificationDigit = (index: number, value: string) => {
    const nextCode = [...verificationCode];
    nextCode[index] = value.replace(/\D/g, "").slice(-1);
    setVerificationCode(nextCode);
  };

  const EyeIcon = ({ slashed = false }: { slashed?: boolean }) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M1.167 7C2.12 5.08 4.117 3.792 7 3.792C9.883 3.792 11.88 5.08 12.833 7C11.88 8.92 9.883 10.208 7 10.208C4.117 10.208 2.12 8.92 1.167 7Z"
        stroke="#6B7280"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="7" r="1.6" stroke="#6B7280" strokeWidth="1.1" />
      {slashed ? (
        <path
          d="M3.2 10.8L10.8 3.2"
          stroke="#6B7280"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      ) : null}
    </svg>
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      <Image
        src="/images/bg.svg"
        alt=""
        fill
        priority
        className="object-cover"
      />

      <div
        className="relative z-10 box-border rounded-xl bg-white py-10 shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
        style={{ width: "572px", minWidth: "572px", minHeight: "422px" }}
      >
        <div className="mx-auto flex min-h-[342px] max-w-[476px] flex-col">
          <Image
            src="/images/Logo.png"
            alt="FarmaDoc"
            width={108}
            height={24}
            className="h-auto w-[86px]"
            priority
          />

          {mode === "login" ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <h1 className="mt-5 text-[16px] font-semibold text-[#21272A]">FarmaDoc Admin</h1>
              <p className="mt-1 text-[11px] text-[#6B6F72]">
                Sign in to manage your healthcare marketplace
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium text-[#21272A]">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-8 w-full rounded-md border border-[#9CB3D9] bg-white px-3 text-[10px] text-[#21272A] outline-none focus:border-[#1E3862]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-medium text-[#21272A]">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-8 w-full rounded-md border border-[#9CB3D9] bg-white px-3 text-[10px] text-[#21272A] outline-none focus:border-[#1E3862]"
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-[9px] text-[#6B6F72]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe((prev) => !prev)}
                    className="h-3 w-3 accent-[#1E3862]"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setMode("forgot-password")}
                  className="text-[9px] font-medium text-[#1192E8]"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="mt-4 h-8 w-full rounded-md bg-[#1E3862] text-[10px] font-medium text-white transition-colors hover:bg-[#162b4b]"
              >
                Log in
              </button>

              <p className="mt-auto pt-6 text-center text-[8px] text-[#6B6F72]">
                © 2026 FarmaDoc. All rights reserved.
              </p>
            </div>
          ) : mode === "forgot-password" ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <h1 className="mt-5 text-[16px] font-semibold text-[#21272A]">Forgot Password?</h1>
              <p className="mt-1 text-[11px] text-[#6B6F72]">
                No worries, we&apos;ll send you reset instructions
              </p>

              <div className="mt-5 min-h-[123px]">
                <label className="mb-1.5 block text-[10px] font-medium text-[#21272A]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-8 w-full rounded-md border border-[#9CB3D9] bg-white px-3 text-[10px] text-[#21272A] outline-none focus:border-[#1E3862]"
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setMode("verification")}
                  className="mt-4 h-8 w-full rounded-md bg-[#1E3862] text-[10px] font-medium text-white transition-colors hover:bg-[#162b4b]"
                >
                  Continue
                </button>

                <p className="mt-6 text-center text-[8px] text-[#6B6F72]">
                  Remember password?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-medium text-[#1192E8]"
                  >
                    Log in
                  </button>
                </p>
              </div>
            </div>
          ) : mode === "verification" ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <h1 className="mt-5 text-[16px] font-semibold text-[#21272A]">Enter Verification Code</h1>
              <p className="mt-1 text-[11px] text-[#6B6F72]">
                We&apos;ve sent a 6-digit code on your email
              </p>

              <div className="mt-5">
                <label className="mb-2.5 block text-[10px] font-medium text-[#21272A]">Verification Code</label>
                <div className="flex gap-2">
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(event) => updateVerificationDigit(index, event.target.value)}
                      className="h-8 w-8 rounded-md border border-[#D6DADD] bg-white text-center text-[11px] text-[#21272A] outline-none focus:border-[#1E3862]"
                    />
                  ))}
                </div>
              </div>

              <p className="mt-4 text-[9px] text-[#6B6F72]">
                Didn&apos;t receive the code?{" "}
                <button type="button" className="font-medium text-[#1192E8]">
                  Resend
                </button>
              </p>

              <button
                type="button"
                onClick={() => setMode("reset-password")}
                className="mt-auto h-8 w-full rounded-md bg-[#1E3862] text-[10px] font-medium text-white transition-colors hover:bg-[#162b4b]"
              >
                Verify Code
              </button>

              <p className="mt-6 text-center text-[8px] text-[#6B6F72]">
                Â© 2026 FarmaDoc. All rights reserved.
              </p>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col">
              <h1 className="mt-5 text-[16px] font-semibold text-[#21272A]">Reset Password</h1>
              <p className="mt-1 text-[11px] text-[#6B6F72]">
                Create a new secure password for your account
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium text-[#21272A]">New Password</label>
                  <div className="flex h-8 items-center rounded-md border border-[#D6DADD] bg-white px-3">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      className="min-w-0 flex-1 border-0 bg-transparent text-[10px] text-[#21272A] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="ml-2 flex h-4 w-4 items-center justify-center"
                    >
                      <EyeIcon slashed={!showNewPassword} />
                    </button>
                  </div>
                </div>

                <div className="mb-2">
                  <label className="mb-1.5 block text-[10px] font-medium text-[#21272A]">Confirm Password</label>
                  <div className="flex h-8 items-center rounded-md border border-[#D6DADD] bg-white px-3">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="min-w-0 flex-1 border-0 bg-transparent text-[10px] text-[#21272A] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="ml-2 flex h-4 w-4 items-center justify-center"
                    >
                      <EyeIcon slashed={!showConfirmPassword} />
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="mt-auto h-8 w-full rounded-md bg-[#1E3862] text-[10px] font-medium text-white transition-colors hover:bg-[#162b4b]"
              >
                Reset Password
              </button>

              <p className="mt-6 text-center text-[8px] text-[#6B6F72]">
                © 2026 FarmaDoc. All rights reserved.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
