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
    onAction: (action: 'view' | 'edit' | 'delete') => void;
    orderId: string | null;
    onDelete: () => void;
    router: AppRouterInstance;
}

export function ActionMenu({ anchorEl, open, onClose, onAction }: ActionMenuProps) {
    return (
        <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
            <MenuItem onClick={() => { onAction('view'); onClose(); }}>
                <Launch sx={{ fontSize: 18, color: '#64748b' }} />
                <ListItemText primary="View Details" />
            </MenuItem>
            <MenuItem onClick={() => { onAction('edit'); onClose(); }}>
                <EditOutlined sx={{ fontSize: 18, color: '#64748b' }} />
                <ListItemText primary="Edit Product" />
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { onAction('delete'); onClose(); }} sx={{ color: '#ef4444' }}>
                <DeleteOutline sx={{ fontSize: 18 }} />
                <ListItemText primary="Delete Product" />
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