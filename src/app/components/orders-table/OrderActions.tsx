import {
    Menu, MenuItem, ListItemText, Divider, Dialog,
    DialogTitle, DialogContent, DialogActions, Button, Typography
} from '@mui/material';
import { Launch, EditOutlined, DeleteOutline } from '@mui/icons-material';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface ActionMenuProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    orderId: string | null;
    onDelete: () => void;
    router: AppRouterInstance;
}

export function ActionMenu({ anchorEl, open, onClose, orderId, onDelete, router }: ActionMenuProps) {
    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            elevation={0}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: '12px',
                        minWidth: '180px',
                        mt: 1,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        '& .MuiMenuItem-root': {
                            px: 2, py: 1.2, fontSize: '0.875rem', fontWeight: 500, gap: 1.5,
                            '&:hover': { backgroundColor: '#f8fafc' }
                        },
                    }
                }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem onClick={() => { router.push(`/orders/${orderId}`); onClose(); }}>
                <Launch sx={{ fontSize: 18, color: '#64748b' }} />
                <ListItemText primary="View Details" />
            </MenuItem>

            <MenuItem onClick={() => { router.push(`/orders/${orderId}?edit=true`); onClose(); }}>
                <EditOutlined sx={{ fontSize: 18, color: '#64748b' }} />
                <ListItemText primary="Edit Order" />
            </MenuItem>

            <Divider sx={{ my: 1, borderColor: '#f1f5f9' }} />

            <MenuItem
                onClick={onDelete}
                sx={{ color: '#ef4444', '&:hover': { backgroundColor: '#fef2f2 !important' } }}
            >
                <DeleteOutline sx={{ fontSize: 18 }} />
                <ListItemText primary="Delete Order" />
            </MenuItem>
        </Menu>
    );
}

interface DeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function DeleteDialog({ open, onClose, onConfirm }: DeleteDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            slotProps={{
                paper: {
                    sx: { borderRadius: '12px', p: 1, maxWidth: '400px' }
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 800, pt: 3, pb: 1 }}>Delete Order</DialogTitle>
            <DialogContent>
                <Typography sx={{ color: '#64748b' }}>
                    Are you sure? This action is permanent and cannot be undone.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 1 }}>
                <Button onClick={onClose} sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600 }}>
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    sx={{
                        backgroundColor: '#ef4444',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        '&:hover': { backgroundColor: '#dc2626' }
                    }}
                >
                    Delete Order
                </Button>
            </DialogActions>
        </Dialog>
    );
}