// frontend/src/components/LoginFormModal/index.js
import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isDisabled, setIsDisabled] = useState(true);
  const { closeModal } = useModal();

  useEffect(() => {
    setIsDisabled(true);
    if (credential.length > 3 && password.length > 5) {
      setIsDisabled(false);
    }
  }, [credential, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demoSubmission = (e) => {
    e.preventDefault();
    return dispatch (sessionActions.login({ credential: 'Demo-lition', password: 'password' }))
      .then(closeModal);
  }

  return (
    <div id="login-form-cont">
      <h1>Log In</h1>
      {errors.credential && (
          <p className="errors" id="login-errors">{errors.credential}</p>
        )}
      <form id="actual-login-form" onSubmit={handleSubmit}>
          <input
            id="username-login-input"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder="Username or Email"
            required
          />
          <input
            id="password-login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        <button type="submit" id="submit-login-btn" disabled={isDisabled}>Log In</button>
      </form>
      <button onClick={demoSubmission}  id="demo-login-btn">Demo User</button>
    </div>
  );
}

export default LoginFormModal;
