import React, { useState} from 'react';
import axiosInstance from '../../axiosInstance';
import ReactQuill from "react-quill";
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from "react-toastify";
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";

const EmailMaintenance = () => {
    const [formData, setFormData] = useState({
      templateId: "",
      customSubject: "",
      customHtml: "",
      sendTime: new Date(),
    });
    const [showPreview, setShowPreview] = useState(false);
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleHtmlChange = (value) => {
      setFormData({ ...formData, customHtml: value });
    };
  
    const handleDateChange = (name, date) => {
      setFormData({ ...formData, [name]: date });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!formData.templateId && (!formData.customSubject || !formData.customHtml)) {
        toast.error("Either Template ID or custom content is required.");
        return;
      }
  
      if (!formData.sendTime || !formData.startTime || !formData.endTime) {
        toast.error("Please provide valid times.");
        return;
      }
  
      try {
        const response = await axiosInstance.post("/email-maintenance", formData);
        toast.success(response.data.message);
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred.");
      }
    };
  
    // Enhanced ReactQuill Toolbar Options
    const quillModules = {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"], 
        [{ color: [] }, { background: [] }], 
        [{ list: "ordered" }, { list: "bullet" }], 
        ["link", "image", "video"], 
        ["blockquote", "code-block"], 
        [{ align: [] }],
        ["clean"]
      ],
    };

    const handlePreview = () => {
            if (!subject || !content) {
                toast.error('Please fill in both subject and content to preview.');
                return;
            }
    
            setShowPreview(true);
        };
    
        const closePreview = () => {
            setShowPreview(false);
        };
  
    return (
      <div className="container">
        <h2>Schedule Maintenance Email</h2>
  
        <form onSubmit={handleSubmit}>
          <div>
            <label>Template ID (optional):</label>
            <input type="text" name="templateId" value={formData.templateId} onChange={handleChange} />
          </div>
  
          <div>
            <label>Custom Subject:</label>
            <input type="text" name="customSubject" value={formData.customSubject} onChange={handleChange} />
          </div>
  
          <div>
            <label>Custom HTML Content:</label>
            <ReactQuill value={formData.customHtml} onChange={handleHtmlChange} modules={quillModules} />
          </div>
  
          {/* Maintenance Time Settings */}
          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <div>
              <label>Send Time:</label>
              <DatePicker selected={formData.sendTime} onChange={(date) => handleDateChange("sendTime", date)} showTimeSelect dateFormat="Pp" />
            </div>
  
            
          </div>
  
          {/* Email Preview */}
         
  
          <button type="submit">Schedule Email</button>
        </form>

        {showPreview && (
                <div className="preview-modal">
                    <div className="preview-modal-content">
                        <button onClick={closePreview} className="close-preview-btn">
                            Close
                        </button>
                        <h3>Preview of Your Newsletter</h3>
                        <div/>
                    </div>
                </div>
            )}
  
        <ToastContainer />
      </div>
    );
  };
  
  export default EmailMaintenance;