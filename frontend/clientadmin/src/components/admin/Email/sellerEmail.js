import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    Switch
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import './styles/seller.css';

const AdminEmailSeller = () => {
    const [templateId, setTemplateId] = useState('');
    const [customSubject, setCustomSubject] = useState('');
    const [customHtml, setCustomHtml] = useState('');
    const [sendTime, setSendTime] = useState(dayjs());
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [emailPreview, setEmailPreview] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [isPromotional, setIsPromotional] = useState(false);
    const [sentEmailsCount, setSentEmailsCount] = useState(0);
    const [lastSentDate, setLastSentDate] = useState(null);
    const [lastSentDetails, setLastSentDetails] = useState(null);
    const [scheduledEmailId, setScheduledEmailId] = useState(null);
    const [isLastSentOpen, setIsLastSentOpen ] = useState(false);


    // Fetch templates on component mount
    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await axiosInstance.get('/template-seller');
                setTemplates(response.data);
            } catch (error) {
                toast.error('Failed to fetch templates');
            }
        };
        fetchTemplates();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!templateId && (!customSubject || !customHtml)) {
            toast.error('Either select a template or provide custom email details.');
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.post('/seller-email', {
                templateId: templateId || undefined,
                customSubject: customSubject || undefined,
                customHtml: customHtml || undefined,
                sendTime: sendTime.toISOString(),
                isPromotional
            });

            setSentEmailsCount(response.data.sentEmailsCount);
            setScheduledEmailId(response.data.scheduledEmailId);
            setLastSentDate(new Date().toLocaleDateString());
            setLastSentDetails({
                subject: response.data.subject,
                template: templateId ? templates.find(temp => temp._id === templateId)?.type : 'Custom Email'
            });

            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to schedule emails');
        } finally {
            setLoading(false);
        }
    };

     const handleCancel = async () => {
        if (!scheduledEmailId) {
            toast.error('No scheduled email to cancel');
            return;
        }

        try {
            await axiosInstance.delete(`/cancel-email/${scheduledEmailId}`);
            toast.success('Scheduled email canceled successfully');
            setScheduledEmailId(null);
        } catch (error) {
            toast.error('Failed to cancel scheduled email');
        }
    };


    const handlePreview = () => {
        if (!templateId && (!customSubject || !customHtml)) {
            toast.error('Provide email content to preview.');
            return;
        }

        const selectedTemplate = templates.find((temp) => temp._id === templateId);
        setEmailPreview(selectedTemplate ? selectedTemplate.html : customHtml);
        setPreviewOpen(true);
    };

    const toggleLastSent = () =>{
        setIsLastSentOpen(!isLastSentOpen);
    };


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box className="email-container">
                <Card className="email-card">
                    <CardContent>
                        <Typography variant="h4" gutterBottom align="center" className="email-title">
                            Send Email to Sellers
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth className="form-control">
                                <InputLabel>Select Template</InputLabel>
                                <Select
                                    value={templateId}
                                    onChange={(e) => setTemplateId(e.target.value)}
                                    label="Select Template"
                                >
                                    <MenuItem value="">Custom Email</MenuItem>
                                    {templates.map((template) => (
                                        <MenuItem key={template._id} value={template._id}>
                                            {template.type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {!templateId && (
                                <>
                                    <TextField
                                        fullWidth
                                        label="Subject"
                                        value={customSubject}
                                        onChange={(e) => setCustomSubject(e.target.value)}
                                        className="text-field"
                                        required
                                    />
                                    <ReactQuill
                                        value={customHtml}
                                        onChange={setCustomHtml}
                                        className="quill-editor"
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, false] }],
                                                ['bold', 'italic', 'underline', 'strike'],
                                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                                ['link', 'image'],
                                                ['clean']
                                            ]
                                        }}
                                        formats={[
                                            'header',
                                            'bold', 'italic', 'underline', 'strike',
                                            'list', 'bullet',
                                            'link', 'image'
                                        ]}
                                    />
                                </>
                            )}

                            <DateTimePicker
                                label="Send Time"
                                value={sendTime}
                                onChange={(newValue) => setSendTime(newValue)}
                                renderInput={(params) => <TextField 
                                    {...params} 
                                    fullWidth 
                                    className="text-field date-time-picker "
                                    sx={{
                                        marginTop: 2,
                                        backgroundColor: '#f9f9f9',
                                        borderRadius: '8px',
                                        padding: '12px 16px',
                                        height: '56px',
                                        '& .MuiOutlinedInput-root': {
                                            fontSize: '18px', // Increase font size
                                            color: '#333',
                                            padding: '10px 14px',
                                            '& fieldset': {
                                                borderColor: '#1976d2',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#115293',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#0d47a1',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 'bold',
                                            color: '#1976d2',
                                        },
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    }}
                                />
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={isPromotional}
                                        onChange={(e) => setIsPromotional(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Promotional Email for New Sellers"
                                className="promotional-switch"
                            />

                            <Box className="button-container">
                                <Button variant="outlined" color="secondary" onClick={handlePreview} className="email-button secondary">
                                    Preview Email
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                    className="email-button primary"
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Schedule Emails'}
                                </Button>

                                {scheduledEmailId && (
                                    <Button variant="outlined" color="secondary" onClick={handleCancel} className="email-button cancel">
                                        Cancel Scheduled Email
                                    </Button>
                                )}
                            </Box>
                        </form>

                        <Box className="last-sent-container" onClick={toggleLastSent}>

                        <Typography variant="body1" className="sent-emails-info">
                            Emails Sent: {sentEmailsCount}
                        </Typography>

                        <Typography variant="body1" className="last-sent-date">
                            Last Sent Date: {lastSentDate || 'N/A'}
                        </Typography>

                        {lastSentDetails && (
                            <Typography variant="body2" className="last-sent-details">
                                Sent on: {lastSentDetails.date} <br />
                                Template Used: {lastSentDetails.template} <br />
                                Subject: {lastSentDetails.subject}
                            </Typography>
                        )}
                        </Box>

                    </CardContent>
                </Card>
            </Box>

            <ToastContainer />

            {/* Preview Modal */}
            <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth className="preview-modal">
                <DialogTitle className="preview-modal-title">Email Preview</DialogTitle>
                <DialogContent dividers className="preview-modal-content">
                    <div dangerouslySetInnerHTML={{ __html: emailPreview }} />
                </DialogContent>
                <DialogActions className="preview-modal-actions">
                    <Button onClick={() => setPreviewOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default AdminEmailSeller;