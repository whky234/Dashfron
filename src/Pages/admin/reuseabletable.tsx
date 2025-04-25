/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";

type Column = {
  label: string;
  field: string;
  render?: (row: any) => React.ReactNode;
  align?: "left" | "center" | "right";
};

type Action = {
  icon: React.ReactNode | ((row: any) => React.ReactNode);
  label: string | ((row: any) => string);
  onClick: (row: any) => void;
};

type ReusableTableProps = {
  title?: string;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  addLink?: string;
  addButtonLabel?: string;
  addButtonIcon?: React.ReactNode;
  columns: Column[];
  rows: any[];
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  totalCount?: number;
  actions?: Action[];
};




const ReusableTable: React.FC<ReusableTableProps> = ({
  searchTerm,
  setSearchTerm,
  addLink,
  addButtonLabel,
  addButtonIcon,
  columns,
  rows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  totalCount = 0,
  actions = [],
}) => {
  const [menuAnchor, setMenuAnchor] = useState<{
    [key: string]: HTMLElement | null;
  }>({});

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    rowId: string
  ) => {
    setMenuAnchor((prev) => ({ ...prev, [rowId]: event.currentTarget }));
  };

  const handleMenuClose = (rowId: string) => {
    setMenuAnchor((prev) => ({ ...prev, [rowId]: null }));
  };

  return (
    <Paper sx={{ width: "100%", overflowX: "auto" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          p: 2,
          gap: 2,
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: { xs: "100%", sm: "250px" } }}
        />
        {addLink && (
          <Button
            component={RouterLink}
            to={addLink}
            variant="contained"
            color="primary"
            startIcon={addButtonIcon}
            sx={{
              textTransform: "none",
              whiteSpace: "nowrap",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {addButtonLabel}
          </Button>
        )}
      </Box>

      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  align={col.align || "left"}
                  sx={{ fontWeight: "bold" }}
                >
                  {col.label}
                </TableCell>
              ))}
              {actions.length > 0 && (
                <TableCell align="center">Actions</TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row._id || row.id || JSON.stringify(row)} hover>
                  {columns.map((col) => (
                    <TableCell key={col.field} align={col.align || "left"}>
                      {col.render
                        ? col.render(row)
                        : typeof row[col.field] === "object"
                        ? JSON.stringify(row[col.field])
                        : String(row[col.field])}
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell align="center">
                      <IconButton onClick={(e) => handleMenuClick(e, row._id)}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={menuAnchor[row._id]}
                        open={Boolean(menuAnchor[row._id])}
                        onClose={() => handleMenuClose(row._id)}
                      >
                        {actions.map((action, idx) => (
                          <MenuItem
                            key={idx}
                            onClick={() => {
                              handleMenuClose(row._id);
                              action.onClick(row);
                            }}
                          >
                            <Tooltip
                              title={
                                typeof action.label === "function"
                                  ? action.label(row)
                                  : action.label
                              }
                              arrow
                            >
                              <Box display="flex" alignItems="center" gap={1}>
                                {typeof action.icon === "function"
                                  ? action.icon(row)
                                  : action.icon}
                                <span>
                                  {typeof action.label === "function"
                                    ? action.label(row)
                                    : action.label}
                                </span>
                              </Box>
                            </Tooltip>
                          </MenuItem>
                        ))}
                      </Menu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  align="center"
                >
                  <Typography variant="body1" color="textSecondary">
                    No data available.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
};

export default ReusableTable;
