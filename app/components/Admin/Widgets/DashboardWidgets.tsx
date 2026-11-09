"use client";
import { FC, ReactNode, useMemo } from "react";
import { BiBorderLeft } from "react-icons/bi";
import { PiUsersFourLight } from "react-icons/pi";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import UserAnalytics from "../Analytics/UserAnalytics";
import OrdersAnalytics from "../Analytics/OrdersAnalytics";
import AllInvoices from "../Order/AllInvoices";
import {
  useGetOrdersAnalyticsQuery,
  useGetUsersAnalyticsQuery,
} from "@/redux/features/analytics/analyticsApi";

type Props = {
  open?: boolean;
};

type MonthlyCount = { count: number };

type Comparison = {
  currentMonth: number;
  prevMonth: number;
  percentChange: number;
};

const PANEL =
  "overflow-hidden rounded-3xl border border-[#0B1020]/10 bg-white dark:border-white/10 dark:bg-[#0B1020]";

const compareLastTwoMonths = (
  months?: MonthlyCount[],
): Comparison | undefined => {
  const lastTwo = months?.slice(-2);
  if (lastTwo?.length !== 2) return undefined;

  const prevMonth = lastTwo[0].count;
  const currentMonth = lastTwo[1].count;

  let percentChange: number;
  if (prevMonth !== 0) {
    percentChange = ((currentMonth - prevMonth) / prevMonth) * 100;
  } else {
    percentChange = currentMonth === 0 ? 0 : 100;
  }

  return { currentMonth, prevMonth, percentChange };
};

const DashboardWidgets: FC<Props> = () => {
  const { data: userData, isLoading: usersLoading } =
    useGetUsersAnalyticsQuery();
  const { data: orderData, isLoading: ordersLoading } =
    useGetOrdersAnalyticsQuery();

  const userComparison = useMemo(
    () => compareLastTwoMonths(userData?.users?.last12Months),
    [userData],
  );
  const orderComparison = useMemo(
    () => compareLastTwoMonths(orderData?.orders?.last12Months),
    [orderData],
  );

  return (
    <div className="px-4 pb-14 pt-24 sm:px-7">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-[#0B1020] dark:text-white">
          Dashboard overview
        </h1>
        <p className="mt-1 text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
          Track how your platform is doing this month.
        </p>
      </div>

      {/* Headline numbers */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <StatTile
          icon={<BiBorderLeft size={22} aria-hidden="true" />}
          label="Sales this month"
          comparison={orderComparison}
          loading={ordersLoading}
        />
        <StatTile
          icon={<PiUsersFourLight size={22} aria-hidden="true" />}
          label="New users this month"
          comparison={userComparison}
          loading={usersLoading}
        />
      </div>

      {/* Charts */}
      <div className="mb-6 grid grid-cols-1 gap-6 min-[900px]:grid-cols-2">
        <div className={PANEL}>
          <UserAnalytics isDashboard={true} />
        </div>
        <div className={PANEL}>
          <OrdersAnalytics isDashboard={true} />
        </div>
      </div>

      {/* Recent transactions */}
      <section
        aria-labelledby="transactions-heading"
        className={`${PANEL} px-5 py-5`}
      >
        <div className="mb-4">
          <h2
            id="transactions-heading"
            className="text-base font-extrabold tracking-tight text-[#0B1020] dark:text-white"
          >
            Recent transactions
          </h2>
          <p className="mt-0.5 text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
            Your latest orders.
          </p>
        </div>
        <AllInvoices isDashboard={true} />
      </section>
    </div>
  );
};

type StatTileProps = {
  icon: ReactNode;
  label: string;
  comparison?: Comparison;
  loading: boolean;
};

const StatTile: FC<StatTileProps> = ({ icon, label, comparison, loading }) => {
  const change = comparison?.percentChange ?? 0;
  const isUp = change > 0;
  const isDown = change < 0;
  const changeText = `${isUp ? "+" : isDown ? "-" : ""}${Math.abs(change).toFixed(1)}%`;

  const max = Math.max(
    comparison?.currentMonth ?? 0,
    comparison?.prevMonth ?? 0,
    1,
  );
  const currentWidth = ((comparison?.currentMonth ?? 0) / max) * 100;
  const prevWidth = ((comparison?.prevMonth ?? 0) / max) * 100;

  return (
    <section className={`${PANEL} p-5`} aria-label={label}>
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0B1020]/5 text-[#2F4BFF] dark:bg-white/10">
          {icon}
        </span>

        {comparison && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#0B1020]/5 px-3 py-1 text-xs font-bold text-[#0B1020] dark:bg-white/10 dark:text-white">
            {isUp && <FiArrowUpRight size={14} aria-hidden="true" />}
            {isDown && <FiArrowDownRight size={14} aria-hidden="true" />}
            <span className="sr-only">
              {isUp ? "Up" : isDown ? "Down" : "No change,"}{" "}
            </span>
            {changeText}
          </span>
        )}
      </div>

      <p className="mt-4 text-4xl font-black leading-none tracking-tight text-[#0B1020] dark:text-white">
        {loading || !comparison
          ? "—"
          : comparison.currentMonth.toLocaleString()}
      </p>
      <p className="mt-1.5 text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
        {label}
      </p>

      {comparison && (
        <div className="mt-5 space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-xs font-semibold text-[#0B1020]/70 dark:text-white/70">
              This month
            </span>
            <div
              className="h-2 flex-1 overflow-hidden rounded-full bg-[#0B1020]/5 dark:bg-white/10"
              aria-hidden="true"
            >
              <div
                className="h-full rounded-full bg-[#2F4BFF]"
                style={{ width: `${currentWidth}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-xs font-bold text-[#0B1020] dark:text-white">
              {comparison.currentMonth.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-xs font-semibold text-[#0B1020]/70 dark:text-white/70">
              Last month
            </span>
            <div
              className="h-2 flex-1 overflow-hidden rounded-full bg-[#0B1020]/5 dark:bg-white/10"
              aria-hidden="true"
            >
              <div
                className="h-full rounded-full bg-[#0B1020]/30 dark:bg-white/30"
                style={{ width: `${prevWidth}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-xs font-bold text-[#0B1020] dark:text-white">
              {comparison.prevMonth.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

export default DashboardWidgets;
