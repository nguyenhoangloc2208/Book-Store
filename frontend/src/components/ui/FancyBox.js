import { useRef, useEffect } from "react";
import PropTypes from 'prop-types';
import { Fancybox as NativeFancybox } from "@fancyapps/ui";

function Fancybox(props) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const delegate = props.delegate || "[data-fancybox]";
    const options = props.options || {};

    NativeFancybox.bind(container, delegate, options);

    return () => {
      NativeFancybox.unbind(container);
      NativeFancybox.close();
    };
  });

  return <div ref={containerRef}>{props.children}</div>;
}

Fancybox.propTypes = {
  children: PropTypes.node.isRequired,
  delegate: PropTypes.string,
  options: PropTypes.object
};

export default Fancybox;