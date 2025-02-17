import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const AdminEmailForm = () => {
    const [templateId, setTemplateId] = useState('');
    const [customSubject, setCustomSubject] = useState('');
    const [customHtml, setCustomHtml] = useState('');
    const [sendTime, setSendTime] = useState(dayjs());
    const [templates, setTemplates] = useState([]);

    // Fetch templates on component mount
    React.useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await axios.get('/api/email/templates');
                setTemplates(response.data);
            } catch (error) {
                toast.error('Failed to fetch templates');
            }
        };
        fetchTemplates();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('seller-email', {
                templateId: templateId || undefined,
                customSubject: customSubject || undefined,
                customHtml: customHtml || undefined,
                sendTime: sendTime.toISOString(),
            });

            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to schedule emails');
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Send Email to Sellers
                </Typography>
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
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
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="HTML Content"
                                value={customHtml}
                                onChange={(e) => setCustomHtml(e.target.value)}
                                multiline
                                rows={6}
                                sx={{ mb: 2 }}
                            />
                        </>
                    )}

                    <DateTimePicker
                        label="Send Time"
                        value={sendTime}
                        onChange={(newValue) => setSendTime(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
                    />

                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Schedule Emails
                    </Button>
                </form>
            </Box>
            <ToastContainer />
        </LocalizationProvider>
    );
};

export default AdminEmailForm;