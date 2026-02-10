import { Autocomplete, TextField } from "@mui/material";
import { GridRenderEditCellParams, useGridApiContext } from "@mui/x-data-grid";
import { Product } from "@/app/types/types";

interface ProductEditCellProps extends GridRenderEditCellParams {
    products: Product[];
}

export const ProductEditCell = (props: ProductEditCellProps) => {
    const { id, field, products, value } = props;
    const apiRef = useGridApiContext();

    const handleChange = async (event: any, newValue: Product | null) => {
        if (newValue) {
            const currentRow = apiRef.current.getRow(id);
            const quantity = currentRow?.quantity || 1;
            const newTotal = newValue.unit_price * quantity;

            await apiRef.current.setEditCellValue({ id, field, value: newValue.name });

            apiRef.current.updateRows([{
                id,
                product_id: newValue.id,
                total_price: newTotal,
                product_name: newValue.name
            }]);

            apiRef.current.stopCellEditMode({ id, field });
        }
    };

    return (
        <Autocomplete
            options={products}
            getOptionLabel={(option) => option.name || ""}
            renderOption={(props, option) => (
                <li {...props} key={option.id}>
                    {option.name}
                </li>
            )}
            value={products.find((p) => p.name === value)}
            onChange={handleChange}
            fullWidth
            autoHighlight
            disableClearable
            renderInput={(params) => (
                <TextField {...params} variant="standard" autoFocus sx={{ px: 1 }} />
            )}
        />
    );
};