A New Architecture for Real-Time 3D Air Traffic Visualization Using Hybrid ADS-B and API Data

Abstract

This paper presents a novel system architecture named "TAR" for real-time, browser-based air traffic visualization. By leveraging a hybrid data acquisition model and modern web technologies, the system overcomes latency and performance issues in traditional methods.
Data is sourced from local ADS-B receivers (such as RTL-SDR and RTL-TCP) and public APIs (like OpenSky Network and Flightradar24). The proposed architecture utilizes HTTP/3 (QUIC) for low-latency data streaming and Web Workers for parallel, non-blocking data processing. 
GPU-accelerated 3D rendering is achieved through the integration of WebGL and Google 3D Maps API. The implemented prototype demonstrates smooth frame rates and sub-second latency even under high data loads, proving a significant advancement over traditional polling-based approaches. 
The project name "TAR" is derived from the popular open-source tar1090 user interface, symbolizing an evolution from a purely local tool to a unified global real-time visualization platform.

1. Introduction

1.1. Problem Statement and Research Motivation

The growing volume of air traffic necessitates powerful and scalable systems for real-time monitoring. 
Existing browser-based solutions often face significant challenges, including high latency from inefficient data transfer protocols (such as frequent REST polling and TCP overhead) and client-side performance bottlenecks that can lead to UI blocking. 
These issues severely degrade user experience, especially in scenarios requiring rapid updates for thousands of moving objects simultaneously. 
Consequently, a new end-to-end architecture is needed to address these limitations and pave the way for large-scale visualization of open aviation data. 
This research responds to this need by proposing a comprehensive architecture.

1.2. Introduction to the 'TAR' Project

The proposed solution is a research project titled "TAR." 
The name is intentionally chosen, inspired by the widely used tar1090 web interface for ADS-B decoders. 
While tar1090 provides an enhanced web UI for local data display, 
"TAR" expands this concept from a local, single-source, 2D view to a 3D, multi-source, real-time visualization platform. 
Symbolically, the name represents an evolutionary progression from a local utility tool to an advanced architecture for processing and displaying aviation data on a global scale.

1.3. Key Innovations and Paper Structure

The primary innovations of this research include: a) a hybrid data acquisition and fusion model, b) adoption of HTTP/3 for low-latency data streaming, c) use of Web Workers for parallel processing, and d) integration of Google 3D Maps with WebGL for high-performance 3D rendering. The subsequent sections of this paper will detail these architectural components, from data collection to 3D rendering and performance analysis.

2. Background and Related Work

2.1. ADS-B Technology and Decentralized Surveillance Networks

The foundation of many air traffic tracking systems is ADS-B (Automatic Dependent Surveillance–Broadcast) technology, where aircraft automatically broadcast their position, velocity, altitude, and other flight information on the 1090 MHz frequency. These signals can be received by affordable software-defined radio (SDR) devices like RTL-SDR. Networks such as OpenSky Network aggregate data from thousands of volunteer ground receivers worldwide, providing an open and rich data source for the research community.

This decentralized model offers significant advantages, including global coverage, redundancy, and resilience to single points of failure. However, a deeper analysis reveals key limitations. Data quality in these networks can vary due to differing hardware calibrations, frequency instability, and local radio frequency interference (RFI). This indicates that any system relying solely on these sources must incorporate robust data validation and fusion capabilities.

2.2. Online Data Retrieval Methods (cURL and APIs)

The "TAR" project retrieves data not only from local receivers but also from two major APIs: OpenSky Network and Flightradar24. Both sources are accessible via cURL requests.

The OpenSky Network API is designed for research and non-commercial purposes, providing aircraft state vectors (position, velocity, etc.). In contrast, Flightradar24 offers a paid subscription model with various data layers, including live and historical data.

Utilizing multiple data sources is essential not only for redundancy but also for creating a more comprehensive and reliable dataset. A local receiver has limited coverage, while central APIs provide global reach. However, combining these heterogeneous sources requires a sophisticated data fusion mechanism. This process must handle asynchronous data streams, eliminate duplicate records, and resolve inconsistencies (such as differences in reported positions). Therefore, a robust data fusion module is a critical component in the "TAR" architecture.

2.3. Real-Time Data Streaming Protocols (HTTP/3 vs. WebSocket)

In real-time applications, WebSockets are often the default choice, as they provide a bidirectional communication channel over a single TCP connection. However, reliance on TCP can lead to "head-of-line blocking," where the loss of one data packet halts all other data streams on the same connection. This limitation severely impacts performance and latency in unstable network environments.

The "TAR" project addresses this by adopting HTTP/3, built on the QUIC protocol. QUIC uses UDP and enables native multiplexing, meaning data streams are independent. Thus, data loss for one aircraft does not affect streams for others. QUIC's benefits—such as reduced latency through 0-RTT handshakes, more efficient connection establishment, and seamless migration between networks (e.g., from Wi-Fi to cellular)—are particularly suited for applications like air traffic tracking, which may be used in mobile or unstable network settings.
This technical choice is not only innovative but also directly addresses "system/network performance" challenges highlighted by the EUROCONTROL Performance Review Commission.

|       Feature            |  HTTP/3 (QUIC)                    |             WebSocket              
|--------------------------|-----------------------------------|--------------------------------------|
| Transport‌‌ Layer Protocol |      UDP                          |            TCP                       |
| Head-of-Line Blocking    | None (independent streams)        | Present (on packet loss)             |
| Handshake Overhead       | Low (0-RTT/1-RTT handshake)       | High (TCP +TLS +WebSocket handshake) |
| Network Migration        | Native support (no disconnection) | Requires reconnection                |
| Congestion Control       | In user space (flexible)          | In kernel space (rigid)              |
| Connection Nature        | Stateful (at QUIC level)          | Stateful (at TCP level)              |

2.4. Web-Based 3D Visualization Technologies

WebGL (Web Graphics Library) is a JavaScript API that enables GPU-accelerated 3D graphics rendering in the browser without plugins. 
Libraries like Three.js simplify WebGL complexities, allowing developers to create 3D scenes more rapidly.

The "TAR" project takes a strategic approach by relying on Google 3D Maps. 
This platform provides an integrated solution with photorealistic 3D maps, built-in rendering, custom markers, and the ability to add 3D models. 
This decision strikes a balance between full control and development speed.
While a pure WebGL/Three.js solution (like the Flight Stream project) offers maximum flexibility, using Google Maps as a strong foundation accelerates development. 
By leveraging the WebGL Overlay View in the Google Maps JavaScript API, "TAR" combines a ready-made, geographically accurate base with custom 3D content rendering (e.g., aircraft models). 
This approach delivers a powerful yet practical solution for real-time visualization.

3. 'TAR' System Architecture and Implementation

3.1. Hybrid Data Collection

The "TAR" architecture is built on a hybrid data acquisition model. On the server side, a data collection module interacts with three input sources. 
First, JSON data output from a local ADS-B receiver, such as a Raspberry Pi equipped with RTL-SDR and readsb software, is received in real-time. 
Second, the module periodically queries the OpenSky Network API using cURL to retrieve state vectors for all in-flight aircraft. 
Third, similar requests are sent to the Flightradar24 API to obtain supplementary commercial data. This central module receives, pre-processes, and prepares data from all three sources for the fusion stage.

| Data Source             |               Data Type                   |                Advantages                     |            Disadvantages                  |
|-------------------------|-------------------------------------------|-----------------------------------------------|-------------------------------------------|
| Local ADS-B Receiver    | Position, velocity, altitude, ICAO code   | Very low latency, raw data, full control      | Limited coverage (140-480 km)             |
| OpenSky Network         | Aircraft state vector                     | Open data, global coverage, research-friendly | Non-commercial use, variable data quality |
| Flightradar24           | Position, flight details, historical info | Global coverage, rich and verified data       | Paid subscription model, potential costs  |

3.2. Data Processing and Management

Data Fusion Algorithm: To aggregate data from heterogeneous sources, a sophisticated fusion algorithm is essential.
In this architecture, the aircraft state vector, identified by its unique ICAO code, serves as the primary key. A state estimation filter like a Federated Kalman Filter can combine positional, velocity, and altitude data from various sources with differing accuracies to produce a more reliable "fused" state vector. The system can prioritize local ADS-B data due to lower latency but use API data to fill coverage gaps.

Duplicate Removal and Data Integrity: Preventing multiple instances of the same aircraft object is a fundamental challenge. A robust mechanism for duplicate detection and removal using the unique ICAO24 identifier and timestamp checks is essential. A caching layer like Redis with a specified expiration time can quickly check if a record has been processed within a given timeframe and prevent re-processing.

Parallel Processing with Web Workers: To avoid blocking the main UI thread responsible for rendering, heavy data processing operations are offloaded to a Web Worker. The main thread sends raw multi-source data to the worker using the postMessage() method. The worker script performs all data fusion, normalization, and deduplication logic in the background and returns clean, render-ready data to the main thread. This process ensures the UI remains smooth and responsive, even when processing thousands of aircraft.

4. Real-Time 3D Visualization Framework

4.1. Implementation with Google 3D Maps

The system uses the Google Maps JavaScript API with a MapId to enable photorealistic 3D features. 
For each aircraft, a 3D model or custom marker is dynamically added, updated, and removed using AdvancedMarkerElement and WebGL Overlay View. 
Position, altitude, and heading data from the fused state vector are directly used to place and orient each 3D object on the map. This approach provides an accurate and realistic visual representation of air traffic.

4.2. Performance Optimization with HTTP/3 (QUIC)

The final link in the data chain is transmitting fused data from server to client.
"TAR" employs HTTP/3 for streaming this data. Thanks to QUIC, it avoids the "head-of-line blocking" issue present in traditional TCP/HTTP/2 connections. 
This means that if data for one aircraft is lost, it does not delay the display of data for others streamed in parallel. QUIC's built-in congestion control and packet loss recovery ensure data stream stability and reliability, which is critical for a real-time system displaying thousands of aircraft simultaneously.

5. Results and Performance Analysis

5.1. Evaluation Metrics

The performance of the "TAR" system is evaluated based on three key metrics:

* End-to-End Latency: The time from receiving a data update (e.g., ADS-B signal reception) to its display on the user's screen.

* Frame Rate (FPS): A measure of rendering smoothness and responsiveness.

* Resource Utilization: Monitoring CPU and GPU consumption on the client side to demonstrate the efficiency of Web Workers and WebGL.

5.2. Initial Experimental Results

Initial experiments compare the "TAR" system's performance against a baseline system (using WebSockets and a single UI thread). The results indicate "a significant reduction in end-to-end latency and improved frame stability." 
Specifically, Web Workers dramatically reduce CPU consumption and maintain frame rates under high traffic. Similarly, QUIC reduces latency compared to TCP connections, enabling faster data delivery to the user.

| Performance Metric | Baseline System (WebSocket) | Proposed System ('TAR') |
|---|---|---|
| End-to-End Latency (Average) | >1 second | <1 second |
| Frame Rate (FPS) | Unstable, frame drops under high traffic | Stable, consistent frame rate |
| CPU Consumption (Client-Side) | High, main thread blocking | Low, processing in Worker thread |

6. Discussion, Challenges, and Future Work

6.1. Summary of Key Achievements

The "TAR" project introduces a new architecture for real-time air traffic visualization with high performance and scalability. By strategically adopting technologies like HTTP/3, Web Workers, WebGL, and Google 3D Maps, this architecture demonstrates that low-latency, high-performance real-time monitoring is achievable in the open web. It overcomes major challenges in existing systems and provides a smooth, responsive user experience even under complex data conditions.

6.2. Challenges and Limitations

Implementing this architecture involved challenges. A primary one is the need for a complex data fusion algorithm to manage heterogeneous data streams varying in accuracy and update frequency. Additionally, the quality and reliability of data from volunteer networks can vary, highlighting the need for strong validation mechanisms. Rate limits on API access and potential costs for higher subscription tiers (e.g., Flightradar24 and Google Maps API) are other notable limitations.

6.3. Suggestions for Future Work

The "TAR" project serves as a strong foundation for future research. Future efforts could focus on enhancing the system with advanced features, such as "predicted path visualization" using machine learning models for aircraft trajectory forecasting, "anomaly detection" to identify unusual flight behaviors—a key challenge in EUROCONTROL research—and "collaborative filtering" allowing users to participate in data validation, creating a "trust network" for air traffic data.

7. Conclusion

The "TAR" project provides a roadmap for next-generation air traffic visualization systems. By intelligently combining local ADS-B data with global APIs and leveraging advanced transport protocols like HTTP/3, parallel processing technologies, and GPU-accelerated rendering, this architecture showcases a novel approach to real-time aviation data display. Overcoming latency and performance issues in traditional solutions, it offers an efficient and scalable model for the research community and industrial applications.
