"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import { MdSwipe } from "react-icons/md";
import Loader from "../../Loader/Loader";
import { useGetCoursesAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import { IMonthData } from "@/app/types";

type Point = { name: string; count: number };
type Range = 3 | 6 | 12;

const RANGES: Range[] = [3, 6, 12];
const COBALT = "#2F4BFF";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]";

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  return (
    <div className="rounded-2xl border border-[#0B1020]/10 bg-white px-4 py-2.5 dark:border-white/10 dark:bg-[#0B1020]">
      <p className="text-xs font-semibold text-[#0B1020]/70 dark:text-white/70">
        {label}
      </p>
      <p className="text-sm font-extrabold tracking-tight text-[#0B1020] dark:text-white">
        {value.toLocaleString()} {value === 1 ? "course" : "courses"}
      </p>
    </div>
  );
};

const toShortName = (month: string) => {
  const parts = month.split(" ");
  return parts.length === 3 ? `${parts[1]} ${parts[2].slice(-2)}` : month;
};

const CoursesAnalytics = () => {
  const { data, isLoading } = useGetCoursesAnalyticsQuery();
  const [isMobile, setIsMobile] = useState(false);
  const [range, setRange] = useState<Range>(12);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const points = useMemo<Point[]>(
    () =>
      (data?.course?.last12Months ?? []).map((item: IMonthData) => ({
        name: toShortName(item.month),
        count: item.count,
      })),
    [data],
  );

  const shown = useMemo(() => points.slice(-range), [points, range]);

  const summary = useMemo(() => {
    if (points.length === 0) return null;
    const total = shown.reduce((sum, p) => sum + p.count, 0);

    let change: number | undefined;
    if (points.length >= 2) {
      const prev = points[points.length - 2].count;
      const curr = points[points.length - 1].count;
      change = prev !== 0 ? ((curr - prev) / prev) * 100 : curr === 0 ? 0 : 100;
    }
    return { total, change };
  }, [points, shown]);

  if (isLoading) return <Loader />;

  const change = summary?.change;
  const isUp = (change ?? 0) > 0;
  const isDown = (change ?? 0) < 0;
  const rangeLabel = `last ${range} months`;
  const mobileWidth = Math.max(320, shown.length * 52);

  const tick = (size: number) => ({
    fill: "currentColor",
    fillOpacity: 0.7,
    fontSize: size,
    fontWeight: 600,
  });

  const grid = (
    <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.1} />
  );

  const tooltip = (
    <Tooltip
      content={<CustomTooltip />}
      cursor={{ stroke: "currentColor", strokeOpacity: 0.3, strokeWidth: 1 }}
    />
  );

  const line = (
    <Line
      type="monotone"
      dataKey="count"
      stroke={COBALT}
      strokeWidth={3}
      isAnimationActive={false}
      dot={{ r: 4, fill: COBALT, stroke: "#fff", strokeWidth: 2 }}
      activeDot={{ r: 6, fill: COBALT, stroke: "#fff", strokeWidth: 2 }}
    />
  );

  return (
    <div className="mx-auto mt-[80px] max-w-[95%] rounded-3xl border border-[#0B1020]/10 bg-white p-4 dark:border-white/10 dark:bg-[#0B1020] sm:mt-[120px] sm:p-8">
      {/* Header + range control */}
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-lg font-extrabold tracking-tight text-[#0B1020] dark:text-white">
          Courses analytics
        </h1>

        <div
          role="group"
          aria-label="Time range"
          className="grid w-fit grid-cols-3 gap-1 rounded-full bg-[#0B1020]/5 p-1 dark:bg-white/10"
        >
          {RANGES.map((r) => {
            const active = r === range;
            return (
              <button
                key={r}
                type="button"
                aria-pressed={active}
                onClick={() => setRange(r)}
                className={`h-8 rounded-full px-3 text-sm font-bold transition-colors duration-150 motion-reduce:transition-none ${FOCUS} ${
                  active
                    ? "bg-[#2F4BFF] text-white"
                    : "text-[#0B1020]/70 hover:text-[#0B1020] dark:text-white/70 dark:hover:text-white"
                }`}
              >
                {r} months
              </button>
            );
          })}
        </div>
      </div>

      {!summary ? (
        <p className="py-10 text-center text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
          There&apos;s no course data yet. It will show up here once you publish
          a course.
        </p>
      ) : (
        <>
          {/* Headline */}
          <div className="mb-6 flex flex-wrap items-end gap-x-4 gap-y-2">
            <div>
              <p className="text-4xl font-black leading-none tracking-tight text-[#0B1020] dark:text-white">
                {summary.total.toLocaleString()}
              </p>
              <p className="mt-1.5 text-sm font-semibold text-[#0B1020]/70 dark:text-white/70">
                New courses in the {rangeLabel}
              </p>
            </div>

            {change !== undefined && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#0B1020]/5 px-3 py-1 text-xs font-bold text-[#0B1020] dark:bg-white/10 dark:text-white">
                {isUp && <FiArrowUpRight size={14} aria-hidden="true" />}
                {isDown && <FiArrowDownRight size={14} aria-hidden="true" />}
                <span className="sr-only">
                  {isUp ? "Up" : isDown ? "Down" : "No change,"}{" "}
                </span>
                {isUp ? "+" : isDown ? "-" : ""}
                {Math.abs(change).toFixed(1)}% vs last month
              </span>
            )}
          </div>

          {isMobile && shown.length > 6 && (
            <p className="mb-3 flex w-fit items-center gap-1.5 rounded-full bg-[#0B1020]/5 px-3 py-1.5 text-xs font-bold text-[#0B1020] dark:bg-white/10 dark:text-white">
              <MdSwipe size={16} aria-hidden="true" />
              Swipe the chart to see earlier months
            </p>
          )}

          <div className="text-[#0B1020] dark:text-white">
            {/* Visual only; screen readers get the same numbers as a table. */}
            <div
              role="img"
              aria-label={`Line chart of new courses per month. ${shown
                .map((p) => `${p.name}: ${p.count}`)
                .join(", ")}.`}
            >
              {isMobile ? (
                <div className="flex items-stretch overflow-hidden">
                  {/* Fixed y-axis */}
                  <div className="w-[32px] shrink-0">
                    <LineChart
                      width={32}
                      height={240}
                      data={shown}
                      margin={{ top: 10, right: 0, left: -28, bottom: 20 }}
                    >
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={tick(10)}
                        allowDecimals={false}
                      />
                    </LineChart>
                  </div>

                  {/* Scrollable chart body */}
                  <div className="flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <LineChart
                      width={mobileWidth}
                      height={240}
                      data={shown}
                      margin={{ top: 10, right: 16, left: 10, bottom: 20 }}
                    >
                      {grid}
                      <XAxis
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tick={tick(10)}
                      />
                      {tooltip}
                      {line}
                    </LineChart>
                  </div>
                </div>
              ) : (
                <div style={{ height: "45vh", width: "100%" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={shown}
                      margin={{ top: 10, right: 20, left: -15, bottom: 0 }}
                    >
                      {grid}
                      <XAxis
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tick={tick(11)}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={tick(11)}
                        allowDecimals={false}
                      />
                      {tooltip}
                      {line}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <table className="sr-only">
              <caption>New courses per month</caption>
              <thead>
                <tr>
                  <th scope="col">Month</th>
                  <th scope="col">Courses</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((p, i) => (
                  <tr key={i}>
                    <th scope="row">{p.name}</th>
                    <td>{p.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default CoursesAnalytics;
