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
  Container,
} from "@mui/material";
import {
  Description as FileTextIcon,
  Person as UserIcon,
  Business as BuildingIcon,
  Search as SearchIcon,
  Save as SaveIcon,
  LocalShipping as TruckIcon,
} from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";
import SalesCalculation from "./Salescalculation";
import customFetch from "../../utils/Customfetch";

export default function EditSaleModal({ sale, onClose, onUpdated }) {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState(sale.items || []);

  const [formData, setFormData] = useState({
    ...sale,
    sellerDetails: sale.sellerDetails || { name: "", address: "" },
    buyerDetails: sale.buyerDetails || {
      name: "",
      email: "",
      phone: "",
      address: "",
      state: "",
    },
  });

  // Load users for buyer selection
  useEffect(() => {
    customFetch
      .get("/user")
      .then((res) => setUsers(res.data))
      .catch(() => toast.error("Failed to load users"));
  }, []);

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

  const handleUserSelect = (event, value) => {
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
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

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
      const { data } = await customFetch.patch(
       `/sales/${sale._id}`,
        payload
      );
      toast.success("Sale updated successfully");
      if (onUpdated) onUpdated(data);
      onClose();
    } catch (err) {
      toast.error("Failed to update sale");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-auto">
      <Container
        maxWidth="xl"
        sx={{
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 5,
          p: 3,
          my: 4,
          maxHeight: "95vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Edit Sales Invoice
        </Typography>

        <form onSubmit={handleUpdate}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Buyer Selection */}
            <Card>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <SearchIcon sx={{ color: "text.secondary" }} />
                  <Typography variant="h6">Buyer Selection</Typography>
                </Box>
                <Autocomplete
                  fullWidth
                  options={users}
                  getOptionLabel={(option) => option.userName || ""}
                  value={users.find((u) => u._id === formData.userId) || null}
                  onChange={handleUserSelect}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Buyer"
                      variant="outlined"
                    />
                  )}
                />
              </CardContent>
            </Card>

            {/* Invoice Info */}
            <Card>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <FileTextIcon sx={{ color: "text.secondary" }} />
                  <Typography variant="h6">Invoice Information</Typography>
                </Box>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Invoice Number"
                      name="invoiceNumber"
                      value={formData.invoiceNumber}
                      onChange={handleChange}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Invoice Date"
                      name="invoiceDate"
                      value={formData.invoiceDate?.substring(0, 10)}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Billing Date"
                      name="billingDate"
                      value={formData.billingDate?.substring(0, 10)}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Seller & Buyer Details */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Seller Details</Typography>
                    <TextField
                      fullWidth
                      label="Seller Name"
                      name="sellerDetails.name"
                      value={formData.sellerDetails.name}
                      onChange={handleChange}
                      sx={{ mt: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Seller Address"
                      name="sellerDetails.address"
                      value={formData.sellerDetails.address}
                      onChange={handleChange}
                      sx={{ mt: 2 }}
                      multiline
                      rows={3}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Buyer Details</Typography>
                    <TextField
                      fullWidth
                      label="Buyer Name"
                      name="buyerDetails.name"
                      value={formData.buyerDetails.name}
                      onChange={handleChange}
                      sx={{ mt: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      name="buyerDetails.email"
                      value={formData.buyerDetails.email}
                      onChange={handleChange}
                      sx={{ mt: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Phone"
                      name="buyerDetails.phone"
                      value={formData.buyerDetails.phone}
                      onChange={handleChange}
                      sx={{ mt: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Address"
                      name="buyerDetails.address"
                      value={formData.buyerDetails.address}
                      onChange={handleChange}
                      sx={{ mt: 2 }}
                      multiline
                      rows={2}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Products Table */}
            <Card>
              <CardContent>
                <SalesCalculation
                  products={products}
                  setProducts={setProducts}
                />
              </CardContent>
            </Card>

            {/* Save/Cancel */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button onClick={onClose} variant="outlined">
                Cancel
              </Button>
              <Button
                type="submit"
                startIcon={<SaveIcon />}
                sx={{
                  px: 3,
                  background:
                    "linear-gradient(45deg,#fff 5%, rgb(0, 255, 30) 90%)",
                  color: "black",
                }}
              >
                Update Invoice
              </Button>
            </Box>
          </Box>
        </form>
      </Container>
    </div>
  );
}