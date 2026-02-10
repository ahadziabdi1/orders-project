import { Autocomplete, TextField } from "@mui/material";
import { GridRenderEditCellParams, useGridApiContext } from "@mui/x-data-grid";
import { Customer } from "@/app/types/types";

interface CustomerEditCellProps extends GridRenderEditCellParams {
    customers: Customer[];
}

export const CustomerEditCell = (props: CustomerEditCellProps) => {
    const { id, value, field, customers } = props;
    const apiRef = useGridApiContext();

    const handleChange = (event: any, newValue: Customer | null) => {
        if (newValue) {
            apiRef.current.setEditCellValue({ id, field, value: newValue.full_name });

            apiRef.current.updateRows([{ id, customer_uuid: newValue.customer_uuid }]);

            apiRef.current.stopCellEditMode({ id, field });
        }
    };

    return (
        <Autocomplete
            options={customers}
            getOptionLabel={(option) => option.full_name || ""}
            renderOption={(props, option) => (
                <li {...props} key={option.customer_uuid}>
                    {option.full_name}
                </li>
            )}
            value={customers.find((c) => c.full_name === value) ?? undefined}
            isOptionEqualToValue={(option, value) => option.customer_uuid === value.customer_uuid}
            onChange={handleChange}
            fullWidth
            disableClearable
            renderInput={(params) => (
                <TextField {...params} variant="standard" autoFocus sx={{ px: 1 }} />
            )}
        />
    );
};