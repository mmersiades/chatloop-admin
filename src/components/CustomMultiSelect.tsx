import React from 'react';
import { FieldProps } from 'formik';
import Select from 'react-select';
import { OptionsType, ValueType } from 'react-select/src/types';
import {
  createStyles,
  withStyles,
  Typography,
  TextField,
  MenuItem,
  Chip,
  Paper,
  NoSsr,
  Theme,
  WithStyles,
} from '@material-ui/core';
import { emphasize, fade } from '@material-ui/core/styles/colorManipulator';
import clsx from 'clsx';
import { CancelRounded } from '@material-ui/icons';

/** @ignore */
const styles = ({ spacing, palette }: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    input: {
      display: 'flex',
      padding: spacing(1, 2),
      height: 'auto',
    },
    valueContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      flex: 1,
      alignItems: 'center',
      overflow: 'hidden',
    },
    chip: {
      margin: spacing(0.5, 0.25),
    },
    chipRoot: {
      backgroundColor: fade('#45ecff', 0.25),
    },
    chipFocused: {
      backgroundColor: emphasize(
        palette.type === 'light' ? '#45ecff' : '#45ecff',
        0.08
      ),
    },
    noOptionsMessage: {
      padding: spacing(1, 2),
    },
    paper: {
      position: 'absolute',
      zIndex: 3,
      marginTop: spacing(1),
      left: 0,
      right: 0,
    },
    textField: {
      width: '100%',
      paddingTop: spacing(),
    },
    cancelIconRoot: {
      fill: palette.primary.main,
    },
  });

export interface Option {
  label: string;
  value: string;
}

interface CustomMultiSelectProps extends FieldProps, WithStyles<typeof styles> {
  options: OptionsType<Option>;
  isMulti?: boolean;
  className?: string;
  placeholder?: string;
}

/**
 * This React functional component renders a select element
 * that can handle the User selecting multiple options,
 * rendering the selected options as Chips.
 * Uses **react-select**
 * @noInheritDoc
 */
export const CustomMultiSelect = ({
  classes,
  placeholder,
  field,
  form,
  options,
  isMulti = false,
}: CustomMultiSelectProps) => {
  /** Updates the field's value as the User types */
  const onChange = (option: ValueType<Option | Option[], boolean>) => {
    let fieldValue;
    if (isMulti) {
      if (option === null) {
        // Set value to empty array if User deletes option from input
        fieldValue = [];
      } else {
        fieldValue = (option as Option[]).map((item: Option) => {
          return item.value;
        });
      }
    } else {
      fieldValue = (option as Option).value;
    }

    try {
      form.setFieldValue(field.name, fieldValue);
    } catch (error) {
      console.error(error);
    }
  };

  const getValue = () => {
    if (options) {
      console.log(`options`, options);
      console.log(`field`, field);
      return isMulti
        ? options.filter((option) => field.value.indexOf(option.value) >= 0)
        : options.find((option) => option.value === field.value);
    } else {
      return isMulti ? [] : ('' as any);
    }
  };

  /**
   * A customised element so that the form can have Material-UI styling
   * Returns JSX for a material-ui Typography
   * */
  const NoOptionsMessage = (props: any) => {
    return (
      <Typography
        color="textSecondary"
        className={props.selectProps.classes.noOptionsMessage}
        {...props.innerProps}
      >
        {props.children}
      </Typography>
    );
  };

  const inputComponent = ({ inputRef, ...props }: any) => {
    return <div ref={inputRef} {...props} />;
  };

  /**
   * A customised element so that the form can have Material-UI styling
   * Returns JSX for a material-ui TextField
   * */
  const Control = (props: any) => {
    const {
      children,
      innerProps,
      innerRef,
      selectProps: { classes, TextFieldProps },
    } = props;

    return (
      <TextField
        fullWidth
        variant="outlined"
        dir="ltr"
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
  };

  /**
   * A customised element so that the form can have Material-UI styling
   * Returns JSX for a material-ui MenuOption
   * */
  const Option = (props: any) => {
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
  };

  /**
   * A customised element so that the form can have Material-UI styling
   * Returns JSX for a material-ui Typography
   * */
  const Placeholder = (props: any) => {
    const { selectProps, innerProps = {}, children } = props;
    return (
      <Typography
        color="textSecondary"
        className={selectProps.classes.placeholder}
        {...innerProps}
      >
        {children}
      </Typography>
    );
  };

  const ValueContainer = (props: any) => {
    return (
      <div className={props.selectProps.classes.valueContainer}>
        {props.children}
      </div>
    );
  };

  /**
   * A customised element so that the form can have Material-UI styling
   * Returns JSX for a material-ui Chip
   * */
  const MultiValue = (props: any) => {
    return (
      <Chip
        tabIndex={-1}
        classes={{ root: classes.chipRoot }}
        label={props.children}
        className={clsx(props.selectProps.classes.chip, {
          [props.selectProps.classes.chipFocused]: props.isFocused,
        })}
        onDelete={props.removeProps.onClick}
        deleteIcon={
          <CancelRounded
            classes={{ root: classes.cancelIconRoot }}
            {...props.removeProps}
          />
        }
      />
    );
  };

  /**
   * A customised element so that the form can have Material-UI styling
   * Returns JSX for a material-ui Paper
   * */
  const Menu = (props: any) => {
    return (
      <Paper
        square
        className={props.selectProps.classes.paper}
        {...props.innerProps}
      >
        {props.children}
      </Paper>
    );
  };

  /**
   * Gathers up the components created above so they
   * can be passed into the **react-select** Select component
   */
  const components = {
    Control,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    ValueContainer,
  };

  return (
    <div className={classes.root}>
      <NoSsr>
        <Select
          className={classes.textField}
          classes={classes}
          name={field.name}
          value={getValue()}
          onChange={onChange}
          placeholder={placeholder}
          options={options}
          isMulti={isMulti}
          components={components}
        />
      </NoSsr>
    </div>
  );
};

export default withStyles(styles)(CustomMultiSelect);
