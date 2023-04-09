import { StyleAttribute, merge } from 'glamor';
import React, { PropsWithChildren, Children } from 'react';
import styles from './styles';

interface GenericListProps {
  /**
   * Additional stlye of the list container
   */
  style?: StyleAttribute;

  /**
   * Additional classes of the list container
   */
  className?: string;
}

/**
 * Component that display a list of clickable elements
 */
function GenericList(props: PropsWithChildren<GenericListProps>): JSX.Element {
  const childrenArray = Children.toArray(props.children);
  return (
    <div
      {...merge(styles.listContainer, props.style)}
      /* istanbul ignore next */
      className={`genericList${props.className ? ` ${props.className}` : ''}`}
    >
      {Children.map(childrenArray, (child, index) => (
        <>
          {child}
          {index !== childrenArray.length - 1 && <hr className="hr" />}
        </>
      ))}
    </div>
  );
}

export default GenericList;
