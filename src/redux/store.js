import { configureStore } from '@reduxjs/toolkit';
import titleSlice from './titleSlice';
import projectReducer from './projectSlice';
import selectedProjectReducer from './selectedProjectSlice';
import sidebarModeReducer from './sidebarModeSlice';
import sectionReducer from './sectionSlice';
import modelReducer from './modelSlice';

import storageSession from 'redux-persist/lib/storage/session'; // ใช้ sessionStorage
import { combineReducers } from 'redux';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
  } from 'redux-persist';
const persistConfig = {
  key: 'root',
  storage: storageSession, // ใช้ sessionStorage แทน localStorage
  whitelist: ['title', 'selectedProject'], // state ที่จะเก็บไว้ชั่วคราว
};

const rootReducer = combineReducers({
  title: titleSlice,
  projects: projectReducer, // อันนี้ไม่ต้อง persist เพราะมัน fetch ทุกครั้งอยู่แล้ว
  selectedProject: selectedProjectReducer,
  sidebarMode: sidebarModeReducer, // 👈 เพิ่มตรงนี้
  section: sectionReducer,
  models: modelReducer,



});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // ยกเว้น action พวกนี้จากการตรวจ serialize
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

export const persistor = persistStore(store);
export default store;
