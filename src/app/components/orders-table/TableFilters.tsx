import { Card, CardContent, Stack, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';

interface TableFiltersProps {
    searchTerm: string;
    statusFilter: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onStatusChange: (status: string) => void;
    onReset: () => void;
}

export const TableFilters = ({ searchTerm, statusFilter, onSearchChange, onStatusChange, onReset }: TableFiltersProps) => (
    <Card sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', mb: 4, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        <CardContent sx={{ p: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                <TextField
                    placeholder="Search orders..."
                    size="small"
                    fullWidth
                    value={searchTerm}
                    onChange={onSearchChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchOutlined sx={{ color: '#64748b' }} /></InputAdornment>,
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', backgroundColor: '#f8fafc' } }}
                />
                <FormControl size="small" sx={{ minWidth: { md: 180 }, width: '100%' }}>
                    <InputLabel>Status</InputLabel>
                    <Select value={statusFilter} label="Status" onChange={(e) => onStatusChange(e.target.value)}>
                        <MenuItem value="ALL">All Statuses</MenuItem>
                        <MenuItem value="CREATED">Created</MenuItem>
                        <MenuItem value="PROCESSING">Processing</MenuItem>
                        <MenuItem value="SHIPPED">Shipped</MenuItem>
                        <MenuItem value="DELIVERED">Delivered</MenuItem>
                        <MenuItem value="CANCELED">Canceled</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="outlined" onClick={onReset} sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    color: '#64748b',
                    borderColor: '#e2e8f0',
                    '&:hover': {
                        backgroundColor: '#f8fafc',
                        borderColor: '#cbd5e1'
                    },
                    maxWidth: { md: 80 },
                    width: '100%'
                }}>
                    Reset
                </Button>
            </Stack>
        </CardContent>
    </Card>
);