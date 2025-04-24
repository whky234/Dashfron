import React from "react";
import {
  Paper,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import {
  ArrowDropUp,
  ArrowDropDown,
} from "@mui/icons-material";
import CountUp from "react-countup";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  diff?: number; // percentage change (+/-)
  prefix?: string;
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color,
  diff,
  prefix = "",
  suffix = "",
}) => {
  const isPositive = diff !== undefined && diff >= 0;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 3,
        flex: "1 1 220px",
        minWidth: 220,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          {label.toUpperCase()}
        </Typography>
        <Avatar sx={{ bgcolor: color, width: 40, height: 40 }}>
          {icon}
        </Avatar>
      </Box>

      <Typography variant="h5" fontWeight="bold">
        <CountUp
          end={value}
          duration={2}
          separator=","
          prefix={prefix}
          suffix={suffix}
        />
      </Typography>

      {diff !== undefined && (
        <Box display="flex" alignItems="center" gap={0.5}>
          {isPositive ? (
            <ArrowDropUp sx={{ color: "green" }} />
          ) : (
            <ArrowDropDown sx={{ color: "red" }} />
          )}
          <Typography
            variant="body2"
            color={isPositive ? "green" : "red"}
            fontWeight={500}
          >
            {Math.abs(diff)}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Since last month
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default StatCard;
