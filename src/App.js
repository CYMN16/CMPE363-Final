import React, { Component } from "react";
import { Helmet } from "react-helmet";
//import {global} from "../global";

import { Container } from 'reactstrap';
import { getTokenOrRefresh } from './token_util';
import './custom.css'

import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';

const speechsdk = require('microsoft-cognitiveservices-speech-sdk')
export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayText: 'INITIALIZED: ready to test speech...'
    }
  }

  async componentDidMount() {
    // check for valid speech key/region
    const tokenRes = await getTokenOrRefresh();
    if (tokenRes.authToken === null) {
      this.setState({
        displayText: 'FATAL_ERROR: ' + tokenRes.error
      });
    }

  }

  async sttFromMic() {
    const tokenObj = await getTokenOrRefresh();
    const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
    speechConfig.speechRecognitionLanguage = 'en-US';

    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

    this.setState({
      displayText: 'speak into your microphone...'
    });

    recognizer.recognizeOnceAsync(result => {
      let displayText;
      if (result.reason === ResultReason.RecognizedSpeech) {

        if (result.text.includes("down") || result.text.includes("Down") || result.text.includes("south" || result.text.includes("South"))) {
          displayText = "down"
        } else if (result.text.includes("up") || result.text.includes("Up") || result.text.includes("north" || result.text.includes("North"))) {
          displayText = "up"
        } else if (result.text.includes("left") || result.text.includes("Left") || result.text.includes("west" || result.text.includes("West"))) {
          displayText = "left"
        } else if (result.text.includes("right") || result.text.includes("Right") || result.text.includes("east" || result.text.includes("East"))) {
          displayText = "right"
        }
        global.displayText = displayText
      } else {
        displayText = 'None';
        console.log("ERROR: Speech was cancelled or could not be recognized.Ensure your microphone is working properly.")
      }
      window.displayText = displayText;
      this.setState({
        displayText: displayText,
        tableHtml : window.tableHtml
      });
    });

  }

  render() {
    return (
      <Container className="app-container">
        <Helmet>
          <title>Accessibility Snake Game</title>
        
        </Helmet>

        <body>
          <div id="accessibility">
            <h3>Accessibility <span id="snake">Snake</span> Game</h3>
            <button id="restart-btn">Restart</button>

          </div>
          <div id="game-panel">
            <div id="left-panel">
              <div class="points">Points: <span id="game-points">0</span></div>
              <div class="arrow-keys">
                <button id="up" class="arrow-key active">&#8593;</button>
                <button id="left" class="arrow-key active">&#8592;</button>
                <button id="down" class="arrow-key active">&#8595;</button>
                <button id="right" class="arrow-key active">&#8594;</button>
              </div>
              <div id="speak">

              </div>
              <div id="mic-result" className="output-display rounded">
                <p>{this.state.tableHtml}</p>
              </div>
              <button id="microphone-btn" onClick={() => this.sttFromMic()}>Input With Microphone</button>
              <div id="name-field">
                <button id="submit-btn" /*onClick={() => this.somefunc()}*/>Submit</button>
                <input type="text" id="username-container" placeholder="Enter your username"></input>
              </div>

            </div>
            <div id="game-board"></div>
            <div>
              <div id = "response-container">
              </div>
            </div>
          </div>

        </body>

        <Helmet>
          <script type="module" src="./game.js"></script>
          <script>
            
          </script>
        </Helmet>

      </Container>
    );
  }
}