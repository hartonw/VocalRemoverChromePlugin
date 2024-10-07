class RingBufferWorkletProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.reset();
        this.port.onmessage = (event) => {
            switch (event.data.type) {
                case "stop":
                    this.isStopped = true;
                    break;
                case "start":
                    this.reset()
                    break;
                case "getAudioSignal":
                    // Send the buffered audio signal back to content script to be processed
                    if (this.internalBuffer[0] && this.internalBuffer[0].length >= 1024) {
                        this.port.postMessage([this.internalBuffer[0].splice(0, 1024), this.internalBuffer[1].splice(0, 1024)]);
                    } else {
                        this.port.postMessage([]);
                    }
                    break;
                case "processedSounds":
                    // After the output video is treated by pre-trained model in sandbox.js, it send to service_worker and here
                    this.processedSound.forEach((channelData, index) => {
                        channelData.push(...event.data.payload[index])
                    })
                    break;
                default:
            }
        };
    }
    reset() {
        this.processedSound = [
            [],
            []
        ];
        this.isStopped = false;
        this.internalBuffer = [
            [],
            []
        ];
    }
    process(inputs, outputs) {
        inputs[0].forEach((channelData, channelIndex) => {
                this.internalBuffer[channelIndex].push(...channelData)
            })
            // inputs.forEach((input, inputIndex) => {
            //     if (this.internalBuffer[inputIndex].length == 0) {
            //         this.internalBuffer[inputIndex] = input
            //     } else {
            //         this.internalBuffer[inputIndex][0].push(input[0])
            //         this.internalBuffer[inputIndex][1].push(input[1])
            //     }
            // })
            // if (this.isStopped) {
            //     outputs = inputs;
            // } else {
            //     const output = outputs[0];
            //     if (this.processedSound && this.processedSound[0].length >= output[0].length) {
            //         output[0] = this.processedSound[0].splice(0, output[0].length);
            //         output[1] = this.processedSound[1].splice(0, output[1].length);
            //         console.log(`after modify ${outputs[0][0]}`);
            //     }
            // }
        outputs.forEach((output, outputIndex) => {
            output.forEach((channelOutputData, channelIndex) => {
                if (this.isStopped) {
                    outputs = inputs;
                } else {
                    if (this.processedSound && this.processedSound[channelIndex].length >= channelOutputData.length) {
                        for (let i = 0; i < channelOutputData.length; i++) {
                            channelOutputData[i] = this.processedSound[channelIndex][i]
                        }
                        this.processedSound[channelIndex].splice(0, channelOutputData.length);
                        // console.log(`after modify ${channelOutputData[0]}`);
                        console.log(`after modify ${outputs[0][0]}`);

                    } else {
                        console.warn("buffer underflow");
                    }
                }
            });
        })

        return true;
    }
}

registerProcessor("ring-buffer-worklet-processor", RingBufferWorkletProcessor);