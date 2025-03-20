import { useState } from "react";
import axios from "axios";

const FeedbackForm = ({ reportId, onFeedbackSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `http://localhost:5002/api/waste/report/${reportId}/feedback`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      alert("Feedback submitted successfully!");
      onFeedbackSubmitted(response.data.wasteReport); // Refresh parent component
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="feedback-form">
      <h3>Submit Feedback</h3>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Rating:</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>{num} Stars</option>
          ))}
        </select>

        <label>Comment:</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your feedback..."></textarea>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;