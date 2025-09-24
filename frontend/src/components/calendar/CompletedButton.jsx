import { useState } from "react"
import { toggleTaskCompleted } from "../../utils/api";

const CompletedButton = ({taskTitle, taskId, currentComplete}) => {
  const[isCompleted, setIsCompleted] = useState(currentComplete);

  const handleToggleComplete = async (e)=>{
    e.stopPropagation(); // prevent triggering parent click

    const newCompleted = !isCompleted;
    setIsCompleted(newCompleted); 

    try{
      await toggleTaskCompleted(taskId, newCompleted)
    } catch (err){
      alert(err.message) || "Failed to perform action. Try again later"
    }
  }
  const buttonClass= isCompleted? "complete-btn-active": "complete-btn";
  return (
    <button className={buttonClass}
      onClick={handleToggleComplete}
      tabIndex={0} // keyboard focusable
      aria-label={`Mark task as completed: ${taskTitle}`}>{isCompleted? "✅":"✔"}</button>
  )
}

export default CompletedButton