import { css, Rule, StyleAttribute } from "glamor";
import { defaultColors } from "_/types/styles";

const residentListElementStyle: Rule = {
  width: "100%",
  color: defaultColors.mainDark2,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  ":hover": {
    backgroundColor: defaultColors.mainLight3,
    cursor: "pointer",
  },
};

const residentListContainer: Rule = {
  width: "20%",
  height: "100%",
  backgroundColor: defaultColors.mainLight2,
  overflowY: "auto",
};

const newResidentDiv: Rule = { ...residentListElementStyle, height: "5%" };

const residentListElementContainer: Rule = {
  ...residentListElementStyle,
  height: "10%",
};

const styles: { [key: string]: StyleAttribute } = {
  residentListContainer: css(residentListContainer),
  newResidentDiv: css(newResidentDiv),
  residentListElementContainer: css(residentListElementContainer),
};

export default styles;
