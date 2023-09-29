<script>
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { goto } from '$app/navigation';
	import { authenticateUser } from '../../utils/auth.js';
	// import { signUpAlert } from '../../../utils/alert.js';
	let formErrors = {};
	let clicked = false;

	function postSignUp() {
		goto('/');
	}

	async function createUser(evt) {
		evt.preventDefault();
		clicked = true;

		if (evt.target['password'].value != evt.target['password-confirmation'].value) {
			formErrors['password'] = { message: 'Password confirmation does not match' };
			clicked = false;
			return;
		}

		const userData = {
			email: evt.target['email'].value,
			password: evt.target['password'].value
		};

		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/users', {
			// remember this is for POSTing DATA to Backend
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(userData)
		});
		console.log(resp.status);
		if (resp.status == 201) {
			const res = await authenticateUser(userData.email, userData.password);

			if (res.success) {
				// signUpAlert()
				postSignUp();
			} else {
				throw 'Sign up succeeded but authentication failed';
			}
		} else {
			clicked = false;
			// const res = await resp.json();
			// formErrors = res.data;
			throw 'Sign up failed';
		}
	}

	let enteredEmail = '';
	let emailIsValid = false;
	let emailIsTouched = false;
	$: emailHasError = !emailIsValid && emailIsTouched;
	const emailChangeHandler = (event) => {
		enteredEmail = event.target.value;
		if (enteredEmail.includes('@') && enteredEmail.includes('.com')) {
			emailIsValid = true;
		} else {
			emailIsValid = false;
		}
	};
	const emailBlurHandler = (event) => {
		emailIsTouched = true;
		if (!(enteredEmail.includes('@') && enteredEmail.includes('.com'))) {
			emailIsValid = false;
		}
	};

	let enteredPassword = '';
	let passwordIsValid = false;
	let passwordIsTouched = false;
	$: passwordHasError = !passwordIsValid && passwordIsTouched;
	const passwordChangeHandler = (event) => {
		enteredPassword = event.target.value;
		if (enteredPassword.length >= 8) {
			passwordIsValid = true;
		} else {
			passwordIsValid = false;
		}
	};
	const passwordBlurHandler = (event) => {
		passwordIsTouched = true;
		if (enteredPassword.length < 8) {
			passwordIsValid = false;
		}
	};

	let enteredConfirmPassword = '';
	let confirmPasswordIsValid = false;
	let confirmPasswordIsTouched = false;
	$: confirmPasswordHasError = !confirmPasswordIsValid && confirmPasswordIsTouched;
	const confirmPasswordChangeHandler = (event) => {
		enteredConfirmPassword = event.target.value;
		if (enteredConfirmPassword.length >= 8) {
			confirmPasswordIsValid = true;
		} else {
			confirmPasswordIsValid = false;
		}
	};
	const confirmPasswordBlurHandler = (event) => {
		confirmPasswordIsTouched = true;
		if (enteredConfirmPassword.length < 8) {
			confirmPasswordIsValid = false;
		}
	};

	let formIsValid = false;
	$: if (emailIsValid && passwordIsValid && confirmPasswordIsValid) {
		formIsValid = true;
	} else {
		formIsValid = false;
	}
</script>

<h1 class="text-center text-xl">Create an Account to track expenses</h1>
<div class="text-center">
	<a class="link-hover italic text-xs" href="/login">
		Already have an account? Click here to login instead.
	</a>
</div>
<div class="flex justify-center items-center mt-8">
	<form on:submit={createUser} class="w-1/3">
		<div class="form-control w-full">
			<label class="label" for="email">
				<span class="label-text"> Email </span>
			</label>
			<input
				type="email"
				name="email"
				placeholder="john@example.com"
				class="input input-bordered w-full"
				on:input={emailChangeHandler}
				on:blur={emailBlurHandler}
				required
			/>
			{#if emailHasError}
				<label class="label" for="email">
					<span class="label-text-alt text-red-500"
						>Please enter a valid email with "@" and ".com".</span
					>
				</label>
			{/if}
		</div>

		<div class="form-control w-full">
			<label class="label" for="password">
				<span class="label-text"> Password </span>
			</label>
			<input
				type="password"
				name="password"
				placeholder="xxxxxxxx"
				class="input input-bordered w-full"
				on:input={passwordChangeHandler}
				on:blur={passwordBlurHandler}
				required
			/>
			{#if passwordHasError}
				<label class="label" for="password">
					<span class="label-text-alt text-red-500">Password must be at least 8 characters.</span>
				</label>
			{/if}
		</div>

		<div class="form-control w-full">
			<label class="label" for="password">
				<span class="label-text"> Confirm Password </span>
			</label>
			<input
				type="password"
				name="password-confirmation"
				placeholder="xxxxxxxx"
				class="input input-bordered w-full"
				on:input={confirmPasswordChangeHandler}
				on:blur={confirmPasswordBlurHandler}
				required
			/>
			{#if confirmPasswordHasError}
				<label class="label" for="passwod-confirmation">
					<span class="label-text-alt text-red-500">Password must be at least 8 characters.</span>
				</label>
			{/if}
		</div>

		<div class="form-control w-full mt-4">
			{#if clicked}
				<button class="btn btn-md loading loading-spinner"> Create an Account </button>
			{:else}
				<button class="btn btn-md"> Create an Account </button>
			{/if}
		</div>
	</form>
</div>
