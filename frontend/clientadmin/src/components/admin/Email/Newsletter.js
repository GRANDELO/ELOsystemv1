import React, { useState } from 'react';
import axiosInstance from '../../axiosInstance';
import { ToastContainer, toast } from 'react-toastify'; // For notifications
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill'; // Rich text editor
import 'react-quill/dist/quill.snow.css';
import { Upload, X, Loader2 } from 'lucide-react';
import './styles/email.css';

const NewsLetter = () => {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [newsletterId, setNewsletterId] = useState(null); // Store the newsletter ID after creation
    const [showPreview, setShowPreview] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const removeFile = () => {
        setFile(null);
    };

    const styleNewsletterContent = (content) => {
        return `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    ${content}
                    <footer style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #777;">
                        <p>Best regards,<br/><strong>Bazelink Team</strong></p>
                    </footer>
                </div>
            </div>
        `;
    };

    const handleSendNewsletter = async () => {
        if (!subject || !content) {
            toast.error('Please fill in the subject and content.');
            return;
        }

        setIsLoading(true);

        const styled = styleNewsletterContent(content);


        const formData = new FormData();
        formData.append('subject', subject);
        formData.append('content', styled);
        if (file) {
            formData.append('file', file);
        }

        try {
            const response = await axiosInstance.post('/newsletter', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success(response.data.message);
            setNewsletterId(response.data.newsletterId); // Store the newsletter ID
            setSubject('');
            setContent('');
            setFile(null);
        } catch (error) {
            console.error('Error sending newsletter:', error);
            toast.error(error.response?.data?.message || 'Failed to send newsletter.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendNewsletterToSubscribers = async () => {
        if (!newsletterId) {
            toast.error('No newsletter created yet.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axiosInstance.post('/send-newsletter', {
                newsletterId: newsletterId,
            });

            toast.success(response.data.message);
        } catch (error) {
            console.error('Error sending newsletter to subscribers:', error);
            toast.error(error.response?.data?.message || 'Failed to send newsletter to subscribers.');
        } finally {
            setIsLoading(false);
        }
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
        <div className="admin-panel">
            <div className="admin-card">
                <div className="admin-card-content">
                    <h2 className="admin-title">Create Newsletter</h2>

                    {/* Subject Input */}
                    <div className="form-group">
                        <label>Subject</label>
                        <input
                            type="text"
                            placeholder="Enter subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="form-input"
                        />
                    </div>

                    {/* Rich Text Editor for Content */}
                    <div className="form-group">
                        <label>Content</label>
                        <ReactQuill
                            value={content}
                            onChange={(value) => {
                                console.log('Content:', value); // Debugging: Log the content
                                setContent(value);
                            }}
                            placeholder="Write your newsletter content here..."
                            className="quill-editor"
                            modules={{
                                toolbar: [
                                    [{ header: [1, 2, 3, false] }],
                                    ['bold', 'italic', 'underline', 'strike'],
                                    [{ list: 'ordered' }, { list: 'bullet' }],
                                    ['link', 'image'],
                                    ['clean'],
                                ],
                            }}
                            formats={[
                                'header',
                                'bold', 'italic', 'underline', 'strike',
                                'list', 'bullet',
                                'link', 'image',
                            ]}
                        />
                    </div>

                    {/* File Upload */}
                    <div className="form-group">
                        <label>Attach File (Optional)</label>
                        <div className="file-upload">
                            <label htmlFor="file-upload" className="file-upload-label">
                                <Upload className="upload-icon" />
                                <span>{file ? file.name : 'Choose a file'}</span>
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                onChange={handleFileChange}
                                className="file-input"
                            />
                            {file && <X className="remove-file" onClick={removeFile} />}
                        </div>
                    </div>

                    {/* Create Newsletter Button */}
                    <button
                        onClick={handleSendNewsletter}
                        disabled={isLoading}
                        className="send-button"
                    >
                        {isLoading ? <Loader2 className="spinner" /> : 'Create Newsletter'}
                    </button>

                    {/* Preview Button */}
                    <button
                        onClick={handlePreview}
                        className="preview-button"
                        style={{ marginTop: '10px' }}
                    >
                        Preview Newsletter
                    </button>

                    {/* Send Newsletter to Subscribers Button */}
                    {newsletterId && (
                        <button
                            onClick={handleSendNewsletterToSubscribers}
                            disabled={isLoading}
                            className="send-button"
                            style={{ marginTop: '10px' }}
                        >
                            {isLoading ? <Loader2 className="spinner" /> : 'Send Newsletter to Subscribers'}
                        </button>
                    )}
                </div>
            </div>
            {showPreview && (
                <div className="preview-modal">
                    <div className="preview-modal-content">
                        <button onClick={closePreview} className="close-preview-btn">
                            Close
                        </button>
                        <h3>Preview of Your Newsletter</h3>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: styleNewsletterContent(content),
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Toast Notifications */}
            <ToastContainer />
        </div>
    );
};

export default NewsLetter;