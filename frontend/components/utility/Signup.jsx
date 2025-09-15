"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "../lib/api";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'student',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.password !== formData.password_confirmation) {
      setError({ password_confirmation: ["Passwords do not match."] });
      setLoading(false);
      return;
    }

    try {
      await apiClient.post('/register', formData);
      alert('Registration successful! Please sign in.');
      router.push('/signin');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError({ general: ["An unexpected error occurred."] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="wrapper ">
      <div className="container py-14 py-md-16">
        <div className="flex flex-wrap">
          <div className="lg:w-7/12 xl:w-6/12 xxl:w-5/12 mx-auto">
            <div className="card">
              <div className="card-body p-12 text-center">
                <h2 className="mb-3 text-left">Sign up to E-learning</h2>
                <p className="lead mb-6 text-left">Registration takes less than a minute.</p>
                <form className="text-left mb-3" onSubmit={handleSubmit}>
                  <div className="form-floating mb-4">
                    <input id="loginName" type="text" name="name" className="form-control" placeholder="Name" required onChange={handleChange} />
                    <label htmlFor="loginName">Name</label>
                    {error?.name && <p className="text-red-500 text-xs mt-1">{error.name[0]}</p>}
                  </div>
                  <div className="form-floating mb-4">
                    <input id="loginEmail" type="email" name="email" className="form-control" placeholder="Email" required onChange={handleChange} />
                    <label htmlFor="loginEmail">Email</label>
                    {error?.email && <p className="text-red-500 text-xs mt-1">{error.email[0]}</p>}
                  </div>
                  <div className="form-floating password-field mb-4">
                    <input id="loginPassword" type="password" name="password" className="form-control" placeholder="Password" required onChange={handleChange} />
                    <label htmlFor="loginPassword">Password</label>
                    {error?.password && <p className="text-red-500 text-xs mt-1">{error.password[0]}</p>}
                  </div>
                  <div className="form-floating password-field mb-4">
                    <input id="loginPasswordConfirm" type="password" name="password_confirmation" className="form-control" placeholder="Confirm Password" required onChange={handleChange} />
                    <label htmlFor="loginPasswordConfirm">Confirm Password</label>
                    {error?.password_confirmation && <p className="text-red-500 text-xs mt-1">{error.password_confirmation[0]}</p>}
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label">Register as a:</label>
                    <div className="d-flex">
                      <div className="form-check me-3">
                        <input className="form-check-input" type="radio" name="role" id="roleStudent" value="student" checked={formData.role === 'student'} onChange={handleChange} />
                        <label className="form-check-label" htmlFor="roleStudent">Student</label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="role" id="roleProfessor" value="professor" checked={formData.role === 'professor'} onChange={handleChange} />
                        <label className="form-check-label" htmlFor="roleProfessor">Professor</label>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-sm btn-primary !w-full !text-white !bg-[#3f78e0] border-[#3f78e0] hover:text-white hover:bg-[#3f78e0] hover:!border-[#3f78e0] active:text-white active:bg-[#3f78e0] active:border-[#3f78e0] disabled:text-white disabled:bg-[#3f78e0] disabled:border-[#3f78e0] !rounded-[.4rem] !text-[.8rem] hover:translate-y-[-0.15rem] hover:shadow-[0_0.25rem_0.75rem_rgba(30,34,40,0.15)]"
                    disabled={loading}>
                    {loading ? 'Signing Up...' : 'Sign Up'}
                  </button>
                </form>
                {error?.general && <p className="text-red-500 text-center">{error.general[0]}</p>}
                <p className="mb-0">Already have an account? <Link href="/signin" className="hover">Sign in</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}