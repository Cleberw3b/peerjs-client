import React, { createContext, useContext } from 'react';

const dataStreams = [];
const functions = [];

export const RemoteStreamsContext = createContext(dataStreams, functions);


export const useStore = () => useContext(RemoteStreamsContext);