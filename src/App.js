import React, { Component } from 'react';
import { Button } from '@material-ui/core'
import styled from 'styled-components'

import AudioAnalyser from './components/AudioAnalyser'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audio: null
    };
    this.toggleMicrophone = this.toggleMicrophone.bind(this);
  }
  // Method to request access to the microphone using getUserMedia and set audio stream in the state if it is successful
  async getMicrophone() {
    const audio = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    });
    this.setState({ audio });
  }
  // Method to stop the audio capture
  // This loops through each of the MediaTracks associated with the MediaStream that getUserMedia returns and stops them,-
  //- finally removing the stream from the state.
  stopMicrophone() {
    this.state.audio.getTracks().forEach(track => track.stop());
    this.setState({ audio: null });
  }
  // Toggle funciton to toggle the state of the microphone
  toggleMicrophone() {
    if (this.state.audio) {
      this.stopMicrophone();
    } else {
      this.getMicrophone();
    }
  }
  render() {
    return (
      <div className="App">
        <StyledHeader>
          <h1>React Audio Visualizer using Web Audio API</h1>
        </StyledHeader>
        <MicHolder>
          <Button variant="contained" color="primary" onClick={this.toggleMicrophone}>
            {this.state.audio ? 'Stop Microphone' : 'Start Microphone'} &#x1F3A4;
          </Button>
        </MicHolder>
        {this.state.audio ? <AudioAnalyser audio={this.state.audio} /> : ''}
      </div>
    );
  }
}

const StyledHeader = styled.header`
  height: 75px;
  background: #FFFFF0;
  color: #40E0D0;
  text-align: center;
  margin-top: -22px;
  padding-top: 10px;
  font-family: 'Lobster', cursive;
`
const MicHolder = styled.div`
  text-align: center;
  padding: 0.5em 0;
  background: #F0FFFF;
  color: #fff;
`
export default App;
