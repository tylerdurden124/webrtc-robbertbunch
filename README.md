# WebRTC with Robert Bunch

## Section 01 - introduction to webRTC
1. what is WebRTC 

### summary - Mastering webRTC - make a video chat app!
- Course teaches you how to `connect audio/video streams` between computers 
- browser related
- set up a `signaling server` for` connection negotiation` 
- and `integrate webRTC into a React app with Redux`. 
- You'll learn to manage `multiple asynchronous sources` and organize your code effectively. 
- It's suitable for anyone familiar with JavaScript and Node
- using webRTC to implement video conferencing `without third-party services` (p2p)
- requisites include knowledge of GUM - `getUserMedia()` and `socket.io`
    - GUM (getting camera, mic, screen) - `getUserMedia()` -> requires user granting permission
- access to a Linux machine is required for later sections.

- webRTC uses UDP (fast) -> online gaming
- in contrast to TCP (reliable , acknowledgments, stable)

2. github source code
[https://github.com/robertbunch/webrtcCourse](https://github.com/robertbunch/webrtcCourse)

3. Getting the codebase for a specific video
- use github tags for reference when stuck, it puts you at the start of the lesson the tag references

4. How I code
- uses node 18 (16+ will do)
- his root directory is `videocode/`

5. But it's 2023: Why would I use webRTC over a 3rd party SDK (Zoom)?

- 3rd party is sdk and is reliable but may be restrictive
- when you need to build things yourself (more control) we use webRTC and its fast
- no licensing fee 
- control over sercurity and protection from 3rd party data breech
- cross platform 

---

## Section 02 - basics -> project teaching getUserMedia 
6. Project file setup - (3min)
7. getUserMedia - where everything starts - (13min)
8. play the feed, getTracks(), and MediaStreamTracks - (7min)
9. A few UI updates - (9min)
10. Constraints overview - getSupportedConstraints() and getCapabilities() - (10min)
11. Changing resolution, framerate, aspect ratio - applyConstraints() - (8min)
12. Recording a feed - MediaRecorder and webRTC - (13min)
13. Update buttons - (5min)
14. Capturing the screen - (10min)
15. Getting available input/outputs with enumerateDevices() - (9min)
16. Loading up input/output options - (11min)

---

## Section 03 - rtcPeerConnection - Stream video, peer-to-peer
17. Section Demo & Overview - (6min)
18. rtcPeerConnection and signaling - (7min)
19. Signaling Part 1 - SDP - (3min)
20. Signaling Part 2 - ICE (and STUN) - (7min)
21. File Structure - (7min)
22. local RTC - (14min)
23. setLocalDescription() - (4min)
24. Socket.io and HTTPS setup - (9min)
25. Connection TaskList - (6min)
26. Connection TaskList - part 2 - (12min)
27. emit newOffer - (9min)
28. Emit iceCandidates - (8min)
29. Load existing and new offers on all clients - (9min)
30. Create answer - (9min)
31. Error handling the signaling process - (8min)
32. Emitting answer - (7min)
33. Listening for answer and setRemoteDescription(answer) - (6min)
34. Apply ICE candidates - Part 1 - (8min)
35. Apply ICE candidates - Part 2 - (5min)
36. Add tracks from remote peer - MAGIC!! - (6min)
37. Loading on another device on the same network - (5min)

---

## Section 04 - WebRTC Process review - review it

38. The Process (on the board) - (24min)
39. Code Review - (50min)

---

## Section 05 - webRTC and React - TeleLegal site
40. Project Demo - (6min)
41. Project Structure and Front-end Setup - (6min)
42. Chrome and localhost certs - (1min)
43. Back-end Setup - (8min)
44. Creating a JWT & link to simulate scheduling - (11min)
45. Add React-Router for our front-end - (5min)
46. Setup Join-Video route and get the decoded data in React - (8min)
47. Add starting components - (10min)
48. Wire up redux and make callStatus reducer - (8min)
49. Add action buttons, bootstrap, and fontawesome - (7min)
50. getUserMedia() and store the stream in redux - (9min)
51. Create peerConnection and store it in redux - (7min)
52. Thinking through where our functions belong (& a few bug fixes) - (6min)
53. Abstracting the Video and Audio buttons - (8min)
54. Adding the local video feed - (10min)
55. Add our tracks to the peerConnection - (8min)
56. Enable and disable (mute) the local video feed - (6min)
57. Display local video inputs (camera options) - (11min)
58. Set new video device on select - (7min)
59. replaceTracks() - (8min)
60. Abstract DropDown component - (3min)
61. Set up AudioButton component - (11min)
62. Switch Audio Input and Output Devices - (11min)
63. Start, mute, unmute audio - (10min)
64. Organize offers on backEnd and add uuid - (8min)
65. createOffer() once the tracks are shared - (13min)
66. Add Dashboard markup for professional - (5min)
67. Optional - Overview of markup - (2min)
68. Authenticate professional - (10min)
69. socket refactoring - (9min)
70. Reorganize Appointment Data - (3min)
71. Pull Appointment Data - (9min)
72. Listen for offers on the client - (11min)
73. Create join video route for professional - (6min)
74. Add Call Info to Professional Video Page - (4min)
75. Create Answer and set Descriptions - (10min)
76. Review Task List and Cheer for Our Progress - (7min)
77. Emit Answer Up To Server - (8min)
78. Listen for New Answer On the Client - (12min)
79. Emit Ice Candidates To Server - (9min)
80. Send Ice Candidates to clients - (13min)
81. Add Ice Candidates to Peer Connection - (12min)
82. AddTracks and... VICTORY!!! (test app) - (6min)
83. Fix 2 small bugs - (2min)
84. Make the HangupButton do something! - (5min)
85. ReplaceTracks on change device - (8min)

---

## Section 06 - Deploying our Apps to AWS
86. Drawing Out And Explaining The Process - (15min)
87. Warning... this section is deploying, not WebRTC and might be hard - (1min)
88. Setting up a (hopefully) free AWS server to run our app on - (36min)
89. Getting a Domain &Setting It To Point At Our Server & Install Apache - (17min)
90. Pulling files onto our server from github and building React - (20min)
91. htaccess file and vhost for next lecture - (1min)
92. Vhost - Telling Apache Where Our Sites Are - (12min)
93. Reverse Proxy Vhost - For the backend - (1min)
94. HTTPS and Reverse Proxy Vhost - (23min)

---

## Section 07 - Scaling WebRTC - beyond the mesh
95. Your options - an SFU, MCU, and mesh - (13min)