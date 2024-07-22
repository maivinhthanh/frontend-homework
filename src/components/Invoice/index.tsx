import { Field, FieldArray, FormikErrors } from 'formik';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Button,
  Grid,
  Stack,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  SelectChangeEvent,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/vi';
import dayjs from 'dayjs';
import EmptyIcon from '@/assets/icon/empty.svg?react';
import DeleteIcon from '@mui/icons-material/Delete';
import PaidIcon from '@mui/icons-material/Paid';
import { Product } from '@/types';
import useProductsQuery from '@/hooks/useProductsQuery';
import { numberFormatter } from '@/helpers';
import { useMemo } from 'react';
import { InvoiceProps } from './Invoice';

const Invoice = ({
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  setFieldValue,
  isEdit = false,
  submitComponent,
}: InvoiceProps) => {
  const { products } = useProductsQuery();

  const handleChangeProduct = (e: SelectChangeEvent<any>, index: number) => {
    const { name, value } = e.target;
    const product = products.find((e: any) => e.id === value);
    setFieldValue(name, value);
    setFieldValue(`products[${index}].price`, product.price);
    setFieldValue(`products[${index}].amount`, values.products[index].quantity * product.price);
    setFieldValue(`products[${index}].rate`, product.rate);
  };

  const handleChangeQuantity = (e: any, index: number) => {
    const { value } = e.target;
    setFieldValue(`products[${index}].quantity`, value);
    setFieldValue(`products[${index}].amount`, values.products[index].price * value);
  };

  const total = useMemo(() => {
    return values.products.reduce((sum: any, curr: { amount: any }) => {
      return (sum += curr.amount);
    }, 0);
  }, [values]);

  const tax = useMemo(() => {
    return (total * Number.parseInt(values.vat)) / 100 || 0;
  }, [values, total]);

  return (
    <>
      <Stack spacing={2} direction="column">
        <Paper
          elevation={0}
          sx={{
            p: 2,
            flex: 'none',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Field
                as={TextField}
                fullWidth
                name="id"
                label="Document number"
                value={values.id}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.id && !!errors.id}
                helperText={touched.id && errors.id}
                disabled
                variant="filled"
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl variant="filled" fullWidth error={touched.type && !!errors.type} disabled={isEdit}>
                <InputLabel>Document type</InputLabel>
                <Field as={Select} name="type" value={values.type} onChange={handleChange} onBlur={handleBlur}>
                  <MenuItem value="type1">Type 1</MenuItem>
                  <MenuItem value="type2">Type 2</MenuItem>
                  <MenuItem value="type3">Type 3</MenuItem>
                  <MenuItem value="type3">Type 4</MenuItem>
                </Field>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl variant="filled" fullWidth error={touched.prepared && !!errors.prepared}>
                <InputLabel>Prepared</InputLabel>
                <Field
                  as={Select}
                  name="prepared"
                  value={values.prepared}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isEdit}
                >
                  <MenuItem value="contractor1">Prepared 1</MenuItem>
                  <MenuItem value="contractor2">Prepared 2</MenuItem>
                  <MenuItem value="contractor3">Prepared 3</MenuItem>
                </Field>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl
                variant="filled"
                fullWidth
                error={touched.contractor && !!errors.contractor}
                disabled={isEdit}
              >
                <InputLabel>Contractor</InputLabel>
                <Field
                  as={Select}
                  name="contractor"
                  value={values.contractor}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <MenuItem value="contractor1">Contractor 1</MenuItem>
                  <MenuItem value="contractor2">Contractor 2</MenuItem>
                  <MenuItem value="contractor3">Contractor 3</MenuItem>
                </Field>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl variant="filled" fullWidth error={touched.vat && !!errors.vat} disabled={isEdit}>
                <InputLabel>VAT</InputLabel>
                <Field as={Select} name="vat" value={values.vat} onChange={handleChange} onBlur={handleBlur}>
                  <MenuItem value="10">10%</MenuItem>
                  <MenuItem value="20">20%</MenuItem>
                  <MenuItem value="30">30%</MenuItem>
                </Field>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl
                variant="filled"
                fullWidth
                error={touched.bankAccount && !!errors.bankAccount}
                disabled={isEdit}
              >
                <InputLabel>Bank account</InputLabel>
                <Field
                  as={Select}
                  name="bankAccount"
                  value={values.bankAccount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <MenuItem value="012345">3123 2123 1123 1123</MenuItem>
                  <MenuItem value="543210">9831 2312 3131 3123</MenuItem>
                </Field>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <DatePicker
                label="Invoice Date"
                value={dayjs(values.invoiceDate)}
                onChange={(value) => setFieldValue('invoiceDate', value)}
                sx={{ width: '100%' }}
                slotProps={{ textField: { variant: 'filled' } }}
                disabled={isEdit}
              />
            </Grid>
            <Grid item xs={4}>
              <DatePicker
                label="Due Date"
                value={dayjs(values.dueDate)}
                onChange={(value) => setFieldValue('dueDate', value)}
                sx={{ width: '100%' }}
                slotProps={{ textField: { variant: 'filled' } }}
                disabled={isEdit}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl variant="filled" fullWidth error={touched.payment && !!errors.payment} disabled={isEdit}>
                <InputLabel>Payment</InputLabel>
                <Field as={Select} name="payment" value={values.payment} onChange={handleChange} onBlur={handleBlur}>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="card">Card</MenuItem>
                </Field>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            height: `calc(100vh - 480px)`,
            overflow: 'auto',
          }}
        >
          <Grid item xs={12} sm={9} md={9} sx={{ textAlign: 'right' }}>
            <FieldArray name="products">
              {({ push, remove }) => (
                <Stack direction="column" justifyContent="space-between" sx={{ height: '100%' }}>
                  <TableContainer component={Paper} sx={{ maxHeight: 250 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Rate</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {values.products.length === 0 && (
                          <TableCell colSpan={6}>
                            <Stack justifyContent="center" alignItems="center" sx={{ width: '100%' }}>
                              <EmptyIcon width={140} height={140} />
                            </Stack>
                          </TableCell>
                        )}
                        {values.products.map((product: Product, index: number) => {
                          const productErrors = errors.products?.[index] as FormikErrors<Product> | undefined;
                          const productTouched = touched.products?.[index] as any;
                          return (
                            <TableRow key={index}>
                              <TableCell sx={{ width: 200 }}>
                                <FormControl
                                  sx={{ width: 200 }}
                                  error={productTouched?.name && !!productErrors?.name}
                                  disabled={isEdit}
                                >
                                  <Field
                                    sx={{ width: '100%' }}
                                    as={Select}
                                    name={`products[${index}].name`}
                                    value={product.name}
                                    onChange={(event: SelectChangeEvent<any>) => handleChangeProduct(event, index)}
                                    onBlur={handleBlur}
                                    variant="standard"
                                  >
                                    {products.map((item: any, index: number) => {
                                      return (
                                        <MenuItem value={item.id} key={index}>
                                          {item.name}
                                        </MenuItem>
                                      );
                                    })}
                                  </Field>
                                  {productTouched?.name && productErrors?.name && (
                                    <FormHelperText>{productErrors?.name}</FormHelperText>
                                  )}
                                </FormControl>
                              </TableCell>
                              <TableCell sx={{ width: 200 }}>
                                <Field
                                  name={`products[${index}].quantity`}
                                  type="number"
                                  as={TextField}
                                  onChange={(e: any) => handleChangeQuantity(e, index)}
                                  variant="standard"
                                  error={productTouched?.quantity && !!productErrors?.quantity}
                                  helperText={productTouched?.quantity && productErrors?.quantity}
                                  disabled={isEdit}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography>{product.rate}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{numberFormatter(product.price)}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{numberFormatter(product.amount)}</Typography>
                              </TableCell>
                              <TableCell>
                                {!isEdit && (
                                  <IconButton onClick={() => remove(index)} color="error">
                                    <DeleteIcon />
                                  </IconButton>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {!isEdit && (
                    <Box>
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        onClick={() => push({ name: '', quantity: 1, rate: '', price: 0, amount: 0 })}
                        sx={{ marginTop: 2 }}
                      >
                        Add Product
                      </Button>
                    </Box>
                  )}
                </Stack>
              )}
            </FieldArray>
          </Grid>
        </Paper>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            flex: 'none',
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={2}
            >
              <Stack spacing={2} direction="row" justifyContent="flex-start" alignItems="center">
                <Typography>Tax base {numberFormatter(tax)}</Typography>
              </Stack>
              <Stack spacing={2} direction="row" justifyContent="flex-start" alignItems="center">
                <Typography>% VAT {values.vat}</Typography>
              </Stack>
              <Stack spacing={2} direction="row" justifyContent="flex-start" alignItems="center">
                <PaidIcon />
                <Typography>Total {numberFormatter(total - tax)}</Typography>
              </Stack>
            </Stack>
            <Stack spacing={2} direction="row" justifyContent="flex-start" alignItems="center">
              {submitComponent}
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </>
  );
};

export default Invoice;
