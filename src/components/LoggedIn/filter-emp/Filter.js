import React, { Component } from "react";
import "./Filter.css";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import { connect } from "react-redux";
import { updateFilterValue } from "../../../ducks/schedulesreducer";

let underlined = {
  borderColor: "black"
};
let iconColor = {
  fill: "black"
};
let selectElement = {
  width: "184px"
};
class Filter extends Component {
  constructor() {
    super();
    this.state = {
      station: 1,
      employee: 1
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(prop, val) {
    this.setState({ [prop]: val });
  }
  render() {
    return (
      <div className="filters">
        {/* <div className="filter-station">
          <SelectField
            autoWidth={true}
            value={this.state.station}
            onChange={(event, i, val) => {
              this.handleChange("station", val);
            }}
          >
            <MenuItem value={1} primaryText="select station" />
            <MenuItem value="Griddle" primaryText="Griddle" />
            <MenuItem value="Fry" primaryText="Fry" />
            <MenuItem value="Flat Bread" primaryText="Flat Bread" />
            <MenuItem value="Broil" primaryText="Broil" />
            <MenuItem value="Salad" primaryText="Salad" />
          </SelectField>
        </div> */}
        <div className="filter-emp">
          <SelectField
            labelStyle={{ color: "#2196F3" }}
            listStyle={{ backgroundColor: "#BBDEFB" }}
            style={selectElement}
            iconStyle={iconColor}
            underlineStyle={underlined}
            value={this.state.employee}
            onChange={(event, i, val) => {
              console.log(val);
              this.handleChange("employee", val);
              this.props.updateFilterValue(val);
            }}
          >
            <MenuItem
              style={{ color: "#2196F3" }}
              value={1}
              primaryText="All Employees"
            />
            <MenuItem
              style={{ color: "#2196F3" }}
              value="A-F"
              primaryText="A-F"
            />
            <MenuItem
              style={{ color: "#2196F3" }}
              value="G-K"
              primaryText="G-K"
            />
            <MenuItem
              style={{ color: "#2196F3" }}
              value="L-P"
              primaryText="L-P"
            />
            <MenuItem
              style={{ color: "#2196F3" }}
              value="Q-U"
              primaryText="Q-U"
            />
            <MenuItem
              style={{ color: "#2196F3" }}
              value="V-Z"
              primaryText="V-Z"
            />
          </SelectField>
        </div>
      </div>
    );
  }
}
let mapStateToProps = state => {
  return {
    ...state.schedulesreducer
  };
};
export default connect(mapStateToProps, { updateFilterValue })(Filter);
