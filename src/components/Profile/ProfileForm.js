import { useRef, useContext } from "react";
import { useHistory } from "react-router-dom";

import AuthContext from "../../store/auth-context";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
	const history = useHistory();
	const newPasswordInputRef = useRef();
	const authCtx = useContext(AuthContext);

	const submithandler = (event) => {
		event.preventDefault();

		const enteredNewPassword = newPasswordInputRef.current.value;

		// add validation

		fetch(
			"https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDGMYspya7SsbyHSgllFJ_3s9H_AiTCnOk",
			{
				method: "POST",
				body: JSON.stringify({
					idToken: authCtx.token,
					password: enteredNewPassword,
					returnSecureToken: false,
				}),
				headers: { "Content-Type": "application/json" },
			}
		).then((res) => {
			// assumption: Always succeeds for ed purposes
			history.replace("/");
		});
	};

	return (
		<form className={classes.form} onSubmit={submithandler}>
			<div className={classes.control}>
				<label htmlFor="new-password">New Password</label>
				<input
					type="password"
					id="new-password"
					minLength="8"
					ref={newPasswordInputRef}
				/>
			</div>
			<div className={classes.action}>
				<button>Change Password</button>
			</div>
		</form>
	);
};

export default ProfileForm;
