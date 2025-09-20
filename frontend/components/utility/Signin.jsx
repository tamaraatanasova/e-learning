"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import dynamic from "next/dynamic";
import apiClient from "../lib/api";
import { useRouter } from "next/navigation";

const FaceScanner = dynamic(() => import("../../components/FaceScanner"), { ssr: false });

export default function Signin() {
  const [loginMode, setLoginMode] = useState('password');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const { login, handleLoginSuccess } = useAuth();

  const router = useRouter();
  const [faceScannerKey, setFaceScannerKey] = useState(0);

  const handleCredentialChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(credentials);
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleFaceDetected = async (descriptor) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/login/biometric', { face_embedding: descriptor });

      if (response.status === 200) {

        handleLoginSuccess(response.data);

        setStatusMessage('Login successful! Redirecting...');
        setError('');
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        throw new Error("Authentication failed from server.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Face not recognized. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetFaceScan = () => {
    setError('');
    setStatusMessage('');
    setFaceScannerKey(prevKey => prevKey + 1);
  };

  const switchMode = (mode) => {
    setLoginMode(mode);
    setError('');
    setStatusMessage('');
  };

  const renderFaceLogin = () => (
    <>
      <p className="lead mb-4 text-center">{statusMessage || "Center your face in the oval to sign in."}</p>
      {!error && !statusMessage.includes('successful') &&
        <FaceScanner
          key={faceScannerKey}
          onFaceDetected={handleFaceDetected}
          onError={setError}
          onStatusUpdate={setStatusMessage}
        />
      }
      {loading && <div className="text-center my-4">Verifying identity...</div>}
      {error && (
        <div className="text-center mt-4">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button onClick={resetFaceScan} className="btn btn-sm btn-primary !w-full !text-white !bg-[#3f78e0] border-[#3f78e0] hover:text-white hover:bg-[#3f78e0] hover:!border-[#3f78e0] active:text-white active:bg-[#3f78e0] active:border-[#3f78e0] disabled:text-white disabled:bg-[#3f78e0] disabled:border-[#3f78e0] !rounded-[.4rem] !text-[.8rem] hover:translate-y-[-0.15rem] hover:shadow-[0_0.25rem_0.75rem_rgba(30,34,40,0.15)]">
            Try Again
          </button>
        </div>
      )}
    </>
  );

  return (
    <section className="wrapper">
      <div className="container py-14 py-md-16">
        <div className="flex flex-wrap">
          <div className="lg:w-7/12 xl:w-6/12 xxl:w-5/12 mx-auto">
            <div className="card">
              <div className="card-body p-12">
                <h2 className="mb-3 text-center">Welcome Back</h2>
                {loginMode === 'password' ? (
                  <>
                    <p className="lead mb-6 text-center">Use your email and password to sign in.</p>
                    <form className="text-left mb-3" onSubmit={handlePasswordSubmit}>
                      <div className="form-floating mb-4">
                        <input id="loginEmail" type="email" name="email" className="form-control" placeholder="Email" required onChange={handleCredentialChange} value={credentials.email} />
                        <label htmlFor="loginEmail">Email</label>
                      </div>
                      <div className="form-floating password-field mb-4">
                        <input id="loginPassword" type="password" name="password" className="form-control" placeholder="Password" required onChange={handleCredentialChange} value={credentials.password} />
                        <label htmlFor="loginPassword">Password</label>
                      </div>
                      {error && !loading && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
                      <button type="submit" className="btn btn-sm btn-primary !w-full !text-white !bg-[#3f78e0] border-[#3f78e0] hover:text-white hover:bg-[#3f78e0] hover:!border-[#3f78e0] active:text-white active:bg-[#3f78e0] active:border-[#3f78e0] disabled:text-white disabled:bg-[#3f78e0] disabled:border-[#3f78e0] !rounded-[.4rem] !text-[.8rem] hover:translate-y-[-0.15rem] hover:shadow-[0_0.25rem_0.75rem_rgba(30,34,40,0.15)]" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                      </button>
                    </form>
                  </>
                ) : (
                  renderFaceLogin()
                )}
                <div className="divider-icon my-4">or</div>
                <button onClick={() => switchMode(loginMode === 'password' ? 'face' : 'password')} className="btn btn-sm btn-primary !w-full !text-white !bg-[#3f78e0] border-[#3f78e0] hover:text-white hover:bg-[#3f78e0] hover:!border-[#3f78e0] active:text-white active:bg-[#3f78e0] active:border-[#3f78e0] disabled:text-white disabled:bg-[#3f78e0] disabled:border-[#3f78e0] !rounded-[.4rem] !text-[.8rem] hover:translate-y-[-0.15rem] hover:shadow-[0_0.25rem_0.75rem_rgba(30,34,40,0.15)]">
                  {loginMode === 'password' ? 'Sign In with Face' : 'Sign In with Password'}
                </button>
                <p className="mt-4 mb-0 text-center">Don't have an account? <Link href="/signup" className="hover">Sign up</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

