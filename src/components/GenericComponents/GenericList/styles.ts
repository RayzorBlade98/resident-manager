import { css, Rule } from 'glamor';
import { defaultColors } from '../../../types/styles';

const listContainerStyle: Rule = {
  backgroundColor: defaultColors.mainLight2,
  overflowY: 'auto',
};

const listElementStyle: Rule = {
  width: '100%',
  height: '10%',
  color: defaultColors.mainDark2,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  ':hover': {
    backgroundColor: defaultColors.mainLight3,
    cursor: 'pointer',
  },
};

const selectedListElementStyle: Rule = {
  backgroundColor: defaultColors.mainLight3,
};

const styles = {
  listContainer: css(listContainerStyle),
  listElement: css(listElementStyle),
  selectedListElement: css(listElementStyle, selectedListElementStyle),
};

export default styles;
