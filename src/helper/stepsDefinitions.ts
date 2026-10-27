const baseUrl = '/dubai-app/submit-steps';
const welcomeUrl = '/dubai-app/welcome';

const baseComponentPath = 'SubmitSteps';
const middleComponentPathRecording = 'RecordingsSteps';
const middleComponentPathQuestionary = 'Questionary';
const middleComponentPathSubmission = 'Submission';
const recordYourCoughLogic = 'recordYourCough';
const recordYourSpeechLogic = 'recordYourSpeech';

function getCoughSteps(storeKey: string): Wizard.Step[] {
  return [
    {
      path: '/step-record/cough',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/Introduction`,
      props: {
        storeKey,
        previousStep: '/dubai-app/welcome/step-4',
        nextStep: `${baseUrl}/step-listen/cough`,
        otherSteps: {
          manualUploadStep: `${baseUrl}/step-manual-upload/cough`,
        },
        metadata: {
          currentLogic: recordYourCoughLogic,
        },
      },
    },
    {
      path: '/step-manual-upload/cough',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/RecordManualUpload`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/cough`,
        nextStep: `${baseUrl}/step-listen/cough`,
        metadata: {
          currentLogic: recordYourCoughLogic,
        },
      },
    },
    {
      path: '/step-listen/cough',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/ListenAudio`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/cough`,
        nextStep: `${baseUrl}/questionary/step1`,
        otherSteps: {
          isShortAudioStep: `${baseUrl}/thank-you`,
        },
        metadata: {
          currentLogic: recordYourCoughLogic,
        },
      },
    },
  ];
}

function getSpeechSteps(storeKey: string) {
  return [
    {
      path: '/step-record/speech',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/Introduction`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-listen/breath`,
        nextStep: `${baseUrl}/step-listen/speech`,
        otherSteps: {
          manualUploadStep: `${baseUrl}/step-manual-upload/speech`,
        },
        metadata: {
          currentLogic: recordYourSpeechLogic,
        },
      },
    },
    {
      path: '/step-manual-upload/speech',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/RecordManualUpload`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/speech`,
        nextStep: `${baseUrl}/step-listen/speech`,
        metadata: {
          currentLogic: recordYourSpeechLogic,
        },
      },
    },
    {
      path: '/step-listen/speech',
      componentPath: `${baseComponentPath}/${middleComponentPathRecording}/ListenAudio`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-record/speech`,
        nextStep: ``,
        metadata: {
          currentLogic: recordYourSpeechLogic,
        },
      },
    },
  ];
}

function getQuestionarySteps(storeKey: string): Wizard.Step[] {
  const baseMetadata = {
    total: 3,
    progressCurrent: 3,
    progressTotal: 3,
  };
  return [
    {
      path: '/questionary/step1',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step1`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/step-listen/cough`, 
        nextStep: `${baseUrl}/questionary/step2`,
        metadata: {
          current: 1,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step2',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step2`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step1`, 
        nextStep: `${baseUrl}/questionary/step3`,
        metadata: {
          current: 2,
          ...baseMetadata,
        },
      },
    },
    {
      path: '/questionary/step3',
      componentPath: `${baseComponentPath}/${middleComponentPathQuestionary}/Step3`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step2`, 
        nextStep: `${baseUrl}/sending`,
        metadata: {
          current: 3,
          ...baseMetadata,
        },
      },
    }
  ];
}

/** Welcome Steps */

export function getWelcomeStepsWithoutDots(storeKey: string): Wizard.Step[] {
  return [
    {
      path: '',
      componentPath: 'Welcome/Step1',
      props: {
        storeKey,
        nextStep: `${welcomeUrl}/step-2`,
      },
    },
    {
      path: '/step-2',
      componentPath: 'Welcome/Step2',
      props: {
        storeKey,
        previousStep: `${welcomeUrl}`,
        nextStep: `${welcomeUrl}/step-3`,
      },
    },
  ];
}

export function welcomeStepsDefinitions(storeKey: string): Wizard.Step[] {
  return [
    {
      path: '/step-3',
      componentPath: 'Welcome/Step3',
      props: {
        storeKey,
        previousStep: `${welcomeUrl}/step-2`,
        nextStep: `${welcomeUrl}/step-4`
      },
    },
    {
      path: '/step-4',
      componentPath: 'Welcome/Step4',
      props: {
        storeKey,
        previousStep: `${welcomeUrl}/step-3`,
        nextStep: '/dubai-app/submit-steps/step-record/cough',
        // nextStep: '/submit-steps/step-record/cough',
      },
    },
  ];
}

export default function stepsDefinition(storeKey: string) {
  const steps: Wizard.Step[] = [
    // Record Your Cough Steps
    ...getCoughSteps(storeKey),
    // Record Your Speech Steps
    ...getSpeechSteps(storeKey),
    // Questionary
    ...getQuestionarySteps(storeKey),
    {
      path: '/sending',
      componentPath: `${baseComponentPath}/${middleComponentPathSubmission}/Sending`,
      props: {
        storeKey,
        previousStep: `${baseUrl}/questionary/step2`, 
        nextStep: `${baseUrl}/thank-you`,
      },
    },
    {
      path: '/thank-you',
      componentPath: `${baseComponentPath}/${middleComponentPathSubmission}/ThankYou`,
      props: {
        storeKey,
        previousStep: `${welcomeUrl}`,
        nextStep: '/welcome',
      },
    },
  ];

  return steps;
}
