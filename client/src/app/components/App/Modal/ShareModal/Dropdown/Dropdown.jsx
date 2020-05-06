import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

require('./Dropdown.scss');

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function Dropdown({ options, onChange, formLabel, formHelperText, formControlClassName }) {
  const classes = useStyles();

  const getDefaultValue = (dropDownOptions) => {
    for (let i = 0; i < dropDownOptions.length; i++) {
      const option = dropDownOptions[i];
      if (option.selected === true) {
        return option.value;
      }
    }
    return '';
  };

  const [state, setState] = React.useState({
    selection: getDefaultValue(options),
  });

  const handleChange = (event) => {
    setState({ selection: event.target.value });
    onChange(event);
  };

  return (
    <FormControl className={`${classes.formControl} ${formControlClassName}`}>
      {formLabel && (
        <InputLabel shrink id="dropdown__label">
          {formLabel}
        </InputLabel>
      )
      }
      <Select
        labelId="dropdown__label"
        id="dropdown-placeholder-label"
        onChange={handleChange}
        value={state.selection}
      >
        {options.map(option => <MenuItem value={option.value}>{option.displayKey}</MenuItem>)}
      </Select>
      {formHelperText && <FormHelperText>{formHelperText}</FormHelperText>}
    </FormControl>
  );
}

Dropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    displayKey: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired
  })).isRequired,
  formLabel: PropTypes.string,
  formHelperText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

Dropdown.defaultProps = {
  formLabel: null,
  formHelperText: null,
};
