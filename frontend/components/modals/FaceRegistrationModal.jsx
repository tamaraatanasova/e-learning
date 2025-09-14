"use client";

import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import FaceScanner from '../FaceScanner';
import apiClient from '../lib/api';

function FaceRegistrationModal({ show, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    useEffect(() => {
        if (show) {
            setRegistrationSuccess(false);
            setError('');
            setLoading(false);
        }
    }, [show]);

    const handleFaceDetected = async (descriptor) => {
        setLoading(true);
        setError('');

        const descriptorArray = Array.from(descriptor);

        try {
            await apiClient.post('/user/register-face', {
                face_embedding: JSON.stringify(descriptorArray),
            });

            setRegistrationSuccess(true);


            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2500);

        } catch (err) {
            setError('Failed to register face. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const renderModalContent = () => {
        if (registrationSuccess) {
            return (
                <div className="text-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="green" className="bi bi-check-circle-fill mb-3" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                    <h4 className="text-success">Registration Complete!</h4>
                    <p>You can now use your Face ID to log in.</p>
                </div>
            );
        }

        if (loading) {
            return (
                <div className="text-center p-4">
                    <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                    <p className="mt-3">Registering your face...</p>
                </div>
            );
        }

        return (
            <>
                <p className="text-center">Center your face in the camera frame below.</p>
                <FaceScanner
                    onFaceDetected={handleFaceDetected}
                    onError={(e) => setError(e.toString())}
                />
            </>
        );
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Register Face ID</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && !registrationSuccess && <div className="alert alert-danger">{error}</div>}
                {renderModalContent()}
            </Modal.Body>
        </Modal>
    );
}

export default FaceRegistrationModal;