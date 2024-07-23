import ListPage from '@/components/listpage/ListPage';
import routeStrings from '@/routes/routeStrings';
import {
  Button,
  Chip,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridColumnHeaderParams,
  GridRenderCellParams,
  GridRowSelectionModel,
} from '@mui/x-data-grid';
import { SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ReduxState } from '@/redux/store';
import { FilterCriteria, FilterInvoice, Invoice as InvoiceType } from '@/types';
import { DEFAULT_INITIAL_PAGE, DEFAULT_SIZE } from '@/constants';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { formatDate } from '@/constants/common';
import { DatePicker } from '@mui/x-date-pickers';
import Filter from './Filter';

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
    filters: { contractor: '', vat: '', startDate: null, endDate: null, status: '' },
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
      startDate: querystringObj?.startDate,
      endDate: querystringObj?.endDate,
      status: querystringObj?.status || '',
      category: querystringObj?.category || 'all',
    };

    setFilterCriteria({
      ...filterCriteria,
      filters: {
        ...filterCriteria.filters,
        ...transformToFilterCriteria,
        startDate: querystringObj?.startDate && dayjs(dayjs.utc(querystringObj?.startDate).local()),
        endDate: querystringObj?.endDate && dayjs(dayjs.utc(querystringObj?.endDate).local()),
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

  const resetFilter = () => {
    setFilterCriteria({
      filters: { contractor: '', vat: '', startDate: null, endDate: null, status: '' },
      paging: {
        page: DEFAULT_INITIAL_PAGE,
        pageSize: DEFAULT_SIZE,
      },
      sorts: [],
    });
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
        <Filter filters={filterCriteria.filters} setFilterCriteria={setFilterCriteria} resetFilter={resetFilter} />
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
        renderCell: (params: GridRenderCellParams) => (
          <>
            <NavLink to={`${routeStrings.invoiceDetail}/${params.value}`}>{params.value}</NavLink>
          </>
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
