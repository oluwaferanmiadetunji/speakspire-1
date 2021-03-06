import React from 'react';
import store from "./redux/store";

import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import TopScroll from './utilities/scrollTop';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";


ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<TopScroll />
			<App />
		</BrowserRouter>
	</Provider>
,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
