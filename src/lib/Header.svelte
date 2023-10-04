<script>
import '../app.css';
import { logOut } from "../utils/auth.js";
import { isLogin } from "../utils/stores.js"
import Logo from '$lib/images/profile-logo.png';

function signOut () {
  logOut();
  goto('/');
}
</script>

{#if $isLogin}
	<div class="flex justify-between items-center nav-container fixed top-0 left-0 right-0">
		<a class="flex-none flex btn btn-outline btn-accent btn-lg nav-title" href="/homepage">
			<img src={Logo} alt="profile-logo" class="profile-logo flex-none" href="/homepage" />
			<div class="flex-none">
				Final Project
			</div>
			<div class="flex-none small-title">
				Expense Tracker
			</div>
		</a>

		<div class="flex-none pr-6 right-container">
			<select data-choose-theme class="select select-accent select-sm">
				<option value="winter">
					Winter
				</option>
				<option value="Summer">
					Summer
				</option>
			</select>
			<div class="flex flex-row items-center">
				<a class="btn btn-outline btn-accent flex-none" href="/" on:click={signOut}>
					Log Out
				</a>
			</div>
		</div>
	</div>
{:else}
	<div class="flex justify-between items-center nav-container fixed top-0 left-0 right-0">
		<a class="flex-none flex btn btn-outline btn-accent btn-lg nav-title" href="/">
			<img src={Logo} alt="profile-logo" class="profile-logo flex-none" href="/" />
			<div class="flex-none">
				Final Project
			</div>
			<div class="flex-none small-title">
				Expense Tracker
			</div>
		</a>

		<div class="flex-none pr-6">
			<select data-choose-theme class="select select-accent select-sm">
				<option value="winter">
					Winter
				</option>
				<option value="summer">
					Summer
				</option>
			</select>
			<a class="btn btn-outline btn-accent flex-none" href="/signup">
				Sign Up
			</a>
			<a class="btn btn-outline btn-accent flex-none" href="/login">
				Log In
			</a>
		</div>
	</div>
{/if}

<style>
	.nav-container {
		height: 60px;
		border-bottom: 1px solid black;
		padding-bottom: 5px;
		background-color: black;
		z-index: 1;
	}

	.profile-logo {
		height: 40px;
		width: auto;
		border-radius: 50%;
		cursor: pointer;
	}

	.nav-title {
		font-size: 25px;
		width: auto;
		height: 6vh;
		text-transform: none;
		border: none;
	}

	.right-container {
		width: 500px;
		display: flex;
		justify-content:end;
		align-items: center;
	}
	.small-title {
		font-size: 13px;
	}
</style>