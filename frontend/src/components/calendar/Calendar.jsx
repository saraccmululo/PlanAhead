import { useEffect, useState, useContext } from "react";
import { generateCalendar, startOfWeek } from "../../utils/calendarHelpers.js";
import CalendarHeader from "./CalendarHeader.jsx.jsx";
import MonthView from "./MonthView.jsx";
import WeekView from "./WeekView.jsx";
import TaskModal from "./TaskModal.jsx";
import { fetchTasks } from "../../utils/api.js";
import AuthContext from "../authentication/AuthContext.jsx";

const Calendar = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0..11
  const [view, setView] = useState("month");
  const [selectedDate, setSelectedDate] = useState(today);
  const [tasks, setTasks] = useState({});
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [weeks, setWeeks] = useState(generateCalendar(currentYear, currentMonth));
  const { isLoggedIn, logout } = useContext(AuthContext);

  // --- Load tasks function ---//
  const loadTasks = async () => {
    try {
      //1. Get the array of tasks from the database 
        //(data = [{ id: 1, title: "Buy milk", description: "2 liters", date: "2025-09-15", completed: false }, etc]):
      const data = await fetchTasks(); //data is an array of tasks
      
      //2.Transform this array of tasks by date first:
      const tasksByDate = {}; //create an empty object to group tasks by date { "2025-09-15": ["Buy milk"] }.
      data.forEach((task) => {
        const dateKey = task.date; //loop through each task and grab its date e.g. "2025-09-15"

        // Inside the empty tasksByDate object,create a key-value pair: insert dateKey as the key and an empty array [] as its value (value will be an array of tasks).
        if (!tasksByDate[dateKey]) tasksByDate[dateKey] = [];

        // Add the task title to that date's array
        tasksByDate[dateKey].push({
          id: task.id,
          title: task.title,
          description: task.description,
          completed: !! task.completed,//true or false
        }); 
      });
      setTasks(tasksByDate);//tasksByDate looks like this:
        //tasksByDate= {"2025-09-15": [{id: 1, title: "Buy milk", description: "2l", completed: false},],
        //"2025-09-16": [{id: 3, title: "Meeting with team", description: "", completed: false}],}

    } catch (error) {
      //If fetchTasks promise rejects (because of throw new Error), JS engine jumps immediately to the catch(error) block. The error object in catch is automatically the Error instance thrown by fetchTasks. You don’t need to pass the error explicitly.
      if (error.message.includes("Session expired")) {
        logout(); // call your AuthContext logout
      }
      setError(error.message);
    }
  };

  //---Fetching Tasks on mount---
  useEffect(() => {
    if (isLoggedIn) {
      loadTasks();
    } else {
      setTasks({}); //clear tasks on logout
    }
  }, [isLoggedIn]);

  //--Calendar helpers ---
  const monthName = new Date(currentYear, currentMonth, 1).toLocaleString(
    undefined,
    { month: "long" }
  );

  useEffect(()=> {
    setWeeks(generateCalendar(currentYear, currentMonth))
  },[currentYear, currentMonth])

  const weekStart = startOfWeek(selectedDate);

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const goPrev = () => {
    if (view === "month") {
      const d = new Date(currentYear, currentMonth - 1, 1);
      setCurrentYear(d.getFullYear());
      setCurrentMonth(d.getMonth());
      setSelectedDate(d);
    } else if (view === "week") {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - 7); // move 7 days back
      setSelectedDate(d);
    }
  };

  const goNext = () => {
    if (view === "month") {
      const d = new Date(currentYear, currentMonth + 1, 1);
      setCurrentYear(d.getFullYear());
      setCurrentMonth(d.getMonth());
      setSelectedDate(d);
    } else if (view === "week") {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + 7); // move 7 days back
      setSelectedDate(d);
    }
  };

  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container my-3">
      <CalendarHeader
        view={view}
        setView={setView}
        today={today}
        currentYear={currentYear}
        monthName={monthName}
        setCurrentYear={setCurrentYear}
        setCurrentMonth={setCurrentMonth}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        goPrev={goPrev}
        goNext={goNext}
      />
      {view === "month" ? (
        <MonthView
          weeks={weeks}
          tasks={tasks}
          today={today}
          setSelectedDate={setSelectedDate}
          setShowModal={setShowModal}
          refreshTasks={loadTasks}
          monthName={monthName}
          currentMonth={currentMonth}
          currentYear={currentYear}
        />
      ) : (
        <WeekView
          weekDays={weekDays}
          tasks={tasks}
          today={today}
          setSelectedDate={setSelectedDate}
          setShowModal={setShowModal}
          refreshTasks={loadTasks}
          currentMonth={currentMonth}
        />
      )}
      {showModal && (
        <TaskModal
          selectedDate={selectedDate}
          onClose={() => setShowModal(false)}
          refreshTasks={loadTasks}
        />
      )}
    </div>
  );
};

export default Calendar;
