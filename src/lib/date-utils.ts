export function formatYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDatesInRange(startDate: Date, endDate: Date): string[] {
  const dates: string[] = [];
  const theDate = new Date(startDate);
  theDate.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  while (theDate <= end) {
    const offset = new Date().getTimezoneOffset() * 60000;
    dates.push(new Date(theDate.getTime() - offset).toISOString().split('T')[0]);
    theDate.setDate(theDate.getDate() + 1);
  }
  return dates;
}

export function getDefaultDateRange(): { start: string; end: string } {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return {
    start: formatYMD(new Date(today.getFullYear(), today.getMonth(), 1)),
    end: formatYMD(yesterday),
  };
}
