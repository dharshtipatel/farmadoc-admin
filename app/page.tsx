import StatsCard from "./components/statscard";
import RevenueChart from "./components/revenuecart";
import TopSellingProducts from "./components/topsellingproducts";
import RecentOrders from "./components/recentorders";
import PharmaciesRequest from "./components/pharmaciesrequest";
import RecentActivity from "./components/recentactivity";

type Stat = {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: string;
};

export default function AdminDashboardPage() {
  const stats: Stat[] = [
  { title: "Top Users", value: 1240, change: "+8.2%", isPositive: true, icon: "/images/Users.svg" },
  { title: "Top Sellers", value: 320, change: "+5.1%", isPositive: true, icon: "/images/PharmaciesReq.svg" },
  { title: "Showroom Pharmacies", value: "$12,400", change: "+12.5%", isPositive: true, icon: "/images/star.svg" },
  { title: "Top Orders", value: 18, change: "-2.4%", isPositive: false, icon: "/images/Orders.svg" },
  { title: "Support Revenue", value: 18, change: "-2.4%", isPositive: false, icon: "/images/revenue.svg" },
];

  return (
    <div className="min-w-0">
      {/* Heading */}
      <h1 className="text-[18px] font-inter font-semibold text-black">
        Dashboard
      </h1>

      <p className="text-[#6B6F72] font-inter font-medium text-[12px] mt-2">
        Welcome back! Here&apos;s what&apos;s happening with FarmaDoc today.
      </p>

      {/* Cards */}
      <div className="mt-6 mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_380px] 2xl:grid-cols-[minmax(0,1fr)_420px]">

        {/* LEFT */}
        <div className="min-w-0">
          <RevenueChart />
        </div>

        {/* RIGHT */}
        <div className="min-w-0">
          <TopSellingProducts />
        </div>

      </div>

        <div className="mt-4 w-full min-w-0">
          <RecentOrders />
        </div>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <PharmaciesRequest />
        <RecentActivity />
      </div>
    </div>
  );
}
