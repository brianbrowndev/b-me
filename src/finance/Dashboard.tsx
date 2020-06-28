import React, { Fragment, useState } from 'react';
import { Grid, makeStyles, Theme, createStyles } from '@material-ui/core';
import FinanceSummaryCard from './SummaryCard';
import getLookupName from '../core/components/forms/lookups/getLookupName';
import FormYearOptions from '../core/components/forms/FormYearOptions';
import { SelectMenuFieldSchema } from '../core/components/forms/SchemaForm';
import SchemaFormField from '../core/components/forms/fields/SchemaField';
import FinanceSpendingCard from './SpendingCard';
import FinanceMonthlySpendingSummaryCard from './MonthlySpendingSummaryCard';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    container: {
      marginTop: theme.spacing(2),
      [theme.breakpoints.down('md')]: {
        justifyContent: 'center'
      }
    },
    year: {
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      zIndex: 999

    }
  })
});


const formSchema = {
  year: {
    title: "Year",
    type: "select-menu",
    options: FormYearOptions,
    required: true,
    getVal: getLookupName
  } as SelectMenuFieldSchema,
}


function FinanceDashboard() {

  const classes = useStyles();

  const [form, setForm] = useState<{ [key: string]: any }>({ year: { id: "2020", name: "2020" } });

  const onFormChange = (obj: { [key: string]: any }) => setForm({ ...obj });

  return (
    <Fragment>
      <div className={classes.year}>
        <SchemaFormField property={"year"} obj={form} schema={formSchema.year} onChange={onFormChange} error={""} />
      </div>

      <Grid container direction="row">
        <Grid item xs={10}>
          <Grid container spacing={3}>
            <Grid item>
              <FinanceSummaryCard year={form.year.id} />
            </Grid>
            <Grid item>
              <FinanceSpendingCard year={form.year.id} />
            </Grid>
            <Grid item>
              <FinanceMonthlySpendingSummaryCard year={form.year.id} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default FinanceDashboard;