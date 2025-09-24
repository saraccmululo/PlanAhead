
const WeekdayHeaders = () => {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className={`row text-center fw-bold calendar-row`}>
      {weekdays.map((day) => (
        <div key={day} className="col border p-2">
          {day}
        </div>
      ))}
    </div>
  );
};

export default WeekdayHeaders;
