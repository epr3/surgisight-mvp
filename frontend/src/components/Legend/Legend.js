import React from 'react';
import PropTypes from 'prop-types';
import styles from './Legend.scss';

 
class Legend extends React.Component {
  render() {
    return <div className="legend-container mask rgba-green-strong">
		<ul className="list-group list-group-flush">
			<li className="list-group-item">
				disectie
				<span className="pill-content badge badge-warning badge-pill">.</span>
			</li>
			<li className="list-group-item">
				homostaza
				<span className="pill-content badge badge-success badge-pill">.</span>
			</li>
			<li className="list-group-item">
				taiere
				<span className="pill-content badge badge-dark badge-pill">.</span>
			</li>
		</ul>
	</div>;
  }
}
 

export default Legend;
