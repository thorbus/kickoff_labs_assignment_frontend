import React, { useState } from "react";
import axios from "axios";
import "../styles/eventModal.css";

const EventDetailsModal = ({ isOpen, event, onClose, onEventUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [editedEvent, setEditedEvent] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
  });
  const [error, setError] = useState(null);

  if (!isOpen || !event) return null;

  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const headers = {
    Authorization: `Token ${sessionStorage.getItem("token")}`,
  };

  const handleEdit = () => {
    setEditedEvent({
      title: event.title,
      description: event.extendedProps?.description || "",
      start_time: event.start.toISOString().slice(0, 19).replace("T", " "),
      end_time: event.end
        ? event.end.toISOString().slice(0, 19).replace("T", " ")
        : event.start.toISOString().slice(0, 19).replace("T", " "),
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.patch(
        `${baseUrl}/calendar/event/${event.id}/`,
        editedEvent,
        { headers }
      );

      onEventUpdate(response.data);
      setIsEditing(false);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update event");
      console.error("Event update error:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/calendar/event/${event.id}/`, { headers });
      event.remove();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete event");
      console.error("Event deletion error:", err);
    }
  };

  if (isDeleteConfirmationOpen) {
    return (
      <div className="modal-container">
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>

            {error && (
              <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
            )}

            <div style={{ marginBottom: "15px", textAlign: "center" }}>
              Are you sure you want to delete the event '{event.title}'?
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() => setIsDeleteConfirmationOpen(false)}
                className="action-button cancel-button"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="action-button delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (isEditing) {
    return (
      <div className="modal-container">
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Event</h2>

            {error && (
              <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
            )}

            <label>Event Title:</label>
            <input
              type="text"
              value={editedEvent.title}
              onChange={(e) =>
                setEditedEvent({ ...editedEvent, title: e.target.value })
              }
              style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
              required
            />

            <label>Event Description:</label>
            <textarea
              value={editedEvent.description}
              onChange={(e) =>
                setEditedEvent({ ...editedEvent, description: e.target.value })
              }
              style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
            ></textarea>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <div>
                <label>Start Date/Time:</label>
                <input
                  type="datetime-local"
                  value={editedEvent.start_time.replace(" ", "T")}
                  onChange={(e) =>
                    setEditedEvent({
                      ...editedEvent,
                      start_time: e.target.value.replace("T", " "),
                    })
                  }
                  style={{ width: "100%", padding: "5px" }}
                  required
                />
              </div>

              <div>
                <label>End Date/Time:</label>
                <input
                  type="datetime-local"
                  value={editedEvent.end_time.replace(" ", "T")}
                  onChange={(e) =>
                    setEditedEvent({
                      ...editedEvent,
                      end_time: e.target.value.replace("T", " "),
                    })
                  }
                  style={{ width: "100%", padding: "5px" }}
                />
              </div>
            </div>

            <div className="actions-button-container">
              <button
                onClick={handleSaveEdit}
                className="action-button edit-button"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="action-button cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-container">
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Event Details</h2>

          {error && (
            <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
          )}

          <div>
            <strong>ID:</strong>
            <span>{event.id}</span>
          </div>

          <div>
            <strong>Title:</strong>
            <span>{event.title}</span>
          </div>

          <div>
            <strong>Description:</strong>
            <span>{event.extendedProps?.description || "No description"}</span>
          </div>

          <div>
            <strong>Start:</strong>
            <span>{event.start.toLocaleString()}</span>
          </div>

          {event.end && (
            <div style={{ marginBottom: "15px" }}>
              <strong>End:</strong>
              <span>{event.end.toLocaleString()}</span>
            </div>
          )}

          <div className="actions-button-container">
            <button onClick={handleEdit} className="action-button edit-button">
              Edit
            </button>

            <button
              onClick={() => setIsDeleteConfirmationOpen(true)}
              className="action-button delete-button"
            >
              Delete
            </button>

            <button onClick={onClose} className="action-button close-button">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
