const IST_TIMEZONE = "Asia/Kolkata";
const IST_UTC_OFFSET = "+05:30";
const IST_TIME_API_URL =
  "https://timeapi.io/api/Time/current/zone?timeZone=Asia/Kolkata";

type TimeApiResponse = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  seconds: number;
  milliSeconds: number;
  dateTime: string;
  timeZone: string;
};

export type CurrentIstTime = {
  loggedAtIst: Date;
  loggedDateIst: string;
  loggedTimezone: string;
};

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function isValidTimeApiResponse(value: unknown): value is TimeApiResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as Record<string, unknown>;

  return (
    typeof data.year === "number" &&
    Number.isInteger(data.year) &&
    typeof data.month === "number" &&
    Number.isInteger(data.month) &&
    typeof data.day === "number" &&
    Number.isInteger(data.day) &&
    typeof data.hour === "number" &&
    Number.isInteger(data.hour) &&
    typeof data.minute === "number" &&
    Number.isInteger(data.minute) &&
    typeof data.seconds === "number" &&
    Number.isInteger(data.seconds) &&
    typeof data.milliSeconds === "number" &&
    Number.isInteger(data.milliSeconds) &&
    typeof data.dateTime === "string" &&
    typeof data.timeZone === "string"
  );
}

function buildLoggedDateIst(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

function parseIstDateTime(dateTime: string): Date {
  const parsed = new Date(`${dateTime}${IST_UTC_OFFSET}`);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid IST datetime from time API: ${dateTime}`);
  }

  return parsed;
}

function buildFallbackIstTime(): CurrentIstTime {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: IST_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(new Date());
  const partMap = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  const year = Number(partMap.year);
  const month = Number(partMap.month);
  const day = Number(partMap.day);
  const hour = partMap.hour ?? "00";
  const minute = partMap.minute ?? "00";
  const second = partMap.second ?? "00";

  return {
    loggedAtIst: parseIstDateTime(
      `${year}-${pad(month)}-${pad(day)}T${hour}:${minute}:${second}.000`,
    ),
    loggedDateIst: buildLoggedDateIst(year, month, day),
    loggedTimezone: IST_TIMEZONE,
  };
}

export async function getCurrentIstTime(): Promise<CurrentIstTime> {
  try {
    const response = await fetch(IST_TIME_API_URL, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Time API request failed with status ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!isValidTimeApiResponse(data)) {
      throw new Error("Time API returned an unexpected payload");
    }

    return {
      loggedAtIst: parseIstDateTime(data.dateTime),
      loggedDateIst: buildLoggedDateIst(data.year, data.month, data.day),
      loggedTimezone: data.timeZone,
    };
  } catch (error) {
    console.warn(
      "Falling back to the local IST clock after time API failure:",
      error,
    );
    return buildFallbackIstTime();
  }
}
