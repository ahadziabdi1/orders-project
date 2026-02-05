"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Box, CircularProgress } from "@mui/material";
import { PersonOutline, EmailOutlined, HomeOutlined, LocationCityOutlined } from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { createBrowserClient } from '@supabase/ssr';
import LabelWithIcon from "@/app/components/common/LabelWithIcon";

export default function CustomerForm({ onClose }: { onClose: () => void }) {
    const [isLoading, setIsLoading] = useState(false);

    const supabase = useMemo(() => createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ), []);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { name: "", email: "", street: "", city: "" },
    });

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('customers')
                .insert([
                    {
                        full_name: data.name,
                        email: data.email,
                        delivery_address: `${data.street}, ${data.city}`
                    }
                ]);

            if (error) throw error;

            toast.success("Customer saved successfully!");
            onClose();
        } catch (error: any) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: { xs: 1, sm: 2 }, width: "100%" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Box>
                    <LabelWithIcon icon={PersonOutline} label="Full Name" />
                    <TextField
                        fullWidth
                        placeholder="John Doe"
                        disabled={isLoading}
                        {...register("name", { required: "Name is required" })}
                        error={!!errors.name}
                        helperText={errors.name?.message as string}
                    />
                </Box>

                <Box>
                    <LabelWithIcon icon={EmailOutlined} label="Email Address" />
                    <TextField
                        fullWidth
                        type="email"
                        placeholder="john@example.com"
                        disabled={isLoading}
                        {...register("email", { required: "Email is required" })}
                        error={!!errors.email}
                        helperText={errors.email?.message as string}
                    />
                </Box>

                <Box>
                    <LabelWithIcon icon={HomeOutlined} label="Street Address" />
                    <TextField
                        fullWidth
                        placeholder="123 Main St"
                        disabled={isLoading}
                        {...register("street", { required: "Street is required" })}
                        error={!!errors.street}
                        helperText={errors.street?.message as string}
                    />
                </Box>

                <Box>
                    <LabelWithIcon icon={LocationCityOutlined} label="City" />
                    <TextField
                        fullWidth
                        placeholder="New York"
                        disabled={isLoading}
                        {...register("city", { required: "City is required" })}
                        error={!!errors.city}
                        helperText={errors.city?.message as string}
                    />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 1 }}>
                    <Button onClick={onClose} disabled={isLoading} sx={{ color: "#374151", textTransform: "none", fontWeight: 600 }}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={isLoading} sx={{ backgroundColor: "#0f172a", borderRadius: "8px", textTransform: "none", fontWeight: 600, px: 3 }}>
                        {isLoading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Save Customer"}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}