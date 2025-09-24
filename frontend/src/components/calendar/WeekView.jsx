import { formatDate } from "../../utils/calendarHelpers.js";
import { deleteTask } from "../../utils/api.js";
import WeekdayHeaders from "./WeekDayHeaders.jsx";
import DayCell from "./DayCell.jsx";

const WeekView = ({
  weekDays,
  tasks,
  today,
  refreshTasks,
  setSelectedDate,
  setShowModal,
}) => {
  return (
    <>
      <WeekdayHeaders />
      <div className="row text-center calendar-row">
        {weekDays.map((day) => (
          <DayCell /* Day row */
            key={formatDate(day)}
            day={day}
            tasks={tasks}
            today={today}
            setSelectedDate={setSelectedDate}
            setShowModal={setShowModal}
            refreshTasks={refreshTasks}
            deleteTask={deleteTask}
          />
        ))}
      </div>
    </>
  );
};

export default WeekView;
