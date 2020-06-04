//Author: Raminderpreet Singh Kharaud
//version 1.0;
//Date: 6/3/2020

//this alexa skill plays audio from youtube videos.
//it searches youtube for the given query by user and plays the first result return by youtube.
//user can play, pause, stop, and repeat.
//to close application, user can say cancle.

const Alexa = require('ask-sdk-core');

const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');
const YtAgent = require('./youtubeAgent');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
    const playbackInfo = await getPlaybackInfo(handlerInput);    
    let message;
    let reprompt;

    
    if (!playbackInfo.inPlaybackSession) {
      message = 'Welcome to the Youtube Boombox. what would you like to play.';
      reprompt = 'You can say, play and the song name that you want to listen.';
    } else {
      message = `Would you like to resume the current playing track`;
      reprompt = 'You can say yes to resume or no to play some thing else.';
    } 

    return handlerInput.responseBuilder
      .speak(message)
      .reprompt(reprompt)
      .getResponse();
    }
};

const AudioPlayerEventHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type.startsWith('AudioPlayer.');
  },
  async handle(handlerInput) {
    const {
      requestEnvelope,
      attributesManager,
      responseBuilder
    } = handlerInput;
    const audioPlayerEventName = requestEnvelope.request.type.split('.')[1];
    const {
      playbackSetting,
      playbackInfo
    } = await attributesManager.getPersistentAttributes();

    switch (audioPlayerEventName) {
      case 'PlaybackStarted':
        playbackInfo.inPlaybackSession = true;
        break;
      case 'PlaybackFinished':
        if(playbackInfo.loop){
            playbackInfo.offsetInMilliseconds = 0;
            return controller.play(handlerInput, '');
        }else{
            playbackInfo.inPlaybackSession = false;
        }
        break;
      case 'PlaybackStopped':
        playbackInfo.offsetInMilliseconds = getOffsetInMilliseconds(handlerInput);
        break;
      case 'PlaybackNearlyFinished':
        {
          break;
        }
      case 'PlaybackFailed':
        playbackInfo.inPlaybackSession = false;
        console.log('Playback Failed : %j', handlerInput.requestEnvelope.request.error);
        return handlerInput.responseBuilder
            .speak('Sorry, can not play due to technical difficulty')
            .getResponse();
      default:
        throw new Error('Should never reach here!');
    }

    return responseBuilder.getResponse();
  },
};

const CheckAudioInterfaceHandler = {
  async canHandle(handlerInput) {
    const audioPlayerInterface = ((((handlerInput.requestEnvelope.context || {}).System || {}).device || {}).supportedInterfaces || {}).AudioPlayer;
    return audioPlayerInterface === undefined
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Sorry, this skill is not supported on this device')
      .withShouldEndSession(true)
      .getResponse();
  },
};

const NextAndPrevPlaybackHandler = {
  async canHandle(handlerInput) {
    const playbackInfo = await getPlaybackInfo(handlerInput);
    const request = handlerInput.requestEnvelope.request;

    return playbackInfo.inPlaybackSession &&
      ((request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NextIntent') ||
        (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.PreviousIntent'));
  },
  async handle(handlerInput) {
     const playbackInfo = await getPlaybackInfo(handlerInput);
      
    return controller.play(handlerInput, 'next and previous commands are currently not supported on this application');
  },
};

const YesIntentHandler = {
  async canHandle(handlerInput) {
    const playbackInfo = await getPlaybackInfo(handlerInput);
    const request = handlerInput.requestEnvelope.request;

    return playbackInfo.inPlaybackSession && request.type === 'IntentRequest' && (request.intent.name === 'AMAZON.YesIntent' || request.intent.name === 'AMAZON.ResumeIntent');
  },
  handle(handlerInput) {
    return controller.play(handlerInput, 'ok, resuming');
  },
};

const NoHandler = {
  async canHandle(handlerInput) {
    const playbackInfo = await getPlaybackInfo(handlerInput);
    const request = handlerInput.requestEnvelope.request;

    return playbackInfo.inPlaybackSession && request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NoIntent';
  },
  async handle(handlerInput) {
    const playbackInfo = await getPlaybackInfo(handlerInput);

    playbackInfo.offsetInMilliseconds = 0;
    playbackInfo.inPlaybackSession = false;
    
    return handlerInput.responseBuilder
      .speak("Ok, what would you like to play.")
      .reprompt('You can say, play and the name of song that you want to listen.')
      .getResponse();
  },
};


const searchTextHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'searchTextIntent';
    },
    async handle(handlerInput) {
        const message = 'Ok';
        const playbackInfo = await getPlaybackInfo(handlerInput);
        playbackInfo.offsetInMilliseconds = 0;
        let query = Alexa.getSlotValue(handlerInput.requestEnvelope, 'searchText');
         let ytAgent = new YtAgent();
        try{
            let id = await ytAgent.getVideoId(query);
            playbackInfo.url = await ytAgent.getYoutubeUrl(id);
        }catch(err){
            return handlerInput.responseBuilder
            .speak('Sorry, can not play due to technical difficulty')
            .getResponse();
        }
        
        return controller.play(handlerInput, message);
    }
};

const LoopOnHandler = {
  async canHandle(handlerInput) {
    const playbackInfo = await getPlaybackInfo(handlerInput);
    const request = handlerInput.requestEnvelope.request;

    return playbackInfo.inPlaybackSession &&
      request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.LoopOnIntent';
  },
  async handle(handlerInput) {
    const playbackSetting = await handlerInput.attributesManager.getPersistentAttributes().playbackSetting;

    playbackSetting.loop = true;

    return handlerInput.responseBuilder
      .speak('Loop turned on.')
      .getResponse();
  },
};

const LoopOffHandler = {
  async canHandle(handlerInput) {
    const playbackInfo = await getPlaybackInfo(handlerInput);
    const request = handlerInput.requestEnvelope.request;

    return playbackInfo.inPlaybackSession &&
      request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.LoopOffIntent';
  },
  async handle(handlerInput) {
    const playbackSetting = await handlerInput.attributesManager.getPersistentAttributes().playbackSetting;

    playbackSetting.loop = false;

    return handlerInput.responseBuilder
      .speak('Loop turned off.')
      .getResponse();
  },
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    async handle(handlerInput) {
    const playbackInfo = await getPlaybackInfo(handlerInput);
    let message;

    if (!playbackInfo.inPlaybackSession) {
      message = 'Welcome to the Youtube Boombox. You can say, play and the name of song that you want to listen';
    } else {
      message = `You were listening to title. Would you like to resume?`;
    } 

    return handlerInput.responseBuilder
      .speak(message)
      .reprompt(message)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
/*
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
}; */

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
       console.log(`~~~~ Error handled: ${error.stack}`);
        console.log(JSON.stringify(handlerInput.requestEnvelope.request.error));
        const speakOutput = `Sorry, this is not a valid command. Please say help to hear what you can say.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const PausePlaybackHandler = {
  async canHandle(handlerInput) {
    const playbackInfo = await getPlaybackInfo(handlerInput);
    const request = handlerInput.requestEnvelope.request;

    return playbackInfo.inPlaybackSession &&
      request.type === 'IntentRequest' &&
      (request.intent.name === 'AMAZON.StopIntent' ||
        request.intent.name === 'AMAZON.PauseIntent');
  },
  handle(handlerInput) {
    return controller.stop(handlerInput,'ok');
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
     const request = handlerInput.requestEnvelope.request;
     return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.CancelIntent';
  },
  async handle(handlerInput) {
      const playbackInfo = await getPlaybackInfo(handlerInput);
      if(playbackInfo.inPlaybackSession){
        playbackInfo.inPlaybackSession = false;
        return controller.stop(handlerInput,'Goodbye');
      }else{
        return handlerInput.responseBuilder
            .speak('Goodbye')
            .getResponse();  
      }
  },
};

const LoadPersistentAttributesRequestInterceptor = {
  async process(handlerInput) {
    const persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();

    // Check if user is invoking the skill the first time and initialize preset values
    if (Object.keys(persistentAttributes).length === 0) {
      handlerInput.attributesManager.setPersistentAttributes({
        playbackSetting: {
          loop: false,
        },
        playbackInfo: {
          offsetInMilliseconds: 0,
          inPlaybackSession: false,
          url: '',
        },
      });
    }
  },
};
const SavePersistentAttributesResponseInterceptor = {
  async process(handlerInput) {
    await handlerInput.attributesManager.savePersistentAttributes();
  },
};

const SystemExceptionHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'System.ExceptionEncountered';
  },
  handle(handlerInput) {
    console.log(`System exception encountered: ${handlerInput.requestEnvelope.request.reason}`);
  },
};

/* HELPER FUNCTIONS */

const controller = {
  async play(handlerInput, message) {
    const {
      attributesManager,
      responseBuilder
    } = handlerInput;

    const playbackInfo = await getPlaybackInfo(handlerInput);
    const {
      url,
      offsetInMilliseconds
    } = playbackInfo;

    const playBehavior = 'REPLACE_ALL';
    const token = '0';

    responseBuilder
      .speak(message)
      .withShouldEndSession(true)
      .addAudioPlayerPlayDirective(playBehavior, url, token, offsetInMilliseconds, null);

    return responseBuilder.getResponse();
  },
  stop(handlerInput,message) {
    return handlerInput.responseBuilder
      .speak(message)
      .addAudioPlayerStopDirective()
      .getResponse();
  },
};

async function getPlaybackInfo(handlerInput) {
  const attributes = await handlerInput.attributesManager.getPersistentAttributes();
  return attributes.playbackInfo;
}
function getOffsetInMilliseconds(handlerInput) {
  // Extracting offsetInMilliseconds received in the request.
  return handlerInput.requestEnvelope.request.offsetInMilliseconds;
}

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        CheckAudioInterfaceHandler,
        LaunchRequestHandler,
        HelpIntentHandler,
        SystemExceptionHandler,
        SessionEndedRequestHandler,
        YesIntentHandler,
        NoHandler,
        PausePlaybackHandler,
        NextAndPrevPlaybackHandler,
        LoopOnHandler,
        LoopOffHandler,
        searchTextHandler,
        ExitHandler,
        AudioPlayerEventHandler
       // IntentReflectorHandler// make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .withPersistenceAdapter( new persistenceAdapter.S3PersistenceAdapter({bucketName:process.env.S3_PERSISTENCE_BUCKET}))
    .addRequestInterceptors(LoadPersistentAttributesRequestInterceptor)
    .addResponseInterceptors(SavePersistentAttributesResponseInterceptor)
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
