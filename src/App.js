import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Navigation from './components/Navigation';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Logo from './components/logo/Logo';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
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
const intialState = {
	input: '',
	imageUrl: '',
	box: {},
	route: 'SignIn',
	isSignedIn: false,
	user: {
		id: '',
		name : '',
		email: '', 
		password: '',
		entries: '',
		joined: '' 
	}	
}

class App extends Component{
	constructor() {
		super();
		this.state = {
			input: '',
			imageUrl: '',
			box: {},
			route: 'SignIn',
			isSignedIn: false,
			user: {
				id: '',
				name : '',
				email: '', 
				password: '',
				entries: '',
				joined: '' 
			}
		}
	}  

	loadUser = (user) => {
		this.setState({
			user: {
				id: user.id,
				name : user.name,
				email: user.email, 
				password: user.password,
				entries: user.entries,
				joined: user.joined 
			}
		})
	}

	calculateFaceLocation = (data) =>{
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputImage');
		const width = Number(image.width);
		const height = Number(image.height);
		return{
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - (clarifaiFace.right_col * width),
			bottomRow: height - (clarifaiFace.bottom_row * height)
		}
	} 

	displayFaceBox =(box) => {
		this.setState({box: box})
	}

	onInputChange = (event) => {
		this.setState({input: event.target.value});
	} 

	onPictureSubmit = () => {
		this.setState({imageUrl: this.state.input})
		console.log('click')
		app.models.predict(
			Clarifai.FACE_DETECT_MODEL, 
			this.state.input )
		.then(response => {
			if(response){
				fetch('http://localhost:3001/image' , {
					method: 'put',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({ 
						id: this.state.user.id
					})
				})
				.then(response => response.json())
				.then(count =>{
					this.setState(Object.assign(this.state.user, {entries:count}))
				})
				.catch(console)
			}
			this.displayFaceBox(this.calculateFaceLocation(response));
		})
		.catch(err => console.log(err)); 
	} 

	onRouteChange = (route) =>{
		if (route === 'SignIn') {
			this.setState(intialState)
		} else if(route === 'home'){ 
			this.setState({isSignedIn : true})
		}
		this.setState({route: route} )
	}

	render(){
		const {isSignedIn, imageUrl, route, box} = this.state;
	    return (
	        <div className="App">
	        	<Particles className='particles'
	        	    params={particlesOptions}
	        	 />
	            <Navigation isSignedIn = {isSignedIn} onRouteChange = {this.onRouteChange} /> 
	           	{( () => {
           	        switch (route) {
           	          case "home":   
           	          	return (
           	          		<div>	
					      		<Logo />
					      		<Rank  name={this.state.user.name} entries={this.state.user.entries}/>
					            <ImageLinkForm 
					            	onInputChange = {this.onInputChange} 
					            	onPictureSubmit ={this.onPictureSubmit} 
					            />
					            <FaceRecognition 
					            	box={box} 
					            	imageUrl={imageUrl} 
					            />
					        </div> 
           	          	);
           	          case "SignIn": 
           	          	return <SignIn loadUser = {this.loadUser} onRouteChange = {this.onRouteChange}/>;
           	          default:      
           	          return <Register loadUser={this.loadUser} onRouteChange = {this.onRouteChange}/>;
           	        }
	           	}
	           	) ()}
	       
	        </div>
	    );
	}
}

export default App;
