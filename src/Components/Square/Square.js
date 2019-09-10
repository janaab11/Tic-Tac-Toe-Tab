import React from 'react';
import './Square.css';

function Square(props) {
  const style=(props.win)?{'border-color':'#ac6413'}:{};
  return (
    <button className='square'
            style={style}
            onClick={props.onClick} >
      {props.value}
    </button>   
  );
}

  export default Square;