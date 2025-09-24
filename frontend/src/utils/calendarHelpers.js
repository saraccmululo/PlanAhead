
export function formatDate(d) {
  if (!d) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}


/* Build weeks: array of 6 weeks, each week is array of 7 Date objects */
export function generateCalendar(year, month) {
  const weeks = [];
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  const firstDayIndex = firstDayOfMonth.getDay(); // 0 = Sun, 6 = Sat

  // previous month info
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

  let day = 1;
  let nextMonthDay = 1;

  for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
    const week = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      let date;

      // first week
      if (weekIndex === 0 && dayIndex < firstDayIndex) {
        // leading days from previous month
        const prevMonthDate = daysInPrevMonth - firstDayIndex + dayIndex + 1;
        date = new Date(prevYear, prevMonth, prevMonthDate);
      } else if (day > daysInMonth) {
        // trailing days from next month
        date = new Date(
          month === 11 ? year + 1 : year,
          (month + 1) % 12,
          nextMonthDay++
        );
      } else {
        // current month
        date = new Date(year, month, day++);
      }

      week.push(date);
    }

    weeks.push(week);
  }

  return weeks;
}


 /* Week view: start from Sunday of the week that contains selectedDate */
export function startOfWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}
