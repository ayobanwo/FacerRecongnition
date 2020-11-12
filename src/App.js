import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Logo from './components/logo/Logo';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition'
import './App.css';

const app = new Clarifai.App({
 apiKey: '07a6f5135ec9445aa30af05bac535607'
});

const particlesOptions = {
	particles: {
		number: {
			value: 60,
			density: {
				enable: true,
				value_area: 500
			}
		}
	}
}

class App extends Component{
	constructor() {
		super();
		this.state = {
			input: '',
			imageUrl: ''
		}
	}

	onInputChange = (event) => {
		this.setState({input: event.target.value});
	} 

	onSubmit = () => {
		this.setState({imageUrl: this.state.input})
		console.log('click')
		app.models.predict(
			Clarifai.FACE_DETECT_MODEL, 
			this.state.input ).then(
			function(response) {
				console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
			},
			function(err) {

			} 
		);
	} 

	render(){
	    return (
	        <div className="App">
	        	<Particles className='particles'
	        	    params={particlesOptions}
	        	 />
	            <Navigation /> 
	      		<Logo />
	      		<Rank />
	            <ImageLinkForm onInputChange = {this.onInputChange} onSubmit ={this.onSubmit} />
	            <FaceRecognition imageUrl={this.state.imageUrl} />
	        </div>
	    );
	}
}

export default App;
