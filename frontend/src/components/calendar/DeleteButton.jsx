
const DeleteButton = ({ taskId, taskTitle, deleteTask, refreshTasks }) => {
  const handleClick = async (e) => {
    e.stopPropagation(); // prevent triggering parent click
    
    const confirmed = window.confirm(`Are you sure you want to delete "${taskTitle}"?`);
    if (!confirmed) return;

    try {
      await deleteTask(taskId);
      refreshTasks(); // refresh calendar/tasks
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <button
      className="btn btn-outline-danger btn-sm delete-btn"
      onClick={handleClick}
      tabIndex={0} // keyboard focusable
      aria-label={`Delete task: ${taskTitle}`} // accessibility
    >
      ✘
    </button>
  );
};

export default DeleteButton;
