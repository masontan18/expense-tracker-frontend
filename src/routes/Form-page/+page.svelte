<script>
  import { onMount } from 'svelte';
  import { navigate } from '@svelte-routing/core';

  let date = '';
  let title = '';
  let amount = '';

  async function sendExpenseData(date, title, amount) {
    try {
      const response = await fetch('/api/addExpense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, title, amount }),
      });

      if (response.ok) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error submitting expense:', error);
      return false;
    }
  }

  async function handleSubmit() {
    const success = await sendExpenseData(date, title, amount);
if (success) {
  navigate('/expenses');
} else {
  console.log('Expense submission failed.');
    // console.log('Expense submitted:', { date, title, amount });
  }}
  </script>
  
  <style scoped>
    form {
      margin: 20px 0;
    }
  
    label {
      display: block;
      margin-bottom: 5px;
    }
  
    input {
      width: 100%;
      padding: 10px;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  
    button {
      background-color: #007bff;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
    }
  
    button:hover {
      background-color: #0056b3;
    }
  </style>
  
  <form on:submit={handleSubmit}>
    <label for="date">Date:</label>
    <input type="date" id="date" bind:value={date} required />
  
    <label for="description">title:</label>
    <input type="text" id="description" bind:value={title} required />
  
    <label for="amount">Amount:</label>
    <input type="number" id="amount" bind:value={amount} required />
  
    <button type="submit">Add Expense</button>
  </form>