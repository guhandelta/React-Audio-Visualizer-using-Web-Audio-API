// This component willuse the Web Audio API to analyse the audio stream and store that analysis in the state
import React, { Component } from 'react'
import AudioVisualiser from './AudioVisualiser'

class AudioAnalyser extends Component {

    // Initialise the state of the component, with an empty Uint8Array and also bind the scope of the tick() to the component.
    constructor(props) {
        super(props);
        this.state = { audioData: new Uint8Array(0) };
        this.tick = this.tick.bind(this);
    }

    // When the component mounts we're going to setup the Web Audio API objects.
    componentDidMount() {
        this.audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser(); // Creating an Audio AnalyserNode
        // The AnalyserNode interface represents a node able to provide real - time frequency and time - domain analysis information.-
        //- It is an AudioNode that passes the audio stream unchanged from the input to the output, but allows you to take the generated data,-
        //- process it, and create audio visualizations.


        // The frequencyBinCount from the AnalyserNode is needed here which, generally equates to the number of data values that will be-
        //- available, which will be used for the visualisation.
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        // A dataArray of 8-bit unsigned integers, Uint8Array is created here for the length of the frequencyBinCount, which will be used-
        //- to store the waveform data that the AnalyserNode will be creating

        // The media stream is passed from the microphone into the component as a prop, which should be converted into a source-
        //- for the Web Audio API. createMediaStreamSource is called on the AudioContext object, passing in the stream to obtain the source-
        //- to connect the analyser
        this.source = this.audioContext.createMediaStreamSource(this.props.audio);
        this.source.connect(this.analyser);
        // Kick off the animation loop from the end of the componentDidMount method after connecting the source to the analyser.
        this.rafId = requestAnimationFrame(this.tick);
    }

    // For the animation, a method tick() is created, that will be called every time requestAnimationFrame runs. The function will copy-
    //- the current waveform as an array of integers, from the AnalyserNode into the dataArray. The audioData property will then be updated-
    //- in the component's state with the dataArray.Finally, it will call on requestAnimationFrame again to request the next update.
    tick() {
        // To initiate the audio analysis, AnalyserNode's getByteTimeDomainData method needs to be called every time, to update the visualisation.
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.setState({ audioData: this.dataArray });
        this.rafId = requestAnimationFrame(this.tick);
        // For the animations, browser's requestAnimationFrame API is called to pull the latest audio data from the AnalyserNode-
        //- everytime to update the visualisation.
    }
    //  To release all the resources if the component is removed. componentWillUnmount() cancels the animation frame and disconnects the audio nodes.
    componentWillUnmount() {
        cancelAnimationFrame(this.rafId);
        this.analyser.disconnect();
        this.source.disconnect();
    }

    render() {
        return (
            <div>
                <AudioVisualiser audioData={this.state.audioData} />
            </div>
        )
    }
}
export default AudioAnalyser;