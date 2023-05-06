import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import React from 'react';

interface GenericStepperProps {
  /**
   * Name of the steps
   */
  steps: string[];

  /**
   * Callback when all steps are finished
   */
  onFinished: () => void;
}

/**
 * Generic stepper component
 * See https://mui.com/material-ui/react-stepper/
 */
function GenericStepper(props: React.PropsWithChildren<GenericStepperProps>) {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    const nextStep = activeStep + 1;
    if (nextStep === props.steps.length) {
      props.onFinished();
      return;
    }
    setActiveStep(nextStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const children = React.Children.toArray(props.children);
  if (children.length !== props.steps.length) {
    throw new Error('Stepper needs exactly as many children as steps');
  }

  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel>
        {props.steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <>
        {children[activeStep]}
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            {activeStep === 0 ? '' : 'Zurück'}
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button onClick={handleNext}>
            {activeStep === props.steps.length - 1 ? 'Abschließen' : 'Weiter'}
          </Button>
        </Box>
      </>
    </>
  );
}

export default GenericStepper;
