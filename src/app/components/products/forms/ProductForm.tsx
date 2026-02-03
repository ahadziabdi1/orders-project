"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    TextField,
    Button,
    Box,
    CircularProgress,
    Typography,
    SxProps,
    Theme,
} from "@mui/material";
import { Inventory2Outlined, AttachMoneyOutlined } from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { createProductAction } from "@/app/actions/products";
import { ProductFormData } from "@/app/types/types";
import LabelWithIcon from "@/app/components/common/LabelWithIcon";

export default function ProductForm({ onClose }: { onClose: () => void }) {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProductFormData>({
        defaultValues: {
            unit_price: 0,
        },
    });

    const onSubmit = async (data: ProductFormData) => {
        setIsLoading(true);
        try {
            const result = await createProductAction(data);

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

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ p: { xs: 1, sm: 2 }, width: "100%" }}
        >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Box>
                    <LabelWithIcon icon={Inventory2Outlined} label="Product Name" />
                    <TextField
                        fullWidth
                        placeholder="e.g. Wireless Mouse"
                        disabled={isLoading}
                        {...register("name", { required: "Product name is required" })}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                </Box>

                <Box>
                    <LabelWithIcon icon={AttachMoneyOutlined} label="Unit Price ($)" />
                    <TextField
                        fullWidth
                        type="number"
                        placeholder="0.01"
                        disabled={isLoading}
                        slotProps={{
                            input: {
                                inputProps: { step: "0.01", min: 0.01 },
                            },
                        }}
                        {...register("unit_price", {
                            required: "Price is required",
                            valueAsNumber: true,
                            min: { value: 0.01, message: "Price must be greater than 0" },
                        })}
                        error={!!errors.unit_price}
                        helperText={errors.unit_price?.message}
                    />
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column-reverse", sm: "row" },
                        justifyContent: "flex-end",
                        gap: 1.5,
                        mt: 1,
                    }}
                >
                    <Button
                        onClick={onClose}
                        disabled={isLoading}
                        sx={{ color: "#374151", textTransform: "none", fontWeight: 600 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        sx={{
                            backgroundColor: "#0f172a",
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 600,
                            px: 3,
                            minWidth: "140px",
                        }}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} sx={{ color: "white" }} />
                        ) : (
                            "Save Product"
                        )}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}