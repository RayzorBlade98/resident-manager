import { css, Rule } from 'glamor';

const invoiceListContainerStyle: Rule = {
  width: '20%',
  height: '100%',
};

const invoiceInformationContainerStyle: Rule = {
  width: '80%',
  height: '100%',
};

const invoiceViewStyle: Rule = {
  width: '100%',
  height: '100%',
  display: 'flex',
};

const styles = {
  invoiceView: css(invoiceViewStyle),
  invoiceListContainer: css(invoiceListContainerStyle),
  invoiceInformationContainer: css(invoiceInformationContainerStyle),
};

export default styles;
