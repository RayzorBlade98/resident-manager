import { css, Rule } from 'glamor';

const residentListContainerStyle: Rule = {
  width: '20%',
  height: '100%',
};

const residentInformationContainerStyle: Rule = {
  width: '80%',
  height: '100%',
};

const residentViewStyle: Rule = {
  width: '100%',
  height: '100%',
  display: 'flex',
};

const styles = {
  residentView: css(residentViewStyle),
  residentListContainer: css(residentListContainerStyle),
  residentInformationContainer: css(residentInformationContainerStyle),
};

export default styles;
