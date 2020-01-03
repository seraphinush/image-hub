import React, { Component } from 'react';

export class TextInput extends Component {

  constructor(props) {

    super(props);

    this.placeholder = '';

  }

  setPlaceholder = () => {
    if (this.props.options) {
      this.placeholder = this.props.options[this.props.option];
    }
    else {
      this.placeholder = this.props.placeholder;
    }
  }

  render() {
    this.setPlaceholder();

    return (
      <input
        type="text"
        disabled={this.props.disabled}
        id={this.props.id}
        placeholder={this.placeholder}
        value={this.props.value}
        onChange={this.props.onChange} />
    );
  }

}