	self.onmessage = (e) => {
    const states = e.data; 
    // Raw states array from API
    const points = states
        .filter(state => state[5] !== null && state[6] !== null) 
        // Valid lat/lon
        .map(state => ({
            lat: state[2],
            lng: state[3],
            altitude: (state[5] || 0) / 100000, 
            // Normalize for three-globe
            category: state[17] || 0,
            // Aircraft category
            icao24: state[0],
            velocity: state[7]
        }));
    self.postMessage({ points });
};
	