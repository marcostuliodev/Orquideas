import { NextRequest, NextResponse } from "next/server";
import { getLiveWeather, getHistoricalAverages, getForecast } from "@/lib/climate/live";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city");
  if (!city) {
    return NextResponse.json({ error: "city is required" }, { status: 400 });
  }
  const month = new Date().getMonth() + 1;
  const [live, historical, forecast] = await Promise.all([
    getLiveWeather(city),
    getHistoricalAverages(city, month),
    getForecast(city, 5),
  ]);
  return NextResponse.json({ live, historical, forecast });
}
