import { StyleAttribute, merge } from 'glamor';
import React, { PropsWithChildren } from 'react';
import styles from './styles';

interface GenericListElementProps {
  /**
   * onClick callback
   */
  onClick: () => void;

  /**
   * Whether the element is selected or not
   */
  selected?: boolean;

  /**
   * Additional stlye of the list element
   */
  style?: StyleAttribute;
}

/**
 * Component that displays an element inside of a `GenericList`
 */
function GenericListElement(
  props: PropsWithChildren<GenericListElementProps>,
): JSX.Element {
  return (
    <div
      onClick={props.onClick}
      {...merge(
        props.selected ? styles.selectedListElement : styles.listElement,
        props.style,
      )}
      className={`listElement${props.selected ? ' selectedListElement' : ''}`}
    >
      {props.children}
    </div>
  );
}

export default GenericListElement;
