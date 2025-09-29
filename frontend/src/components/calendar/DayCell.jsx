import DeleteButton from "./DeleteButton.jsx";
import { formatDate } from "../../utils/calendarHelpers.js";
import CompletedButton from "./CompletedButton.jsx";

const DayCell = ({
  day,
  tasks,
  today,
  setSelectedDate,
  setShowModal,
  refreshTasks,
  deleteTask,
  monthName,
  currentMonth,
  currentYear,
}) => {
  const key = day ? formatDate(day) : undefined;
  const isToday = day && key === formatDate(today);
  const isCurrentMonth = 
    currentMonth !==undefined? day.getMonth() === currentMonth: true;
    //If currentMonth exists(we're in MonthView), we check if the day is in the same month.This will be true for days in the current month, false for days outside the month → they get grayed out.
    //If currentMonth does not exist/is undefined (we're in WeekView), we just return true- all days are treated as “current month” → no graying out.

  const handleClick = () => {
    if (!isCurrentMonth) return; 
    setSelectedDate(day);
    setShowModal(true);
  };

  const dayClassName =
    "col border p-1 calendar-col" +
    (isToday ? " bg-today" : "") +
    (!isCurrentMonth ? " prev-next-month" : "");

  const dayNumberClass =
    "fw-bold day-number" + (!isCurrentMonth ? " small-day" : "");

  if (!day)
    return (
      <div className="col border p-1 calendar-col" style={{ minHeight: 100 }} />
    );

  return (
    <div
      className={dayClassName}
      style={{ minHeight: 100, cursor: isCurrentMonth ? "pointer" : "default" }}
      onClick={handleClick}
      role="button"
      tabIndex={isCurrentMonth ? 0 : -1}
      onKeyDown={(e) => {
        if (!isCurrentMonth) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setSelectedDate(day);
        }
      }}
      aria-label={`Select ${day.getDate()} ${monthName || ""} ${
        currentYear || ""
      }`}
    >
      <div className={dayNumberClass}>{day.getDate()}</div>
      <ul className="list-unstyled small mb-0 task-list">
        {(tasks[key] || []).map((t) => (
          <li
            key={t.id}
            className="task-item"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") e.preventDefault();
            }}
            aria-label={`Task: ${t.title}${
              t.description ? ", " + t.description : ""
            }`}
          >
            <div className="task-title">
              {t.title}
              {t.description && (
                <div
                  className={
                    "task-desc" +
                    (!isCurrentMonth ? " prev-next-month small-day" : "")
                  }
                >
                  {t.description}
                </div>
              )}
            </div>
            {isCurrentMonth && (
              <>
                <CompletedButton
                  taskTitle={t.title}
                  taskId={t.id}
                  currentComplete={t.completed}
                />
                <DeleteButton
                  taskId={t.id}
                  taskTitle={t.title}
                  deleteTask={deleteTask}
                  refreshTasks={refreshTasks}
                />
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DayCell;
