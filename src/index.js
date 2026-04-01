import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store, { persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';

// 🔹 เพิ่มสองบรรทัดนี้
import { Provider } from 'react-redux';
// import store from './redux/store'; // <-- เปลี่ยน path ตามที่คุณวางไฟล์ไว้

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
