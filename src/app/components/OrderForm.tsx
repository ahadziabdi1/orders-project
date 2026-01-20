"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Box, Typography, MenuItem, SxProps, Theme, CircularProgress } from "@mui/material";
import { PersonOutline, ShoppingBagOutlined, NumbersOutlined, PaidOutlined, LocalOfferOutlined, HomeOutlined } from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { createOrderAction } from "@/app/actions/orders";
import { OrderFormData } from "../types/orders";

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
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<OrderFormData>({
        defaultValues: {
            quantity: 1,
            price_per_unit: 0,
            status: 'CREATED'
        }
    });

    const onSubmit = async (data: OrderFormData) => {
        setIsLoading(true);
        try {
            const result = await createOrderAction(data);
            if (result.success) {
                toast.success(result.message);
                onClose();
            } else {
                toast.error(result.message || "Failed to create order");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
            console.log("An unexpected error occurred", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: { xs: 1, sm: 2 }, width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box>
                    <LabelWithIcon icon={PersonOutline} label="Customer Name" />
                    <TextField
                        fullWidth
                        disabled={isLoading}
                        placeholder="Enter customer name"
                        {...register("customer_name", { required: "Customer name is required", minLength: 2 })}
                        error={!!errors.customer_name}
                        helperText={errors.customer_name?.message}
                    />
                </Box>

                <Box>
                    <LabelWithIcon icon={ShoppingBagOutlined} label="Product" />
                    <TextField
                        fullWidth
                        disabled={isLoading}
                        placeholder="Enter product name"
                        {...register("product_name", { required: "Product name is required" })}
                        error={!!errors.product_name}
                        helperText={errors.product_name?.message}
                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                        <LabelWithIcon icon={NumbersOutlined} label="Quantity" />
                        <TextField
                            fullWidth
                            type="number"
                            disabled={isLoading}
                            slotProps={{
                                input: {
                                    inputProps: {
                                        min: 1
                                    }
                                }
                            }}
                            {...register("quantity", {
                                required: "Quantity is required",
                                min: {
                                    value: 1,
                                    message: "Quantity must be at least 1"
                                },
                                valueAsNumber: true
                            })}
                            error={!!errors.quantity}
                        />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <LabelWithIcon icon={PaidOutlined} label="Unit Price" />
                        <TextField
                            fullWidth
                            type="number"
                            disabled={isLoading}
                            slotProps={{
                                input: {
                                    inputProps: {
                                        step: "0.01",
                                        min: 0.01
                                    }
                                }
                            }}
                            {...register("price_per_unit", {
                                required: "Price is required",
                                min: {
                                    value: 0.01,
                                    message: "Price must be greater than 0"
                                },
                                validate: {
                                    positive: (value) => value > 0 || "Price must be greater than 0"
                                },
                                valueAsNumber: true
                            })}
                            error={!!errors.price_per_unit}
                            helperText={errors.price_per_unit?.message}
                        />
                    </Box>
                </Box>

                <Box>
                    <LabelWithIcon icon={HomeOutlined} label="Delivery Address" />
                    <TextField
                        fullWidth
                        disabled={isLoading}
                        placeholder="Enter full delivery address"
                        {...register("delivery_address", { required: "Delivery address is required" })}
                        error={!!errors.delivery_address}
                        helperText={errors.delivery_address?.message}
                    />
                </Box>

                <Box>
                    <LabelWithIcon icon={LocalOfferOutlined} label="Status" />
                    <TextField select fullWidth disabled={isLoading} defaultValue="CREATED" {...register("status")}>
                        <MenuItem value="CREATED">Created</MenuItem>
                        <MenuItem value="PROCESSING">Processing</MenuItem>
                    </TextField>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
                    <Button onClick={onClose} disabled={isLoading} sx={{ color: '#374151', textTransform: 'none', fontWeight: 600 }}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        sx={{ backgroundColor: '#0f172a', borderRadius: '8px', textTransform: 'none', fontWeight: 600, px: 3, minWidth: '140px' }}
                    >
                        {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Create Order"}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}