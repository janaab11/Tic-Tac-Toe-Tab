import React from 'react';
import './Square.css';

function Square(props) {
  const classTag=(props.win)?'square-winner':'square';
  return (
    <button className={classTag}
            onClick={props.onClick} >
      {props.value}
    </button>   
  );
}

  export default Square;