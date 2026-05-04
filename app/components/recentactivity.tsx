"use client";

interface Activity {
  id: number;
  title: string;
  description: string;
  time: string;
}

const activities: Activity[] = [
  {
    id: 1,
    title: "New Registration",
    description: "User Ayush Santoki just create their account",
    time: "5m",
  },
  {
    id: 2,
    title: "Password Reset",
    description: "User John Doe requested a password reset",
    time: "2m",
  },
  {
    id: 3,
    title: "Profile Update",
    description: "User Sarah Johnson updated her profile picture",
    time: "3m",
  },
  {
    id: 4,
    title: "Email Verification",
    description: "User Emily Chen verified her email address",
    time: "1m",
  },
  {
    id: 5,
    title: "Login Attempt",
    description: "User Mark Thompson successfully logged in",
    time: "4m",
  },
  {
    id: 6,
    title: "Account Deletion",
    description: "User Alex Rivera requested account deletion",
    time: "6m",
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-2xl border border-[#D6DADD] overflow-hidden w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#D6DADD]">
        <h2 className="text-[16px] font-semibold font-inter text-black">Recent Activity</h2>
        <button className="text-[14px] font-inter text-[#1192E8] hover:text-blue-700 font-medium transition-colors">
          View All
        </button>
      </div>

      {/* Activity List */}
      <ul>
        {activities.map((activity, idx) => (
          <li
            key={activity.id}
            className={`flex items-start justify-between px-5 py-3 border-b border-[#D6DADD] last:border-b-0 hover:bg-blue-50/40 transition-colors`}
          >
            <div className="flex-1 min-w-0 pr-4">
              <p className="text-[14px] font-inter font-semibold text-[#21272A]">
                {activity.title}
              </p>
              <p className="text-[13px] font-inter text-[#6B6F72] mt-0.5">
                {activity.description}
              </p>
            </div>
            <span className="text-[13px] font-inter text-[#6B6F72] whitespace-nowrap flex-shrink-0 mt-0.5">
              {activity.time}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
