import React, { Fragment, useState } from 'react';
import { Grid, makeStyles, Theme, createStyles } from '@material-ui/core';
import FinanceSummaryCard from './SummaryCard';
import getLookupName from '../core/components/forms/lookups/getLookupName';
import FormYearOptions from '../core/components/forms/FormYearOptions';
import { SelectFieldSchema } from '../core/components/forms/SchemaForm';
import SchemaFormField from '../core/components/forms/fields/SchemaField';
import FinanceSpendingCard from './SpendingCard';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    container: {
      marginTop: theme.spacing(2),
      [theme.breakpoints.down('md')]: {
        justifyContent: 'center'
      }
    },
    year: {
      width:'125px'
    }
  })
});


const formSchema = {
  year: {
    title: "Year",
    type: "select",
    options: FormYearOptions,
    required: true,
    getVal: getLookupName
  } as SelectFieldSchema,
}


function FinanceDashboard () {

  const classes = useStyles();

  const [form, setForm] = useState<{[key:string]:any}>({year: {id:"2019", name:"2019"}});

  const onFormChange = (obj:{[key:string]:any}) => setForm({...obj});

  return (
  <Fragment>
    <Grid container direction="row">
      <Grid item xs={10}>
        <Grid container spacing={3}>
          <Grid item>
            <FinanceSummaryCard year={form.year.id}/>
          </Grid>
          <Grid item>
            <FinanceSpendingCard year={form.year.id}/>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs>
        <Grid container direction="row" justify="flex-end" >
          <Grid item className={classes.year}>
            <SchemaFormField  property={"year"} obj={form} schema={formSchema.year} onChange={onFormChange}  error={""}/>
          </Grid>
        </Grid>
      </Grid>
   </Grid>
   {/* <Typography color="textSecondary" variant="h5" gutterBottom className={classes.title}>
      Org
    </Typography>
    <Grid container spacing={3} className={classes.container}>
      {orgContext.routes().reduce((a, b) => a.concat(b.items), ([] as OrgItem[])).map(item => 
        <Grid item xs={12} sm key={item.title}>
          <OrgItemCard orgItem={item}></OrgItemCard>
        </Grid>
      )}
    </Grid> */}
  </Fragment>
  )
}

export default FinanceDashboard;