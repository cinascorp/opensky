Real-Time 3D Air Traffic Visualization
Using HTTP/3, Web Workers, and WebGL

![opensky_2025](https://github.com/user-attachments/assets/4d76964b-237c-4171-80a5-333c44ddaf74)

# Abstract: 

The growing demand for real-time air traffic monitoring requires data
delivery and visualization technologies that minimize latency and maxi-
mize scalability. While the OpenSky Network provides a rich source of
ADS-B data, existing browser-based visualization approaches often suffer
from delays caused by REST polling, TCP handshake overhead, and the
lack of parallel processing in the rendering pipeline.

This work proposes a novel architecture for real-time air traffic visual-
ization leveraging three key technologies:(1) HTTP/3 (QUIC) for low-
latency and loss-tolerant data streaming, reducing round-trip times com-
pared to HTTP/2 or WebSocket-over-TCP solutions;(2) Web Workers
to process incoming ADS-B and traffic data streams in parallel without
blocking the main UI thread; and (3) WebGL/Three.js for efficient,
GPU-accelerated 3D visualization of aircraft trajectories directly in the
browser.

The proposed solution is designed to display thousands of concurrent
aircraft with smooth frame rates and sub-second latency, even under high
data load. We present a prototype implementation that connects to the
OpenSky live API, decodes positional updates, and renders them as dy-
namic 3D objects on a global map. Preliminary performance tests show
significant reductions in end-to-end latency and improved frame stability
compared to traditional polling-based approaches.

This contribution aims to spark discussion within the OpenSky re-
search community about adopting modern web transport protocols and
browser rendering techniques for large-scale, open aviation data visualiza
tion. Future work will extend the prototype to support predictive trajec.
tory visualization, anomaly detection, and collaborative filtering of traffic
events in real time.

![fundamental-en](https://raw.githubusercontent.com/cinascorp/opensky/refs/heads/main/fundamental-en.html)

client side usage : 
download pre-apk release from link : https://github.com/cinascorp/opensky/raw/refs/heads/main/TAR.apk 

for server and bigger project: 
download repo and run live server :
```
pkg update && pkg upgrade -y
```
then install requirements : 
```
pkg instal http-server
```
download and setup repo in your terminal :
```
gh repo clone cinascorp/opensky
cd opensky
http-server
```
