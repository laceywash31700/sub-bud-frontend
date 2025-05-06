import {
  Box,
  TextField,
  InputAdornment,
  InputLabel,
  FormHelperText,
  FormControl,
  Modal,
  Stack,
  Typography,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { Close, Save } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

type Currency = "USD" | "EUR" | "GBP";
type Frequency = "daily" | "weekly" | "monthly" | "yearly";
type Status = "Active" | "Canceled" | "Expired" | "Paused";
type Category = "Sports" | "News" | "Entertainment" | "Lifestyle" | 
  "Technology" | "Finance" | "Politics" | "Business" | "Other";


interface Subscription {
  name: string;
  price: number;
  currency: Currency; 
  frequency: Frequency;
  category: Category; 
  paymentMethod: string;
  startDate: Dayjs; 
  renewalDate: Dayjs; 
  status?: Status;
}

interface SubscriptionInput {
  name: string;
  price: number;
  currency: Currency;
  frequency: Frequency;
  category: Category;
  paymentMethod: string;
  status: Status;
  startDate: Dayjs;
  renewalDate: Dayjs;
}

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  subscriptionInput: SubscriptionInput;
  formErrors: Record<string, string>;
  onSubscriptionChange: (updatedSubscription: SubscriptionInput) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

function SubscriptionModal({
  open,
  onClose,
  subscriptionInput,
  formErrors,
  onSubscriptionChange,
  onSubmit,
  isLoading = false,
}: SubscriptionModalProps) {
  
  
  const handleChange = (field: keyof Subscription, value: any) => {
    onSubscriptionChange({
      ...subscriptionInput,
      [field]: value,
    });
  };

  const handleStartDateChange = (date: Dayjs | null) => {
    if (!date) return;
  
    const updatedSubscription = {
      ...subscriptionInput,
      startDate: date,
    };
  
    const periodMap = {
      daily: { value: 1, unit: "day" as const },
      weekly: { value: 7, unit: "day" as const },
      monthly: { value: 1, unit: "month" as const },
      yearly: { value: 1, unit: "year" as const },
    };
    
    const period = periodMap[subscriptionInput.frequency as Frequency];
    updatedSubscription.renewalDate = date.add(period.value, period.unit);
  
    onSubscriptionChange(updatedSubscription);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "80%", md: "600px" },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h5" component="h2" mb={3}>
            Add New Subscription
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="Subscription Name"
              value={subscriptionInput.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={!!formErrors.name}
              helperText={formErrors.name}
              fullWidth
            />

            <TextField
              label="Price"
              type="number"
              value={subscriptionInput.price || ""}
              onChange={(e) => handleChange("price", Number(e.target.value) )}
              error={!!formErrors.price}
              helperText={formErrors.price}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {subscriptionInput.currency === "USD"
                      ? "$"
                      : subscriptionInput.currency === "EUR"
                      ? "€"
                      : "£"}
                  </InputAdornment>
                ),
                inputProps: { min: 0, step: "0.01" },
              }}
              fullWidth
            />

            <FormControl fullWidth error={!!formErrors.currency}>
              <InputLabel>Currency</InputLabel>
              <Select
                value={subscriptionInput.currency}
                label="Currency"
                onChange={(e) => handleChange("currency", e.target.value as Currency)}
              >
                <MenuItem value="USD">USD ($)</MenuItem>
                <MenuItem value="EUR">EUR (€)</MenuItem>
                <MenuItem value="GBP">GBP (£)</MenuItem>
              </Select>
              {formErrors.currency && (
                <FormHelperText>{formErrors.currency}</FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={!!formErrors.frequency}>
              <InputLabel>Frequency</InputLabel>
              <Select
                value={subscriptionInput.frequency}
                label="Frequency"
                onChange={(e) => handleChange("frequency", e.target.value as Frequency)}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
              {formErrors.frequency && (
                <FormHelperText>{formErrors.frequency}</FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={!!formErrors.category}>
              <InputLabel>Category</InputLabel>
              <Select
                value={subscriptionInput.category}
                label="Category"
                onChange={(e) => handleChange("category", e.target.value as Category)}
              >
                {[
                  "Sports",
                  "News",
                  "Entertainment",
                  "Lifestyle",
                  "Technology",
                  "Finance",
                  "Politics",
                  "Business",
                  "Other",
                ].map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.category && (
                <FormHelperText>{formErrors.category}</FormHelperText>
              )}
            </FormControl>

            <TextField
              label="Payment Method"
              value={subscriptionInput.paymentMethod}
              onChange={(e) => handleChange("paymentMethod", e.target.value)}
              error={!!formErrors.paymentMethod}
              helperText={formErrors.paymentMethod}
              fullWidth
            />

            <DatePicker
              label="Start Date"
              value={subscriptionInput.startDate}
              onChange={handleStartDateChange}
              maxDate={dayjs()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!formErrors.startDate,
                  helperText: formErrors.startDate,
                },
              }}
            />

            <DatePicker
              label="Renewal Date"
              value={subscriptionInput.renewalDate}
              onChange={(date) => handleChange("renewalDate", date)}
              minDate={subscriptionInput.startDate || dayjs()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!formErrors.renewalDate,
                  helperText: formErrors.renewalDate,
                },
              }}
            />

            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button
                variant="outlined"
                startIcon={<Close />}
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={onSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Subscription"}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
}

export default SubscriptionModal;
