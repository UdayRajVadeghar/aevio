const IST_TIMEZONE = "Asia/Kolkata";
const IST_UTC_OFFSET = "+05:30";
const IST_TIME_API_URL =
  "https://timeapi.io/api/Time/current/zone?timeZone=Asia/Kolkata";
const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

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

/** Fixed English labels so SSR and the browser always match (Node vs Chromium `Intl` differs for `en-IN`). */
const WEEKDAY_LONG_EN = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const WEEKDAY_SHORT_EN = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

const MONTH_LONG_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const MONTH_SHORT_EN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function parseDateKeyParts(dateKey: string): {
  year: number;
  month: number;
  day: number;
} {
  const [yearPart, monthPart, dayPart] = dateKey.split("-");

  return {
    year: Number(yearPart),
    month: Number(monthPart),
    day: Number(dayPart),
  };
}

export function isValidIstDateKey(dateKey: string): boolean {
  if (!DATE_KEY_PATTERN.test(dateKey)) {
    return false;
  }

  const { year, month, day } = parseDateKeyParts(dateKey);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

export function getIstDateKey(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: IST_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const partMap = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return buildLoggedDateIst(
    Number(partMap.year),
    Number(partMap.month),
    Number(partMap.day),
  );
}

export function shiftIstDateKey(dateKey: string, days: number): string {
  if (!Number.isInteger(days)) {
    throw new Error("days must be an integer");
  }

  if (!isValidIstDateKey(dateKey)) {
    throw new Error(`Invalid IST date key: ${dateKey}`);
  }

  const { year, month, day } = parseDateKeyParts(dateKey);
  const nextDate = new Date(Date.UTC(year, month - 1, day + days));

  return buildLoggedDateIst(
    nextDate.getUTCFullYear(),
    nextDate.getUTCMonth() + 1,
    nextDate.getUTCDate(),
  );
}

export function formatIstDateKey(
  dateKey: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (!isValidIstDateKey(dateKey)) {
    return dateKey;
  }

  const { year, month, day } = parseDateKeyParts(dateKey);
  const utc = new Date(Date.UTC(year, month - 1, day));
  const weekdayIndex = utc.getUTCDay();

  const weekday = options?.weekday ?? "short";
  const monthStyle = options?.month ?? "short";

  const weekdayLabel =
    weekday === "long"
      ? WEEKDAY_LONG_EN[weekdayIndex]
      : WEEKDAY_SHORT_EN[weekdayIndex];
  const monthLabel =
    monthStyle === "long"
      ? MONTH_LONG_EN[month - 1]
      : MONTH_SHORT_EN[month - 1];

  return `${weekdayLabel}, ${day} ${monthLabel} ${year}`;
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
