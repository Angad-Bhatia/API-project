// frontend/src/components/SignupFormPage/index.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isDisabled, setIsDisabled] = useState(true);
  const { closeModal } = useModal();

  useEffect(() => {
    setIsDisabled(true);
    if (email.length &&
      username.length &&
      firstName.length &&
      lastName.length &&
      password.length &&
      confirmPassword.length) {
        setIsDisabled(false);
    }
  }, [email, username, firstName, lastName, password, confirmPassword])
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div id="sign-up-modal-cont">
      <h2 id="signup-modal-header">Sign Up</h2>
        {errors.email && <p className="signup-errors">{errors.email}</p>}
        {errors.username && <p className="signup-errors">{errors.username}</p>}
        {errors.firstName && <p className="signup-errors">{errors.firstName}</p>}
        {errors.lastName && <p className="signup-errors">{errors.lastName}</p>}
        {errors.password && <p className="signup-errors">{errors.password}</p>}
        {errors.confirmPassword && (
          <p className="signup-errors">{errors.confirmPassword}</p>
        )}
      <form onSubmit={handleSubmit} id='signup-actual-form'>
          <input
            type="text"
            className="signup-actual-inputs"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            className="signup-actual-inputs"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="text"
            className="signup-actual-inputs"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            className="signup-actual-inputs"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="password"
            className="signup-actual-inputs"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className="signup-actual-inputs"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        <button type="submit" disabled={isDisabled} id="modal-signup-btn">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
