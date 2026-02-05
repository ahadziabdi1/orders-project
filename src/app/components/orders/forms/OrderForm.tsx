"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box, MenuItem, CircularProgress, Autocomplete } from "@mui/material";
import {
    PersonOutline, ShoppingBagOutlined, NumbersOutlined,
    PaidOutlined, LocalOfferOutlined, HomeOutlined
} from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import { createOrderAction } from "@/app/actions/orders";
import { OrderFormData, Product, Customer } from "@/app/types/types";
import LabelWithIcon from "@/app/components/common/LabelWithIcon";

interface OrderFormProps {
    onClose: () => void;
}

export default function OrderForm({ onClose }: OrderFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [lookupsLoading, setLookupsLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);

    const { control, register, handleSubmit, watch, setValue, formState: { errors } } = useForm<OrderFormData>({
        defaultValues: {
            quantity: 1,
            total_price: 0,
            status: 'CREATED'
        }
    });

    const selectedProductId = watch('product_id');
    const quantity = watch('quantity');

    useEffect(() => {
        async function loadData() {
            const [pRes, cRes] = await Promise.all([
                supabase.from('products').select('*'),
                supabase.from('customers').select('*')
            ]);
            setProducts(pRes.data || []);
            setCustomers(cRes.data || []);
            setLookupsLoading(false);
        }
        loadData();
    }, []);

    useEffect(() => {
        const product = products.find(p => p.id === selectedProductId);
        if (product) {
            setValue('total_price', product.unit_price * (quantity || 0));
        }
    }, [selectedProductId, quantity, products, setValue]);

    const onSubmit = async (data: OrderFormData) => {
        setIsLoading(true);
        try {
            const payload = {
                product_id: data.product_id,
                quantity: data.quantity,
                total_price: data.total_price,
                delivery_address: data.delivery_address,
                status: data.status,
                customer_id: data.customer_uuid 
            };

            const result = await createOrderAction(payload as any);

            if (result.success) {
                toast.success(result.message);
                onClose();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    if (lookupsLoading) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress size={30} sx={{ color: '#0f172a' }} />
            </Box>
        );
    }

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: { xs: 1, sm: 2 }, width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

                <Box>
                    <LabelWithIcon icon={PersonOutline} label="Customer Name" />
                    <Controller
                        name="customer_uuid"
                        control={control}
                        rules={{ required: "Selecting a customer is required" }}
                        render={({ field }) => (
                            <Autocomplete
                                options={customers}
                                disabled={isLoading}
                                getOptionLabel={(option) => option.full_name}
                                onChange={(_, data) => {
                                    field.onChange(data?.customer_uuid);

                                    if (data?.delivery_address) {
                                        setValue('delivery_address', data.delivery_address, {
                                            shouldValidate: true,
                                            shouldDirty: true
                                        });
                                    } else {
                                        setValue('delivery_address', '');
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Search customers..."
                                        error={!!errors.customer_uuid}
                                        helperText={errors.customer_uuid?.message}
                                    />
                                )}
                            />
                        )}
                    />
                </Box>

                <Box>
                    <LabelWithIcon icon={ShoppingBagOutlined} label="Product" />
                    <Controller
                        name="product_id"
                        control={control}
                        rules={{ required: "Selecting a product is required" }}
                        render={({ field }) => (
                            <Autocomplete
                                options={products}
                                disabled={isLoading}
                                getOptionLabel={(option) => `${option.name} ($${option.unit_price})`}
                                onChange={(_, data) => field.onChange(data?.id)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Search products..."
                                        error={!!errors.product_id}
                                        helperText={errors.product_id?.message}
                                    />
                                )}
                            />
                        )}
                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                        <LabelWithIcon icon={NumbersOutlined} label="Quantity" />
                        <TextField
                            fullWidth
                            type="number"
                            disabled={isLoading}
                            slotProps={{ input: { inputProps: { min: 1 } } }}
                            {...register("quantity", {
                                required: "Quantity is required",
                                valueAsNumber: true,
                                min: 1
                            })}
                            error={!!errors.quantity}
                        />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <LabelWithIcon icon={PaidOutlined} label="Total Price ($)" />
                        <TextField
                            fullWidth
                            disabled
                            value={watch('total_price')?.toFixed(2)}
                            sx={{ "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#0f172a", fontWeight: 700 } }}
                        />
                    </Box>
                </Box>

                <Box>
                    <LabelWithIcon icon={HomeOutlined} label="Delivery Address" />
                    <TextField
                        fullWidth
                        disabled={isLoading || (!!watch('customer_uuid') && !!customers.find(c => c.customer_uuid === watch('customer_uuid'))?.delivery_address)}

                        {...register("delivery_address", { required: "Delivery address is required" })}

                        placeholder={watch('customer_uuid') ? "Enter delivery address..." : "Select a customer first"}
                        error={!!errors.delivery_address}
                        helperText={errors.delivery_address?.message}
                        sx={{
                            "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor: "#0f172a",
                                fontWeight: 500
                            },
                            "& .MuiOutlinedInput-root.Mui-disabled": {
                                backgroundColor: "#f8fafc"
                            }
                        }}
                    />
                </Box>

                <Box>
                    <LabelWithIcon icon={LocalOfferOutlined} label="Status" />
                    <TextField
                        select
                        fullWidth
                        disabled={isLoading}
                        defaultValue="CREATED"
                        {...register("status")}
                    >
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