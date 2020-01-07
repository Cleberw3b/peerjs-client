export const ADD_STREAM = 'ADD_STREAM';
export const REMOVE_STREAM = 'REMOVE_STREAM';

const addRemoteStream = (remoteStream, state) => {
    console.log("Adding Stream")
    const streams = [...state.remoteStreams];
    if (!remoteStream.stream || !remoteStream.peerId) return;
    if (state.remoteStreams.length > 3) return;
    if (state.remoteStreams.some(remote => remote.peerId === remoteStream.peerId)) return;
    streams.push({ peerId, stream })
    return { remoteStreams: streams };
};

const removeRemoteStream = (peerId, state) => {
    console.log("Removing Stream")
    const streams = [...state.remoteStreams];
    let streamToRemove = streams.findIndex(remote => remote.peerId === peerId);
    if (streamToRemove < 0) return;
    streams.splice(index, 1);
    return { remoteStreams: streams }
};

export const remoteStreamReducer = (state, action) => {
    switch (action.type) {
        case ADD_STREAM:
            return addRemoteStream(action.remoteStream, state);
        case REMOVE_STREAM:
            return removeRemoteStream(action.peerId, state);
        default:
            return state;
    }
};