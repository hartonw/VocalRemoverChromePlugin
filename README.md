# VocalRemoverWebExtension

## Overview
This is a Chrome Extension that can remove vocal parts from web videos in real time while they are being played. It performs inference using the WebGPU backend of 
[Tensorflow.js](https://github.com/tensorflow/tfjs)

## Usage notes
* This extension requires a WebGPU backend, so please use it with a compatible version of Chrome 113 or later.
* If your GPU performance is low, it may not work properly.
* It cannot be used in multiple videos or multiple browser tabs at the same time.
* This extension is basically intended for private use, but if you wish to remove vocal of any online audio source using this extension, you should obtain permission from the copyright holder.
* This repository is primarily intended for developers, but if users want to download it and use it in their browsers, they can follow the steps below to install it.

1. Select "Download ZIP" from the green "Code" button and unzip it.
1. In Chrome, go to chrome://extensions/
1. Turn on Developer mode in the top right
1. Click Load unpackaged extension
1. Select the folder to unzip


## Known Issue
### Noise is being picked up
We have confirmed that even if a PCM sound source with all 0s is input, when inference is performed with the model, the results returned are noisy. This may be causing problems when converting the model, but we will investigate this further.

## Future Outlook
* In the future, in addition to solving the problems mentioned above, we are considering implementing the following features
1. Adjust the ratio of vocals to be removed
1. Adjust the key/pitch of the audio source
1. Able to extract different instrument track in the audio


## Credits
### Anjok07, Aufr33
The model uses "UVR-MDX-NET-Inst_HQ_3" from [Ultimate Vocal Remover](https://github.com/Anjok07/ultimatevocalremovergui) under the [MIT license]((https://github.com/Anjok07/ultimatevocalremovergui/blob/v5.2.0/LICENSE)) .

### Tendorflow
It is licensed under the [Apache-2.0 license](https://github.com/tensorflow/tfjs/blob/master/LICENSE) and uses [Tensorflow.js](https://github.com/tensorflow/tfjs) .

### wakapippi
First version of this vocal remover: [VocalRemoverWebExtension](https://github.com/wakapippi/VocalRemoverWebExtension/tree/master)

## References
[Takahashi et al., "Multi-scale Multi-band DenseNets for Audio Source Separation"](https://arxiv.org/pdf/1706.09588.pdf)
