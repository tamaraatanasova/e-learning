"use client";
import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';

function FaceScanner({ onFaceDetected, onError }) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        let intervalId;

        const loadModelsAndStartCamera = async () => {
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                ]);

                const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Camera or model loading error:", err);
                if (onError) onError("Could not access camera. Please check permissions.");
            }
        };

        loadModelsAndStartCamera();

        const handlePlay = () => {
            intervalId = setInterval(async () => {
                if (videoRef.current && onFaceDetected) {
                    const detections = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
                    if (detections) {
                        onFaceDetected(detections.descriptor);
                        clearInterval(intervalId);
                    }
                }
            }, 2000);
        };

        const videoEl = videoRef.current;
        if (videoEl) {
            videoEl.addEventListener('play', handlePlay);
        }

        return () => {
            clearInterval(intervalId);
            if (videoEl) {
                videoEl.removeEventListener('play', handlePlay);
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [onFaceDetected, onError]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', width: '100%', maxWidth: '400px', margin: 'auto' }}>
            <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', borderRadius: '8px' }}></video>
        </div>
    );
}

export default FaceScanner;