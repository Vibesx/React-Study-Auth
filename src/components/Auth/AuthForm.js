import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
	const history = useHistory();
	const emailInputRef = useRef();
	const passwordInputRef = useRef();
	const [isLogin, setIsLogin] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const authContext = useContext(AuthContext);

	const switchAuthModeHandler = () => {
		setIsLogin((prevState) => !prevState);
	};

	const submithandler = (event) => {
		event.preventDefault();

		const enteredEmail = emailInputRef.current.value;
		const enteredPassword = emailInputRef.current.value;

		// optional: add validation

		setIsLoading(true);

		let url;
		if (isLogin) {
			url =
				"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDGMYspya7SsbyHSgllFJ_3s9H_AiTCnOk";
		} else {
			url =
				"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDGMYspya7SsbyHSgllFJ_3s9H_AiTCnOk";
		}
		fetch(url, {
			method: "POST",
			body: JSON.stringify({
				email: enteredEmail,
				password: enteredPassword,
				returnSecureToken: true,
			}),
			headers: { "Content-Type": "application/json" },
		})
			.then((res) => {
				setIsLoading(false);
				if (res.ok) {
					return res.json();
				} else {
					return res.json().then((data) => {
						let errorMessage = "Authentication failed!";
						// if (data && data.error && data.error.message) {
						// 	errorMessage = data.error.message;
						// }
						// alert(errorMessage);
						throw new Error(errorMessage);
					});
				}
			})
			.then((data) => {
				const expirationTime = new Date(
					new Date().getTime() + +data.expiresIn * 1000
				);
				authContext.login(data.idToken, expirationTime.toISOString());
				history.replace("/");
			})
			.catch((err) => {
				alert(err.errorMessage);
			});
	};

	return (
		<section className={classes.auth}>
			<h1>{isLogin ? "Login" : "Sign Up"}</h1>
			<form onSubmit={submithandler}>
				<div className={classes.control}>
					<label htmlFor="email">Your Email</label>
					<input
						type="email"
						id="email"
						required
						ref={emailInputRef}
					/>
				</div>
				<div className={classes.control}>
					<label htmlFor="password">Your Password</label>
					<input
						type="password"
						id="password"
						required
						ref={passwordInputRef}
					/>
				</div>
				<div className={classes.actions}>
					{!isLoading && (
						<button>{isLogin ? "Login" : "Create Account"}</button>
					)}
					{isLoading && <p>Sending request...</p>}
					<button
						type="button"
						className={classes.toggle}
						onClick={switchAuthModeHandler}
					>
						{isLogin
							? "Create new account"
							: "Login with existing account"}
					</button>
				</div>
			</form>
		</section>
	);
};

export default AuthForm;
