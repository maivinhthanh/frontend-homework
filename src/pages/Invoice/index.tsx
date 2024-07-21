import ListPage from '@/components/listpage/ListPage';
import routeStrings from '@/routes/routeStrings';
import {
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridColumnHeaderParams,
  GridRenderCellParams,
  GridRowSelectionModel,
} from '@mui/x-data-grid';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ReduxState } from '@/redux/store';
import { FilterCriteria, FilterInvoice, Invoice as InvoiceType } from '@/types';
import { DEFAULT_INITIAL_PAGE, DEFAULT_SIZE } from '@/constants';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { formatDate } from '@/constants/common';
import { DatePicker } from '@mui/x-date-pickers';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const Invoice = () => {
  const navigate = useNavigate();
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const { list } = useSelector((state: ReduxState) => state.invoice);
  const [data, setData] = useState<InvoiceType[]>([...list]);
  const [searchParams, setSearchParams] = useSearchParams();
  const dataBackup = useRef<InvoiceType[]>(list);

  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria<FilterInvoice>>({
    filters: {},
    paging: {
      page: DEFAULT_INITIAL_PAGE,
      pageSize: DEFAULT_SIZE,
    },
    sorts: [],
  });

  useEffect(() => {
    if (searchParams.size < 1) {
      return;
    }

    const querystringObj = Object.fromEntries(searchParams);
    const transformToFilterCriteria = {
      contract: querystringObj?.contract || '',
      startDate: querystringObj?.startDate || null,
      endDate: querystringObj?.endDate || null,
      status: querystringObj?.status || '',
      category: querystringObj?.category || 'all',
    };

    setFilterCriteria({
      ...filterCriteria,
      filters: {
        ...filterCriteria.filters,
        ...transformToFilterCriteria,
        startDate: querystringObj?.startDate ? dayjs(dayjs.utc(querystringObj?.startDate).local()) : null,
        endDate: querystringObj?.endDate ? dayjs(dayjs.utc(querystringObj?.endDate).local()) : null,
        category: querystringObj?.category || 'all',
      },
      paging: {
        page: +querystringObj?.page || DEFAULT_INITIAL_PAGE,
        pageSize: +querystringObj?.pageSize || DEFAULT_SIZE,
      },
    });
  }, []);

  useEffect(() => {
    const buildParams = () => {
      const params: any = {};
      let dataList: InvoiceType[] = dataBackup.current;
      if (filterCriteria.filters.category && filterCriteria.filters.category !== 'all') {
        params.category = filterCriteria.filters.category;
        dataList = dataList.filter((e) => e.category === filterCriteria.filters.category);
      }
      if (filterCriteria.filters.startDate) {
        params.startDate = dayjs(filterCriteria.filters.startDate).startOf('day').toISOString();
        dataList = dataList.filter((e) =>
          dayjs(e.createDate).isAfter(dayjs(filterCriteria.filters.startDate).startOf('day')),
        );
      }
      if (filterCriteria.filters.endDate) {
        params.endDate = dayjs(filterCriteria.filters.endDate).startOf('day').toISOString();
        dataList = dataList.filter((e) =>
          dayjs(e.dueDate).isBefore(dayjs(filterCriteria.filters.endDate).startOf('day')),
        );
      }
      if (filterCriteria.filters.status) {
        params.status = filterCriteria.filters.status;
        dataList = dataList.filter((e) => e.status === filterCriteria.filters.status);
      }
      if (filterCriteria.filters.vat) {
        params.vat = filterCriteria.filters.vat;
      }
      if (filterCriteria.filters.contractor) {
        params.contractor = filterCriteria.filters.contractor;
        dataList = dataList.filter((e) => e.contractor === filterCriteria.filters.contractor);
      }

      params.page = filterCriteria.paging.page.toString();
      params.pageSize = filterCriteria.paging.pageSize.toString();

      setData(dataList);

      return params;
    };

    setSearchParams(buildParams());
  }, [filterCriteria]);

  const filterCategory = (category: string) => {
    setFilterCriteria({
      ...filterCriteria,
      filters: {
        ...filterCriteria.filters,
        category,
      },
    });
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

  const typeList = useMemo(() => {
    return (
      <>
        <Button
          variant={filterCriteria.filters.category === 'all' ? 'contained' : 'text'}
          onClick={() => filterCategory('all')}
        >
          All
        </Button>
        <Button
          variant={filterCriteria.filters.category === 'inprogess' ? 'contained' : 'text'}
          onClick={() => filterCategory('inprogess')}
        >
          Inprogess
        </Button>
        <Button
          variant={filterCriteria.filters.category === 'draft' ? 'contained' : 'text'}
          onClick={() => filterCategory('draft')}
        >
          Draft
        </Button>
      </>
    );
  }, [filterCriteria]);

  const filter = useMemo(() => {
    return (
      <>
        <FormControl fullWidth>
          <InputLabel>Document type</InputLabel>
          <Select name="contractor" value={filterCriteria.filters.contractor} onChange={handleChangeFilter}>
            <MenuItem value="contractor1">Contractor 1</MenuItem>
            <MenuItem value="contractor2">Contractor 2</MenuItem>
            <MenuItem value="contractor3">Contractor 3</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Vat</InputLabel>
          <Select name="vat" value={filterCriteria.filters.vat} onChange={handleChangeFilter}>
            <MenuItem value="10">10%</MenuItem>
            <MenuItem value="20">20%</MenuItem>
          </Select>
        </FormControl>
        <DatePicker
          label="Start Date"
          // value={dayjs(filterCriteria.filters.startDate) || ''}
          onChange={(e) => handleChangeDateFilter(e, 'startDate')}
          sx={{ width: '100%' }}
        />
        <DatePicker
          label="End Date"
          // value={dayjs(filterCriteria.filters.endDate) || ''}
          onChange={(e) => handleChangeDateFilter(e, 'endDate')}
          sx={{ width: '100%' }}
        />
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select name="status" value={filterCriteria.filters.status} onChange={handleChangeFilter}>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
            <MenuItem value="Outstanding">Outstanding</MenuItem>
            <MenuItem value="Late">Late</MenuItem>
          </Select>
        </FormControl>
      </>
    );
  }, [filterCriteria]);

  const handleAdd = () => {
    navigate(routeStrings.invoiceCreate);
  };

  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: 'id',
        headerName: 'ID',
        width: 150,
        renderHeader: (params: GridColumnHeaderParams) => (
          <Typography variant="subtitle1" color="primary">
            {params.colDef.headerName}
          </Typography>
        ),
      },
      {
        field: 'contractor',
        headerName: 'Contractor',
        flex: 1,
        renderHeader: (params: GridColumnHeaderParams) => (
          <Typography variant="subtitle1" color="primary">
            {params.colDef.headerName}
          </Typography>
        ),
      },
      {
        field: 'type',
        headerName: 'Type',
        flex: 1,
        renderHeader: (params: GridColumnHeaderParams) => (
          <Typography variant="subtitle1" color="primary">
            {params.colDef.headerName}
          </Typography>
        ),
      },
      {
        field: 'createDate',
        headerName: 'Create Date',
        alignItems: 'center',
        flex: 1,
        renderHeader: (params: GridColumnHeaderParams) => (
          <Typography variant="subtitle1" color="primary">
            {params.colDef.headerName}
          </Typography>
        ),
        renderCell: (params: GridRenderCellParams) => <p>{dayjs(params.value).format(formatDate)}</p>,
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        renderHeader: (params: GridColumnHeaderParams) => (
          <Typography variant="subtitle1" color="primary">
            {params.colDef.headerName}
          </Typography>
        ),
        renderCell: (params: GridRenderCellParams) => (
          <>
            <Chip label={params.value} />
          </>
        ),
      },
    ];
  }, []);

  return (
    <>
      <ListPage typeList={typeList} filter={filter} titleAddButton="Create a new invoice" actionAdd={handleAdd}>
        <DataGrid
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
          checkboxSelection
          rows={data}
          columns={columns}
          hideFooterPagination={true}
        />
      </ListPage>
    </>
  );
};

export default Invoice;
