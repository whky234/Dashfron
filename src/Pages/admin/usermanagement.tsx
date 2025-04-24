import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Typography,
  Snackbar,
  Alert,
  
  Chip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  ToggleOn as ActivateIcon,
  ToggleOff as DeactivateIcon,
  SwapHoriz as RoleIcon,
  PersonAdd as AddUserIcon,
  Edit,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../stores/store";
import {
  ChangeRole,
  ChangeStatus,
  
  Deleteuser,
  Fetchuser,
} from "../../stores/features/usermangement";
import {  useNavigate } from "react-router-dom";
import ConfirmDialog from "./confimation";
import ReusableTable from "./reuseabletable";

const UserManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate=useNavigate()
  const { users } = useSelector((state: RootState) => state.userManagement);
  // const [localerror, setlocalerror] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowperpage, setrowperpage] = useState(5);
  const [searchterm, setsearchterm] = useState("");
  const [opendeletedialog, setopendeletedialog] = useState(false);
  const [usertodelete, setusertodelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => u.name.toLowerCase().includes(searchterm.toLowerCase()));
  }, [users, searchterm]);

  const visibleUsers = filteredUsers.slice(
    page * rowperpage,
    page * rowperpage + rowperpage
  );

  useEffect(() => {
    dispatch(Fetchuser());
  }, [dispatch]);

  

  const HandleStatus = async (id: string, status: string) => {
    const newstatus = status === "active" ? "pending" : "active";
    const result = await dispatch(ChangeStatus({ id, status: newstatus }));
    if (ChangeStatus.fulfilled.match(result)) {
      setSnackbar({ message: result.payload.message, severity: 'success' });
    } else {
      setSnackbar({ message: result.payload as string, severity: 'error' });
    }
    dispatch(Fetchuser());
  };

  const handlerole = async (id: string, role: string) => {
    const newrole = role === "user" ? "admin" : "user";
    const result = await dispatch(ChangeRole({ id, role: newrole }));
    if (ChangeRole.fulfilled.match(result)) {
      setSnackbar({ message: result.payload.message, severity: 'success' });
    } else {
      setSnackbar({ message: result.payload as string, severity: 'error' });
    }
    await dispatch(Fetchuser());
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (user: any) => {
    navigate(`/admin/users/edit/${user._id}`);
  };

  const handledeleteclick = (id: string) => {
    setusertodelete(id);
    setopendeletedialog(true);
  };

  const handledeleteconfirm = async () => {
    if (!usertodelete) return;
    const result = await dispatch(Deleteuser(usertodelete));
    if (Deleteuser.fulfilled.match(result)) {
      setSnackbar({ message: result.payload.message, severity: 'success' });
    } else {
      setSnackbar({ message: result.payload as string, severity: 'error' });
    }
    setopendeletedialog(false);
    setusertodelete(null);
    dispatch(Fetchuser());
  };

  const handleDeleteCancel = () => {
    setopendeletedialog(false);
    setusertodelete(null);
  };

  const columns = [
    { label: "Name", field: "name" },
    { label: "Email", field: "email" },
    { label: "Created At", field: "createdAt", render: (row: { createdAt: string | number | Date; }) => new Date(row.createdAt).toLocaleDateString() },
    { label: "Last update", field: "updatedAt", render: (row: { updatedAt: string | number | Date; }) => new Date(row.updatedAt).toLocaleString() },

    { label: "Role", field: "role", render: (row: { role: string; }) => row.role.charAt(0).toUpperCase() + row.role.slice(1) },
    {
      label: "Status",
      field: "status",
      render: (row: { status: string }) => (
        <Chip
          label={row.status}
          color={row.status === "active" ? "success" : "warning"}
          variant="outlined"
          size="small"
          sx={{ textTransform: "capitalize", fontWeight: 500 }}
        />
      ),
    }
      ];

  const actions = [
    {
      icon: <DeleteIcon fontSize="small" />,
      label: "Delete",
      onClick: (user: { _id: string; }) => handledeleteclick(user._id),
    },
    {
      icon: (user: { status: string; }) => user.status === "active" ? <DeactivateIcon fontSize="small" /> : <ActivateIcon fontSize="small" />,
      label: (user: { status: string; }) => user.status === "active" ? "Deactivate" : "Activate",
      onClick: (user: { _id: string; status: string; }) => HandleStatus(user._id, user.status),
    },
    {
      icon: <RoleIcon fontSize="small" />,
      label: "Change Role",
      onClick: (user: { _id: string; role: string; }) => handlerole(user._id, user.role),
    },
    {
      icon: <Edit fontSize="small" />,
      label: "Edit",
      onClick: handleEdit,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 1, mb: 12 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        User Management
      </Typography>

      <ReusableTable
        title="Users"
        searchTerm={searchterm}
        setSearchTerm={setsearchterm}
        addLink="/admin/users/add"
        addButtonLabel="Add New User"
        addButtonIcon={<AddUserIcon />}
        columns={columns}
        rows={visibleUsers}
        page={page}
        rowsPerPage={rowperpage}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onPageChange={(_: any, newPage: React.SetStateAction<number>) => setPage(newPage)}
        onRowsPerPageChange={(e: { target: { value: string; }; }) => {
          setrowperpage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        totalCount={filteredUsers.length}
        actions={actions}
      />

      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar(null)}
          severity={snackbar?.severity}
          sx={{ width: "100%" }}
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>

      <ConfirmDialog
        open={opendeletedialog}
        title="Delete"
        message="Are you sure do you want to delete this"
        onConfirm={handledeleteconfirm}
        onCancel={handleDeleteCancel}
      />
    </Container>
  );
};

export default UserManagement;
