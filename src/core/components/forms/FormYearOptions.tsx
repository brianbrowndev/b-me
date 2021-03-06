import FormOptionType from "./FormOptionType";

export default ["2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014"].map(
  (year) => ({ value: year, label: year } as FormOptionType)
);
