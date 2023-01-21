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
                    global.displayText = "down"
                } else if (result.text.includes("up") || result.text.includes("Up")) {
                    displayText = "up"
                    global.displayText = "up"
                } else if (result.text.includes("left") || result.text.includes("Left")) {
                    displayText = "left"
                } else if (result.text.includes("right") || result.text.includes("Right")) {
                    displayText = "right"
                }
            } else {
                displayText = 'ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.';
            }
            window.displayText = displayText;
            this.setState({
                displayText: displayText
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
                        <button id="restart-btn">Restart</button>
                    </div>
                    <div id="game-panel">
                        <div id="left-panel">
                            <div class="arrow-keys">
                                <button id="up" class="arrow-key active">&#8593;</button>
                                <button id="left" class="arrow-key active">&#8592;</button>
                                <button id="down" class="arrow-key active">&#8595;</button>
                                <button id="right" class="arrow-key active">&#8594;</button>
                            </div>
                            <div id="speak">
                                <i className="fas fa-microphone fa-lg mr-2" onClick={() => this.sttFromMic()}></i>
                            </div>
                            <div className="col-6 output-display rounded">
                                <code>{this.state.displayText}</code>
                            </div>
                        </div>
                        <div id="game-board"></div>
                    </div>

                </body>

                <Helmet>
                    <script type="module" src="./game.js"></script>
                </Helmet>

            </Container>
        );
    }
}