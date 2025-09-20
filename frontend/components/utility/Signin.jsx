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
  const { login } = useAuth();
  const router = useRouter();

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

  const [statusMessage, setStatusMessage] = useState('');

  const handleFaceDetected = async (descriptor) => {
    setLoading(true);
    setError('');
    setStatusMessage('Face detected, verifying identity...');
    try {
      const response = await apiClient.post('/login/biometric', { face_embedding: descriptor });
      const { access_token, user } = response.data;
      localStorage.setItem('authToken', access_token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setStatusMessage('Login successful! Redirecting...');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      setError('Face not recognized. Please try again or use your password.');
      setStatusMessage('');
      setLoading(false);
      setTimeout(() => setLoginMode('password'), 3000);
    }
  };


  return (
    <section className="wrapper">
      <div className="container py-14 py-md-16">
        <div className="flex flex-wrap">
          <div className="lg:w-7/12 xl:w-6/12 xxl:w-5/12 mx-auto">
            <div className="card">
              <div className="card-body p-12 text-center">
                <h2 className="mb-3 text-left">Welcome Back</h2>

                {loginMode === 'password' ? (
                  <>
                    <p className="lead mb-6 text-left">Fill your email and password to sign in.</p>
                    <form className="text-left mb-3" onSubmit={handlePasswordSubmit}>
                      <div className="form-floating mb-4">
                        <input id="loginEmail" type="email" name="email" className="form-control" placeholder="Email" required onChange={handleCredentialChange} value={credentials.email} />
                        <label htmlFor="loginEmail">Email</label>
                      </div>
                      <div className="form-floating password-field mb-4">
                        <input id="loginPassword" type="password" name="password" className="form-control" placeholder="Password" required onChange={handleCredentialChange} value={credentials.password} />
                        <label htmlFor="loginPassword">Password</label>
                      </div>
                      {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
                      <button type="submit"
                        className="btn btn-sm btn-primary !w-full !text-white !bg-[#3f78e0] border-[#3f78e0] hover:text-white hover:bg-[#3f78e0] hover:!border-[#3f78e0] active:text-white active:bg-[#3f78e0] active:border-[#3f78e0] disabled:text-white disabled:bg-[#3f78e0] disabled:border-[#3f78e0] !rounded-[.4rem] !text-[.8rem] hover:translate-y-[-0.15rem] hover:shadow-[0_0.25rem_0.75rem_rgba(30,34,40,0.15)]"
                        disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <p className="lead mb-6 text-left">Center your face in the camera to sign in.</p>
                    {loading && <p>Verifying face...</p>}
                    {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
                    <FaceScanner onFaceDetected={handleFaceDetected} onError={(e) => setError(e)} />
                  </>
                )}

                <div className="divider-icon my-4">or</div>

                {loginMode === 'password' ? (
                  <button onClick={() => { setLoginMode('face'); setError(''); }} className="btn btn-sm btn-primary !w-full !text-white !bg-[#3f78e0] border-[#3f78e0] hover:text-white hover:bg-[#3f78e0] hover:!border-[#3f78e0] active:text-white active:bg-[#3f78e0] active:border-[#3f78e0] disabled:text-white disabled:bg-[#3f78e0] disabled:border-[#3f78e0] !rounded-[.4rem] !text-[.8rem] hover:translate-y-[-0.15rem] hover:shadow-[0_0.25rem_0.75rem_rgba(30,34,40,0.15)]"
                  >
                    Sign In with Face ID
                  </button>
                ) : (
                  <button onClick={() => setLoginMode('password')} className="btn btn-sm btn-primary !w-full !text-white !bg-[#3f78e0] border-[#3f78e0] hover:text-white hover:bg-[#3f78e0] hover:!border-[#3f78e0] active:text-white active:bg-[#3f78e0] active:border-[#3f78e0] disabled:text-white disabled:bg-[#3f78e0] disabled:border-[#3f78e0] !rounded-[.4rem] !text-[.8rem] hover:translate-y-[-0.15rem] hover:shadow-[0_0.25rem_0.75rem_rgba(30,34,40,0.15)]"
                  >
                    Sign In with Password
                  </button>
                )}

                <p className="mt-4 mb-0">Don't have an account? <Link href="/signup" className="hover">Sign up</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}