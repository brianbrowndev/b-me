import React, { useState, useEffect, CSSProperties, HTMLAttributes } from 'react';
import { makeStyles, Theme, createStyles, useTheme } from '@material-ui/core/styles';
import Select from 'react-select';
import FormOptionType from './FormOptionType';
import { Paper, Typography, MenuItem } from '@material-ui/core';
import { ValueContainerProps } from 'react-select/src/components/containers';
import { ControlProps } from 'react-select/src/components/Control';
import { MenuProps, NoticeProps } from 'react-select/src/components/Menu';
import { OptionProps } from 'react-select/src/components/Option';
import { PlaceholderProps } from 'react-select/src/components/Placeholder';
import { SingleValueProps } from 'react-select/src/components/SingleValue';
import { Omit } from '@material-ui/types';
import TextField, { BaseTextFieldProps } from '@material-ui/core/TextField';

// Pulled from: https://material-ui.com/components/autocomplete/
// TODO - understand component override of select to use MUI components

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menu: {
      width: 200,
    },
    root: {
      flexGrow: 1,
      height: 250,
      minWidth: 290,
    },
    input: {
      display: 'flex',
      padding: 0,
      height: 'auto',
    },
    valueContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      flex: 1,
      alignItems: 'center',
      overflow: 'hidden',
    },
    noOptionsMessage: {
      padding: theme.spacing(1, 2),
    },
    singleValue: {
      fontSize: 16,
    },
    placeholder: {
      position: 'absolute',
      left: 2,
      bottom: 6,
      fontSize: 16,
    },
    paper: {
      position: 'absolute',
      zIndex: 1,
      marginTop: theme.spacing(1),
      left: 0,
      right: 0,
    },
    divider: {
      height: theme.spacing(2),
    },
  }),
);


function NoOptionsMessage(props: NoticeProps<FormOptionType>) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

type InputComponentProps = Pick<BaseTextFieldProps, 'inputRef'> & HTMLAttributes<HTMLDivElement>;

function inputComponent({ inputRef, ...props }: InputComponentProps) {
  return <div ref={inputRef} {...props} />;
}

function Control(props: ControlProps<FormOptionType>) {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { classes, TextFieldProps },
  } = props;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: classes.input,
          ref: innerRef,
          children,
          ...innerProps,
        },
      }}
      {...TextFieldProps}
    />
  );
}

function Option(props: OptionProps<FormOptionType>) {
  return (
    <MenuItem
      ref={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

type MuiPlaceholderProps = Omit<PlaceholderProps<FormOptionType>, 'innerProps'> & Partial<Pick<PlaceholderProps<FormOptionType>, 'innerProps'>>;
function Placeholder(props: MuiPlaceholderProps) {
  const { selectProps, innerProps = {}, children } = props;
  return (
    <Typography color="textSecondary" className={selectProps.classes.placeholder} {...innerProps}>
      {children}
    </Typography>
  );
}

function SingleValue(props: SingleValueProps<FormOptionType>) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props: ValueContainerProps<FormOptionType>) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function Menu(props: MenuProps<FormOptionType>) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};



interface SelectProps {
  label: string;
  id: string;
  options: FormOptionType[]; 
  obj: {[key:string]:any} | undefined;
  valueProperty: string; 
  labelProperty: string;
  onChange(obj:{[key:string]:any}): void;
}


export default function FormSelect({label, id, options, obj, valueProperty, labelProperty, onChange}: SelectProps) {
  const classes = useStyles();
  const theme = useTheme();

  const [option, setOption] = useState({} as FormOptionType);
  const selectStyles = {
    input: (base: CSSProperties) => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  };


  useEffect(() => {
    if (obj !== undefined) {
      setOption({value: obj[valueProperty], label:obj[labelProperty]} as FormOptionType);
    }
  }, [obj, valueProperty, labelProperty])


  
  function handleChange(selected: any): void {
    selected = (selected as FormOptionType);
    setOption(selected);
    onChange({...obj, [labelProperty]:selected.label, [valueProperty]:selected.value});
  }

  return (
        <Select
          classes={classes}
          styles={selectStyles}
          inputId={id}
          TextFieldProps={{
            label: label,
            InputLabelProps: {
              htmlFor: id,
              shrink: true,
            },
          }}
          placeholder={label}
          options={options}
          components={components}
          value={option}
          onChange={handleChange}
        />
 );
}