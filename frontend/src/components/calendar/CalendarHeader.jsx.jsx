const CalendarHeader = ({
  view,
  setView,
  today,
  currentYear,
  monthName,
  setCurrentYear,
  setCurrentMonth,
  setSelectedDate,
  goPrev,
  goNext,
}) => {
  const goToCurrent = () => {
    if (view === "month") {
      setCurrentYear(today.getFullYear());
      setCurrentMonth(today.getMonth());
      setSelectedDate(today);
    } else if (view === "week") {
      setSelectedDate(today);
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-2">
      <div>
        <button className="btn btn-outline-secondary me-1 btn-nav" onClick={goPrev}>
          ‹
        </button>
        <button className="btn btn-outline-secondary me-2 btn-nav" onClick={goNext}>
          ›
        </button>

        <button
          type="button"
          className="btn btn-link current-link"
          onClick={goToCurrent}
        >
          <span className="btn-desktop">{view === "month" ? "Got to current month" : "Go to current week"}</span>
          <span className="btn-mobile">Today</span>
          
        </button>
      </div>

      <h4 className="mb-0 calendar-title">{monthName} {currentYear}</h4>

      <div className="btn-group" role="group" aria-label="View toggle">
        <button
          type="button"
          className={`group-btn ${view === "month" ? "active" : ""}`}
          onClick={() => setView("month")}
        >Month
        </button>
        <button
          type="button"
          className={`group-btn ${view === "week" ? "active" : ""}`}
          onClick={() => setView("week")}
        >Week
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
