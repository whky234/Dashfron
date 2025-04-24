import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  
  // useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchproduct,
  delproduct,
  clearMessages,
} from "../../stores/features/productslice";
import { AppDispatch, RootState } from "../../stores/store";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "./confimation";
import ReusableTable from "./reuseabletable";

const AdminProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  // const theme = useTheme();
  // const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [opendeletedialog, setopendeletedialog] = useState(false);
  const [producttodelete, setproducttodelete] = useState<string | null>(null);
  const [searchterm, setsearchterm] = useState("");

  const { products, error, message } = useSelector(
    (state: RootState) => state.product
  );

  useEffect(() => {
    dispatch(fetchproduct());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      setSnackbarMessage(message);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      dispatch(clearMessages());
    } else if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      dispatch(clearMessages());
    }
  }, [message, error, dispatch]);

  const filteredProducts = useMemo(() => {
    if (!searchterm.trim()) return products;

    const term = searchterm.toLowerCase();
    return products.filter((product) =>
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.createBy?.name?.toLowerCase().includes(term)
    );
  }, [products, searchterm]);

  const visibleProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (product: any) => {
    navigate(`/admin/products/edit/${product._id}`);
  };

  const handledeleteclick = (id: string) => {
    setproducttodelete(id);
    setopendeletedialog(true);
  };

  const handledeleteconfirm = async () => {
    if (!producttodelete) return;

    try {
      await dispatch(delproduct(producttodelete)).unwrap();
      await dispatch(fetchproduct());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Error already handled by thunk
    } finally {
      setopendeletedialog(false);
      setproducttodelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setopendeletedialog(false);
    setproducttodelete(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const columns = [
    { label: "Image", field: "image",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (row: any) => (
        <img
          src={row.image}
          alt={row.name}
          style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 50 }}
        />
     )},
     { label: "CreateBy", field: "createBy",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render:(row:any)=>`${row.createBy?.name}`
      },

    { label: "Name", field: "name" },
    { label: "Category", field: "category" },
    {
      label: "Price",
      field: "price",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (row: any) => `$${row.price?.toFixed(2)}`,
    },
    { label: "Quantity", field: "stock" },
    { label: "UpdateAt", field: "stock" ,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render:(row:any)=>`${new Date(row.updatedAt).toLocaleDateString()}`
    },

  ];

  const actions = [
    {
      icon: <EditIcon fontSize="small" />,
      label: "Edit",
      onClick: handleEdit,
    },
    {
      icon: <DeleteIcon fontSize="small" />,
      label: "Delete",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick: (product: any) => handledeleteclick(product._id),
    },
  ];

  return (
    <Box sx={{ mb: 14 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: "left" }}>
        Admin Product List
      </Typography>

      <ReusableTable
        title="Products"
        searchTerm={searchterm}
        setSearchTerm={setsearchterm}
        addLink="/admin/products/add"
        addButtonLabel="Add Product"
        addButtonIcon={<EditIcon />} // Optional: Replace with AddIcon
        columns={columns}
        rows={visibleProducts}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        totalCount={filteredProducts.length}
        actions={actions}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <ConfirmDialog
        open={opendeletedialog}
        title="Delete"
        message="Are you sure you want to delete this product?"
        onConfirm={handledeleteconfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
};

export default AdminProductList;