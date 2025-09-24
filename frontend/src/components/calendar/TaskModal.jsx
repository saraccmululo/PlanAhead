import { useState } from "react";
import { addTask } from "../../utils/api";
import { formatDate } from "../../utils/calendarHelpers";

const TaskModal = ({ selectedDate, onClose, refreshTasks }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await addTask({ title, description, date: formatDate(selectedDate) });
      refreshTasks(); // refetch tasks to update calendar
      onClose();
    } catch (err) {
      setError(err.message) || "Failed to add task. Please try again.";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Add a Task for {selectedDate?.toLocaleDateString()}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  className="form-control"
                  value={description}
                  placeholder="optional"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              {error && <p className="text-danger">{error}</p>}
              <button
                type="submit"
                className="btn btn-primary me-2"
                disabled={loading}
              >
                Add
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
