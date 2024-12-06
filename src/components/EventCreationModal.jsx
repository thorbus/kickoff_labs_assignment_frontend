import { useState } from "react";
import axios from "axios";
import "../styles/eventModal.css"


const EventCreationModal = ({ 
  isOpen, 
  onClose, 

}) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const formatDateTime = (date, time) => {
    if (!date || !time) return null;
    return `${date} ${time}:00`;
  };

  const handleCreate = async () => {
    // Validate inputs
    if (!title || !startDate || !startTime) {
      setError("Title, start date, and start time are required.");
      return;
    }
  
    // If end date is not provided, use start date
    const finalEndDate = endDate || startDate;
    const finalEndTime = endTime || 
      // If no end time, add 1 hour to start time
      `${(parseInt(startTime.split(':')[0]) + 1).toString().padStart(2, '0')}:${startTime.split(':')[1]}`;
  
    setIsSubmitting(true);
    setError(null);
  
    try {
      const startDateTime = formatDateTime(startDate, startTime);
      const endDateTime = formatDateTime(finalEndDate, finalEndTime);
  
      // Prepare event data
      const eventData = {
        title,
        description,
        start_time: startDateTime,
        end_time: endDateTime,
      };
  
      const baseUrl = import.meta.env.VITE_APP_BASE_URL;
      const headers = {
        Authorization: `Token ${sessionStorage.getItem('token')}`
      }
  
      // Send API request
      const response = await axios.post(`${baseUrl}/calendar/event/`, eventData, { headers });
  
      // Reset form and close modal
      setTitle("");
      setDescription("");
      setStartDate("");
      setStartTime("");
      setEndDate("");
      setEndTime("");
      onClose();
    } catch (err) {
      // Handle API error
     console.log?.(err.response?.data?.error?.non_field_errors[0]);
      setError(err.response?.data?.error?.non_field_errors[0]|| "Failed to create event. Please try again.");
      console.error("Event creation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-container">
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Create New Event</h2>

          {error && (
            <div  className="error-message">
              {error}
            </div>
          )}

          <label>Event Title:</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            
            required 
          />

          <label>Event Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
       
            required
          ></textarea>
        
     
      
              <label>Start Date:</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
             
                required
              />
        
              <label>Start Time:</label>
              <input 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
     
                required
              />



              <label>End Date </label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            
              />
       
              <label>End Time </label>
              <input 
                type="time" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                
              />
 
        
          <div className="actions-button-container">
            <button 
              onClick={handleCreate} 
              disabled={isSubmitting}
              className="action-button edit-button"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
            <button 
              onClick={onClose} 
              disabled={isSubmitting}
              className="action-button close-button"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCreationModal;