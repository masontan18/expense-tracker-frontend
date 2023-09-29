<script>
	import '../../app.css';
	// import { getUserId } from '../../utils/auth.js';
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { getAccessTokenFromLocalStorage } from '../../utils/auth.js';


	export let data;
    let formErrors = {};
    let clicked = false;


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

	$:filterByExpense  = data.expenses.filter((expense) => {
		return new Date(expense.date).getFullYear().toString() === filterByYear;
	});

	const dropDownMenuFunct = (evt) => {
		filterByYear = evt.target.value;
	};
</script>


<div>
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
	{#if filterByExpense.length === 0}
		<div>
			<p class="text-center text-xl text-red-500 phase-text">
				No Record Found
			</p>
		</div>
	{:else}
		<ul class="explist">
			{#each filterByExpense as expense}
				<li>
					<div class="expitem">
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
						<div class="expitemdesrp">
							<div class="expitemprice">
								{expense.amount}
							</div>
						</div>
					</div>
					<button on:click={ deleteBtnFunct(expense.id)}>
						Delete
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>



