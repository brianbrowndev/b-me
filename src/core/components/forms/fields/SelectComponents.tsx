import React, { HTMLAttributes } from "react";
import {
  makeStyles,
  Theme,
  createStyles,
  emphasize,
} from "@material-ui/core/styles";
import FormOptionType from "../FormOptionType";
import { Paper, Typography, MenuItem, Chip } from "@material-ui/core";
import { ValueContainerProps } from "react-select/src/components/containers";
import { ControlProps } from "react-select/src/components/Control";
import { MenuProps, NoticeProps } from "react-select/src/components/Menu";
import { OptionProps } from "react-select/src/components/Option";
import { PlaceholderProps } from "react-select/src/components/Placeholder";
import { Omit } from "@material-ui/types";
import TextField, { BaseTextFieldProps } from "@material-ui/core/TextField";
import { MultiValueProps } from "react-select/src/components/MultiValue";
import CancelIcon from "@material-ui/icons/Cancel";
import clsx from "clsx";
import { SingleValueProps } from "react-select/src/components/SingleValue";

const useSelectStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      display: "flex",
      height: "auto",
    },
    valueContainer: {
      display: "flex",
      flexWrap: "wrap",
      flex: 1,
      alignItems: "center",
      overflow: "hidden",
    },
    chip: {
      margin: theme.spacing(0.5, 0.25),
    },
    chipFocused: {
      backgroundColor: emphasize(
        theme.palette.type === "light"
          ? theme.palette.grey[300]
          : theme.palette.grey[700],
        0.08
      ),
    },
    noOptionsMessage: {
      padding: theme.spacing(1, 2),
    },
    singleValue: {
      fontSize: 16,
    },
    placeholder: {
      position: "absolute",
      left: 2,
      bottom: 6,
      fontSize: 16,
    },
    paper: {
      position: "absolute",
      zIndex: 2,
      marginTop: theme.spacing(1),
      left: 0,
      right: 0,
    },
  })
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

type InputComponentProps = Pick<BaseTextFieldProps, "inputRef"> &
  HTMLAttributes<HTMLDivElement>;

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

type MuiPlaceholderProps = Omit<
  PlaceholderProps<FormOptionType>,
  "innerProps"
> &
  Partial<Pick<PlaceholderProps<FormOptionType>, "innerProps">>;
function Placeholder(props: MuiPlaceholderProps) {
  const { selectProps, innerProps = {} } = props;
  return (
    <Typography
      color="textSecondary"
      className={selectProps.classes.placeholder}
      {...innerProps}
    ></Typography>
  );
}

function ValueContainer(props: ValueContainerProps<FormOptionType>) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

function MultiValue(props: MultiValueProps<FormOptionType>) {
  return (
    <Chip
      key={props.data.key}
      tabIndex={-1}
      label={props.children}
      className={clsx(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function SingleValue(props: SingleValueProps<FormOptionType>) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function Menu(props: MenuProps<FormOptionType>) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

export {
  Menu,
  SingleValue,
  MultiValue,
  ValueContainer,
  Placeholder,
  Option,
  Control,
  inputComponent,
  NoOptionsMessage,
  useSelectStyles,
};
