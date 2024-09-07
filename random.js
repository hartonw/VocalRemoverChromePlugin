const bufferSize = 1024;

class RandomNoiseProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super();
        this.numberOfInputs = options.numberOfInputs;
        this.numberOfOutputs = options.numberOfOutputs;
        this.bufferL = [];
        this.bufferR = [];
        this.bufferQueue = [];
        this.isStopped = false;

        this.port.onmessage = (event) => {
            switch (event.data.type) {
                case "stop":
                    this.isStopped = true;
                    break;
                case "start":
                    this.bufferL = [];
                    this.bufferR = [];
                    this.bufferQueue = [];
                    break;
                case "request":
                    console.log("received request message from content script")
                        // Send the buffered audio signal back to content script to be processed
                    this.port.postMessage(this.bufferQueue.shift());
                    break;
                case "buffer":
                    // After the output video is treated by pre-trained model in sandbox.js, it send to service_worker and here
                    this.bufferL = this.bufferL.concat(event.data.payload[0]);
                    this.bufferR = this.bufferR.concat(event.data.payload[1]);
                    break;
                default:
            }
        };
    }
    process(inputs, outputs) {
        // The input buffer is the song we loaded earlier
        const channels = Array.from({ length: this.numberOfInputs }, (_, i) => inputs[i]);
        // Push processed data to shared array buffer queue
        const audioToBeProcessed = this.numberOfInputs == 1 ? [channels, channels] : channels
        this.bufferQueue.push(audioToBeProcessed);

        // Loop through the output channels (in this case there is only one)
        for (let channel = 0; channel < this.numberOfOutputs; channel++) {
            let outputData = outputs[channel];

            // if user stopped the plugin, set the input as the output so that no modification is performed. 
            if (this.isStopped) {
                outputData = inputs[channel];
                continue;
            }

            const target = channel === 0 ? this.bufferL : this.bufferR;
            if (target && target.length >= bufferSize) {
                console.log("buffer work");
                outputData = target.subarray(0, bufferSize);
                target.splice(0, bufferSize);
            } else {
                console.warn("buffer underflow");
            }
        }
        return true;
    }
}


registerProcessor("random", RandomNoiseProcessor);