import React, { useEffect, useState } from 'react';
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
import { fetchLogs, fetchLogsByCategory, LogEntry } from '../../../api/logs';
import { SelectChangeEvent } from '@mui/material';
import AdminStickyPage from '../../../layouts/AdminStickyPage';



const AdminLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  useEffect(() => {
    const loadLogs = async () => {
      try {
        setLoading(true);
        const data = categoryFilter
          ? await fetchLogsByCategory(categoryFilter)
          : await fetchLogs();
        setLogs(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load logs');
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, [categoryFilter]);

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setCategoryFilter(event.target.value);
  };

  return (

    <AdminStickyPage title={'Admin Logs'}>
      <FormControl sx={{ mb: 2, minWidth: 200 }}>
        <InputLabel>Filter by Category</InputLabel>
        <Select
          value={categoryFilter}
          onChange={handleCategoryChange}
          displayEmpty
          label="Filter by Category"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="category1">Category 1</MenuItem>
          <MenuItem value="category2">Category 2</MenuItem>
          <MenuItem value="category3">Category 3</MenuItem>
        </Select>
      </FormControl>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Paper>
          <List>
            {logs.map((log) => (
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
          {logs.length === 0 && (
            <Typography sx={{ p: 2 }} align="center">
              No logs found.
            </Typography>
          )}
        </Paper>
      )}
    </AdminStickyPage>
  );
};

export default AdminLogsPage;
