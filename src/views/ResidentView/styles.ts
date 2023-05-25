import { css, Rule } from 'glamor';

const residentViewStyle: Rule = {
  width: '100%',
  height: '100%',
  display: 'flex',
};

const residentListContainerStyle: Rule = {
  width: '20%',
  height: '100%',
};

const newResidentElementStyle: Rule = { height: '5%' };

const residentInformationContainerStyle: Rule = {
  width: '80%',
  height: '100%',
};

const rentInformationActionIcon: Rule = {
  ':hover': {
    cursor: 'pointer',
  },
};

const styles = {
  residentView: css(residentViewStyle),
  residentList: {
    container: css(residentListContainerStyle),
    newResident: css(newResidentElementStyle),
  },
  residentInformation: {
    container: css(residentInformationContainerStyle),
    actionIcon: css(rentInformationActionIcon),
  },
};

export default styles;
