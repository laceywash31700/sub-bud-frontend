import React, { useEffect, useState } from "react";
import { API_URL } from "@/config/env";
import { useAuth } from "./modules/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AppAppBar from "./modules/views/AppAppBar";
import withRoot from "./modules/withRoot";
import AppFooter from "./modules/views/AppFooter";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Grid,
  Select,
  MenuItem,
  FormControl,
  useTheme,
} from "@mui/material";
import { ResponsivePie } from "@nivo/pie";
import { Cancel, MonetizationOn, Delete, Add } from "@mui/icons-material";
import dayjs, { Dayjs } from "dayjs";
import SubscriptionModal from "./SubscriptionModal";

type Currency = "USD" | "EUR" | "GBP";
type Frequency = "daily" | "weekly" | "monthly" | "yearly";
type Status = "Active" | "Canceled" | "Expired" | "Paused";
type Category =
  | "Sports"
  | "News"
  | "Entertainment"
  | "Lifestyle"
  | "Technology"
  | "Finance"
  | "Politics"
  | "Business"
  | "Other";

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

interface Subscription {
  _id: string;
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

function Dashboard() {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Add these state variables to your existing Dashboard state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [SubscriptionInput, setSubscriptionInput] = useState<SubscriptionInput>(
    {
      name: "",
      price: 0,
      currency: "USD",
      frequency: "monthly",
      category: "Entertainment",
      paymentMethod: "",
      status: "Active",
      startDate: dayjs().subtract(1, "month"),
      renewalDate: dayjs(),
    }
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const displayName = currentUser?.firstName || currentUser?.name;
  const token = localStorage.getItem("token");

  const handleAddSubscription = async () => {
    const errors: Record<string, string> = {};
    if (!SubscriptionInput.name) errors.name = "Name is required";
    if (SubscriptionInput.price <= 0)
      errors.price = "Price must be greater than 0";
    if (!SubscriptionInput.paymentMethod)
      errors.paymentMethod = "Payment method is required";
    if (!SubscriptionInput.startDate)
      errors.startDate = "Start date is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/subscriptions/`,
        {
          ...SubscriptionInput,
          startDate: SubscriptionInput.startDate.toISOString(),
          renewalDate: SubscriptionInput.renewalDate.toISOString(),
          userId: currentUser?._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data.data.subscription);
      if (response.data.success) {
        setSubscriptions([...subscriptions, response.data.data.subscription]);
        setOpenAddModal(false);
        // Reset form
        setSubscriptionInput({
          name: "",
          price: 0,
          currency: "USD",
          frequency: "monthly",
          category: "Entertainment",
          paymentMethod: "",
          status: "Active",
          startDate: dayjs().subtract(1, "month"),
          renewalDate: dayjs(),
        });
        setFormErrors({});
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to add subscription");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to add subscription");
      }
    }
  };

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        if (!currentUser) throw new Error("No user logged in");

        const response = await axios.get(
          `${API_URL}/api/v1/subscriptions/user/${currentUser._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          setSubscriptions(response.data.data);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message || "Failed to load subscriptions"
          );
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load subscriptions");
        }
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && token) {
      fetchSubscriptions();
    } else {
      navigate("/sign-in");
    }
  }, [currentUser, token, navigate]);

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      await axios.put(
        `${API_URL}/api/v1/subscriptions/${subscriptionId}/cancel`,
        { status: "Canceled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubscriptions((subs) =>
        subs.map((sub) =>
          sub._id === subscriptionId ? { ...sub, status: "Canceled" } : sub
        )
      );
    } catch (err) {
      console.error("Failed to cancel subscription:", err);
    }
  };

  const handleStatusChange = async (
    subscriptionId: string,
    newStatus: Status
  ) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/v1/subscriptions/${subscriptionId}/update`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSubscriptions((subs: Subscription[]) =>
          subs.map((sub) =>
            sub._id === subscriptionId ? { ...sub, status: newStatus } : sub
          )
        );
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Failed to update subscription"
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update subscription");
      }
    }
  };

  const handleDeleteSubscription = async (subscriptionId: string) => {
    try {
      await axios.delete(
        `${API_URL}/api/v1/subscriptions/${subscriptionId}/delete`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSubscriptions((subs) =>
        subs.filter((sub) => sub._id !== subscriptionId)
      );

      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Failed to delete subscription"
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to delete subscription");
      }
    }
  };

  const calculateMonthlyCost = (sub: Subscription) => {
    switch (sub.frequency) {
      case "monthly":
        return sub.price;
      case "yearly":
        return sub.price / 12;
      case "weekly":
        return sub.price * 4;
      case "daily":
        return sub.price * 30;
      default:
        return 0;
    }
  };

  const totalMonthlyCost = subscriptions
    .filter((sub) => sub.status === "Active")
    .reduce((sum, sub) => sum + calculateMonthlyCost(sub), 0);

  const activeSubscriptionsCount = subscriptions.filter(
    (sub) => sub.status === "Active"
  ).length;

  const upcomingRenewals = subscriptions.filter((sub) => {
    if (sub.status !== "Active") return false;

    const renewalDate = dayjs.isDayjs(sub.renewalDate)
      ? sub.renewalDate
      : dayjs(sub.renewalDate);

    if (!renewalDate?.isValid()) return false;

    const now = dayjs();
    const thirtyDaysFromNow = now.add(30, "days");

    return renewalDate.isAfter(now) && renewalDate.isBefore(thirtyDaysFromNow);
  }).length;

  const categoryData = subscriptions
    .filter((sub) => sub.status === "Active")
    .reduce((acc, sub) => {
      const monthlyValue = calculateMonthlyCost(sub);
      acc[sub.category] = (acc[sub.category] || 0) + monthlyValue;
      return acc;
    }, {} as Record<string, number>);

  const pieChartData = Object.entries(categoryData).map(
    ([category, value]) => ({
      id: category,
      label: category,
      value: parseFloat(value.toFixed(2)),
      color: theme.palette.primary.main,
    })
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <React.Fragment>
      <AppAppBar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4" component="h1">
            Welcome back, {displayName}!
          </Typography>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenAddModal(true)}
          >
            Add Subscription
          </Button>
        </Box>

        <Grid container spacing={3} mb={4} component="div">
          <Grid size={{ xs: 12, sm: 4 }} component="div">
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <MonetizationOn color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Monthly Cost</Typography>
                </Box>
                <Typography variant="h4">
                  ${totalMonthlyCost.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }} component="div">
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="h6">Active Subscriptions</Typography>
                </Box>
                <Typography variant="h4">{activeSubscriptionsCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }} component="div">
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <MonetizationOn color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Upcoming Renewals</Typography>
                </Box>
                <Typography variant="h4">{upcomingRenewals}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} component="div">
          <Grid size={{ xs: 12, md: 6 }} component="div">
            <Paper elevation={3} sx={{ p: 2, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Spending by Category
              </Typography>
              <Box height={350}>
                <ResponsivePie
                  data={pieChartData}
                  margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={{ scheme: "nivo" }}
                  borderWidth={1}
                  borderColor={{
                    from: "color",
                    modifiers: [["darker", 0.2]],
                  }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor={theme.palette.text.primary}
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: "color" }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{
                    from: "color",
                    modifiers: [["darker", 2]],
                  }}
                  tooltip={({ datum }) => (
                    <Box
                      sx={{
                        background: theme.palette.background.paper,
                        padding: 1,
                        borderRadius: 1,
                        boxShadow: theme.shadows[3],
                      }}
                    >
                      <strong>{datum.label}</strong>: ${datum.value}
                    </Box>
                  )}
                />
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} component="div">
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Your Subscriptions
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Frequency</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subscriptions.map((sub) => (
                      <TableRow key={sub._id}>
                        <TableCell>{sub.name}</TableCell>
                        <TableCell align="right">
                          {sub.currency} {sub.price.toFixed(2)}
                        </TableCell>
                        <TableCell>{sub.frequency}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <FormControl size="small" variant="outlined">
                              <Select
                                value={sub.status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    sub._id,
                                    e.target.value as Status
                                  )
                                }
                                sx={{
                                  minWidth: 120,
                                  height: 32,
                                  "& .MuiSelect-select": {
                                    color:
                                      sub.status === "Active"
                                        ? "success.main"
                                        : sub.status === "Canceled"
                                        ? "error.main"
                                        : sub.status === "Expired"
                                        ? "warning.main"
                                        : "text.secondary",
                                    fontWeight: "bold",
                                  },
                                }}
                              >
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Expired">Expired</MenuItem>
                                <MenuItem value="Paused">Paused</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {sub.status === "Active" ? (
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<Cancel />}
                              onClick={() => handleCancelSubscription(sub._id)}
                            >
                              Cancel
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              color="secondary"
                              size="small"
                              startIcon={<Delete />} // Make sure to import Delete icon
                              onClick={() => handleDeleteSubscription(sub._id)}
                              sx={{ ml: 1 }}
                            >
                              Delete
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <AppFooter />
      <SubscriptionModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        subscriptionInput={SubscriptionInput}
        formErrors={formErrors}
        onSubscriptionChange={setSubscriptionInput}
        onSubmit={handleAddSubscription}
      />
    </React.Fragment>
  );
}

export default withRoot(Dashboard);
