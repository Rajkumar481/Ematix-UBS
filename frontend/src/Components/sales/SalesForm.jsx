import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Divider,
  Container,
} from "@mui/material";
import {
  Description as FileTextIcon,
  Person as UserIcon,
  Business as BuildingIcon,
  CalendarToday as CalendarIcon,
  CreditCard as CreditCardIcon,
  LocalShipping as TruckIcon,
  LocationOn as MapPinIcon,
  Save as SaveIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import SalesCalculation from "./Salescalculation";
import Autocomplete from "@mui/material/Autocomplete";
import customFetch from "../../utils/Customfetch";

const SalesForm = () => {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    userId: "",
    invoiceNumber: "",
    invoiceDate: today,
    billingDate: today,
    dueDate: tomorrow,
    modeOfPayment: "Credit",
    otherRef: "",
    GRNoDate: "",
    deliveryNote: "",
    supplierRef: "",
    buyerOrderNo: "",
    deliveryNoteDate: "",
    despatchedThrough: "",
    destination: "",
    termsOfDelivery: "",
    sellerDetails: { name: "", address: "" },
    buyerDetails: { name: "", email: "", phone: "", address: "", state: "" },
    roundOff: 0,
  });

  // Load users
  useEffect(() => {
    customFetch
      .get("/user")
      .then((res) => setUsers(res.data))
      .catch(() => toast.error("Failed to load users"));
  }, []);
  console.log("Users list:", users);

  // Handle change for main fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle selecting a user
  const handleUserSelect = (e) => {
    const name = e.target.value.trim();
    const selected = users.find(
      (u) => u.userName.toLowerCase() === name.toLowerCase()
    );
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        userId: selected._id,
        buyerDetails: {
          name: selected.userName,
          email: selected.email,
          phone: selected.phone,
          address: selected.address,
          state: selected.state || "",
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, userId: "" }));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userId || products.length === 0) {
      toast.error("Please select a user and add at least one product");
      return;
    }

    const payload = {
      ...formData,
      items: products.map((p) => ({
        productName: p.productName,
        quantity: p.quantity,
        purchaseId: p.purchaseId,
        discountPercentage: p.discountPercentage,
        rate: p.rate,
        amount: (p.quantity * p.rate * (100 - p.discountPercentage)) / 100,
        hsnCode: p.hsnCode,
      })),
    };

    try {
      await customFetch.post("/sales", payload);
      toast.success("Sales record saved");

      // Reset form
      setFormData({
        userId: "",
        invoiceNumber: "",
        invoiceDate: today,
        billingDate: today,
        dueDate: tomorrow,
        modeOfPayment: "Credit",
        otherRef: "",
        GRNoDate: "",
        deliveryNote: "",
        supplierRef: "",
        buyerOrderNo: "",
        deliveryNoteDate: "",
        despatchedThrough: "",
        destination: "",
        termsOfDelivery: "",
        sellerDetails: { name: "", address: "" },
        buyerDetails: {
          name: "",
          email: "",
          phone: "",
          address: "",
          state: "",
        },
        roundOff: 0,
      });
      setProducts([]);
    } catch (err) {
      toast.error("Failed to save sales record");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: "primary.light",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileTextIcon sx={{ color: "primary.main", fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="text.primary">
                Create Sales Invoice
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Generate professional invoices for your sales transactions
              </Typography>
            </Box>
          </Box>
        </Paper>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Buyer Selection */}
            {/* <Card elevation={1} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
                >
                  <SearchIcon sx={{ color: "text.secondary" }} />
                  <Typography variant="h6" fontWeight="600">
                    Buyer Selection
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  label="Select Buyer"
                  placeholder="Type to search for a buyer..."
                  onChange={handleUserSelect}
                  variant="outlined"
                  InputProps={{
                    list: "buyers", // links to the datalist
                  }}
                />
                <datalist id="buyers">
                  {users.map((u) => (
                    <option key={u._id} value={u.userName} />
                  ))}
                </datalist>
              </CardContent>
            </Card> */}
            <Card elevation={1} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
                >
                  <SearchIcon sx={{ color: "text.secondary" }} />
                  <Typography variant="h6" fontWeight="600">
                    Buyer Selection
                  </Typography>
                </Box>
                <Autocomplete
                  fullWidth
                  options={users}
                  getOptionLabel={(option) => option.userName || ""}
                  value={users.find((u) => u._id === formData.userId) || null}
                  onChange={(event, value) => {
                    if (value) {
                      setFormData((prev) => ({
                        ...prev,
                        userId: value._id,
                        buyerDetails: {
                          name: value.userName,
                          email: value.email,
                          phone: value.phone,
                          address: value.address,
                          state: value.state || "",
                        },
                      }));
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        userId: "",
                        buyerDetails: {
                          name: "",
                          email: "",
                          phone: "",
                          address: "",
                          state: "",
                        },
                      }));
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Buyer"
                      placeholder="Type to search for a buyer..."
                      variant="outlined"
                    />
                  )}
                />
              </CardContent>
            </Card>
            {/* Invoice Details */}
            <Card elevation={1} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
                >
                  <FileTextIcon sx={{ color: "text.secondary" }} />
                  <Typography variant="h6" fontWeight="600">
                    Invoice Information
                  </Typography>
                </Box>
                <Grid container spacing={6}>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      fullWidth
                      label="Invoice Number"
                      name="invoiceNumber"
                      sx={{ width: 250 }}
                      placeholder="Enter invoice number"
                      value={formData.invoiceNumber}
                      onChange={handleChange}
                      variant="outlined"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      fullWidth
                      label="Invoice Date"
                      name="invoiceDate"
                      type="date"
                      sx={{ width: 250 }}
                      value={formData.invoiceDate}
                      onChange={handleChange}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      fullWidth
                      label="Billing Date"
                      name="billingDate"
                      type="date"
                      sx={{ width: 250 }}
                      value={formData.billingDate}
                      onChange={handleChange}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      fullWidth
                      label="Due Date"
                      name="dueDate"
                      type="date"
                      sx={{ width: 250 }}
                      value={formData.dueDate}
                      onChange={handleChange}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Mode of Payment</InputLabel>
                      <Select
                        name="modeOfPayment"
                        sx={{ width: 250 }}
                        value={formData.modeOfPayment}
                        onChange={handleChange}
                        label="Mode of Payment"
                      >
                        <MenuItem value="Cash">Cash</MenuItem>
                        <MenuItem value="Credit">Credit</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      fullWidth
                      label="Other Reference"
                      name="otherRef"
                      sx={{ width: 250 }}
                      placeholder="Additional reference"
                      value={formData.otherRef}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card elevation={1} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
                >
                  <TruckIcon sx={{ color: "text.secondary" }} />
                  <Typography variant="h6" fontWeight="600">
                    Delivery & Order Details
                  </Typography>
                </Box>
                <Grid container spacing={5}>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      fullWidth
                      label="GR No Date"
                      name="GRNoDate"
                      type="date"
                      sx={{ width: 200 }}
                      value={formData.GRNoDate}
                      onChange={handleChange}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      fullWidth
                      label="Delivery Note"
                      name="deliveryNote"
                      sx={{ width: 200 }}
                      placeholder="Delivery note details"
                      value={formData.deliveryNote}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      fullWidth
                      label="Supplier Reference"
                      name="supplierRef"
                      sx={{ width: 200 }}
                      placeholder="Supplier reference"
                      value={formData.supplierRef}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      fullWidth
                      label="Buyer Order Number"
                      name="buyerOrderNo"
                      sx={{ width: 200 }}
                      placeholder="Purchase order number"
                      value={formData.buyerOrderNo}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      fullWidth
                      label="Delivery Note Date"
                      name="deliveryNoteDate"
                      type="date"
                      sx={{ width: 200 }}
                      value={formData.deliveryNoteDate}
                      onChange={handleChange}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      fullWidth
                      label="Despatched Through"
                      name="despatchedThrough"
                      sx={{ width: 200 }}
                      placeholder="Transportation method"
                      value={formData.despatchedThrough}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      fullWidth
                      label="Destination"
                      name="destination"
                      sx={{ width: 200 }}
                      placeholder="Delivery destination"
                      value={formData.destination}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      fullWidth
                      label="Terms of Delivery"
                      name="termsOfDelivery"
                      sx={{ width: 200 }}
                      placeholder="Delivery terms"
                      value={formData.termsOfDelivery}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Seller & Buyer Details */}
            <Grid container spacing={4}>
              {/* Seller Details */}
              <Grid item xs={12} lg={6}>
                <Card elevation={1} sx={{ borderRadius: 2, height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 3,
                        width: 400,
                      }}
                    >
                      <BuildingIcon sx={{ color: "text.secondary" }} />
                      <Typography variant="h6" fontWeight="600">
                        Seller Details
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Seller Name"
                        name="sellerDetails.name"
                        placeholder="Company or individual name"
                        value={formData.sellerDetails.name}
                        onChange={handleChange}
                        variant="outlined"
                      />
                      <TextField
                        fullWidth
                        label="Seller Address"
                        name="sellerDetails.address"
                        placeholder="Complete business address"
                        value={formData.sellerDetails.address}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={3}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Buyer Details */}
              <Grid item xs={12} lg={6}>
                <Card elevation={1} sx={{ borderRadius: 2, height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 3,
                        width: 600,
                      }}
                    >
                      <UserIcon sx={{ color: "text.secondary" }} />
                      <Typography variant="h6" fontWeight="600">
                        Buyer Details
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <TextField
                        fullWidth
                        label="Buyer Name"
                        name="buyerDetails.name"
                        placeholder="Customer name"
                        value={formData.buyerDetails.name}
                        onChange={handleChange}
                        variant="outlined"
                      />
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="buyerDetails.email"
                        type="email"
                        placeholder="customer@example.com"
                        value={formData.buyerDetails.email}
                        onChange={handleChange}
                        variant="outlined"
                      />
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="buyerDetails.phone"
                        placeholder="Contact number"
                        value={formData.buyerDetails.phone}
                        onChange={handleChange}
                        variant="outlined"
                      />
                      <TextField
                        fullWidth
                        label="Address"
                        name="buyerDetails.address"
                        placeholder="Customer address"
                        value={formData.buyerDetails.address}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={2}
                      />
                      <TextField
                        fullWidth
                        label="State"
                        name="buyerDetails.state"
                        placeholder="State/Province"
                        value={formData.buyerDetails.state}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Sales Calculation */}
            <Card elevation={1} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <SalesCalculation
                  products={products}
                  setProducts={setProducts}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Card elevation={1} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="submit"
                    // variant="contained"

                    size="large"
                    startIcon={<SaveIcon />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: 600,
                      boxShadow: 2,
                      background:
                        "linear-gradient(45deg, #fff 5%, rgb(0, 255, 30) 90%)",
                      color: "black",
                      "&:hover": {
                        boxShadow: 4,
                      },
                    }}
                  >
                    Save Invoice
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </form>
      </Container>
    </Box>
  );
};

export default SalesForm;
