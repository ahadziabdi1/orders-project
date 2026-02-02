"use client";

import { useForm } from "react-hook-form";
import { TextField, Button, Box, CircularProgress } from "@mui/material";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-hot-toast";

export default function ProductForm({ onClose }: { onClose: () => void }) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data: any) => {
        const { error } = await supabase.from('products').insert([data]);
        if (!error) {
            toast.success("Artikal uspješno dodan!");
            onClose();
        } else {
            toast.error(error.message);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
                label="Naziv proizvoda"
                fullWidth
                {...register("name", { required: "Naziv je obavezan" })}
                error={!!errors.name}
                helperText={errors.name?.message as string}
            />
            <TextField
                label="Cijena (KM)"
                type="number"
                slotProps={{ input: { inputProps: { step: "0.01" } } }}
                fullWidth
                {...register("unit_price", { required: "Cijena je obavezna", min: 0.01 })}
                error={!!errors.unit_price}
            />
            <Button 
                type="submit" 
                variant="contained" 
                disabled={isSubmitting}
                sx={{ backgroundColor: '#0f172a', py: 1.5 }}
            >
                {isSubmitting ? <CircularProgress size={24} /> : "Spremi Artikal"}
            </Button>
        </Box>
    );
}