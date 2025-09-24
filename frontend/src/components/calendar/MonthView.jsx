import { formatDate } from "../../utils/calendarHelpers.js";
import { deleteTask } from "../../utils/api.js";
import WeekdayHeaders from "./WeekDayHeaders.jsx";
import DayCell from "./DayCell.jsx";

const MonthView = ({
  weeks,
  tasks,
  today,
  setSelectedDate,
  setShowModal,
  refreshTasks,
  monthName = { monthName },
  currentYear = { currentYear },
  currentMonth={ currentMonth }
}) => {
  return (
    <>
      <WeekdayHeaders />

      {/* Day rows */}
      {weeks.map((week, wi) => (
        <div className="row text-center calendar-row" key={wi}>
          {week.map((day) => (
            <DayCell
              key={day ? formatDate(day) : wi}
              day={day}
              tasks={tasks}
              today={today}
              setSelectedDate={setSelectedDate}
              setShowModal={setShowModal}
              refreshTasks={refreshTasks}
              deleteTask={deleteTask}
              monthName={monthName}
              currentMonth={currentMonth}
              currentYear={currentYear}
            />
          ))}
        </div>
      ))}
    </>
  );
};

export default MonthView;
