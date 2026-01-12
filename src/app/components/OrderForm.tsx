"use client";

import { useForm } from "react-hook-form";
import { TextField, Button, Box, Typography, MenuItem, SxProps, Theme } from "@mui/material";
import { PersonOutline, ShoppingBagOutlined, NumbersOutlined, PaidOutlined, LocalOfferOutlined, HomeOutlined } from "@mui/icons-material";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type OrderFormData = {
    product_name: string;
    customer_name: string;
    quantity: number;
    price_per_unit: number;
    delivery_address: string;
    status: string;
};

interface OrderFormProps {
    onClose: () => void;
}

const LabelWithIcon = ({ icon: Icon, label }: { icon: React.ElementType<{ sx?: SxProps<Theme> }>, label: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Icon sx={{ fontSize: 18, color: 'text.secondary' }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151' }}>
            {label}
        </Typography>
    </Box>
);

export default function OrderForm({ onClose }: OrderFormProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<OrderFormData>({
        defaultValues: {
            quantity: 1,
            price_per_unit: 0,
            status: 'CREATED'
        }
    });
    const router = useRouter();

    const onSubmit = async (data: OrderFormData) => {
        const { error } = await supabase.from("orders").insert([
            {
                product_name: data.product_name,
                customer_name: data.customer_name,
                quantity: Number(data.quantity),
                price_per_unit: Number(data.price_per_unit),
                delivery_address: data.delivery_address,
                status: data.status
            }
        ]);

        if (error) {
            alert("Error: " + error.message);
        } else {
            reset();
            router.refresh();
            onClose();
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                p: { xs: 1, sm: 2 },
                width: '100%',
                '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                },
                '& .MuiFormHelperText-root': {
                    color: '#ef4444',
                    marginLeft: 0,
                    fontWeight: 500
                },
                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                    display: 'block',
                    opacity: 1,
                }
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

                {/* Customer Name */}
                <Box>
                    <LabelWithIcon icon={PersonOutline} label="Customer Name" />
                    <TextField
                        fullWidth
                        placeholder="Enter customer name"
                        {...register("customer_name", { required: "Customer name is required", minLength: 2 })}
                        error={!!errors.customer_name}
                        helperText={errors.customer_name?.message}
                    />
                </Box>

                {/* Product */}
                <Box>
                    <LabelWithIcon icon={ShoppingBagOutlined} label="Product" />
                    <TextField
                        fullWidth
                        placeholder="Enter product name"
                        {...register("product_name", { required: "Product name is required" })}
                        error={!!errors.product_name}
                        helperText={errors.product_name?.message}
                    />
                </Box>

                {/* Quantity and Price Row */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2
                }}>
                    <Box sx={{ flex: 1 }}>
                        <LabelWithIcon icon={NumbersOutlined} label="Quantity" />
                        <TextField
                            fullWidth
                            type="number"
                            {...register("quantity", { required: true, min: 1 })}
                            error={!!errors.quantity}
                        />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <LabelWithIcon icon={PaidOutlined} label="Unit Price" />
                        <TextField
                            fullWidth
                            type="number"
                            inputProps={{ step: "0.01" }}
                            {...register("price_per_unit", { required: "Price is required", min: 0.01 })}
                            error={!!errors.price_per_unit}
                            helperText={errors.price_per_unit?.message}
                        />
                    </Box>
                </Box>

                {/* Delivery Address */}
                <Box>
                    <LabelWithIcon icon={HomeOutlined} label="Delivery Address" />
                    <TextField
                        fullWidth
                        placeholder="Enter full delivery address"
                        {...register("delivery_address", { required: "Delivery address is required" })}
                        error={!!errors.delivery_address}
                        helperText={errors.delivery_address?.message}
                    />
                </Box>

                {/* Status */}
                <Box>
                    <LabelWithIcon icon={LocalOfferOutlined} label="Status" />
                    <TextField
                        select
                        fullWidth
                        defaultValue="CREATED"
                        {...register("status")}
                    >
                        <MenuItem value="CREATED">Created</MenuItem>
                        <MenuItem value="PROCESSING">Processing</MenuItem>
                    </TextField>
                </Box>

                {/* Action Buttons */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column-reverse', sm: 'row' },
                    justifyContent: 'flex-end',
                    gap: 1.5,
                    mt: 1
                }}>
                    <Button
                        onClick={onClose}
                        fullWidth={false}
                        sx={{
                            color: '#374151',
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                            width: { xs: '100%', sm: 'auto' },
                            '&:hover': { backgroundColor: '#f3f4f6' }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            backgroundColor: '#0f172a',
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                            width: { xs: '100%', sm: 'auto' },
                            '&:hover': { backgroundColor: '#1e293b' }
                        }}
                    >
                        Create Order
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}