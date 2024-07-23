import { FilterCriteria, FilterInvoice } from '@/types';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Button, Menu } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useState } from 'react';

interface FilterProps {
  filters: FilterInvoice;
  setFilterCriteria: React.Dispatch<React.SetStateAction<FilterCriteria<FilterInvoice>>>;
  resetFilter: () => void;
}

const Filter = ({ filters, setFilterCriteria, resetFilter }: FilterProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChangeFilter = (e: SelectChangeEvent<any>) => {
    const { name, value } = e.target;
    setFilterCriteria((state) => ({
      ...state,
      filters: {
        ...state.filters,
        [name]: value,
      },
    }));
  };

  const handleChangeDateFilter = (e: any, name: string) => {
    setFilterCriteria((state) => ({
      ...state,
      filters: {
        ...state.filters,
        [name]: dayjs(e).endOf('day').toISOString(),
      },
    }));
  };

  return (
    <>
      <FormControl fullWidth>
        <InputLabel>Document type</InputLabel>
        <Select name="contractor" value={filters.contractor} onChange={handleChangeFilter}>
          <MenuItem value="contractor1">Contractor 1</MenuItem>
          <MenuItem value="contractor2">Contractor 2</MenuItem>
          <MenuItem value="contractor3">Contractor 3</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Vat</InputLabel>
        <Select name="vat" value={filters.vat} onChange={handleChangeFilter}>
          <MenuItem value="10">10%</MenuItem>
          <MenuItem value="20">20%</MenuItem>
        </Select>
      </FormControl>
      <DatePicker
        label="Start Date"
        value={filters.startDate ? dayjs(filters.startDate) : null}
        onChange={(e) => handleChangeDateFilter(e, 'startDate')}
        sx={{ width: '100%' }}
      />
      <DatePicker
        label="End Date"
        value={filters.endDate ? dayjs(filters.endDate) : null}
        onChange={(e) => handleChangeDateFilter(e, 'endDate')}
        sx={{ width: '100%' }}
      />
      <FormControl fullWidth>
        <InputLabel>Status</InputLabel>
        <Select name="status" value={filters.status} onChange={handleChangeFilter}>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Paid">Paid</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
          <MenuItem value="Outstanding">Outstanding</MenuItem>
          <MenuItem value="Late">Late</MenuItem>
        </Select>
      </FormControl>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        More
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={resetFilter}>Reset</MenuItem>
      </Menu>
    </>
  );
};

export default Filter;
