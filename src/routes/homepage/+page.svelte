<script>
	import '../../app.css';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import { isLogin } from '../../utils/stores.js';
	import { isLoggedIn } from '../../utils/auth.js';
	import Footer from '../../lib/Footer.svelte';
	import owlLogo from '$lib/images/owl.png';
	import { getUserId } from '../../utils/auth.js';
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { getAccessTokenFromLocalStorage } from '../../utils/auth.js';

	export let data;

	let expenses = [];

	// onMount(async () => {
	// 	themeChange(false);
	// 	if (isLoggedIn)
	// 		isLogin.set(true);
	// 	else 
	// 		isLogin.set(false);
	// });

	onMount(async () => {
		themeChange(false);
		// 👆 false parameter is required for svelte

		// check local storage to see if login-ed, refer function named "isLoggedIn" in auth.js
		isLogin.set(await isLoggedIn());
	});

  
	async function submitForm(evt) {
		evt.preventDefault();

		const userData = {
			userId: getUserId(),
			title: evt.target['title'].value,
			amount: evt.target['amount'].value,
			date: evt.target['date'].value
		};
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/expenses', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(userData)
		});

		if (resp.ok) {
			alert('New expense recorded successfully');
			expenses.push(userData);
			expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
			location.reload();
		} else {
			throw 'Expense submission failed';
		}
	}


	async function  deleteBtnFunct(expenseId) {
		const value = confirm('Confirm to delete this entry?');
		if (value) {
			const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/expenses', {
				method: 'DELETE',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
					Authorization: getAccessTokenFromLocalStorage()
				},
				body: JSON.stringify({ id: Number(expenseId) })
			});
			if (resp.ok) {
				alert('Delete Successfully');
				location.reload();
			} else {
				alert('Failed to remove entry');
			}
		}
	}

	let filterByYear = '2023';

	$:filterByExpenses  = data.expenses.filter((expense) => {
		return new Date(expense.date).getFullYear().toString() === filterByYear;
	});

	function calculateTotalExpenses(filterByExpenses) {
		return filterByExpenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
	}

	$: totalExpense = calculateTotalExpenses(filterByExpenses);

	const dropDownMenuFunct = (evt) => {
		filterByYear = evt.target.value;
	};

</script>

<div class="bg-black pb-5 min-h-screen">
	<div class = "exp">
		<div class="expfilterlist">
			<div class="filtercontroller">
				<label class="label year-label-box" for="box">
					Filter by year
				</label>
				<select on:change={dropDownMenuFunct} value={filterByYear}>
					<option value="2025">
						2025
					</option>
					<option value="2024">
						2024
					</option>
					<option value="2023">
						2023
					</option>
					<option value="2022">
						2022
					</option>
					<option value="2021">
						2021
					</option>
				</select>
			</div>
		</div>
		{#if filterByExpenses.length === 0}
			<div class = "container-logo">
				<img alt="ologo" src={owlLogo} class="ologo" />
				<p class="text-center text-xl text-red-500 phase-text">
					No Record Found
				</p>
			</div>
			<div class="flex justify-center">
				<p class="text-white text-lg">
					Total Expenses for the year: {totalExpense.toFixed(2)}
				</p> 
				<!-- Display the total expense amount here -->
			  </div>
			<div class="flex justify-center">
				<!-- <p>Total Expense: {totalExpense.toFixed(2)}</p> -->
				<button class="btn" onclick="my_modal_1.showModal()"> 
					add transaction 
				</button>
				<dialog id="my_modal_1" class="modal">
					<div class="addnew-exp">
						<form on:submit={submitForm}>
							<div class="addnew-expcontrol">
								<div class="addnew-expcontrol">
									<label class="label" for="title"> 
										Title 
									</label>
									<input name="title" type="text" />
								</div>
								<div class="addnew-expcontrol">
									<label class="label" for="amount"> 
										Amount 
									</label>
									<input name="amount" type="number" min="0.01" step="0.01" />
								</div>
								<div class="addnew-expcontrol">
									<label class="label" for="date"> 
										Date 
									</label>
									<input name="date" type="date" min="2021-01-01" max="2025-12-31" />
								</div>
							</div>
							<div class="actionaddnew">
								<button type="submit"> 
									Add Expense 
								</button>
							</div>
							<div class="modal-action">
								<form method="dialog">
									<!-- if there is a button in form, it will close the modal -->
									<button class="btn">
										Close
									</button>
								</form>
							</div>
						</form>
					</div>
				</dialog>
			</div>
		{:else}
			<ul class="explist">
				{#each filterByExpenses as expense}
					<li>
						<div class="flex justify-between items-center"><div class="expitem card" style="flex: 9; margin-right: 10px;">
							<div class="expdate">
								<div class="expmth">
									{new Date(expense.date).toLocaleString('en-US', { month: 'long' })}
								</div>
								<div class="expyr">
									{new Date(expense.date).toLocaleString('en-US', { year: 'numeric' })}
								</div>
								<div class="expday">
									{new Date(expense.date).toLocaleString('en-US', { day: '2-digit' })}
								</div>
							</div>
							<h2>
								{expense.title}
							</h2>
							<div class="expitemdescrp">
								<div class="expitemprice">
									{expense.amount}
								</div>
							</div>
						</div>
						<button class="btn btn-circle btn-outline text-red-500 hover:bg-red-700 hover:text-white" on:click={ deleteBtnFunct(expense.id)}>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								Delete
							</svg>
						</button>
					</div>		
				</li>
				{/each}
				<div class="flex justify-center">
					<p class="text-white text-lg">
						Total Expenses for the year: {totalExpense.toFixed(2)}
					</p> 
				</div>
				<div class="flex justify-center py-5">
					<!-- <p>Total Expense: {totalExpense.toFixed(2)}</p> -->
					<button class="btn" onclick="my_modal_1.showModal()"> 
						add transaction 
					</button>
					<dialog id="my_modal_1" class="modal">
						<div class="addnew-exp">
							<form on:submit={submitForm}>
								<div class="addnew-expcontrol">
									<div class="addnew-expcontrol">
										<label class="label" for="title"> 
											Title 
										</label>
										<input name="title" type="text" />
									</div>
									<div class="addnew-expcontrol">
										<label class="label" for="amount"> 
											Amount 
										</label>
										<input name="amount" type="number" min="0.01" step="0.01" />
									</div>
									<div class="addnew-expcontrol">
										<label class="label" for="date"> 
											Date 
										</label>
										<input name="date" type="date" min="2021-01-01" max="2025-12-31" />
									</div>
								</div>
								<div class="actionaddnew">
									<button type="submit"> 
										Add Expense 
									</button>
								</div>
								<div class="modal-action">
									<form method="dialog">
										<!-- if there is a button in form, it will close the modal -->
										<button class="btn">
											Close
										</button>
									</form>
								</div>
							</form>
						</div>
					</dialog>
				</div>
			</ul>
		{/if}
	</div>
</div>


<Footer />

<style>
	.addnew-exp {
		background-color: #b0accfe9;
		padding: 1rem;
		margin: 2rem auto;
		margin-top: 100px;
		width: 50rem;
		max-width: 95%;
		border-radius: 12px;
		text-align: center;
		box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
	}

	.addnew-exp button {
		font: inherit;
		cursor: pointer;
		padding: 1rem 2rem;
		border: 1px solid #04235a;
		background-color: #04235a;
		color: white;
		border-radius: 12px;
		margin-right: 1rem;
	}

	.addnew-exp button:hover,
	.addnew-exp button:active {
		background-color: #064490;
		border-color: #064490;
	}
	.addnew-expcontrol {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1rem;
		text-align: left;
	}

	.addnew-expcontrol label {
		font-weight: bold;
		margin-bottom: 0.5rem;
		display: block;
	}

	.addnew-expcontrol input {
		font: inherit;
		padding: 0.5rem;
		border-radius: 6px;
		border: 1px solid #ccc;
		width: 20rem;
		max-width: 100%;
	}

	.actionaddnew {
		text-align: right;
	}
	.container-logo {
		margin-top: 200px;
		margin-bottom: 250px;
	}
	.ologo {
		margin: 80px 45% 0;
	}
	.exp {
		padding: 1rem;
		background-color: rgb(31, 31, 31);
		margin: 2rem auto;
		width: 50rem;
		max-width: 95%;
	}
	.explist {
		list-style: none;
		padding: 0;
	}
	.card {
		border-radius: 12px;
		box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
		max-width: 100%;
	}
	.expitem {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem;
		margin: 1rem 0;
		background-color: #4b4b4b;
	}
	.expdate {
		display: flex;
		flex-direction: column;
		width: 5.5rem;
		height: 5.5rem;
		border: 1px solid #ececec;
		background-color: #2a2a2a;
		color: white;
		border-radius: 12px;
		align-items: center;
		justify-content: center;
	}

	.expmth {
		font-size: 0.8rem;
		font-weight: bold;
	}

	.expyr {
		font-size: 0.8rem;
	}

	.expday {
		font-size: 1.5rem;
		font-weight: bold;
	}
	.expitemdescrp {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: flex-end;
		flex-flow: column-reverse;
		justify-content: flex-start;
		flex: 1;
	}

	h2 {
		color: #3a3a3a;
		font-size: 2rem;
		flex: 1;
		margin: 0 1rem;
		color: white;
	}

	.expitemprice {
		font-size: 1.4rem;
		font-weight: bold;
		color: white;
		background-color: #04235a;
		border: 1px solid white;
		padding: 0.5rem;
		border-radius: 12px;
	}
	.expfilterlist {
		padding: 0 1rem;
	}

	.filtercontroller {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		margin: 1rem 0;
	}

	.expfilterlist label {
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	.expfilterlist select {
		font: inherit;
		padding: 0.5rem 3rem;
		font-weight: bold;
		border-radius: 6px;
	}

	.year-label-box {
		color: white;
	}
</style>


