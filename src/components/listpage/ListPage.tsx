import { Button, Paper, Stack } from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { ListPageProp } from './ListPage.d';

const ListPage = ({ typeList, filter, titleAddButton, actionAdd, children }: ListPageProp) => {
  return (
    <Stack spacing={2} direction="column">
      <Paper
        elevation={0}
        sx={{
          p: 2,
        }}
      >
        <Stack spacing={2} direction="column">
          <Stack spacing={2} direction="row" justifyContent="space-between" alignItems="center">
            <Stack spacing={2} direction="row" justifyContent="flex-start">
              {typeList}
            </Stack>
            <Stack spacing={2} direction="row" justifyContent="flex-end">
              <Button startIcon={<ControlPointIcon />} variant="contained" onClick={actionAdd}>
                {titleAddButton}
              </Button>
            </Stack>
          </Stack>
          <Stack spacing={2} direction="row" alignItems="center">
            {filter}
          </Stack>
        </Stack>
      </Paper>
      <Paper
        elevation={0}
        sx={{
          p: 2,
        }}
      >
        {children}
      </Paper>
    </Stack>
  );
};

export default ListPage;
