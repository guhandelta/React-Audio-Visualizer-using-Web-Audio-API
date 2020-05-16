import React, { Component } from 'react'
import styled from 'styled-components'

export default class AudioVisualiser extends Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        //The canvas element is referenced on the constructor using React.createRef() and add the ref attribute to the <canvas> element.
    }
    // Fn() take the audioData from AudioAnalyser and draw a line from left to right between each data point in the array
    draw() { //called each time new data is available, from the analyser
        // setting up the variables that are required
        const { audioData } = this.props; //the audioData from the props and its length
        // debugger;
        const canvas = this.canvas.current; //the canvas from the ref
        const height = canvas.height; //height and width of the canvas
        const width = canvas.width;
        const context = canvas.getContext('2d'); // A 2d drawing context from the canvas
        let x = 0; // A variable that will be used to track across the canvas
        const sliceWidth = (width * 1.0) / audioData.length; // distance to be moved to the right every time the visualizaiton is updated
        // Setting the drawing style
        context.lineWidth = 2;
        context.strokeStyle = '#000000';
        context.clearRect(0, 0, width, height);
        // draw by moving the drawing position to halfway down the left side of the canvas
        context.beginPath();
        context.moveTo(0, height / 2);
        // Loop over the data in audioData. Each data point is between 0 and 255.
        for (const item of audioData) {
            const y = (item / 255.0) * height; //To normalise this to the canvas, divide by 255 and then multiply by the height of the canvas. 
            context.lineTo(x, y); //Then draw a line from the previous point to this one/current point
            x += sliceWidth; //increment x by the sliceWidth(Distance to move to the right every time a line is drawn).
        }
        // Draw a line to the point halfway down the right side of the canvas and direct the canvas to colour the entire path.
        context.lineTo(x, height / 2);
        context.stroke();
    }
    // To run draw() needs every time the audioData is updated
    componentDidUpdate() {
        this.draw();
    }

    render() {
        return (
            <div>
                {/* The animation is rendered over a Canvas, to render on the page */}
                <StyledCanvasHolder>
                    <canvas width="750" height="400" ref={this.canvas} />
                </StyledCanvasHolder>
            </div>
        )
    }
}

const StyledCanvasHolder = styled.div`
    margin: 5% 25%;
    border-right: 0.5px dotted #000;
    border-left: 0.5px dotted #000;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    padding-left: 2px;
`
