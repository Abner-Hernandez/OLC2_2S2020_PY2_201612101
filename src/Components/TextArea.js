import React, { Component } from 'react'
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/theme/eclipse.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';

class TextArea extends Component {

	text_area = React.createRef();
	constructor() {
		super();
		this.state = {
			value: ''
		};
	  }

	modify_text = (texto) => {
		this.setState({
			value: texto,
		});
	}	
	
	render() {
		let options = {
			lineNumbers: true,
			matchBrackets: true,
			styleActiveLine: true,
			theme: "eclipse",
			mode : "javascript"
		};

		return (
		  <div>
			  <CodeMirror
				value={this.state.value}
				options={options}
				onBeforeChange={(editor, data, value) => {
					this.setState({value});
					this.props.get_text(value);
				}}
				onChange={(editor, data, value) => {
				}}
				/>
		  </div>
		);
	}
  }

  export default TextArea;

