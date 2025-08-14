'use client';
import { useEffect, useRef, useState } from 'react';

export default function VideoStream() {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('Initializing...');
  const pcRef = useRef(null);
  const retryTimeoutRef = useRef(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    const signalingServer = 'http://192.168.82.134:5000';

    const handleConnectionState = () => {
      if (!isMountedRef.current || !pcRef.current) return;
      const newState = pcRef.current.connectionState;
      setStatus(prev => prev !== newState ? newState.charAt(0).toUpperCase() + newState.slice(1) : prev);
    };

    const handleIceCandidate = async (candidate) => {
      try {
        await fetch(`${signalingServer}/webrtc_signal`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'candidate',
            candidate: candidate.toJSON()
          })
        });
      } catch (error) {
        console.error('Candidate error:', error);
      }
    };

    const initWebRTC = async () => {
      try {
        // Fetch offer with retry logic
        let offer;
        for (let attempt = 0; attempt < 5; attempt++) {
          try {
            const res = await fetch(`${signalingServer}/get_offer`);
            const data = await res.json();
            if (data?.sdp && data?.type === 'offer') {
              offer = data;
              break;
            }
          } catch (error) {
            if (attempt >= 4) throw error;
            await new Promise(resolve => 
              setTimeout(resolve, 500 * 2 ** attempt));
          }
        }

        if (!offer) throw new Error('No offer received');

        // Create peer connection
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        });
        pcRef.current = pc;

        // Event handlers
        pc.addEventListener('connectionstatechange', handleConnectionState);
        pc.addEventListener('icecandidate', ({ candidate }) => {
          if (candidate) handleIceCandidate(candidate);
        });

        pc.ontrack = ({ streams }) => {
          if (videoRef.current && streams[0]) {
            videoRef.current.srcObject = streams[0];
          }
        };

        // Set remote description
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        
        // Create and send answer
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        
        await fetch(`${signalingServer}/webrtc_signal`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sdp: pc.localDescription.sdp,
            type: pc.localDescription.type
          })
        });

        // Fetch existing candidates
        const candidatesRes = await fetch(`${signalingServer}/get_candidates`);
        const { candidates } = await candidatesRes.json();
        for (const candidate of candidates) {
          await pc.addIceCandidate(candidate);
        }

      } catch (error) {
        console.error('Connection error:', error);
        if (isMountedRef.current) {
          setStatus('Reconnecting...');
          retryTimeoutRef.current = setTimeout(initWebRTC, 2000);
        }
      }
    };

    initWebRTC();

    return () => {
      isMountedRef.current = false;
      clearTimeout(retryTimeoutRef.current);
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
    };
  }, []);

  return (
    <div className="stream-container">
      <video 
        ref={videoRef}
        autoPlay 
        playsInline 
        muted 
        className="w-full max-w-4xl rounded-lg shadow-lg"
      />
      <div className="status-indicator">
        {status} 
        {status === 'Connected' && '✅'}
        {status === 'Reconnecting' && '🔄'}
      </div>
    </div>
  );
}