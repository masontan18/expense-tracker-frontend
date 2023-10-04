<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import { isLogin } from '../utils/stores.js';
	import { isLoggedIn } from '../utils/auth.js';
	import { goto } from '$app/navigation';
	import Footer from '../lib/Footer.svelte';

	onMount(async () => {
		// themeChange(false);
		// if (isLoggedIn)
		// 	isLogin.set(true);
		// else 
		// 	isLogin.set(false);
		themeChange(false);
		// 👆 false parameter is required for svelte

		// check local storage to see if login-ed, refer function named "isLoggedIn" in auth.js
		isLogin.set(await isLoggedIn());
	});
  
	function signUpLogIn() {
		goto('/signup');
	
	}

</script>

<div class="hero min-h-screen main-message" style="background-image: url(https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg);">
	<div class="hero-overlay bg-opacity-60"></div>
	<div class="hero-content text-center text-neutral-content">
	  <div class="max-w-md">
		<h1 class="mb-5 text-5xl font-bold">
			Your Expense Tracker
		</h1>
		<p class="mb-5">
			Every penny is potentially weighing down a mighty vessel
		</p>
		<p class="mb-5">
			All that's needed are little steps in tracking your expenses
		</p>
		<p class="mb-5">
			To make greater strides to financial success.
		</p>
		<button class="btn btn-primary" on:click={signUpLogIn}> 
			Get Started 
		</button>
	  </div>
	</div>
  </div>

<Footer />

<style>
	.main-message {
		margin-top: 20px;
	}
</style>
