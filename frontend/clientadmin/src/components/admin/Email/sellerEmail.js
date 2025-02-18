import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    DialogActions
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import '../styles/seller.css';

const AdminEmailSeller = () => {
    const [templateId, setTemplateId] = useState('');
    const [customSubject, setCustomSubject] = useState('');
    const [customHtml, setCustomHtml] = useState('');
    const [sendTime, setSendTime] = useState(dayjs());
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [emailPreview, setEmailPreview] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);

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
            });

            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to schedule emails');
        } finally {
            setLoading(false);
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
                                    <TextField
                                        fullWidth
                                        label="HTML Content"
                                        value={customHtml}
                                        onChange={(e) => setCustomHtml(e.target.value)}
                                        multiline
                                        rows={6}
                                        className="text-field"
                                        required
                                    />
                                </>
                            )}

                            <DateTimePicker
                                label="Send Time"
                                value={sendTime}
                                onChange={(newValue) => setSendTime(newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth className="text-field" />}
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
                            </Box>
                        </form>
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