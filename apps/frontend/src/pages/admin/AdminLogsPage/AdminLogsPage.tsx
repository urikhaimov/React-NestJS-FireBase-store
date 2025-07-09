import React, { useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import AdminStickyPage from '../../../layouts/AdminStickyPage';
import { useLogs } from '../../../hooks/useLogs';
import type { LogEntry } from '../../../api/logs';

const CATEGORY_OPTIONS = [
  { id: '', label: 'All' },
  { id: 'category1', label: 'Category 1' },
  { id: 'category2', label: 'Category 2' },
  { id: 'category3', label: 'Category 3' },
];

const AdminLogsPage: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const { data: logs, isLoading, error } = useLogs(categoryFilter);

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setCategoryFilter(event.target.value);
  };

  const logsArray: LogEntry[] = logs ?? [];

  return (
    <AdminStickyPage title="Admin Logs">
      <FormControl sx={{ mb: 2, minWidth: 200 }}>
        <InputLabel>Filter by Category</InputLabel>
        <Select
          value={categoryFilter}
          onChange={handleCategoryChange}
          displayEmpty
          label="Filter by Category"
        >
          {CATEGORY_OPTIONS.map(({ id, label }) => (
            <MenuItem key={id} value={id}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">Failed to load logs: {error.message}</Typography>
      ) : logsArray.length > 0 ? (
        <Paper>
          <List>
            {logsArray.map((log: LogEntry) => (
              <React.Fragment key={log.id}>
                <ListItem>
                  <ListItemText
                    primary={`${log.action} (Admin: ${log.adminId})`}
                    secondary={new Date(log.timestamp.seconds * 1000).toLocaleString()}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Typography sx={{ p: 2 }} align="center">
          No logs found.
        </Typography>
      )}
    </AdminStickyPage>
  );
};

export default AdminLogsPage;
