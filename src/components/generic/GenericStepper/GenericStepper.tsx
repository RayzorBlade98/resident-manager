import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import React from 'react';
import { CONTENT_HEIGHT } from '../../../styles';

/**
 * Constant that indicates that all steps are finished
 */
export const STEPPER_FINISHED = -1;

const styles = {
  component: {
    height: '100%',
  },
  stepper: {
    height: '80px',
    paddingTop: '20px',
  },
  content: {
    height: `${CONTENT_HEIGHT - 140}px`,
  },
  footer: {
    height: '60px',
    display: 'flex',
    flexDirection: 'row',
    pt: 2,
  },
};

interface GenericStepperProps {
  /**
   * Name of the steps
   */
  steps: string[];

  /**
   * Callback that's called when the current step changes
   * @param step new active step
   */
  onStepChange: (step: number) => void;

  /**
   * Whether the current step is finished
   */
  canFinishStep: boolean;
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
      props.onStepChange(STEPPER_FINISHED);
      return;
    }

    setActiveStep(nextStep);
    props.onStepChange(nextStep);
  };

  const handleBack = () => {
    const nextStep = activeStep - 1;
    setActiveStep(nextStep);
    props.onStepChange(nextStep);
  };

  const children = React.Children.toArray(props.children);
  if (children.length !== props.steps.length) {
    throw new Error('Stepper needs exactly as many children as steps');
  }

  return (
    <Box sx={styles.component}>
      <Stepper sx={styles.stepper} activeStep={activeStep} alternativeLabel>
        {props.steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <>
        <Box sx={styles.content}>{children[activeStep]}</Box>
        <Box sx={styles.footer}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            {activeStep === 0 ? '' : 'Zurück'}
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button onClick={handleNext} disabled={!props.canFinishStep}>
            {activeStep === props.steps.length - 1 ? 'Abschließen' : 'Weiter'}
          </Button>
        </Box>
      </>
    </Box>
  );
}

export default GenericStepper;
